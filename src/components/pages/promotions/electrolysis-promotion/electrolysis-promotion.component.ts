import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ButtonItem } from 'src/components/molecules/button-list/button-list.component';
import { TextBlockComponent } from 'src/components/molecules/text-block/text-block.component';

@Component({
  standalone: true,
  selector: 'app-electrolysis-promotion',
  imports: [ImageHeroComponent, TextBlockComponent],
  templateUrl: './electrolysis-promotion.component.html',
  styleUrl: './electrolysis-promotion.component.scss'
})
export class ElectrolysisPromotionComponent implements OnInit {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  private readonly pageUrl =
    'https://www.farewell.salon/elektrolyse-permanente-haarentfernung-aktion-nuernberg';
  private readonly heroImageUrl =
    'https://www.farewell.salon/assets/images/treatment/nadel.jpg';

  paragraphText: string = `
    Permanente Haarentfernung mit Elektrolyse in Nürnberg bei FareWell.

    Diese Aktion gilt exklusiv für Neukundinnen und Neukunden und nur für kurze Zeit.
    Perfekt, um den Start in eine glattere und pflegeleichtere Zukunft zu setzen.
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
      'Elektrolyse Nürnberg – permanente Haarentfernung | FareWell';
    const description =
      'Permanente Haarentfernung mit Elektrolyse in Nürnberg bei FareWell. ' +
      'Die einzige medizinisch anerkannte Methode zur endgültigen Haarentfernung. ' +
      'Jetzt 50 % Rabatt auf die erste Behandlung für Neukunden.';

    this.title.setTitle(pageTitle);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: this.pageUrl });
    this.meta.updateTag({ property: 'og:image', content: this.heroImageUrl });
    this.meta.updateTag({ property: 'og:locale', content: 'de_DE' });
    this.meta.updateTag({ property: 'og:site_name', content: 'FareWell' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: this.heroImageUrl });
  }

  private setStructuredData(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Elektrolyse – permanente Haarentfernung',
      description:
        'Permanente Haarentfernung mit Elektrolyse bei FareWell in Nürnberg. ' +
        'Die einzige wirklich permanente Methode zur Haarentfernung.',
      serviceType: 'Elektrolyse Haarentfernung',
      url: this.pageUrl,
      image: this.heroImageUrl,
      areaServed: {
        '@type': 'City',
        name: 'Nürnberg'
      },
      provider: {
        '@type': 'BeautySalon',
        '@id': 'https://www.farewell.salon/#business',
        name: 'FareWell',
        url: 'https://www.farewell.salon',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Frauentorgraben 5',
          addressLocality: 'Nürnberg',
          postalCode: '90443',
          addressCountry: 'DE'
        }
      },
      offers: {
        '@type': 'Offer',
        description:
          '50 % Rabatt auf die erste Elektrolyse Behandlung für Neukundinnen und Neukunden',
        priceCurrency: 'EUR',
        url: this.pageUrl
      }
    };

    this.structuredData = JSON.stringify(jsonLd);
  }
}