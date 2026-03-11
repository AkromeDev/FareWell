import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';

@Component({
  selector: 'app-microneedling',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent],
  templateUrl: './microneedling.html',
  styleUrl: './microneedling.scss'
})
export class MicroneedlingComponent implements OnInit {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  private readonly pageUrl = 'https://farewell.salon/microneedling';
  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/treatment/microneedling2.png';

  constructor() {}

  paragraphText: string = `
    Microneedling mit Radiofrequenz kombiniert feine Mikro-Nadeln mit gezielter Wärme in der Tiefe.
    Das Ergebnis: straffere Haut, ein verfeinertes Hautbild und ein frischer Glow – ganz ohne OP.

    Alle wichtigen Infos zur Behandlung findest du weiter unten.
  `;

  structuredData = '';

  ngOnInit(): void {
    this.setSeoTags();
    this.setStructuredData();
  }

  private setSeoTags(): void {
    const pageTitle =
      'Microneedling in Nürnberg | Radiofrequenz für Straffung & Hautbild | FareWell';

    const description =
      'Microneedling mit Radiofrequenz in Nürnberg bei FareWell: Behandlung für Hautstraffung, verfeinertes Hautbild, Poren, Aknenarben und mehr Spannkraft. Alle Infos zu Wirkung, Ausfallzeit und Sitzungen.';

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
        'FareWell Studio in Nürnberg für Microneedling mit Radiofrequenz zur Hautstraffung und Hautbildverbesserung'
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
        'FareWell Studio in Nürnberg für Microneedling mit Radiofrequenz zur Hautstraffung und Hautbildverbesserung'
    });
  }

  private setStructuredData(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${this.pageUrl}#service`,
          name: 'Microneedling mit Radiofrequenz in Nürnberg',
          description:
            'RF-Microneedling bei FareWell in Nürnberg zur Hautstraffung, Hautbildverbesserung sowie zur Unterstützung bei Poren, Aknenarben und unruhiger Hautstruktur.',
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
          }
        },
        {
          '@type': 'WebPage',
          '@id': `${this.pageUrl}#webpage`,
          url: this.pageUrl,
          name: 'Microneedling in Nürnberg | Radiofrequenz für Straffung & Hautbild | FareWell',
          description:
            'Microneedling mit Radiofrequenz in Nürnberg bei FareWell: Behandlung für Hautstraffung, verfeinertes Hautbild, Poren, Aknenarben und mehr Spannkraft.',
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