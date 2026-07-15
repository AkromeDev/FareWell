import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { SeoService } from 'src/services/seo.service';
import {
  GUIDE_COMPONENTS,
  GuideStat,
  GuideTocItem,
} from 'src/components/molecules/guide';

const PAGE_PATH = '/ratgeber/haarentfernung-steuer-absetzen';
const PAGE_URL = `https://farewell.salon${PAGE_PATH}`;
const PAGE_TITLE = 'Haarentfernung von der Steuer absetzen – Leitfaden für trans Personen | FareWell Nürnberg';
const PAGE_DESCRIPTION =
  'Laser und Nadelepilation als außergewöhnliche Belastung absetzen: welche Nachweise das Finanzamt verlangt, wie du vorgehst und was FareWell dir dafür ausstellt.';

@Component({
  standalone: true,
  selector: 'app-steuer-absetzen',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './steuer-absetzen.component.html',
})
export class SteuerAbsetzenComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly jsonLdId = 'steuer-absetzen-schema';

  readonly stats: GuideStat[] = [
    { value: '3', label: 'Bausteine für den Nachweis' },
    { value: '1–7%', label: 'Zumutbare Belastung vom Einkommen', animate: false },
    { value: '2', label: 'Methoden, steuerlich gleichgestellt' },
  ];

  readonly toc: GuideTocItem[] = [
    { id: 'anerkannt', label: 'Warum das steuerlich anerkannt ist' },
    { id: 'verwechselt', label: 'Zwei Dinge, die oft verwechselt werden' },
    { id: 'nachweise', label: 'Welche Nachweise du brauchst' },
    { id: 'vorgehen', label: 'So gehst du vor' },
    { id: 'rechenbeispiel', label: 'Rechenbeispiel' },
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
          headline: 'Behandlungskosten steuerlich absetzen',
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
            { '@type': 'ListItem', position: 3, name: 'Behandlungskosten steuerlich absetzen', item: PAGE_URL },
          ],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
