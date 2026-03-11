import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { TextBlockComponent } from 'src/components/molecules/text-block/text-block.component';
import { ButtonItem } from 'src/components/molecules/button-list/button-list.component';

@Component({
  standalone: true,
  selector: 'app-laser-promotion',
  imports: [ImageHeroComponent, TextBlockComponent],
  templateUrl: './laser-promotion.component.html',
  styleUrl: './laser-promotion.component.scss'
})
export class LaserPromotionComponent implements OnInit {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  private readonly pageUrl =
    'https://farewell.salon/laser-haarentfernung-aktion-nuernberg';

  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/treatment/laser2.png';

  paragraphText: string = `
    Laser Haarentfernung mit moderner Diodenlaser-Technologie in Nürnberg bei FareWell.

    Diese Aktion gilt exklusiv für Neukundinnen und Neukunden und nur für kurze Zeit.
    Ideal, um den Start in eine glattere und pflegeleichtere Zukunft zu setzen.
  `;

  buttonList: ButtonItem[] = [
    { label: 'Unsere Preise', link: '/price', theme: 'dark' },
    {
      label: 'Termin buchen',
      link: 'https://salonkee.de/salon/farewell?lang=de',
      theme: 'dark',
      external: true
    }
  ];

  structuredData = '';

  ngOnInit(): void {
    this.setSeoTags();
    this.setStructuredData();
  }

  private setSeoTags(): void {
    const pageTitle =
      'Laser Haarentfernung in Nürnberg: 50 % Rabatt für Neukunden | FareWell';

    const description =
      'Dauerhafte Haarentfernung mit modernem 4-Wellen-Diodenlaser in Nürnberg bei FareWell. ' +
      'Jetzt 50 % Rabatt auf die erste Laser-Behandlung für Neukunden mit dem Code FIRSTLASER sichern.';

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
        'FareWell Studio in Nürnberg für moderne dauerhafte Haarentfernung mit 4-Wellen-Diodenlaser'
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
        'FareWell Studio in Nürnberg für moderne dauerhafte Haarentfernung mit 4-Wellen-Diodenlaser'
    });
  }

  private setStructuredData(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${this.pageUrl}#service`,
          name: 'Dauerhafte Haarentfernung mit 4-Wellen-Diodenlaser in Nürnberg',
          description:
            'Dauerhafte Haarentfernung mit modernem 4-Wellen-Diodenlaser bei FareWell in Nürnberg. ' +
            '50 % Rabatt auf die erste Laser-Behandlung für Neukunden mit dem Code FIRSTLASER.',
          serviceType: 'Laser Haarentfernung',
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
            name: '50 % Rabatt auf die erste Laser-Behandlung',
            description:
              'Neukundenangebot für die erste Behandlung zur dauerhaften Haarentfernung mit Diodenlaser bei FareWell in Nürnberg.',
            url: this.pageUrl,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            eligibleCustomerType: {
              '@type': 'BusinessEntityType',
              name: 'Neukunden'
            }
          }
        },
        {
          '@type': 'WebPage',
          '@id': `${this.pageUrl}#webpage`,
          url: this.pageUrl,
          name: 'Laser Haarentfernung in Nürnberg: 50 % Rabatt für Neukunden | FareWell',
          description:
            'Dauerhafte Haarentfernung mit modernem 4-Wellen-Diodenlaser in Nürnberg bei FareWell. Jetzt 50 % Rabatt auf die erste Laser-Behandlung für Neukunden mit dem Code FIRSTLASER sichern.',
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