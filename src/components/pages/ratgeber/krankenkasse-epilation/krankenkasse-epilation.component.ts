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

const PAGE_PATH = '/ratgeber/epilation-krankenkasse';
const PAGE_TITLE_DE =
  'Epilation über die Krankenkasse: Leitfaden für trans Personen | FareWell Nürnberg';
const PAGE_TITLE_EN =
  'Health Insurance Coverage for Hair Removal: a Guide for Trans People | FareWell Nuremberg';
const PAGE_DESCRIPTION_DE =
  'So bekommst du deine Haarentfernung im Gesicht als Kassenleistung: Ärztevorbehalt, ärztliche Delegation bei FareWell, Antrag in 5 Schritten, Fristen und Widerspruch.';
const PAGE_DESCRIPTION_EN =
  'How facial hair removal becomes a covered benefit in Germany: the physician requirement, medical delegation at FareWell, the application in 5 steps, deadlines and objections.';

@Component({
  standalone: true,
  selector: 'app-krankenkasse-epilation',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './krankenkasse-epilation.component.html',
})
export class KrankenkasseEpilationComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'krankenkasse-epilation-schema';

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
      { value: '§ 27', label: this.t('SGB V · Sachleistung', 'SGB V · benefit in kind') },
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
        id: 'termin',
        label: this.t('Was du zum Termin mitbringst', 'What to bring to your appointment'),
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
            'Epilation über die Krankenkasse',
            'Epilation covered by your statutory health insurer',
          ),
          description,
          inLanguage: isEn ? 'en' : 'de',
          datePublished: '2026-07-15',
          dateModified: '2026-07-15',
          image: ['https://farewell.salon/assets/images/farewell/studio.webp'],
          author: { '@id': 'https://farewell.salon/#organization' },
          publisher: {
            '@type': 'BeautySalon',
            '@id': 'https://farewell.salon/#organization',
            name: 'FareWell',
            url: 'https://farewell.salon',
          },
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
              name: 'FAQ',
              item: `https://farewell.salon${this.p('/faq')}`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: this.t(
                'Epilation über die Krankenkasse',
                'Epilation covered by your statutory health insurer',
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
