import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';

@Component({
  selector: 'app-wellness-massagen',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent],
  templateUrl: './massage.html',
  styleUrls: ['./massage.scss']
})
export class MassageComponent implements OnInit {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  private readonly pageUrl = 'https://farewell.salon/massage';
  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/treatment/massage-hero.jpg';

  constructor() {}

  paragraphText: string = `
    Wellness Massagen bei FareWell sind deine Auszeit für Körper & Kopf:
    Verspannungen lösen, runterfahren und neue Leichtigkeit spüren.

    Unten findest du unsere Massage-Angebote inkl. Dauer & Preise.
  `;

  structuredData = '';

  ngOnInit(): void {
    this.setSeoTags();
    this.setStructuredData();
  }

  private setSeoTags(): void {
    const pageTitle =
      'Wellness Massagen in Nürnberg | Entspannung & Regeneration | FareWell';

    const description =
      'Wellness Massagen in Nürnberg bei FareWell: Rücken-Schulter-Nacken-Massage, Ganzkörpermassage mit Aromaölen und Klangschale sowie Teilkörpermassage. Alle Angebote mit Dauer und Preisen im Überblick.';

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
      content:
        'FareWell Studio in Nürnberg für Wellness Massagen, Entspannung und Regeneration'
    });
    this.meta.updateTag({ property: 'og:locale', content: 'de_DE' });
    this.meta.updateTag({ property: 'og:site_name', content: 'FareWell' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: this.heroImageUrl });
    this.meta.updateTag({
      name: 'twitter:image:alt',
      content:
        'FareWell Studio in Nürnberg für Wellness Massagen, Entspannung und Regeneration'
    });
  }

  private setStructuredData(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${this.pageUrl}#service`,
          name: 'Wellness Massagen in Nürnberg',
          description:
            'Wellness Massagen bei FareWell in Nürnberg für Entspannung, Regeneration und neue Leichtigkeit.',
          serviceType: 'Wellness Massage',
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
            name: 'Massage-Angebote',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Rücken-Schulter-Nacken-Massage'
                },
                priceCurrency: 'EUR',
                price: '58'
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Ganzkörpermassage mit Aromaölen & Klangschale'
                },
                priceCurrency: 'EUR',
                price: '78'
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Teilkörpermassage'
                },
                priceCurrency: 'EUR',
                price: '25'
              }
            ]
          }
        },
        {
          '@type': 'WebPage',
          '@id': `${this.pageUrl}#webpage`,
          url: this.pageUrl,
          name: 'Wellness Massagen in Nürnberg | Entspannung & Regeneration | FareWell',
          description:
            'Wellness Massagen in Nürnberg bei FareWell: Rücken-Schulter-Nacken-Massage, Ganzkörpermassage mit Aromaölen und Klangschale sowie Teilkörpermassage.',
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
        }
      ]
    };

    this.structuredData = JSON.stringify(jsonLd);
  }
}