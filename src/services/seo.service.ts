import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

export interface PageSeo {
  /** Full document title, e.g. 'FAQ | FareWell Nürnberg'. */
  title: string;
  description: string;
  /** Absolute path of the page, e.g. '/faq'. */
  path: string;
  /** BCP-47-ish Open-Graph locale, defaults to de_DE. */
  locale?: string;
  /** Open-Graph-Typ; Ratgeber-Artikel setzen 'article'. */
  type?: 'website' | 'article';
  image?: string;
  imageAlt?: string;
  /** Twitter-Card mit großem Bild; für Promo-/Landing-Pages mit Hero-Foto. */
  largeImage?: boolean;
}

const ORIGIN = 'https://farewell.salon';
const DEFAULT_IMAGE = `${ORIGIN}/assets/images/logo/android-chrome-512x512.png`;

/**
 * Zentraler SEO-Helfer: setzt Title/Meta/Open-Graph pro Seite und injiziert
 * JSON-LD sowie hreflang-Links direkt in den <head> (Skript-Tags in Templates
 * werden vom Angular-Compiler entfernt, daher der Umweg über das DOCUMENT).
 * Läuft identisch im Browser und beim Prerendern.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  setPageSeo(seo: PageSeo): void {
    const url = `${ORIGIN}${seo.path}`;
    const image = seo.image ?? DEFAULT_IMAGE;
    const imageAlt = seo.imageAlt ?? 'FareWell Logo';

    this.title.setTitle(seo.title);

    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });

    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:type', content: seo.type ?? 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:alt', content: imageAlt });
    this.meta.updateTag({ property: 'og:locale', content: seo.locale ?? 'de_DE' });
    this.meta.updateTag({ property: 'og:site_name', content: 'FareWell' });

    this.meta.updateTag({
      name: 'twitter:card',
      content: seo.largeImage ? 'summary_large_image' : 'summary',
    });
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:alt', content: imageAlt });
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
