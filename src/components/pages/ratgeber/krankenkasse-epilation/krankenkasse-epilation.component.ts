import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { SeoService } from 'src/services/seo.service';
import {
  GUIDE_COMPONENTS,
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
  private readonly jsonLdId = 'krankenkasse-epilation-schema';

  readonly stats: GuideStat[] = [
    { value: '§ 27', label: 'SGB V · Sachleistung' },
    { value: '5', label: 'Schritte zum Antrag' },
    { value: '3 Wochen', label: 'Entscheidungsfrist der Kasse' },
    { value: '1 Monat', label: 'Zeit für den Widerspruch' },
  ];

  readonly toc: GuideTocItem[] = [
    { id: 'warum', label: 'Warum die Kasse zahlen kann' },
    { id: 'wissen', label: 'Was du wissen solltest' },
    { id: 'schritte', label: 'In 5 Schritten zur Kostenübernahme' },
    { id: 'gut-zu-wissen', label: 'Gut zu wissen' },
    { id: 'termin', label: 'Was du zum Termin mitbringst' },
    { id: 'weiterlesen', label: 'Weiterlesen' },
  ];

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
