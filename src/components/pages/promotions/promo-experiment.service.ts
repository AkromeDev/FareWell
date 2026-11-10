import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { AnalyticsService } from 'src/services/analytics.service';
import { BOOKING_URL, PROMO_CODE } from './promotion-offers';

export type PromoVariant = 'a' | 'b';

/** Name des Tests, an jedem Ereignis als Parameter promo_test. */
export const PROMO_TEST = 'promotionen_2026_11';

/** Die beiden Seiten des Tests, als deutsche Pfade. */
export const PROMO_VARIANT_PATHS: Record<PromoVariant, string> = {
  a: '/promotionen/feld',
  b: '/promotionen/drehbuehne',
};

/** Merkt sich die zuletzt gezeigte Variante, nur mit Einwilligung in Statistik. */
const MEMORY_KEY = 'fw_promo_ab';

/**
 * A/B-Test der Seite /promotionen (Joé, 09.11.2026, abwechselnd seit
 * 10.11.2026): /promotionen zeigt im Browser abwechselnd Variante A „Das Feld"
 * und Variante B „Die Drehbühne", bei jedem Öffnen die andere. Die Adresse
 * bleibt /promotionen, damit Neuladen, Lesezeichen und die Vorschläge der
 * Adresszeile immer wieder zum Wechsel führen.
 *
 * Google Analytics sieht jede Variante trotzdem als eigene Seite:
 * AnalyticsService meldet den Aufruf als /promotionen/feld oder
 * /promotionen/drehbuehne, mit Suchparametern wie gclid. Jedes Ereignis trägt
 * zusätzlich promo_test und promo_variant.
 *
 * Suchmaschinen und KI-Dienste: vorgerendert zeigt /promotionen die schlichte
 * Übersicht mit allen Aktionen, ohne JavaScript lesbar. Die alten Adressen
 * /promotionen/feld und /promotionen/drehbuehne leiten vorübergehend (302) auf
 * /promotionen weiter.
 *
 * Gedächtnis: innerhalb eines Besuchs im Arbeitsspeicher. Über das Neuladen
 * hinweg nur, wenn der Besuch der Statistik zugestimmt hat (localStorage,
 * Schlüssel fw_promo_ab); ohne Einwilligung wird nichts auf dem Endgerät
 * gespeichert oder gelesen (§ 25 TDDDG), und das erste Öffnen eines Besuchs
 * wird halb und halb gelost.
 */
@Injectable({ providedIn: 'root' })
export class PromoExperimentService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly analytics = inject(AnalyticsService);
  private last: PromoVariant | null = null;
  private current: PromoVariant | null = null;
  private readonly once = new Set<string>();

  /** Die Variante für dieses Öffnen von /promotionen, immer die andere als zuletzt; im Prerender null. */
  next(): PromoVariant | null {
    if (!this.isBrowser) return null;
    const last = this.last ?? this.remembered();
    const variant: PromoVariant = last ? (last === 'a' ? 'b' : 'a') : Math.random() < 0.5 ? 'a' : 'b';
    this.last = variant;
    this.current = variant;
    this.once.clear();
    this.remember(variant);
    return variant;
  }

  /** Die Seite ist zu; Ereignisse danach gehören zu keiner Variante. */
  leave(): void {
    this.current = null;
  }

  /** Ein Testereignis; ohne gtag oder außerhalb einer Variante still. */
  track(name: string, params: Record<string, unknown> = {}): void {
    if (!this.isBrowser || !this.current || !window.gtag) return;
    window.gtag('event', name, { ...this.tags(), ...params });
  }

  /** Wie track, aber nur einmal pro Besuch und Schlüssel. */
  trackOnce(key: string, name: string, params: Record<string, unknown> = {}): void {
    if (this.once.has(key)) return;
    this.once.add(key);
    this.track(name, params);
  }

  /**
   * Buchungsklick: dasselbe generate_lead wie booking-cta, dazu die Variante.
   * Öffnet Salonkee in einem neuen Tab, sobald gtag das Ereignis abgeschickt
   * hat, spätestens nach 800 ms.
   */
  book(event: MouseEvent, where: string, label: string): void {
    if (!this.isBrowser) return;
    event.preventDefault();
    let opened = false;
    const open = () => {
      if (opened) return;
      opened = true;
      window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');
    };
    if (!window.gtag) {
      open();
      return;
    }
    const params: Record<string, unknown> = {
      event_category: 'engagement',
      event_label: `Termin Buchen promotionen-${where}`,
      link_text: label,
      location: `promotionen-${where}`,
      destination: 'salonkee',
      event_callback: open,
    };
    window.gtag('event', 'generate_lead', { ...params, ...this.tags() });
    setTimeout(open, 800);
  }

  /** Kopiert den Neukunden-Code; 'fail', wenn der Browser es nicht erlaubt. */
  async copyCode(where: string): Promise<'ok' | 'fail'> {
    this.track('promo_code_copy', { where });
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(PROMO_CODE);
        return 'ok';
      }
    } catch {
      // weiter mit dem alten Weg
    }
    try {
      const ta = document.createElement('textarea');
      ta.value = PROMO_CODE;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok ? 'ok' : 'fail';
    } catch {
      return 'fail';
    }
  }

  /** Test, Variante und die Adresse, unter der GA die Variante führt. */
  private tags(): Record<string, unknown> {
    if (!this.current) return {};
    const tags: Record<string, unknown> = { promo_test: PROMO_TEST, promo_variant: this.current };
    const location = this.analytics.virtualLocation();
    if (location) tags['page_location'] = location;
    return tags;
  }

  private mayRemember(): boolean {
    try {
      return window.fwConsent?.state()?.an === true;
    } catch {
      return false;
    }
  }

  private remembered(): PromoVariant | null {
    if (!this.mayRemember()) return null;
    try {
      const v = window.localStorage.getItem(MEMORY_KEY);
      return v === 'a' || v === 'b' ? v : null;
    } catch {
      return null;
    }
  }

  private remember(variant: PromoVariant): void {
    if (!this.mayRemember()) return;
    try {
      window.localStorage.setItem(MEMORY_KEY, variant);
    } catch {
      // Speicher gesperrt: dann wechselt es nur innerhalb des Besuchs
    }
  }
}
