import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { TextBlockComponent } from 'src/components/molecules/text-block/text-block.component';
import { ButtonItem } from 'src/components/molecules/button-list/button-list.component';

@Component({
  standalone: true,
  selector: 'app-microneedling-promotion',
  imports: [ImageHeroComponent, TextBlockComponent],
  templateUrl: './microneedling-promotion.component.html',
  styleUrl: './microneedling-promotion.component.scss'
})
export class MicroneedlingPromotionComponent implements OnInit {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  private readonly pageUrl =
    'https://farewell.salon/microneedling-aktion-nuernberg';

  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/treatment/microneedling.jpg';

  paragraphText: string = `
    Radiofrequenz-Microneedling für Hautstraffung und Hautverjüngung in Nürnberg bei FareWell.

    Diese Aktion gilt exklusiv für Neukundinnen und Neukunden und nur für kurze Zeit.
    Ideal, um den Start in eine strahlendere, glattere und sichtbar verjüngte Haut zu setzen.
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
      'Microneedling in Nürnberg: 50 % Rabatt für Neukunden | FareWell';

    const description =
      'Radiofrequenz-Microneedling in Nürnberg bei FareWell für straffere, glattere und ebenmäßigere Haut. ' +
      'Jetzt 50 % Rabatt auf die erste Behandlung für Neukunden mit dem Code ERSTEBEHANDLUNG sichern.';

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
        'FareWell Studio in Nürnberg für professionelle Radiofrequenz-Microneedling Behandlungen zur Hautstraffung und Hautverjüngung'
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
        'FareWell Studio in Nürnberg für professionelle Radiofrequenz-Microneedling Behandlungen zur Hautstraffung und Hautverjüngung'
    });
  }

  private setStructuredData(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${this.pageUrl}#service`,
          name: 'Radiofrequenz-Microneedling für strahlende Haut in Nürnberg',
          description:
            'Radiofrequenz-Microneedling bei FareWell in Nürnberg für straffere, glattere und verjüngte Haut. ' +
            '50 % Rabatt auf die erste Behandlung für Neukunden mit dem Code ERSTEBEHANDLUNG.',
          serviceType: 'Radiofrequenz-Microneedling',
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
            name: '50 % Rabatt auf die erste Radiofrequenz-Microneedling Behandlung',
            description:
              'Neukundenangebot für die erste Radiofrequenz-Microneedling Behandlung bei FareWell in Nürnberg.',
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
          name: 'Microneedling in Nürnberg: 50 % Rabatt für Neukunden | FareWell',
          description:
            'Radiofrequenz-Microneedling in Nürnberg bei FareWell für straffere, glattere und ebenmäßigere Haut. Jetzt 50 % Rabatt auf die erste Behandlung für Neukunden mit dem Code ERSTEBEHANDLUNG sichern.',
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