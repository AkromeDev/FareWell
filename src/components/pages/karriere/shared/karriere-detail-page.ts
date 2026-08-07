import { Directive, OnDestroy, OnInit, inject } from '@angular/core';
import { SeoService } from 'src/services/seo.service';
import { LanguageService, Lang } from 'src/services/language.service';
import { type GuideStat, type GuideTocItem } from 'src/components/molecules/guide';
import { KarriereFaqEntry, karriereStats } from './karriere-content';
import { KarriereJobConfig, buildKarriereJsonLd } from './karriere-seo';

/**
 * Gemeinsames Gerüst aller Karriere-Detailseiten: Sprache, interne Links,
 * SEO-Metadaten, Kennzahlen, Inhaltsverzeichnis und der JSON-LD-Graph
 * (JobPosting + FAQPage + WebPage + Breadcrumb). Eine Unterklasse liefert nur
 * noch ihre Berufs-Konfiguration.
 *
 * Die Konfiguration wird pro Sprache gecacht: Ohne Cache baute jeder
 * Change-Detection-Lauf die FAQ-Liste neu auf, an der das Template hängt.
 *
 * @Directive() ohne Selektor, weil die Klasse Angular-Features (inject,
 * Lifecycle-Hooks) nutzt und der Compiler dafür einen Decorator verlangt.
 */
@Directive()
export abstract class KarriereDetailPage implements OnInit, OnDestroy {
  protected readonly seo = inject(SeoService);
  protected readonly language = inject(LanguageService);

  /** Eindeutige id des <script type="application/ld+json">-Tags. */
  protected abstract readonly jsonLdId: string;

  /** Berufsspezifische Inhalte; wird in der aktiven Sprache aufgebaut. */
  protected abstract buildConfig(): KarriereJobConfig;

  /** Optionales Hero-Bild (Pfad ab /assets) für Open Graph. */
  protected readonly ogImage: string | null = null;

  private configCache: { lang: Lang; config: KarriereJobConfig } | null = null;

  get lang(): Lang {
    return this.language.lang();
  }

  get config(): KarriereJobConfig {
    const activeLang = this.language.lang();
    if (this.configCache?.lang !== activeLang) {
      this.configCache = { lang: activeLang, config: this.buildConfig() };
    }
    return this.configCache.config;
  }

  get faq(): KarriereFaqEntry[] {
    return this.config.faq;
  }

  /** Aufgaben und Profil aus derselben Quelle wie die JobPosting-Daten. */
  get responsibilities(): string[] {
    return this.config.responsibilities;
  }

  get profile(): string[] {
    return this.config.profile;
  }

  /** Betreff der Bewerbungs-Mail, berufsspezifisch. */
  get applySubject(): string {
    return this.config.applySubject;
  }

  /** Dritte Kennzahl überschreiben (Kursformate mit festem Zeitfenster). */
  protected get hoursStat(): GuideStat | undefined {
    return undefined;
  }

  /** Vierte Kennzahl überschreiben (z. B. „Approbation“ statt „selbständig“). */
  protected get lastStat(): GuideStat | undefined {
    return undefined;
  }

  get stats(): GuideStat[] {
    return karriereStats((de, en) => this.t(de, en), {
      hours: this.hoursStat,
      last: this.lastStat,
    });
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'aufgaben', label: this.t('Deine Aufgaben', 'Your responsibilities') },
      { id: 'profil', label: this.t('Dein Profil', 'Your profile') },
      { id: 'zeiten', label: this.t('Zeiten und Raumbelegung', 'Hours and room use') },
      { id: 'deal', label: this.t('Dein Deal bei FareWell', 'Your deal at FareWell') },
      { id: 'faq', label: this.t('Häufige Fragen', 'Frequently asked questions') },
      { id: 'bewerben', label: this.t('Bewerben', 'Apply') },
    ];
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  /** Interner Link in der aktiven Sprache (deutscher Pfad rein, /en-Twin raus). */
  p(path: string): string {
    return this.language.localizePath(path);
  }

  ngOnInit(): void {
    const cfg = this.config;

    this.seo.setPageSeo({
      title: cfg.title,
      description: cfg.description,
      path: cfg.path,
      // encodeURI, weil einzelne Assetnamen Leerzeichen enthalten
      // ("tm massaging.jpg") — eine og:image-URL mit rohem Leerzeichen holen
      // sich die Crawler nicht.
      ...(this.ogImage
        ? { image: encodeURI(`https://farewell.salon/${this.ogImage}`), largeImage: true }
        : {}),
    });

    this.seo.setJsonLd(
      this.jsonLdId,
      buildKarriereJsonLd((de, en) => this.t(de, en), this.language.lang() === 'en', cfg)
    );
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
