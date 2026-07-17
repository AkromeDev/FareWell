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

const PAGE_PATH = '/behandlungen/wellness-massage';
const HERO_IMAGE = 'assets/images/treatment/massage-hero.jpg';
const HERO_IMAGE_URL = `https://farewell.salon/${HERO_IMAGE}`;
const HERO_ALT_DE =
  'FareWell Studio in Nürnberg für Wellness Massagen, Entspannung und Regeneration';
const HERO_ALT_EN =
  'FareWell studio in Nuremberg for wellness massages, relaxation and recovery';

@Component({
  selector: 'app-wellness-massagen',
  standalone: true,
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './massage.html',
})
export class MassageComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'massage-schema';

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
      { value: this.t('30–90 Min', '30–90 min'), label: this.t('Behandlungsdauer', 'treatment duration') },
      { value: this.t('ab 45€', 'from 45€'), label: this.t('Einstiegspreis', 'starting price') },
      { value: this.t('3 Varianten', '3 options'), label: this.t('Massage-Angebote', 'massage options') },
      {
        value: this.t('Mandelöl', 'Almond oil'),
        label: this.t('naturreine Basis für Aromaöle', 'pure base for the aroma oils'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'ankommen', label: this.t('Ankommen & abschalten', 'Arrive & switch off') },
      { id: 'ruecken', label: this.t('Rücken-Schulter-Nacken', 'Back, shoulder & neck') },
      { id: 'ganzkoerper', label: this.t('Ganzkörper mit Aromaölen', 'Full-body with aroma oils') },
      { id: 'teilkoerper', label: this.t('Teilkörpermassage', 'Partial-body massage') },
      { id: 'hinweise', label: this.t('Gut zu wissen', 'Good to know') },
    ];
  }

  ngOnInit(): void {
    const isEn = this.language.lang() === 'en';
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;
    const pageTitle = this.t('Wellness Massage Nürnberg | FareWell', 'Wellness Massage Nuremberg | FareWell');
    const description = this.t(
      'Entspannende Wellness Massagen bei FareWell in Nürnberg: Rücken-Schulter-Nacken-Massage, Ganzkörpermassage mit Aromaölen und Teilkörpermassage.',
      'Relaxing wellness massages at FareWell in Nuremberg: back, shoulder and neck massage, full-body massage with aroma oils, and partial-body massage. English spoken.',
    );

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
          name: this.t('Wellness Massagen in Nürnberg', 'Wellness massages in Nuremberg'),
          description: this.t(
            'Wellness Massagen bei FareWell in Nürnberg für Entspannung, Regeneration und neue Leichtigkeit.',
            'Wellness massages at FareWell in Nuremberg for relaxation, recovery and new lightness.',
          ),
          serviceType: this.t('Wellness Massage', 'Wellness massage'),
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
            name: this.t('Massage-Angebote', 'Massage options'),
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t('Rücken-Schulter-Nacken-Massage', 'Back, shoulder and neck massage'),
                },
                priceCurrency: 'EUR',
                price: '58',
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t(
                    'Ganzkörpermassage mit Aromaölen & Klangschale',
                    'Full-body massage with aroma oils and singing bowl',
                  ),
                },
                priceCurrency: 'EUR',
                price: '78',
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t('Teilkörpermassage', 'Partial-body massage'),
                },
                priceCurrency: 'EUR',
                price: '45',
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
              name: this.t('Wellness Massage', 'Wellness massage'),
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
