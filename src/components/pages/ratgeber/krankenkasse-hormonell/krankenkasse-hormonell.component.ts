import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { SeoService } from 'src/services/seo.service';
import { LanguageService } from 'src/services/language.service';
import {
  GUIDE_COMPONENTS,
  GuideLang,
  GuideStat,
  GuideTocItem,
} from 'src/components/molecules/guide';
import { KostenvoranschlagUnterlagenComponent } from 'src/components/molecules/kostenvoranschlag-unterlagen/kostenvoranschlag-unterlagen.component';

/**
 * Schwesterseite zum Leitfaden für trans Personen
 * (`/ratgeber/epilation-krankenkasse`): gleicher Aufbau, gleiche Abschnitte,
 * gleicher Ton. Unterschiedlich sind bewusst nur zwei Dinge, die Diagnosen und
 * die ärztlichen Ansprechpartner:innen; der tragende Rechtsgedanke ist auf
 * beiden Seiten derselbe.
 *
 * Die Metadaten sind absichtlich auf PCOS, Hirsutismus und hormonellen
 * Haarwuchs zugeschnitten, damit beide Seiten nicht um dieselben Suchbegriffe
 * konkurrieren: „trans“ und „F64.0“ kommen hier nicht vor, „PCOS“ und
 * „Hirsutismus“ nicht auf der Trans-Seite.
 */
const PAGE_PATH = '/ratgeber/epilation-krankenkasse-hormonell';
const PAGE_TITLE_DE = 'Hirsutismus & PCOS: Haarentfernung auf Kasse? | FareWell Nürnberg';
const PAGE_TITLE_EN = 'Hirsutism & PCOS: Hair Removal on Insurance? | FareWell Nuremberg';
const PAGE_DESCRIPTION_DE =
  'Hirsutismus durch PCOS, AGS oder die Wechseljahre: welche Abklärung nötig ist, was ins ärztliche Attest gehört und wie ein Antrag bei der Kasse abläuft.';
const PAGE_DESCRIPTION_EN =
  'Hirsutism from PCOS, CAH or the menopause: which work-up is needed, what belongs in the medical certificate and how an application to a German insurer works.';

@Component({
  standalone: true,
  selector: 'app-krankenkasse-hormonell',
  imports: [
    ...GUIDE_COMPONENTS,
    RevealOnScrollDirective,
    RouterLink,
    KostenvoranschlagUnterlagenComponent,
  ],
  templateUrl: './krankenkasse-hormonell.component.html',
})
export class KrankenkasseHormonellComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'krankenkasse-hormonell-schema';

  get lang(): GuideLang {
    return this.language.lang();
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  p(path: string): string {
    return this.language.localizePath(path);
  }

  get stats(): GuideStat[] {
    return [
      { value: '§ 27', label: this.t('SGB V · Krankenbehandlung', 'SGB V · medical treatment') },
      { value: '5', label: this.t('Schritte zum Antrag', 'Steps to your application') },
      {
        value: this.t('3 Wochen', '3 weeks'),
        label: this.t('Entscheidungsfrist der Kasse', "Insurer's decision deadline"),
      },
      {
        value: this.t('1 Monat', '1 month'),
        label: this.t('Zeit für den Widerspruch', 'Time to object'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'warum', label: this.t('Warum die Kasse zahlen kann', 'Why your insurer can pay') },
      { id: 'wissen', label: this.t('Was du wissen solltest', 'What you should know') },
      {
        id: 'schritte',
        label: this.t('In 5 Schritten zur Kostenübernahme', 'Coverage in 5 steps'),
      },
      { id: 'gut-zu-wissen', label: this.t('Gut zu wissen', 'Good to know') },
      {
        id: 'unterlagen',
        label: this.t('Was wir von dir brauchen', 'What we need from you'),
      },
      { id: 'weiterlesen', label: this.t('Weiterlesen', 'Further reading') },
    ];
  }

  ngOnInit(): void {
    const isEn = this.language.lang() === 'en';
    const title = this.t(PAGE_TITLE_DE, PAGE_TITLE_EN);
    const description = this.t(PAGE_DESCRIPTION_DE, PAGE_DESCRIPTION_EN);
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;
    const homeUrl = isEn ? 'https://farewell.salon/en' : 'https://farewell.salon';

    this.seo.setPageSeo({
      title,
      description,
      path: PAGE_PATH,
      type: 'article',
    });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': `${pageUrl}#article`,
          headline: this.t(
            'Haarentfernung bei PCOS, Hirsutismus und Hypertrichose: Kostenübernahme',
            'Hair removal with PCOS, hirsutism and hypertrichosis: insurance coverage',
          ),
          description,
          inLanguage: isEn ? 'en' : 'de',
          datePublished: '2026-08-27',
          dateModified: '2026-08-27',
          image: ['https://farewell.salon/assets/images/farewell/studio.webp'],
          author: { '@id': 'https://farewell.salon/#organization' },
          publisher: {
            '@type': 'BeautySalon',
            '@id': 'https://farewell.salon/#organization',
            name: 'FareWell – Kosmetikstudio & dauerhafte Haarentfernung',
            alternateName: 'FareWell',
            url: 'https://farewell.salon',
          },
          about: this.t(
            'Kostenübernahme der Haarentfernung bei PCOS, Hirsutismus und Hypertrichose',
            'Insurance coverage of hair removal with PCOS, hirsutism and hypertrichosis',
          ),
          mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title,
          description,
          inLanguage: isEn ? 'en' : 'de',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: homeUrl },
            {
              '@type': 'ListItem',
              position: 2,
              name: this.t('Ratgeber', 'Guides'),
              item: `https://farewell.salon${this.p('/ratgeber')}`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: this.t(
                'Epilation über die Krankenkasse bei hormonellem Haarwuchs',
                'Insurance-covered epilation for hormonal hair growth',
              ),
              item: pageUrl,
            },
          ],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
