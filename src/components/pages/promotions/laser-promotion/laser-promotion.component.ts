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
  selector: 'app-laser-promotion',
  imports: [ImageHeroComponent, TextBlockComponent],
  templateUrl: './laser-promotion.component.html',
  styleUrl: './laser-promotion.component.scss'
})
export class LaserPromotionComponent implements OnInit {

  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly sanitizer = inject(DomSanitizer);

  // Seite und Bild als Konstanten, passend zur Route
  // Route: /laser-haarentfernung-aktion-nuernberg
  private readonly pageUrl =
    'https://farewell.salon/laser-haarentfernung-aktion-nuernberg';
  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/farewell/farewellStudio4.png';

  paragraphText: string = `
    Dauerhafte Haarentfernung mit moderner Diodenlaser-Technologie in Nürnberg bei FareWell.
    Sichern Sie sich jetzt 50% Rabatt auf Ihre erste Laser-Behandlung
    mit dem Code FIRSTLASER.

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

  structuredData!: SafeHtml;

  ngOnInit(): void {
    this.setSeoTags();
    this.setStructuredData();
  }

  private setSeoTags(): void {
    const title =
      'Diodenlaser: dauerhafte Haarentfernung in Nürnberg | FareWell';
    const description =
      'Dauerhafte Haarentfernung mit modernem 4-Wellen-Diodenlaser in Nürnberg bei FareWell. ' +
      'Jetzt 50% Rabatt auf die erste Laser-Behandlung für Neukunden sichern. ' +
      'Sanfte, effiziente Reduktion von unerwünschtem Haarwuchs für glattere, pflegeleichtere Haut.';

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

    // Zusatzinfos
    this.meta.updateTag({ property: 'og:locale', content: 'de_DE' });
    this.meta.updateTag({ property: 'og:site_name', content: 'FareWell' });
  }

  private setStructuredData(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Offer',
      name: 'Diodenlaser – dauerhafte Haarentfernung in Nürnberg',
      description:
        'Dauerhafte Haarentfernung mit modernem 4-Wellen-Diodenlaser bei FareWell in Nürnberg. ' +
        '50% Rabatt auf die erste Laser-Behandlung für Neukunden.',
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
