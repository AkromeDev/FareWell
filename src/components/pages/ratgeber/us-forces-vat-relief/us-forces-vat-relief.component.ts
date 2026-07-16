import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';
import {
  GUIDE_COMPONENTS,
  GuideStat,
  GuideTocItem,
} from 'src/components/molecules/guide';

const PAGE_PATH = '/ratgeber/us-forces-vat-relief';
const PAGE_URL = `https://farewell.salon${PAGE_PATH}`;
const PAGE_TITLE = 'US Forces VAT Relief in Germany: NF1 Forms & Remonon Explained | FareWell Nürnberg';
const PAGE_DESCRIPTION =
  'How US Forces members stop paying the 19% German VAT: NF1 and NF2 forms, the Remonon app, the five rules to keep it valid, plus 20% off laser hair removal for life.';

@Component({
  standalone: true,
  selector: 'app-us-forces-vat-relief',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './us-forces-vat-relief.component.html',
})
export class UsForcesVatReliefComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'us-vat-relief-schema';

  p(path: string): string {
    return this.language.localizePath(path);
  }

  readonly stats: GuideStat[] = [
    { value: '19%', label: 'German VAT you skip' },
    { value: '2', label: 'Easy ways to save' },
    { value: '10', label: 'NF1 forms you may hold' },
    { value: '20%', label: 'For life with code USLASER' },
  ];

  readonly toc: GuideTocItem[] = [
    { id: 'who', label: 'Who can use it' },
    { id: 'what', label: 'What it works on, and what it does not' },
    { id: 'forms', label: 'The two VAT forms' },
    { id: 'ways', label: 'Two ways to save' },
    { id: 'rules', label: 'Five rules to keep it valid' },
    { id: 'offer', label: 'Your exclusive US Forces offer' },
    { id: 'read-on', label: 'Read on' },
  ];

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      path: PAGE_PATH,
      type: 'article',
      locale: 'en_US',
    });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': `${PAGE_URL}#article`,
          headline: 'Your guide to US Forces VAT relief in Germany',
          description: PAGE_DESCRIPTION,
          inLanguage: 'en',
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
          inLanguage: 'en',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: 'https://farewell.salon/en' },
            { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://farewell.salon/en/faq' },
            { '@type': 'ListItem', position: 3, name: 'US Forces VAT relief', item: PAGE_URL },
          ],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
