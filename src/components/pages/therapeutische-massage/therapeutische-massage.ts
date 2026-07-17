import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';
import {
  GUIDE_COMPONENTS,
  GuideLang,
  GuideStat,
  GuideTocItem,
} from 'src/components/molecules/guide';

const PAGE_PATH = '/behandlungen/therapeutische-massage';
const HERO_IMAGE = 'assets/images/massages/tm%20massaging.jpg';
const HERO_IMAGE_URL = `https://farewell.salon/${HERO_IMAGE}`;
const HERO_ALT_DE = 'Therapeutische Massage bei FareWell in Nürnberg';
const HERO_ALT_EN = 'Therapeutic massage at FareWell in Nuremberg';

const TITLE_DE = 'Therapeutische Massage Nürnberg | FareWell';
const TITLE_EN = 'Therapeutic Massage Nuremberg | FareWell';
const DESCRIPTION_DE =
  'Gezielte therapeutische Massagen in Nürnberg: Ersttermin mit Anamnese, Sport- & Regenerationsmassage sowie medizinisch-funktionelle Massage bei FareWell.';
const DESCRIPTION_EN =
  'Targeted therapeutic massages in Nuremberg: initial appointment with assessment, sports and recovery massage, and medical functional massage at FareWell.';

@Component({
  selector: 'app-therapeutische-massage',
  standalone: true,
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './therapeutische-massage.html',
})
export class TherapeutischeMassageComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'therapeutische-massage-schema';

  readonly heroImage = HERO_IMAGE;

  get lang(): GuideLang {
    return this.language.lang();
  }

  get heroImageAlt(): string {
    return this.t(HERO_ALT_DE, HERO_ALT_EN);
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  p(path: string): string {
    return this.language.localizePath(path);
  }

  get stats(): GuideStat[] {
    return [
      {
        value: this.t('kostenlos', 'free'),
        label: this.t('Beratungsgespräch (30 Min)', 'Consultation (30 min)'),
      },
      {
        value: this.t('99 €', '99 €'),
        label: this.t('Ersttermin mit Anamnese (90 Min)', 'Initial appointment with assessment (90 min)'),
      },
      {
        value: this.t('ab 50 €', 'from 50 €'),
        label: this.t('Sport- & Regenerationsmassage', 'Sports & recovery massage'),
      },
      {
        value: this.t('30–90 Min', '30–90 min'),
        label: this.t('Individuelle Behandlungsdauer', 'Individual treatment length'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'ueberblick', label: this.t('Therapeutische Massagen', 'Therapeutic massages') },
      { id: 'beratung', label: this.t('Beratungsgespräch', 'Consultation') },
      { id: 'ersttermin', label: this.t('Ersttermin mit Anamnese', 'Initial appointment') },
      { id: 'sport-regeneration', label: this.t('Sport- & Regeneration', 'Sports & recovery') },
      { id: 'medizinisch-funktionell', label: this.t('Medizinisch-funktionell', 'Medical functional') },
    ];
  }

  ngOnInit(): void {
    const isEn = this.language.lang() === 'en';
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;
    const pageTitle = this.t(TITLE_DE, TITLE_EN);
    const description = this.t(DESCRIPTION_DE, DESCRIPTION_EN);

    this.seo.setPageSeo({
      title: pageTitle,
      description,
      path: PAGE_PATH,
      image: HERO_IMAGE_URL,
      imageAlt: this.heroImageAlt,
      largeImage: true,
    });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: this.t('Therapeutische Massagen in Nürnberg', 'Therapeutic massages in Nuremberg'),
          description: this.t(
            'Gezielte therapeutische Massagen bei FareWell in Nürnberg für Regeneration, muskuläre Entlastung und Wohlbefinden.',
            'Targeted therapeutic massages at FareWell in Nuremberg for recovery, muscular relief and wellbeing.',
          ),
          serviceType: this.t('Therapeutische Massage', 'Therapeutic massage'),
          areaServed: { '@type': 'City', name: 'Nürnberg' },
          provider: {
            '@type': 'BeautySalon',
            '@id': 'https://farewell.salon/#organization',
            name: 'FareWell',
            url: 'https://farewell.salon',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Frauentorgraben 5',
              postalCode: '90443',
              addressLocality: 'Nürnberg',
              addressCountry: 'DE',
            },
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: this.t('Therapeutische Massage-Angebote', 'Therapeutic massage offers'),
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t('Massage Beratungsgespräch', 'Massage consultation'),
                },
                priceCurrency: 'EUR',
                price: '0',
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t(
                    'Ersttermin mit Anamnese & Befundaufnahme',
                    'Initial appointment with medical history and assessment',
                  ),
                },
                priceCurrency: 'EUR',
                price: '99',
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t('Sport- & Regenerationsmassage', 'Sports and recovery massage'),
                },
                priceCurrency: 'EUR',
                price: '50',
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t('Medizinisch-funktionelle Massage', 'Medical functional massage'),
                },
                priceCurrency: 'EUR',
                price: '60',
              },
            ],
          },
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: pageTitle,
          description,
          inLanguage: isEn ? 'en' : 'de',
          isPartOf: { '@id': 'https://farewell.salon/#website' },
          about: { '@id': `${pageUrl}#service` },
          primaryImageOfPage: { '@type': 'ImageObject', url: HERO_IMAGE_URL },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'FareWell',
              item: isEn ? 'https://farewell.salon/en' : 'https://farewell.salon',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: this.t('Behandlungen', 'Treatments'),
              item: `https://farewell.salon${isEn ? '/en' : ''}/behandlungen`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: this.t('Therapeutische Massage', 'Therapeutic Massage'),
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
