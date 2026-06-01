import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';
import { BookingCtaComponent } from 'src/components/atoms/booking-cta/booking-cta';

@Component({
  selector: 'app-therapeutische-massage',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent, BookingCtaComponent],
  templateUrl: './therapeutische-massage.html',
  styleUrls: ['./therapeutische-massage.scss']
})
export class TherapeutischeMassageComponent implements OnInit {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  private readonly pageUrl = 'https://farewell.salon/behandlungen/therapeutische-massage';
  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/massages/tm%20massaging.jpg';

  paragraphText: string = `
    Bei FareWell verbinden wir achtsame Berührung mit funktionellem Blick auf deine Beschwerden,
    Belastungen und Ziele. Jede Behandlung wird individuell angepasst,
    für mehr Beweglichkeit, Regeneration und ein besseres Körpergefühl.
  `;

  structuredData = '';

  ngOnInit(): void {
    this.setSeoTags();
    this.setStructuredData();
  }

  private setSeoTags(): void {
    const pageTitle = 'Therapeutische Massage Nürnberg | FareWell';

    const description =
      'Gezielte therapeutische Massagen in Nürnberg: Ersttermin mit Anamnese, Sport- & Regenerationsmassage sowie medizinisch-funktionelle Massage bei FareWell.';

    this.title.setTitle(pageTitle);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });

    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: this.pageUrl });
    this.meta.updateTag({ property: 'og:image', content: this.heroImageUrl });
    this.meta.updateTag({
      property: 'og:image:alt',
      content: 'Therapeutische Massage bei FareWell in Nürnberg'
    });
    this.meta.updateTag({ property: 'og:locale', content: 'de_DE' });
    this.meta.updateTag({ property: 'og:site_name', content: 'FareWell' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: this.heroImageUrl });
    this.meta.updateTag({
      name: 'twitter:image:alt',
      content: 'Therapeutische Massage bei FareWell in Nürnberg'
    });
  }

  private setStructuredData(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${this.pageUrl}#service`,
          name: 'Therapeutische Massagen in Nürnberg',
          description:
            'Gezielte therapeutische Massagen bei FareWell in Nürnberg für Regeneration, muskuläre Entlastung und Wohlbefinden.',
          serviceType: 'Therapeutische Massage',
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
            name: 'Therapeutische Massage-Angebote',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Massage Beratungsgespräch'
                },
                priceCurrency: 'EUR',
                price: '0'
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Ersttermin mit Anamnese & Befundaufnahme'
                },
                priceCurrency: 'EUR',
                price: '99'
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Sport- & Regenerationsmassage'
                },
                priceCurrency: 'EUR',
                price: '50'
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Medizinisch-funktionelle Massage'
                },
                priceCurrency: 'EUR',
                price: '60'
              }
            ]
          }
        },
        {
          '@type': 'WebPage',
          '@id': `${this.pageUrl}#webpage`,
          url: this.pageUrl,
          name: 'Therapeutische Massage Nürnberg | FareWell',
          description:
            'Gezielte therapeutische Massagen in Nürnberg: Ersttermin mit Anamnese, Sport- & Regenerationsmassage sowie medizinisch-funktionelle Massage bei FareWell.',
          isPartOf: {
            '@id': 'https://farewell.salon/#website'
          },
          about: {
            '@id': `${this.pageUrl}#service`
          },
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: this.heroImageUrl
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: 'https://farewell.salon' },
            { '@type': 'ListItem', position: 2, name: 'Behandlungen', item: 'https://farewell.salon/behandlungen' },
            { '@type': 'ListItem', position: 3, name: 'Therapeutische Massage', item: this.pageUrl }
          ]
        }
      ]
    };

    this.structuredData = JSON.stringify(jsonLd);
  }
}
