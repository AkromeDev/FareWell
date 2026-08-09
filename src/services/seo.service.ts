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
/**
 * Vorschaubild beim Teilen. JPEG in 1200x630, nicht WebP und nicht das Logo:
 * mehrere Messenger (unter anderem WhatsApp und LinkedIn) zeigen WebP gar
 * nicht an, und ein quadratisches Logo erscheint als kleines Kästchen statt
 * als Banner. Muss mit dem og:image in index.html übereinstimmen.
 */
const DEFAULT_IMAGE = `${ORIGIN}/assets/images/farewell/og-studio.jpg`;

/**
 * Zentraler SEO-Helfer: setzt Title/Meta/Open-Graph pro Seite und injiziert
 * JSON-LD sowie hreflang-Links direkt in den <head> (Skript-Tags in Templates
 * werden vom Angular-Compiler entfernt, daher der Umweg über das DOCUMENT).
 * Läuft identisch im Browser und beim Prerendern. Sprachbewusst: auf
 * englischen Seiten (/en/…) werden Pfad, Locale und hreflang automatisch
 * abgeleitet — Komponenten übergeben ihren deutschen Pfad und bereits per t()
 * aufgelöste Texte.
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
    const imageAlt =
      seo.imageAlt ??
      this.language.t(
        'Empfang im FareWell Kosmetikstudio in Nürnberg',
        'Reception at the FareWell beauty studio in Nuremberg'
      );

    this.title.setTitle(seo.title);

    this.meta.updateTag({ name: 'description', content: seo.description });

    // Alle Seiten – deutsch wie englisch (/en/…) – sind indexierbar. Nur
    // einzelne private Seiten (404, interne Task-Seiten) setzen per
    // PageSeo.noindex ein noindex,follow.
    const noindex = seo.noindex === true;
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

    // Maße und Typ nur für das Standardbild, dessen Format wir kennen. Seiten
    // mit eigenem Bild bekommen gar keine Angabe statt einer falschen: die
    // Crawler messen dann selbst.
    if (seo.image) {
      this.meta.removeTag("property='og:image:type'");
      this.meta.removeTag("property='og:image:width'");
      this.meta.removeTag("property='og:image:height'");
    } else {
      this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }
    this.meta.updateTag({
      property: 'og:locale',
      content: seo.locale ?? (lang === 'en' ? 'en_US' : 'de_DE'),
    });
    this.meta.updateTag({ property: 'og:site_name', content: 'FareWell' });

    // Standard ist die große Karte: das Vorschaubild ist ein 1200x630 Foto,
    // in der kleinen Karte würde daraus ein Briefmarkenausschnitt.
    this.meta.updateTag({
      name: 'twitter:card',
      content: seo.largeImage === false ? 'summary' : 'summary_large_image',
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
