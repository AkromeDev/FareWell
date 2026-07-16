import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';

export type Lang = 'de' | 'en';

const STORAGE_KEY = 'fw_lang';

/**
 * Zentrale, seitenübergreifende UI-Sprache (DE/EN). Der Header-Umschalter
 * setzt sie, jede Seite und Komponente liest sie hier aus. Der Zustand wird in
 * localStorage gespeichert und beim Umschalten auf das <html>-Element gespiegelt
 * (lang + data-lang), sodass globales CSS die passenden .lang-Blöcke ein- und
 * ausblendet. Läuft SSR-sicher: beim Prerendern bleibt es bei Deutsch.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly document = inject(DOCUMENT);

  /** Aktuelle UI-Sprache; Default Deutsch (auch beim Prerendern). */
  readonly lang = signal<Lang>('de');

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'de' || stored === 'en') {
      this.lang.set(stored);
    }

    // Spiegelt die Sprache auf <html>, damit globales CSS greift.
    effect(() => {
      const lang = this.lang();
      const root = this.document.documentElement;
      root.setAttribute('data-lang', lang);
      root.lang = lang;
    });
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }

  toggle(): void {
    this.setLang(this.lang() === 'de' ? 'en' : 'de');
  }

  /** Wählt den zur aktuellen Sprache passenden Text. */
  t(de: string, en: string): string {
    return this.lang() === 'de' ? de : en;
  }
}
