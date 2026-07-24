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

const PAGE_PATH = '/ratgeber/elektrolyse-oder-laser';
const PAGE_TITLE_DE =
  'Elektrolyse oder Laser? Der ehrliche Vergleich zur Haarentfernung | FareWell Nürnberg';
const PAGE_TITLE_EN =
  'Electrolysis or Laser? An Honest Hair-Removal Comparison | FareWell Nuremberg';
const PAGE_DESCRIPTION_DE =
  'Elektrolyse (Nadelepilation) oder Diodenlaser? Permanent vs. dauerhaft, Haut- und Haartypen, Zonen, Sitzungen und Kosten, ehrlich verglichen, mit einer klaren Empfehlung für deine Situation.';
const PAGE_DESCRIPTION_EN =
  'Electrolysis (Nadelepilation) or the diode laser? Permanent vs. long-lasting, skin and hair types, areas, sessions and cost, compared honestly, with a clear recommendation for your situation.';

@Component({
  standalone: true,
  selector: 'app-elektrolyse-laser',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './elektrolyse-laser.component.html',
})
export class ElektrolyseLaserComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'elektrolyse-laser-schema';

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
      { value: '2', label: this.t('Methoden im Vergleich', 'methods compared') },
      {
        value: this.t('permanent', 'permanent'),
        label: this.t('nur mit Elektrolyse', 'only with electrolysis'),
      },
      {
        value: this.t('dauerhaft', 'long-lasting'),
        label: this.t('mit dem Diodenlaser', 'with the diode laser'),
      },
      { value: this.t('gratis', 'free'), label: this.t('Erstberatung', 'initial consultation') },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      {
        id: 'unterschied',
        label: this.t('Permanent oder dauerhaft', 'Permanent or long-lasting'),
      },
      { id: 'vergleich', label: this.t('Der direkte Vergleich', 'Side by side') },
      { id: 'elektrolyse', label: this.t('Wann Elektrolyse', 'When electrolysis') },
      { id: 'laser', label: this.t('Wann der Diodenlaser', 'When the diode laser') },
      { id: 'kombi', label: this.t('Beides kombinieren', 'Combining both') },
      { id: 'kosten', label: this.t('Sitzungen & Kosten', 'Sessions & cost') },
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
            'Elektrolyse oder Laser? Der ehrliche Vergleich',
            'Electrolysis or laser? An honest comparison',
          ),
          description,
          inLanguage: isEn ? 'en' : 'de',
          datePublished: '2026-07-24',
          dateModified: '2026-07-24',
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
              name: this.t('Ratgeber', 'Guides'),
              item: `https://farewell.salon${this.p('/ratgeber')}`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: this.t('Elektrolyse oder Laser', 'Electrolysis or laser'),
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
