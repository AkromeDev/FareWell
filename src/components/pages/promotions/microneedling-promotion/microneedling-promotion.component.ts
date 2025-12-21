import { Component, OnInit, inject } from '@angular/core';
import {
  Meta,
  Title,
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';

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
  private readonly sanitizer = inject(DomSanitizer);

  // Route: /microneedling-aktion-nuernberg
  private readonly pageUrl =
    'https://farewell.salon/microneedling-aktion-nuernberg';
  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/farewell/farewellStudio4.png';

  paragraphText: string = `
    Radiofrequenz-Microneedling für Hautstraffung und Hautverjüngung in Nürnberg bei FareWell.
    Sichern Sie sich jetzt 50% Rabatt auf Ihre erste Microneedling Behandlung
    mit dem Code ERSTEBEHANDLUNG.

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

  structuredData!: SafeHtml;

  ngOnInit(): void {
    this.setSeoTags();
    this.setStructuredData();
  }

  private setSeoTags(): void {
    const title =
      'Radiofrequenz-Microneedling: Hautstraffung und Hautverjüngung in Nürnberg | FareWell';
    const description =
      'Radiofrequenz-Microneedling in Nürnberg bei FareWell für straffere, glattere und ebenmäßigere Haut. ' +
      'Jetzt 50% Rabatt auf die erste Behandlung für Neukunden sichern. ' +
      'Ideal bei Fältchen, Narben, großen Poren und müdem Hautbild.';

    this.title.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: this.pageUrl });
    this.meta.updateTag({ property: 'og:image', content: this.heroImageUrl });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: this.heroImageUrl });

    this.meta.updateTag({ property: 'og:locale', content: 'de_DE' });
    this.meta.updateTag({ property: 'og:site_name', content: 'FareWell' });
  }

  private setStructuredData(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Offer',
      name: 'Radiofrequenz-Microneedling in Nürnberg',
      description:
        'Radiofrequenz-Microneedling bei FareWell in Nürnberg für straffere, glattere und verjüngte Haut. ' +
        '50% Rabatt auf die erste Behandlung für Neukunden.',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        priceCurrency: 'EUR',
        price: 50
      },
      category: 'Beauty',
      url: this.pageUrl,
      eligibleCustomerType: 'NewCustomer',
      offeredBy: {
        '@type': 'BeautySalon',
        name: 'FareWell',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Dr.-Kurt-Schumacher-Straße 21',
          addressLocality: 'Nürnberg',
          postalCode: '90402',
          addressCountry: 'DE'
        }
      }
    };

    this.structuredData = this.sanitizer.bypassSecurityTrustHtml(
      JSON.stringify(jsonLd)
    );
  }
}
