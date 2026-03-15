import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { TextBlockComponent } from 'src/components/molecules/text-block/text-block.component';
import { ButtonItem } from 'src/models/ButtonItem';

@Component({
  standalone: true,
  selector: 'app-nadelepilation-promotion',
  imports: [ImageHeroComponent, TextBlockComponent],
  templateUrl: './nadelepilation-promotion.component.html',
  styleUrl: './nadelepilation-promotion.component.scss'
})
export class NadelepilationPromotionComponent implements OnInit {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  private readonly pageUrl =
    'https://farewell.salon/nadelepilation-angebot-nuernberg';

  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/treatment/nadel.jpg';

  paragraphText: string = `
    Permanente Haarentfernung mit Nadelepilation (Elektrolyse) in Nürnberg bei FareWell.

    Diese Aktion gilt exklusiv für Neukundinnen und Neukunden und nur für kurze Zeit.
    Eine ideale Gelegenheit, um den Weg zu dauerhaft glatter und pflegeleichter Haut zu beginnen.
  `;

  buttonList: ButtonItem[] = [
    { label: 'Unsere Preise', link: '/price', theme: 'dark' },
    {
      label: 'Termin buchen',
      link: 'https://salonkee.de/salon/farewell?lang=de',
      theme: 'dark',
      external: true,
      analyticsEvent: 'generate_lead',
      analyticsLocation: 'nadelepilation-page',
      analyticsLabel: 'Termin Buchen Nadelepilation Page'
  }
  ];

  structuredData = '';

  ngOnInit(): void {
    this.setSeoTags();
    this.setStructuredData();
  }

  private setSeoTags(): void {
    const pageTitle =
      'Nadelepilation in Nürnberg: 50 % Rabatt für Neukunden | FareWell';

    const description =
      'Permanente Haarentfernung mit Nadelepilation (Elektrolyse) in Nürnberg bei FareWell. ' +
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
        'FareWell Studio in Nürnberg für permanente Haarentfernung mit Nadelepilation (Elektrolyse)'
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
        'FareWell Studio in Nürnberg für permanente Haarentfernung mit Nadelepilation (Elektrolyse)'
    });
  }

  private setStructuredData(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${this.pageUrl}#service`,
          name: 'Nadelepilation: permanente Haarentfernung in Nürnberg',
          description:
            'Permanente Haarentfernung mit Nadelepilation (Elektrolyse) bei FareWell in Nürnberg. ' +
            '50 % Rabatt auf die erste Behandlung für Neukunden mit dem Code ERSTEBEHANDLUNG.',
          serviceType: 'Nadelepilation',
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
            name: '50 % Rabatt auf die erste Nadelepilation Behandlung',
            description:
              'Neukundenangebot für die erste Nadelepilation Behandlung bei FareWell in Nürnberg.',
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
          name: 'Nadelepilation in Nürnberg: 50 % Rabatt für Neukunden | FareWell',
          description:
            'Permanente Haarentfernung mit Nadelepilation (Elektrolyse) in Nürnberg bei FareWell. Jetzt 50 % Rabatt auf die erste Behandlung für Neukunden mit dem Code ERSTEBEHANDLUNG sichern.',
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