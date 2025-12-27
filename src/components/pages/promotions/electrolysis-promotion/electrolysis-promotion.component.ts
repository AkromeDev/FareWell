import { Component, OnInit, inject } from '@angular/core';
import {
  Meta,
  Title,
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';

import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ButtonItem } from 'src/components/molecules/button-list/button-list.component';
import { TextBlockComponent } from "src/components/molecules/text-block/text-block.component";

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
  private readonly sanitizer = inject(DomSanitizer);

  // Seite und Bild als Konstanten, damit du die Url an einer Stelle ändern kannst
  private readonly pageUrl = 'https://farewell.salon/elektrolyse-permanente-haarentfernung-aktion-nuernberg';
  private readonly heroImageUrl = 'https://farewell.salon/assets/images/farewell/farewellStudio4.png';

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

  structuredData!: SafeHtml;

  ngOnInit(): void {
    this.setSeoTags();
    this.setStructuredData();
  }

  private setSeoTags(): void {
    const title = 'Elektrolyse: permanente Haarentfernung in Nürnberg | FareWell';
    const description =
      'Permanente Haarentfernung mit Elektrolyse in Nürnberg bei FareWell. ' +
      'Jetzt 50% Rabatt auf die erste Behandlung für Neukunden sichern. ' +
      'Professionelle, sichere und präzise Haarentfernung, auch bei hellen und feinen Haaren.';

    // HTML Titel
    this.title.setTitle(title);

    // Basis Meta Tags
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    // Open Graph Tags
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: this.pageUrl });
    this.meta.updateTag({ property: 'og:image', content: this.heroImageUrl });

    // Twitter Cards
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
      name: 'Elektrolyse – permanente Haarentfernung in Nürnberg',
      description:
        'Permanente Haarentfernung mit Elektrolyse bei FareWell in Nürnberg. ' +
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
