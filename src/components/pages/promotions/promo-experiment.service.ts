import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router } from '@angular/router';
import { BOOKING_URL, PROMO_CODE } from './promotion-offers';

export type PromoVariant = 'a' | 'b';

/** Name des Tests, an jedem Ereignis als Parameter promo_test. */
export const PROMO_TEST = 'promotionen_2026_11';

/** Die beiden Seiten des Tests, als deutsche Pfade. */
export const PROMO_VARIANT_PATHS: Record<PromoVariant, string> = {
  a: '/promotionen/feld',
  b: '/promotionen/drehbuehne',
};

/**
 * A/B-Test der Seite /promotionen (Joé, 09.11.2026): jeder zweite Besuch
 * landet auf /promotionen/feld (Variante A „Das Feld"), der andere auf
 * /promotionen/drehbuehne (Variante B „Die Drehbühne"). Weil es zwei Adressen
 * sind, zeigt Google Analytics jede Variante als eigene Seite, mit ihren
 * Aufrufen und Buchungsklicks; zusätzlich trägt jedes Ereignis promo_test und
 * promo_variant.
 *
 * Suchmaschinen: /promotionen bleibt die Seite für Suche und KI-Dienste
 * (vorgerendert mit allen Aktionen). Beide Varianten setzen ihren canonical
 * auf /promotionen, wie Google es für A/B-Tests empfiehlt, und stehen nicht in
 * der Sitemap. Die Weiterleitung passiert im Browser und ist vorübergehend.
 *
 * Die Zuteilung lebt nur im Arbeitsspeicher: kein Cookie, kein localStorage,
 * also kein Zugriff auf das Endgerät nach § 25 TDDDG. Solange der Besuch dauert,
 * bleibt die Variante gleich; ein neuer Besuch wird neu gelost.
 */
@Injectable({ providedIn: 'root' })
export class PromoExperimentService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private assigned: PromoVariant | null = null;
  private current: PromoVariant | null = null;
  private readonly once = new Set<string>();

  /** Lost die Variante dieses Besuchs aus, halb und halb; im Prerender null. */
  assign(): PromoVariant | null {
    if (!this.isBrowser) return null;
    if (!this.assigned) this.assigned = Math.random() < 0.5 ? 'a' : 'b';
    return this.assigned;
  }

  /** Eine Variantenseite ist offen; wer direkt dort landet, bleibt bei ihr. */
  enter(variant: PromoVariant): void {
    this.current = variant;
    if (!this.assigned) this.assigned = variant;
  }

  /** Ein Testereignis; ohne gtag oder außerhalb einer Variante still. */
  track(name: string, params: Record<string, unknown> = {}): void {
    if (!this.isBrowser || !this.current || !window.gtag) return;
    window.gtag('event', name, { promo_test: PROMO_TEST, promo_variant: this.current, ...params });
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
    if (this.current) {
      params['promo_test'] = PROMO_TEST;
      params['promo_variant'] = this.current;
    }
    window.gtag('event', 'generate_lead', params);
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
}

/**
 * Wächter auf /promotionen: im Browser geht es zur ausgelosten Variante
 * (Adresszeile ersetzt, Suchparameter wie gclid bleiben erhalten). Im
 * Prerender bleibt /promotionen die Übersicht für Suchmaschinen.
 *
 * @param prefix Sprachpräfix des Routenbaums: '' oder '/en'.
 */
export function promoSplit(prefix: string): CanMatchFn {
  return () => {
    const variant = inject(PromoExperimentService).assign();
    if (!variant) return true;
    const router = inject(Router);
    const from = router.getCurrentNavigation()?.extractedUrl;
    const tree = router.createUrlTree([prefix + PROMO_VARIANT_PATHS[variant]], {
      queryParams: from?.queryParams,
      fragment: from?.fragment ?? undefined,
    });
    return new RedirectCommand(tree, { replaceUrl: true });
  };
}
