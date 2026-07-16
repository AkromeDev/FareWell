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
const PAGE_URL = `https://farewell.salon${PAGE_PATH}`;
const PAGE_TITLE = 'Epilation über die Krankenkasse – Leitfaden für trans Personen | FareWell Nürnberg';
const PAGE_DESCRIPTION =
  'So bekommst du deine Haarentfernung im Gesicht als Kassenleistung: Ärztevorbehalt, ärztliche Delegation bei FareWell, Antrag in 5 Schritten, Fristen und Widerspruch.';

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
    this.seo.setPageSeo({
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      path: PAGE_PATH,
      type: 'article',
    });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': `${PAGE_URL}#article`,
          headline: 'Epilation über die Krankenkasse',
          description: PAGE_DESCRIPTION,
          inLanguage: 'de',
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
          mainEntityOfPage: { '@id': `${PAGE_URL}#webpage` },
        },
        {
          '@type': 'WebPage',
          '@id': `${PAGE_URL}#webpage`,
          url: PAGE_URL,
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          inLanguage: 'de',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: 'https://farewell.salon' },
            { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://farewell.salon/faq' },
            { '@type': 'ListItem', position: 3, name: 'Epilation über die Krankenkasse', item: PAGE_URL },
          ],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
