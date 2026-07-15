import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { SeoService } from 'src/services/seo.service';
import {
  GUIDE_COMPONENTS,
  GuideStat,
  GuideTocItem,
} from 'src/components/molecules/guide';

const PAGE_PATH = '/ratgeber/mehrwertsteuer-us-streitkraefte';
const PAGE_URL = `https://farewell.salon${PAGE_PATH}`;
const PAGE_TITLE = "Mehrwertsteuerbefreiung für US-Streitkräfte (SOFA) – so funktioniert's | FareWell Nürnberg";
const PAGE_DESCRIPTION =
  'NF1-Formular oder Remonon-App: So kaufen Angehörige der US-Streitkräfte in Deutschland ohne die 19% Mehrwertsteuer ein – Schritt für Schritt, mit FareWell als Beispiel.';

@Component({
  standalone: true,
  selector: 'app-mwst-us-streitkraefte',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './mwst-us-streitkraefte.component.html',
})
export class MwstUsStreitkraefteComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly jsonLdId = 'mwst-us-schema';

  readonly stats: GuideStat[] = [
    { value: '19%', label: 'Mehrwertsteuer gespart' },
    { value: '2', label: 'Wege zum Sparen' },
    { value: '10', label: 'NF1-Formulare gleichzeitig möglich' },
    { value: '20%', label: 'Lebenslang mit Code USLASER' },
  ];

  readonly toc: GuideTocItem[] = [
    { id: 'wer', label: 'Wer es nutzen kann' },
    { id: 'wofuer', label: 'Wofür es gilt, und wofür nicht' },
    { id: 'formulare', label: 'Die zwei VAT-Formulare' },
    { id: 'wege', label: 'Zwei Wege zum Sparen' },
    { id: 'regeln', label: 'Fünf Regeln, damit alles gültig bleibt' },
    { id: 'angebot', label: 'Ihr exklusives Angebot' },
    { id: 'weiterlesen', label: 'Weiterlesen' },
  ];

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      path: PAGE_PATH,
      type: 'article',
    });

    this.seo.setAlternateLinks('vat-guide', [
      { hreflang: 'de', href: 'https://farewell.salon/ratgeber/mehrwertsteuer-us-streitkraefte' },
      { hreflang: 'en', href: 'https://farewell.salon/ratgeber/us-forces-vat-relief' },
      { hreflang: 'x-default', href: 'https://farewell.salon/ratgeber/us-forces-vat-relief' },
    ]);

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': `${PAGE_URL}#article`,
          headline: 'Mehrwertsteuerbefreiung für US-Streitkräfte',
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
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Mehrwertsteuerbefreiung für US-Streitkräfte',
              item: PAGE_URL,
            },
          ],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
    this.seo.clearAlternateLinks('vat-guide');
  }
}
