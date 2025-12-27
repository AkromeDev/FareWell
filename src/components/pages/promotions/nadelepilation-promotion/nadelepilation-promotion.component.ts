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
  selector: 'app-nadelepilation-promotion',
  imports: [ImageHeroComponent, TextBlockComponent],
  templateUrl: './nadelepilation-promotion.component.html',
  styleUrl: './nadelepilation-promotion.component.scss'
})
export class NadelepilationPromotionComponent implements OnInit {

  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly sanitizer = inject(DomSanitizer);

  // Route: /nadelepilation-angebot-nuernberg
  private readonly pageUrl =
    'https://farewell.salon/nadelepilation-angebot-nuernberg';
  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/farewell/farewellStudio4.png';

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
      'Nadelepilation: permanente Haarentfernung in Nürnberg | FareWell';
    const description =
      'Permanente Haarentfernung mit Nadelepilation (Elektrolyse) in Nürnberg bei FareWell. ' +
      'Jetzt 50 Prozent Rabatt auf die erste Behandlung für Neukunden sichern. ' +
      'Geeignet für nahezu alle Haar- und Hauttypen, auch für helle und sehr feine Haare.';

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
      name: 'Nadelepilation – permanente Haarentfernung in Nürnberg',
      description:
        'Permanente Haarentfernung mit Nadelepilation (Elektrolyse) bei FareWell in Nürnberg. ' +
        '50 Prozent Rabatt auf die erste Behandlung für Neukunden.',
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
