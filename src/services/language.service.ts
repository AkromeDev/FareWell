import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { CanActivateChildFn, Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';
import type * as UkCatalog from 'src/i18n/uk/catalog';
import { UK_EXCLUDED_PATHS, loadUkCommon } from 'src/i18n/uk/dictionaries';

export type Lang = 'de' | 'en' | 'uk';

const STORAGE_KEY = 'fw_lang';

/**
 * Sonderpaar: der deutsche MwSt-Ratgeber und sein englisches Gegenstück leben
 * auf eigenen, bereits indexierten URLs statt unter /en/.
 */
const SPECIAL_DE_TO_EN: Record<string, string> = {
  '/ratgeber/mehrwertsteuer-us-streitkraefte': '/ratgeber/us-forces-vat-relief',
};
const SPECIAL_EN_TO_DE: Record<string, string> = {
  '/ratgeber/us-forces-vat-relief': '/ratgeber/mehrwertsteuer-us-streitkraefte',
};

/** Seiten ohne englisches Gegenstück (rechtlich bindende deutsche Texte u. Ä.). */
const NON_LOCALIZED_PREFIXES = ['/impressum', '/datenschutz', '/agb', '/not-found'];

/**
 * Seiten ohne ukrainische Fassung: das MwSt-Paar für US-Streitkräfte
 * (Zielgruppe spricht Englisch), die internen Task-Seiten und alles aus
 * UK_EXCLUDED_PATHS.
 */
const NON_UK_PREFIXES = [
  '/ratgeber/mehrwertsteuer-us-streitkraefte',
  '/ratgeber/us-forces-vat-relief',
  '/tasks',
  '/massage-tasks',
  ...UK_EXCLUDED_PATHS.map((path) => `/${path}`),
];

const PREFIX: Record<Lang, string> = { de: '', en: '/en', uk: '/uk' };

/**
 * Outfit und Fraunces haben keine kyrillischen Zeichen. Auf /uk/-Seiten
 * springen Onest und Lora ein (in den font-family-Listen direkt dahinter);
 * dank unicode-range lädt der Browser nur deren kyrillische Dateien.
 */
const UK_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Onest:wght@300..700&display=swap';

/**
 * Zentrale, seitenübergreifende UI-Sprache (DE/EN/UK).
 *
 * Die URL ist die Quelle der Wahrheit: Pfade unter /en/ (und die englischen
 * Sonderseiten) rendern Englisch, unter /uk/ Ukrainisch, alle anderen Deutsch
 * – identisch beim Prerendern und im Browser. Der Header-Umschalter navigiert
 * zur Gegenstück-URL; nur Seiten ohne Gegenstück schalten das UI direkt um.
 * Die Sprache wird auf <html lang data-lang> gespiegelt, damit das globale
 * CSS die passenden .lang-Blöcke ein- und ausblendet.
 *
 * Ukrainisch ist ein Overlay (src/i18n/uk): t() und die .lang.de-Blöcke
 * werden über Wörterbücher übersetzt, die nur /uk/-Seiten laden. Der Wechsel
 * in den ukrainischen Baum und wieder heraus lädt die Seite deshalb neu,
 * statt im laufenden DOM zurückzuübersetzen.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private observer: MutationObserver | null = null;
  private reloading = false;
  /** Ukrainischer Katalog; nur auf /uk/-Seiten geladen (eigener Chunk). */
  private uk: typeof UkCatalog | null = null;

  /** Aktuelle UI-Sprache; wird aus der URL abgeleitet. */
  readonly lang = signal<Lang>('de');

  constructor() {
    // Initial synchron aus der Request-/Browser-URL, damit ngOnInit-Logik
    // (SEO, JSON-LD) schon vor dem ersten Router-Event die Sprache kennt.
    this.apply(this.langForPath(this.document.location?.pathname ?? '/'));

    // RoutesRecognized feuert vor der Komponenten-Aktivierung, sodass
    // ngOnInit der Zielseite bereits die richtige Sprache sieht. Eine
    // Navigation über die ukrainische Grenze lädt neu (languageBoundaryGuard),
    // bis dahin bleibt die alte Sprache stehen.
    this.router.events
      .pipe(filter((e): e is RoutesRecognized => e instanceof RoutesRecognized))
      .subscribe((e) => {
        const next = this.langForPath(e.urlAfterRedirects.split('?')[0].split('#')[0]);
        if (this.isBrowser && this.crossesUkBoundary(next)) return;
        this.apply(next);
      });
  }

  /**
   * Vor dem ersten Rendern (APP_INITIALIZER): auf /uk/-Seiten das gemeinsame
   * Wörterbuch laden und im Browser die DOM-Übersetzung starten.
   */
  async init(): Promise<void> {
    if (this.lang() !== 'uk') return;
    this.addUkFonts();
    const [catalog] = await Promise.all([import('src/i18n/uk/catalog'), loadUkCommon()]);
    this.uk = catalog;
    if (this.isBrowser) this.startUkObserver();
  }

  /**
   * Umschalten: navigiert zur Gegenstück-URL (die Sprache folgt dann der
   * URL). Ohne Gegenstück wird nur das UI umgeschaltet; Ukrainisch führt dann
   * auf die ukrainische Startseite.
   */
  setLang(lang: Lang): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // Privates Fenster o. Ä.: die URL trägt die Sprache ohnehin.
      }
    }

    const current = this.router.url.split('?')[0].split('#')[0] || '/';
    const target = this.counterpartPath(current, lang) ?? (lang === 'uk' ? '/uk' : null);

    if (target !== null && this.isBrowser && this.crossesUkBoundary(lang)) {
      this.hardNavigate(target);
    } else if (target !== null && target !== current) {
      this.router.navigateByUrl(target);
    } else {
      this.apply(lang);
    }
  }

  toggle(): void {
    this.setLang(this.lang() === 'de' ? 'en' : 'de');
  }

  /**
   * Wählt den zur aktuellen Sprache passenden Text. Auf Ukrainisch aus dem
   * Wörterbuch, mit Englisch als Rückfall für noch fehlende Einträge.
   */
  t(de: string, en: string): string {
    const lang = this.lang();
    if (lang === 'de') return de;
    if (lang === 'en') return en;
    return this.uk?.ukLookup(de) ?? en;
  }

  /**
   * Für Komponenten, die ihren Text selbst im DOM umbauen (Wort-für-Wort-
   * Hervorhebung o. Ä.): auf /uk/-Seiten vorher übersetzen, sonst passt der
   * Schlüssel nicht mehr. Sonst ein No-op.
   */
  translateDom(root: Element): void {
    this.uk?.translateTree(root);
  }

  /** URL-Präfix der aktiven Sprache: '', '/en' oder '/uk'. */
  prefix(): string {
    return PREFIX[this.lang()];
  }

  /**
   * Interner Link in der aktuellen Sprache: auf englischen und ukrainischen
   * Seiten wird der deutsche Pfad auf sein Gegenstück abgebildet, sonst
   * unverändert zurückgegeben. Templates binden Links als
   * [routerLink]="p('/price')" o. Ä.
   */
  localizePath(dePath: string): string {
    if (this.lang() === 'de') {
      return dePath;
    }
    return this.counterpartPath(dePath, this.lang()) ?? dePath;
  }

  /** Gegenstück-URL einer Seite in der Zielsprache; null = existiert nicht. */
  counterpartPath(path: string, target: Lang): string | null {
    const base = this.basePath(path);
    const localized = (prefix: string) => (base === '/' ? prefix : `${prefix}${base}`);

    if (target === 'de') return base;
    if (NON_LOCALIZED_PREFIXES.some((p) => base.startsWith(p))) return null;
    if (target === 'en') return SPECIAL_DE_TO_EN[base] ?? localized('/en');
    if (NON_UK_PREFIXES.some((p) => base.startsWith(p))) return null;
    return localized('/uk');
  }

  /** Sprache, die eine URL ausliefert. */
  langForPath(path: string): Lang {
    const normalized = path === '' ? '/' : path;
    if (normalized === '/en' || normalized.startsWith('/en/')) return 'en';
    if (normalized === '/uk' || normalized.startsWith('/uk/')) return 'uk';
    if (SPECIAL_EN_TO_DE[normalized]) return 'en';
    return 'de';
  }

  /**
   * Für languageBoundaryGuard: eine Navigation in den ukrainischen Baum oder
   * aus ihm heraus wird zum Seitenaufruf. false bricht die Router-Navigation ab.
   */
  allowNavigation(url: string): boolean {
    if (!this.isBrowser) return true;
    const next = this.langForPath(url.split('?')[0].split('#')[0]);
    if (!this.crossesUkBoundary(next)) return true;
    this.hardNavigate(url);
    return false;
  }

  /** Deutscher Pfad einer Seite, egal in welcher Sprache sie gerade steht. */
  private basePath(path: string): string {
    const normalized = path === '' ? '/' : path;
    if (SPECIAL_EN_TO_DE[normalized]) return SPECIAL_EN_TO_DE[normalized];
    const m = /^\/(en|uk)(\/.*)?$/.exec(normalized);
    if (m) return m[2] || '/';
    return normalized;
  }

  private crossesUkBoundary(next: Lang): boolean {
    return (this.lang() === 'uk') !== (next === 'uk');
  }

  private hardNavigate(url: string): void {
    if (this.reloading) return;
    this.reloading = true;
    this.document.location.assign(url);
  }

  private apply(lang: Lang): void {
    this.lang.set(lang);
    const root = this.document.documentElement;
    root.setAttribute('data-lang', lang);
    root.lang = lang;
  }

  /** Beim Prerendern landet der Link im HTML; im Browser ist er dann schon da. */
  private addUkFonts(): void {
    const head = this.document.head;
    if (!head || head.querySelector('link[data-uk-fonts]')) return;
    const link = this.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = UK_FONTS_HREF;
    link.setAttribute('data-uk-fonts', '');
    head.appendChild(link);
  }

  /**
   * Übersetzt neu gerenderte .lang.de-Blöcke, bevor der Browser sie malt
   * (MutationObserver-Callbacks laufen als Microtask vor dem nächsten Frame).
   */
  private startUkObserver(): void {
    const uk = this.uk;
    if (!uk || this.observer || typeof MutationObserver === 'undefined') return;
    const body = this.document.body;
    uk.translateTree(body);
    this.observer = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === 1) uk.translateTree(node as Element);
        });
      }
    });
    this.observer.observe(body, { childList: true, subtree: true });
  }
}

/**
 * Sitzt auf der Wurzel aller Routen: eine Navigation in den ukrainischen
 * Baum oder aus ihm heraus wird zum normalen Seitenaufruf, damit die
 * vorgerenderte Seite in der richtigen Sprache kommt.
 */
export const languageBoundaryGuard: CanActivateChildFn = (_route, state) =>
  inject(LanguageService).allowNavigation(state.url);
