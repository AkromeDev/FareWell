import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';
import { BookingCtaComponent } from "src/components/atoms/booking-cta/booking-cta";
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';

const PAGE_PATH = '/behandlungen/wellness-massage';

@Component({
  selector: 'app-wellness-massagen',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent, BookingCtaComponent],
  templateUrl: './massage.html',
  styleUrls: ['./massage.scss']
})
export class MassageComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  readonly lang = inject(LanguageService);
  private readonly jsonLdId = 'massage-schema';

  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/treatment/massage-hero.jpg';

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  p(path: string): string {
    return this.lang.localizePath(path);
  }

  get paragraphText(): string {
    return this.t(
      `
    Wellness Massagen bei FareWell sind deine Auszeit für Körper & Kopf:
    Verspannungen lösen, runterfahren und neue Leichtigkeit spüren.

    Unten findest du unsere Massage-Angebote inkl. Dauer & Preise.
  `,
      `
    Wellness massages at FareWell are your time out for body and mind:
    release tension, wind down and feel a new lightness.

    Below you will find our massage options, including duration and prices.
  `
    );
  }

  ngOnInit(): void {
    const pageTitle = this.t(
      'Wellness Massage Nürnberg | FareWell',
      'Wellness Massage Nuremberg | FareWell'
    );
    const description = this.t(
      'Entspannende Wellness Massagen bei FareWell in Nürnberg: Rücken-Schulter-Nacken-Massage, Ganzkörpermassage mit Aromaölen und Teilkörpermassage.',
      'Relaxing wellness massages at FareWell in Nuremberg: back, shoulder and neck massage, full-body massage with aroma oils, and partial-body massage. English spoken.'
    );

    this.seo.setPageSeo({
      title: pageTitle,
      description,
      path: PAGE_PATH,
      image: this.heroImageUrl,
      imageAlt: this.t(
        'FareWell Studio in Nürnberg für Wellness Massagen, Entspannung und Regeneration',
        'FareWell studio in Nuremberg for wellness massages, relaxation and recovery'
      ),
      largeImage: true,
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
            'Wellness Massagen in Nürnberg',
            'Wellness massages in Nuremberg'
          ),
          description: this.t(
            'Wellness Massagen bei FareWell in Nürnberg für Entspannung, Regeneration und neue Leichtigkeit.',
            'Wellness massages at FareWell in Nuremberg for relaxation, recovery and new lightness.'
          ),
          serviceType: this.t('Wellness Massage', 'Wellness massage'),
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
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: this.t('Massage-Angebote', 'Massage options'),
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t(
                    'Rücken-Schulter-Nacken-Massage',
                    'Back, shoulder and neck massage'
                  )
                },
                priceCurrency: 'EUR',
                price: '58'
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t(
                    'Ganzkörpermassage mit Aromaölen & Klangschale',
                    'Full-body massage with aroma oils and singing bowl'
                  )
                },
                priceCurrency: 'EUR',
                price: '78'
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t('Teilkörpermassage', 'Partial-body massage')
                },
                priceCurrency: 'EUR',
                price: '45'
              }
            ]
          }
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: pageTitle,
          description,
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
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'FareWell',
              item: isEn ? 'https://farewell.salon/en' : 'https://farewell.salon'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: this.t('Behandlungen', 'Treatments'),
              item: `https://farewell.salon${isEn ? '/en' : ''}/behandlungen`
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: this.t('Wellness Massage', 'Wellness massage'),
              item: pageUrl
            }
          ]
        }
      ]
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
