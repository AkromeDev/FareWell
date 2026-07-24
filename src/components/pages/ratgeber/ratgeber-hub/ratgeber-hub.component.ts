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

const PAGE_PATH = '/ratgeber';
const PAGE_TITLE_DE = 'Ratgeber: Haarentfernung, Körper & Kostenübernahme | FareWell Nürnberg';
const PAGE_TITLE_EN = 'Guides: Hair Removal, Body & Coverage | FareWell Nuremberg';
const PAGE_DESCRIPTION_DE =
  'Alle Ratgeber von FareWell Nürnberg an einem Ort: Elektrolyse oder Laser, Körperbehandlungen mit Ultraschall, Kostenübernahme durch die Krankenkasse, Steuer und Mehrwertsteuerbefreiung für US-Streitkräfte.';
const PAGE_DESCRIPTION_EN =
  "FareWell Nuremberg's guides in one place: electrolysis or laser, ultrasound body treatments, insurance coverage, tax deductions and VAT exemption for US Forces.";

@Component({
  standalone: true,
  selector: 'app-ratgeber-hub',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './ratgeber-hub.component.html',
})
export class RatgeberHubComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'ratgeber-hub-schema';

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
      { value: '6', label: this.t('Ratgeber zum Nachlesen', 'guides to read') },
      { value: '2', label: this.t('Themenfelder', 'topic areas') },
      { value: 'DE · EN', label: this.t('zweisprachig', 'bilingual') },
      { value: this.t('gratis', 'free'), label: this.t('Erstberatung', 'initial consultation') },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'behandlungen', label: this.t('Behandlungen & Methoden', 'Treatments & methods') },
      { id: 'kosten-recht', label: this.t('Kosten & Recht', 'Cost & rights') },
      { id: 'faq', label: this.t('Häufige Fragen', 'FAQ') },
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
    });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title,
          description,
          inLanguage: isEn ? 'en' : 'de',
          isPartOf: { '@id': 'https://farewell.salon/#website' },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: homeUrl },
            { '@type': 'ListItem', position: 2, name: this.t('Ratgeber', 'Guides'), item: pageUrl },
          ],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
