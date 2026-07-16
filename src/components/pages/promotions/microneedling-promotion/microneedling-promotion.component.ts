import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { TextBlockComponent } from 'src/components/molecules/text-block/text-block.component';
import { ButtonItem } from 'src/models/ButtonItem';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';

const PAGE_PATH = '/microneedling-aktion-nuernberg';
const DE_TITLE = 'Microneedling Aktion Nürnberg | FareWell';
const DE_DESCRIPTION =
  'Microneedling Sonderangebot in Nürnberg: Hautverjüngung und Hautverbesserung.';
const EN_TITLE = 'RF Microneedling Offer Nuremberg | FareWell';
const EN_DESCRIPTION =
  'RF microneedling special offer in Nuremberg: skin rejuvenation and a better complexion. 50% off your first treatment.';

@Component({
  standalone: true,
  selector: 'app-microneedling-promotion',
  imports: [ImageHeroComponent, TextBlockComponent],
  templateUrl: './microneedling-promotion.component.html',
  styleUrl: './microneedling-promotion.component.scss'
})
export class MicroneedlingPromotionComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  readonly lang = inject(LanguageService);
  private readonly jsonLdId = 'microneedling-promo-schema';

  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/treatment/microneedling.webp';

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  p(path: string): string {
    return this.lang.localizePath(path);
  }

  get paragraphText(): string {
    return this.t(
      `
    Radiofrequenz-Microneedling für Hautstraffung und Hautverjüngung in Nürnberg bei FareWell.

    Diese Aktion gilt exklusiv für Neukundinnen und Neukunden und nur für kurze Zeit.
    Ideal, um den Start in eine strahlendere, glattere und sichtbar verjüngte Haut zu setzen.
  `,
      `
    Radiofrequency microneedling for skin firming and skin rejuvenation in Nuremberg at FareWell.

    This offer is exclusively for new clients and only for a short time.
    Perfect for starting your journey to more radiant, smoother and visibly rejuvenated skin.
  `
    );
  }

  get buttonList(): ButtonItem[] {
    return [
      { label: this.t('Unsere Preise', 'Our prices'), link: this.p('/price'), theme: 'dark' },
      {
        label: this.t('Termin buchen', 'Book now'),
        link: 'https://salonkee.de/salon/farewell?lang=de',
        theme: 'dark',
        external: true,
        analyticsEvent: 'generate_lead',
        analyticsLocation: 'microneedling-page',
        analyticsLabel: 'Termin Buchen Microneedling Page'
      }
    ];
  }

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: this.t(DE_TITLE, EN_TITLE),
      description: this.t(DE_DESCRIPTION, EN_DESCRIPTION),
      path: PAGE_PATH,
      image: this.heroImageUrl,
      imageAlt: this.t(
        'FareWell Studio in Nürnberg für professionelle Radiofrequenz-Microneedling Behandlungen zur Hautstraffung und Hautverjüngung',
        'FareWell studio in Nuremberg for professional radiofrequency microneedling treatments for skin firming and rejuvenation'
      ),
      largeImage: true
    });

    this.setStructuredData();
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }

  private setStructuredData(): void {
    const isEn = this.lang.lang() === 'en';
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: this.t(
            'Radiofrequenz-Microneedling für strahlende Haut in Nürnberg',
            'Radiofrequency microneedling for radiant skin in Nuremberg'
          ),
          description: this.t(
            'Radiofrequenz-Microneedling bei FareWell in Nürnberg für straffere, glattere und verjüngte Haut. ' +
              '50 % Rabatt auf die erste Behandlung für Neukunden mit dem Code ERSTEBEHANDLUNG.',
            'Radiofrequency microneedling at FareWell in Nuremberg for firmer, smoother and rejuvenated skin. ' +
              '50% off your first treatment for new clients with the code ERSTEBEHANDLUNG.'
          ),
          serviceType: this.t('Radiofrequenz-Microneedling', 'Radiofrequency microneedling'),
          areaServed: {
            '@type': 'City',
            name: 'Nürnberg'
          },
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
              addressCountry: 'DE'
            }
          },
          offers: {
            '@type': 'Offer',
            name: this.t(
              '50 % Rabatt auf die erste Radiofrequenz-Microneedling Behandlung',
              '50% off your first radiofrequency microneedling treatment'
            ),
            description: this.t(
              'Neukundenangebot für die erste Radiofrequenz-Microneedling Behandlung bei FareWell in Nürnberg.',
              'New client offer for the first radiofrequency microneedling treatment at FareWell in Nuremberg.'
            ),
            url: pageUrl,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            eligibleCustomerType: {
              '@type': 'BusinessEntityType',
              name: this.t('Neukunden', 'New clients')
            }
          }
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: this.t(DE_TITLE, EN_TITLE),
          description: this.t(DE_DESCRIPTION, EN_DESCRIPTION),
          inLanguage: isEn ? 'en' : 'de',
          isPartOf: {
            '@id': 'https://farewell.salon/#website'
          },
          about: {
            '@id': `${pageUrl}#service`
          },
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: this.heroImageUrl
          }
        }
      ]
    });
  }
}
