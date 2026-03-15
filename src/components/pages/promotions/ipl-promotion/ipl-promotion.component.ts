import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { TextBlockComponent } from 'src/components/molecules/text-block/text-block.component';
import { ButtonItem } from 'src/models/ButtonItem';

@Component({
  standalone: true,
  selector: 'app-ipl-promotion',
  imports: [ImageHeroComponent, TextBlockComponent],
  templateUrl: './ipl-promotion.component.html',
  styleUrl: './ipl-promotion.component.scss'
})
export class IplPromotionComponent implements OnInit {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  private readonly pageUrl =
    'https://www.farewell.salon/ipl-dauerhafte-haarentfernung-aktion-nuernberg';
  private readonly heroImageUrl =
    'https://www.farewell.salon/assets/images/treatment/laser2.png';

  paragraphText: string = `
Sie suchen nach IPL zur dauerhaften Haarentfernung in Nürnberg?

Bei FareWell arbeiten wir mit moderner 4-Wellen-Diodenlaser-Technologie – einer präzisen, leistungsstarken und hautschonenden Alternative zu klassischen IPL-Systemen.

Exklusiv für Neukundinnen und Neukunden:
50 % Rabatt auf die erste Behandlung mit dem Code ERSTEBEHANDLUNG.
`;

  buttonList: ButtonItem[] = [
    { label: 'Unsere Preise', link: '/price', theme: 'dark' },
    {
      label: 'Termin buchen',
      link: 'https://salonkee.de/salon/farewell?lang=de',
      theme: 'dark',
      external: true,
      analyticsEvent: 'generate_lead',
      analyticsLocation: 'ipl-page',
      analyticsLabel: 'Termin Buchen IPL Page'
  }
  ];

  structuredData = '';

  ngOnInit(): void {
    this.setSeoTags();
    this.setStructuredData();
  }

  private setSeoTags(): void {
    const pageTitle =
      'IPL Alternative in Nürnberg: 4-Wellen-Diodenlaser | FareWell';
    const description =
      'Sie suchen nach IPL in Nürnberg? Bei FareWell erhalten Sie eine moderne Alternative: dauerhafte Haarreduktion mit 4-Wellen-Diodenlaser. Jetzt 50 % Rabatt auf die erste Behandlung für Neukunden.';

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
      name: 'Dauerhafte Haarreduktion mit 4-Wellen-Diodenlaser',
      description:
        'Moderne Alternative zu IPL in Nürnberg: dauerhafte Haarreduktion mit 4-Wellen-Diodenlaser bei FareWell. 50 % Rabatt auf die erste Behandlung für Neukundinnen und Neukunden.',
      serviceType: 'Laser Haarentfernung',
      url: this.pageUrl,
      image: this.heroImageUrl,
      areaServed: {
        '@type': 'City',
        name: 'Nürnberg'
      },
      provider: {
        '@type': 'BeautySalon',
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
        priceCurrency: 'EUR',
        description: '50 % Rabatt auf die erste Behandlung für Neukundinnen und Neukunden',
        url: this.pageUrl
      }
    };

    this.structuredData = JSON.stringify(jsonLd);
  }
}