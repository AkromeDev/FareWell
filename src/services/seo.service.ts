import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { LanguageService } from './language.service';

export interface PageSeo {
  /** Full document title, e.g. 'FAQ | FareWell Nürnberg'. */
  title: string;
  description: string;
  /**
   * Absolute path of the page in its GERMAN form, e.g. '/faq'. The service
   * derives the /en/ form (or an English special page) automatically from the
   * active language.
   */
  path: string;
  /** BCP-47-ish Open-Graph locale; defaults to de_DE / en_US per language. */
  locale?: string;
  /** Open-Graph-Typ; Ratgeber-Artikel setzen 'article'. */
  type?: 'website' | 'article';
  image?: string;
  imageAlt?: string;
  /** Twitter-Card mit großem Bild; für Promo-/Landing-Pages mit Hero-Foto. */
  largeImage?: boolean;
  /** false unterdrückt die automatischen hreflang-Alternates (z. B. Legal). */
  alternates?: boolean;
  /** true erzwingt noindex unabhängig von der Sprache (z. B. 404-Seite). */
  noindex?: boolean;
}

const ORIGIN = 'https://farewell.salon';
const DEFAULT_IMAGE = `${ORIGIN}/assets/images/logo/android-chrome-512x512.png`;

/**
 * Solange false, tragen alle Seiten unter /en/ ein noindex,follow. Auf true
 * stellen (und die /en/-URLs in die sitemap.xml aufnehmen), sobald die
 * englischen Seiten indexiert werden sollen. Bereits indexierte englische
 * Sonderseiten (z. B. /ratgeber/us-forces-vat-relief) sind davon ausgenommen.
 */
const EN_PREFIX_INDEXABLE = false;

/**
 * Zentraler SEO-Helfer: setzt Title/Meta/Open-Graph pro Seite und injiziert
 * JSON-LD sowie hreflang-Links direkt in den <head> (Skript-Tags in Templates
 * werden vom Angular-Compiler entfernt, daher der Umweg über das DOCUMENT).
 * Läuft identisch im Browser und beim Prerendern. Sprachbewusst: auf
 * englischen Seiten (/en/…) werden Pfad, Locale, Robots und hreflang
 * automatisch abgeleitet — Komponenten übergeben ihren deutschen Pfad und
 * bereits per t() aufgelöste Texte.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly language = inject(LanguageService);

  setPageSeo(seo: PageSeo): void {
    const lang = this.language.lang();
    const dePath = this.language.counterpartPath(seo.path, 'de') ?? seo.path;
    const enPath = this.language.counterpartPath(seo.path, 'en');
    const effectivePath = lang === 'en' && enPath ? enPath : dePath;

    const url = `${ORIGIN}${effectivePath === '/' ? '/' : effectivePath}`;
    const image = seo.image ?? DEFAULT_IMAGE;
    const imageAlt = seo.imageAlt ?? 'FareWell Logo';

    this.title.setTitle(seo.title);

    this.meta.updateTag({ name: 'description', content: seo.description });

    // /en/-Seiten bleiben bis zur Freigabe auf noindex; die Freigabe steuert
    // EN_PREFIX_INDEXABLE oben.
    const noindex =
      seo.noindex === true || (effectivePath.startsWith('/en') && !EN_PREFIX_INDEXABLE);
    this.meta.updateTag({
      name: 'robots',
      content: noindex ? 'noindex,follow' : 'index,follow',
    });

    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:type', content: seo.type ?? 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:alt', content: imageAlt });
    this.meta.updateTag({
      property: 'og:locale',
      content: seo.locale ?? (lang === 'en' ? 'en_US' : 'de_DE'),
    });
    this.meta.updateTag({ property: 'og:site_name', content: 'FareWell' });

    this.meta.updateTag({
      name: 'twitter:card',
      content: seo.largeImage ? 'summary_large_image' : 'summary',
    });
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:alt', content: imageAlt });

    // hreflang-Paar (de ↔ en, x-default = de) für alle zweisprachigen Seiten.
    if (seo.alternates !== false && enPath) {
      this.setAlternateLinks('page', [
        { hreflang: 'de', href: `${ORIGIN}${dePath}` },
        { hreflang: 'en', href: `${ORIGIN}${enPath}` },
        { hreflang: 'x-default', href: `${ORIGIN}${dePath}` },
      ]);
    } else {
      this.clearAlternateLinks('page');
    }
  }

  /** Injiziert ein JSON-LD-Skript in den <head>; per id idempotent. */
  setJsonLd(id: string, data: object): void {
    this.clearJsonLd(id);

    const script = this.document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  clearJsonLd(id: string): void {
    this.document.getElementById(id)?.remove();
  }

  /**
   * Setzt <link rel="alternate" hreflang> Paare für mehrsprachige Seiten.
   * `group` erlaubt das saubere Entfernen beim Verlassen der Seite.
   */
  setAlternateLinks(group: string, links: { hreflang: string; href: string }[]): void {
    this.clearAlternateLinks(group);

    for (const link of links) {
      const el = this.document.createElement('link');
      el.rel = 'alternate';
      el.hreflang = link.hreflang;
      el.href = link.href;
      el.setAttribute('data-alternate-group', group);
      this.document.head.appendChild(el);
    }
  }

  clearAlternateLinks(group: string): void {
    this.document
      .querySelectorAll(`link[data-alternate-group="${group}"]`)
      .forEach((el) => el.remove());
  }
}
