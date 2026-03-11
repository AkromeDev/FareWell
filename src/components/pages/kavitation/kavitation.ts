import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';

@Component({
  selector: 'app-kavitation',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent],
  templateUrl: './kavitation.html',
  styleUrls: ['./kavitation.scss']
})
export class KavitationComponent implements OnInit {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  private readonly pageUrl = 'https://farewell.salon/kavitation';
  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/treatment/kavitation2.png';

  constructor() {}

  ngOnInit(): void {
    this.setSeoTags();
    this.setStructuredData();
  }

  paragraphText: string = `
    Kavitation ist eine moderne, nicht-invasive Body-Treatment Methode mit Ultraschall.
    Sie unterstützt die Kontur und kann das Hautbild glätten – sanft, komfortabel und ohne Ausfallzeit.

    Alle wichtigen Infos zur Behandlung findest du weiter unten.
  `;

  structuredData = '';

  private setSeoTags(): void {
    const pageTitle =
      'Kavitation in Nürnberg | Ultraschall-Behandlung zur Kontur | FareWell';

    const description =
      'Kavitation in Nürnberg bei FareWell: nicht-invasive Ultraschall-Behandlung zur Unterstützung der Körperkontur und Verbesserung des Hautbilds. Alle wichtigen Infos zu Wirkung, Eignung und Sitzungen.';

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
        'FareWell Studio in Nürnberg für Kavitation und nicht-invasive Ultraschall-Behandlungen zur Kontur'
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
        'FareWell Studio in Nürnberg für Kavitation und nicht-invasive Ultraschall-Behandlungen zur Kontur'
    });
  }

  private setStructuredData(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${this.pageUrl}#service`,
          name: 'Kavitation in Nürnberg',
          description:
            'Nicht-invasive Ultraschall-Behandlung zur Unterstützung der Körperkontur und Verbesserung des Hautbilds bei FareWell in Nürnberg.',
          serviceType: 'Kavitation',
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
          name: 'Kavitation in Nürnberg | Ultraschall-Behandlung zur Kontur | FareWell',
          description:
            'Kavitation in Nürnberg bei FareWell: nicht-invasive Ultraschall-Behandlung zur Unterstützung der Körperkontur und Verbesserung des Hautbilds.',
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