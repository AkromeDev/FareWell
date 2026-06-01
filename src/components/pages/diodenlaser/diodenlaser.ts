import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';
import { BookingCtaComponent } from 'src/components/atoms/booking-cta/booking-cta';

@Component({
  selector: 'app-diodenlaser',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent, BookingCtaComponent],
  templateUrl: './diodenlaser.html',
  styleUrls: ['./diodenlaser.scss']
})
export class Diodenlaser implements OnInit {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  private readonly pageUrl = 'https://farewell.salon/behandlungen/diodenlaser-4-wellen';
  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/treatment/laser.webp';

  paragraphText: string = `
    Der 4-Wellen-Diodenlaser ist eine moderne Methode zur dauerhaften Haarentfernung.
    Durch mehrere Wellenlängen können verschiedene Haar- und Hauttypen effektiv behandelt werden,
    komfortabel, schnell und mit planbaren Intervallen.

    Alle wichtigen Infos zur Behandlung findest du weiter unten.
  `;

  structuredData = '';

  constructor() {}

  ngOnInit(): void {
    this.setSeoTags();
    this.setStructuredData();
  }

  private setSeoTags(): void {
    const pageTitle =
      'Diodenlaser Haarentfernung Nürnberg | 4-Wellen Laser | FareWell';

    const description =
      'Moderne Diodenlaser Haarentfernung in Nürnberg bei FareWell – effektive und schonende dauerhafte Haarreduktion mit dem 4-Wellen-Diodenlaser für viele Haut- und Haartypen.';

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
      content: '4-Wellen Diodenlaser Haarentfernung bei FareWell in Nürnberg'
    });
    this.meta.updateTag({ property: 'og:locale', content: 'de_DE' });
    this.meta.updateTag({ property: 'og:site_name', content: 'FareWell' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: this.heroImageUrl });
    this.meta.updateTag({
      name: 'twitter:image:alt',
      content: '4-Wellen Diodenlaser Haarentfernung bei FareWell in Nürnberg'
    });
  }

  private setStructuredData(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${this.pageUrl}#service`,
          name: '4-Wellen Diodenlaser Haarentfernung in Nürnberg',
          description:
            'Dauerhafte Haarreduktion mit dem 4-Wellen-Diodenlaser bei FareWell in Nürnberg – effektiv, schonend und für viele Haut- und Haartypen geeignet.',
          serviceType: 'Diodenlaser Haarentfernung',
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
          }
        },
        {
          '@type': 'WebPage',
          '@id': `${this.pageUrl}#webpage`,
          url: this.pageUrl,
          name: 'Diodenlaser Haarentfernung Nürnberg | 4-Wellen Laser | FareWell',
          description:
            'Moderne Diodenlaser Haarentfernung in Nürnberg bei FareWell – effektive dauerhafte Haarreduktion mit dem 4-Wellen-Diodenlaser.',
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
            {
              '@type': 'ListItem',
              position: 1,
              name: 'FareWell',
              item: 'https://farewell.salon'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Behandlungen',
              item: 'https://farewell.salon/behandlungen'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Diodenlaser Haarentfernung',
              item: this.pageUrl
            }
          ]
        }
      ]
    };

    this.structuredData = JSON.stringify(jsonLd);
  }
}
