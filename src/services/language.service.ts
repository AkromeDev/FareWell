import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';

export type Lang = 'de' | 'en';

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
 * Zentrale, seitenübergreifende UI-Sprache (DE/EN).
 *
 * Die URL ist die Quelle der Wahrheit: Pfade unter /en/ (und die englischen
 * Sonderseiten) rendern Englisch, alle anderen Deutsch – identisch beim
 * Prerendern und im Browser. Der Header-Umschalter navigiert zur
 * Gegenstück-URL; nur Seiten ohne Gegenstück schalten das UI direkt um.
 * Die Sprache wird auf <html lang data-lang> gespiegelt, damit das globale
 * CSS die passenden .lang-Blöcke ein- und ausblendet.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  /** Aktuelle UI-Sprache; wird aus der URL abgeleitet. */
  readonly lang = signal<Lang>('de');

  constructor() {
    // Initial synchron aus der Request-/Browser-URL, damit ngOnInit-Logik
    // (SEO, JSON-LD) schon vor dem ersten Router-Event die Sprache kennt.
    this.apply(this.langForPath(this.document.location?.pathname ?? '/'));

    // RoutesRecognized feuert vor der Komponenten-Aktivierung, sodass
    // ngOnInit der Zielseite bereits die richtige Sprache sieht.
    this.router.events
      .pipe(filter((e): e is RoutesRecognized => e instanceof RoutesRecognized))
      .subscribe((e) => {
        this.apply(this.langForPath(e.urlAfterRedirects.split('?')[0].split('#')[0]));
      });
  }

  /**
   * Umschalten: navigiert zur Gegenstück-URL (die Sprache folgt dann der
   * URL). Ohne Gegenstück wird nur das UI umgeschaltet.
   */
  setLang(lang: Lang): void {
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, lang);
    }

    const current = this.router.url.split('?')[0].split('#')[0] || '/';
    const target = this.counterpartPath(current, lang);

    if (target !== null && target !== current) {
      this.router.navigateByUrl(target);
    } else {
      this.apply(lang);
    }
  }

  toggle(): void {
    this.setLang(this.lang() === 'de' ? 'en' : 'de');
  }

  /** Wählt den zur aktuellen Sprache passenden Text. */
  t(de: string, en: string): string {
    return this.lang() === 'de' ? de : en;
  }

  /**
   * Interner Link in der aktuellen Sprache: auf englischen Seiten wird der
   * deutsche Pfad auf sein /en/-Gegenstück (bzw. die englische Sonderseite)
   * abgebildet, sonst unverändert zurückgegeben. Templates binden Links als
   * [routerLink]="p('/price')" o. Ä.
   */
  localizePath(dePath: string): string {
    if (this.lang() !== 'en') {
      return dePath;
    }
    return this.counterpartPath(dePath, 'en') ?? dePath;
  }

  /** Gegenstück-URL einer Seite in der Zielsprache; null = existiert nicht. */
  counterpartPath(path: string, target: Lang): string | null {
    const normalized = path === '' ? '/' : path;

    if (target === 'en') {
      if (this.langForPath(normalized) === 'en') return normalized;
      if (SPECIAL_DE_TO_EN[normalized]) return SPECIAL_DE_TO_EN[normalized];
      if (NON_LOCALIZED_PREFIXES.some((p) => normalized.startsWith(p))) return null;
      return normalized === '/' ? '/en' : `/en${normalized}`;
    }

    if (this.langForPath(normalized) === 'de') return normalized;
    if (SPECIAL_EN_TO_DE[normalized]) return SPECIAL_EN_TO_DE[normalized];
    if (normalized === '/en') return '/';
    if (normalized.startsWith('/en/')) return normalized.slice(3);
    return normalized;
  }

  /** Sprache, die eine URL ausliefert. */
  langForPath(path: string): Lang {
    const normalized = path === '' ? '/' : path;
    if (normalized === '/en' || normalized.startsWith('/en/')) return 'en';
    if (SPECIAL_EN_TO_DE[normalized]) return 'en';
    return 'de';
  }

  private apply(lang: Lang): void {
    this.lang.set(lang);
    const root = this.document.documentElement;
    root.setAttribute('data-lang', lang);
    root.lang = lang;
  }
}
