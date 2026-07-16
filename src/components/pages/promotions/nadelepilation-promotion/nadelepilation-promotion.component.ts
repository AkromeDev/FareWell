import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { TextBlockComponent } from 'src/components/molecules/text-block/text-block.component';
import { ButtonItem } from 'src/models/ButtonItem';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';

const PAGE_PATH = '/nadelepilation-angebot-nuernberg';

@Component({
  standalone: true,
  selector: 'app-nadelepilation-promotion',
  imports: [ImageHeroComponent, TextBlockComponent],
  templateUrl: './nadelepilation-promotion.component.html',
  styleUrl: './nadelepilation-promotion.component.scss'
})
export class NadelepilationPromotionComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  readonly lang = inject(LanguageService);

  private readonly jsonLdId = 'nadelepilation-promo-schema';

  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/treatment/nadel.jpg';

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  p(path: string): string {
    return this.lang.localizePath(path);
  }

  get paragraphText(): string {
    return this.t(
      `
    Permanente Haarentfernung mit Nadelepilation (Elektrolyse) in Nürnberg bei FareWell.

    Diese Aktion gilt exklusiv für Neukundinnen und Neukunden und nur für kurze Zeit.
    Eine ideale Gelegenheit, um den Weg zu dauerhaft glatter und pflegeleichter Haut zu beginnen.
  `,
      `
    Permanent hair removal with electrolysis (Nadelepilation) in Nuremberg at FareWell.

    This offer is exclusively for new clients and available for a short time only.
    An ideal opportunity to begin your journey to lastingly smooth, low-maintenance skin.
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
        analyticsLocation: 'nadelepilation-page',
        analyticsLabel: 'Termin Buchen Nadelepilation Page'
      }
    ];
  }

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: this.t(
        'Nadelepilation Angebot Nürnberg | FareWell',
        'Electrolysis (Nadelepilation) Offer Nuremberg | FareWell'
      ),
      description: this.t(
        'Sonderangebot für Nadelepilation / Elektrolyse in Nürnberg.',
        'Special offer for electrolysis (Nadelepilation) in Nuremberg: 50% off your first treatment for new clients.'
      ),
      path: PAGE_PATH,
      image: this.heroImageUrl,
      imageAlt: this.t(
        'FareWell Studio in Nürnberg für permanente Haarentfernung mit Nadelepilation (Elektrolyse)',
        'FareWell studio in Nuremberg for permanent hair removal with electrolysis (Nadelepilation)'
      ),
      largeImage: true
    });

    const isEn = this.lang.lang() === 'en';
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: this.t(
            'Nadelepilation: permanente Haarentfernung in Nürnberg',
            'Electrolysis (Nadelepilation): permanent hair removal in Nuremberg'
          ),
          description: this.t(
            'Permanente Haarentfernung mit Nadelepilation (Elektrolyse) bei FareWell in Nürnberg. ' +
              '50 % Rabatt auf die erste Behandlung für Neukunden mit dem Code ERSTEBEHANDLUNG.',
            'Permanent hair removal with electrolysis (Nadelepilation) at FareWell in Nuremberg. ' +
              '50% off your first treatment for new clients with the code ERSTEBEHANDLUNG.'
          ),
          serviceType: this.t('Nadelepilation', 'Electrolysis (Nadelepilation)'),
          inLanguage: isEn ? 'en' : 'de',
          areaServed: {
            '@type': 'City',
            name: this.t('Nürnberg', 'Nuremberg')
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
              '50 % Rabatt auf die erste Nadelepilationsbehandlung',
              '50% off your first electrolysis treatment'
            ),
            description: this.t(
              'Neukundenangebot für die erste Nadelepilationsbehandlung bei FareWell in Nürnberg.',
              'New client offer for your first electrolysis treatment at FareWell in Nuremberg.'
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
          name: this.t(
            'Nadelepilation in Nürnberg: 50 % Rabatt für Neukunden | FareWell',
            'Electrolysis (Nadelepilation) in Nuremberg: 50% off for new clients | FareWell'
          ),
          description: this.t(
            'Permanente Haarentfernung mit Nadelepilation (Elektrolyse) in Nürnberg bei FareWell. Jetzt 50 % Rabatt auf die erste Behandlung für Neukunden mit dem Code ERSTEBEHANDLUNG sichern.',
            'Permanent hair removal with electrolysis (Nadelepilation) in Nuremberg at FareWell. Get 50% off your first treatment for new clients with the code ERSTEBEHANDLUNG.'
          ),
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

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
