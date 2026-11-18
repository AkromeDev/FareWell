import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { CanActivateChildFn, Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';
import type { OverlayCatalog } from 'src/i18n/overlay/catalog';
import {
  OVERLAY_EXCLUDED_PATHS,
  OVERLAY_LANGS,
  OverlayLang,
  OverlayRouteDicts,
  isOverlayLang,
} from 'src/i18n/overlay/dictionaries';
import type * as OverlayLoader from 'src/i18n/overlay/loader';

export type Lang = 'de' | 'en' | OverlayLang;

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
const NON_LOCALIZED_PREFIXES = ['/impressum', '/datenschutz', '/agb', '/not-found', '/intern'];

/**
 * Seiten ohne Overlay-Fassung (Ukrainisch, Türkisch): das MwSt-Paar für
 * US-Streitkräfte (Zielgruppe spricht Englisch), die internen Task-Seiten und
 * alles aus OVERLAY_EXCLUDED_PATHS.
 */
const NON_OVERLAY_PREFIXES = [
  '/ratgeber/mehrwertsteuer-us-streitkraefte',
  '/ratgeber/us-forces-vat-relief',
  '/tasks',
  '/massage-tasks',
  ...OVERLAY_EXCLUDED_PATHS.map((path) => `/${path}`),
];

const PREFIX: Record<Lang, string> = { de: '', en: '/en', uk: '/uk', tr: '/tr' };

/**
 * Outfit und Fraunces haben keine kyrillischen Zeichen. Auf /uk/-Seiten
 * springen Onest und Lora ein (in den font-family-Listen direkt dahinter);
 * dank unicode-range lädt der Browser nur deren kyrillische Dateien. Die
 * Schriften liegen auf dieser Website (src/assets/fonts), keine Anfrage an
 * Dritte. Türkisch braucht keine eigenen Schriften: ğ, ş und İ stehen in den
 * Latin-Extended-Dateien von Outfit und Fraunces, die index.html schon kennt.
 */
const UK_FONTS_HREF = '/assets/fonts/uk-fonts.css';

/**
 * Zentrale, seitenübergreifende UI-Sprache (DE/EN/UK/TR).
 *
 * Die URL ist die Quelle der Wahrheit: Pfade unter /en/ (und die englischen
 * Sonderseiten) rendern Englisch, unter /uk/ Ukrainisch, unter /tr/
 * Türkisch, alle anderen Deutsch, identisch beim Prerendern und im Browser.
 * Der Header-Umschalter navigiert zur Gegenstück-URL; nur Seiten ohne
 * Gegenstück schalten das UI direkt um. Die Sprache wird auf
 * <html lang data-lang> gespiegelt, damit das globale CSS die passenden
 * .lang-Blöcke ein- und ausblendet.
 *
 * Ukrainisch und Türkisch sind Overlays (src/i18n/overlay): t() und die
 * .lang.de-Blöcke werden über Wörterbücher übersetzt, die nur die Seiten
 * dieser Sprache laden. Der Wechsel in einen Overlay-Baum, aus ihm heraus
 * oder in einen anderen lädt die Seite deshalb neu, statt im laufenden DOM
 * zurückzuübersetzen.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService implements OverlayRouteDicts {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private observer: MutationObserver | null = null;
  private reloading = false;
  /**
   * Katalog der Overlay-Sprache dieses Seitenaufrufs (beim Prerendern: dieser
   * einen Seite); nur auf /uk/- und /tr/-Seiten, Code als eigener Chunk.
   */
  private overlay: OverlayCatalog | null = null;
  private loader: typeof OverlayLoader | null = null;
  /** Erfüllt, sobald init() fertig ist; die Routen-Resolver warten darauf. */
  private ready: Promise<void> = Promise.resolve();

  /** Aktuelle UI-Sprache; wird aus der URL abgeleitet. */
  readonly lang = signal<Lang>('de');

  constructor() {
    // Initial synchron aus der Request-/Browser-URL, damit ngOnInit-Logik
    // (SEO, JSON-LD) schon vor dem ersten Router-Event die Sprache kennt.
    this.apply(this.langForPath(this.document.location?.pathname ?? '/'));

    // RoutesRecognized feuert vor der Komponenten-Aktivierung, sodass
    // ngOnInit der Zielseite bereits die richtige Sprache sieht. Eine
    // Navigation über die Grenze eines Overlays lädt neu
    // (languageBoundaryGuard), bis dahin bleibt die alte Sprache stehen.
    this.router.events
      .pipe(filter((e): e is RoutesRecognized => e instanceof RoutesRecognized))
      .subscribe((e) => {
        const next = this.langForPath(e.urlAfterRedirects.split('?')[0].split('#')[0]);
        if (this.isBrowser && this.crossesOverlayBoundary(next)) return;
        this.apply(next);
      });
  }

  /**
   * Vor dem ersten Rendern (APP_INITIALIZER): auf Overlay-Seiten das
   * gemeinsame Wörterbuch laden und im Browser die DOM-Übersetzung starten.
   */
  init(): Promise<void> {
    const lang = this.lang();
    if (!isOverlayLang(lang)) return Promise.resolve();
    if (lang === 'uk') this.addUkFonts();
    this.ready = (async () => {
      const [{ OverlayCatalog }, loader] = await Promise.all([
        import('src/i18n/overlay/catalog'),
        import('src/i18n/overlay/loader'),
      ]);
      const catalog = new OverlayCatalog(lang);
      await loader.loadDicts(catalog, lang, ['common']);
      this.overlay = catalog;
      this.loader = loader;
      if (this.isBrowser) this.startOverlayObserver();
    })();
    return this.ready;
  }

  /**
   * Für den Resolver jeder Overlay-Route (OVERLAY_ROUTE_DICTS): die
   * Wörterbücher dieser Route laden. path ist der Routenpfad ohne
   * Sprachpräfix, wie in src/i18n/overlay/route-dicts.ts.
   */
  async loadRouteDicts(path: string): Promise<void> {
    await this.ready;
    const lang = this.lang();
    if (!this.overlay || !this.loader || !isOverlayLang(lang)) return;
    await this.loader.loadDictsForRoute(this.overlay, lang, path);
  }

  /** Der Katalog dieses Seitenaufrufs, für den Feinschliff beim Prerendern. */
  overlayCatalog(): OverlayCatalog | null {
    return this.overlay;
  }

  /**
   * Umschalten: navigiert zur Gegenstück-URL (die Sprache folgt dann der
   * URL). Ohne Gegenstück wird nur das UI umgeschaltet; eine Overlay-Sprache
   * führt dann auf ihre Startseite.
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
    // Interne Seiten (/intern/…) gibt es nur unter einer Adresse und sie
    // schalten ihren Inhalt selbst um. Wegnavigieren würde die mit Passwort
    // geöffnete Seite wieder schließen, also nur das UI umschalten.
    if (current.startsWith('/intern/')) {
      this.apply(lang);
      return;
    }
    const target = this.counterpartPath(current, lang) ?? (isOverlayLang(lang) ? `/${lang}` : null);

    if (target !== null && this.isBrowser && this.crossesOverlayBoundary(lang)) {
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
   * Wählt den zur aktuellen Sprache passenden Text. In einer Overlay-Sprache
   * aus dem Wörterbuch, mit Englisch als Rückfall für noch fehlende Einträge.
   */
  t(de: string, en: string): string {
    const lang = this.lang();
    if (lang === 'de') return de;
    if (lang === 'en') return en;
    return this.overlay?.lookup(de) ?? en;
  }

  /**
   * Für Komponenten, die ihren Text selbst im DOM umbauen (Wort-für-Wort-
   * Hervorhebung o. Ä.): auf Overlay-Seiten vorher übersetzen, sonst passt
   * der Schlüssel nicht mehr. Sonst ein No-op.
   */
  translateDom(root: Element): void {
    this.overlay?.translateTree(root);
  }

  /** URL-Präfix der aktiven Sprache: '', '/en', '/uk' oder '/tr'. */
  prefix(): string {
    return PREFIX[this.lang()];
  }

  /**
   * Interner Link in der aktuellen Sprache: auf englischen und Overlay-
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
    if (NON_OVERLAY_PREFIXES.some((p) => base.startsWith(p))) return null;
    return localized(PREFIX[target]);
  }

  /** Sprache, die eine URL ausliefert. */
  langForPath(path: string): Lang {
    const normalized = path === '' ? '/' : path;
    if (normalized === '/en' || normalized.startsWith('/en/')) return 'en';
    for (const lang of OVERLAY_LANGS) {
      if (normalized === `/${lang}` || normalized.startsWith(`/${lang}/`)) return lang;
    }
    if (SPECIAL_EN_TO_DE[normalized]) return 'en';
    return 'de';
  }

  /**
   * Für languageBoundaryGuard: eine Navigation in einen Overlay-Baum, aus ihm
   * heraus oder in einen anderen wird zum Seitenaufruf. false bricht die
   * Router-Navigation ab.
   */
  allowNavigation(url: string): boolean {
    if (!this.isBrowser) return true;
    const next = this.langForPath(url.split('?')[0].split('#')[0]);
    if (!this.crossesOverlayBoundary(next)) return true;
    this.hardNavigate(url);
    return false;
  }

  /** Deutscher Pfad einer Seite, egal in welcher Sprache sie gerade steht. */
  private basePath(path: string): string {
    const normalized = path === '' ? '/' : path;
    if (SPECIAL_EN_TO_DE[normalized]) return SPECIAL_EN_TO_DE[normalized];
    const m = /^\/([a-z]{2})(\/.*)?$/.exec(normalized);
    if (m && (m[1] === 'en' || isOverlayLang(m[1]))) return m[2] || '/';
    return normalized;
  }

  /** Wörterbuch und Katalog gelten für genau eine Overlay-Sprache je Seitenaufruf. */
  private crossesOverlayBoundary(next: Lang): boolean {
    const overlayOf = (lang: Lang) => (isOverlayLang(lang) ? lang : null);
    return overlayOf(this.lang()) !== overlayOf(next);
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
  private startOverlayObserver(): void {
    const catalog = this.overlay;
    if (!catalog || this.observer || typeof MutationObserver === 'undefined') return;
    const body = this.document.body;
    catalog.translateTree(body);
    this.observer = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === 1) catalog.translateTree(node as Element);
        });
      }
    });
    this.observer.observe(body, { childList: true, subtree: true });
  }
}

/**
 * Sitzt auf der Wurzel aller Routen: eine Navigation in einen Overlay-Baum
 * (/uk/, /tr/) oder aus ihm heraus wird zum normalen Seitenaufruf, damit die
 * vorgerenderte Seite in der richtigen Sprache kommt.
 */
export const languageBoundaryGuard: CanActivateChildFn = (_route, state) =>
  inject(LanguageService).allowNavigation(state.url);
