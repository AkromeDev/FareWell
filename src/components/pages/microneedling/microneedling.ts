import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';
import { LanguageService } from 'src/services/language.service';

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
  readonly lang = inject(LanguageService);

  private readonly pageUrl = 'https://farewell.salon/behandlungen/microneedling-radiofrequenz';
  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/treatment/microneedling2.webp';

  constructor() {}

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  get paragraphText(): string {
    return this.t(
      `
    Microneedling mit Radiofrequenz kombiniert feine Mikro-Nadeln mit gezielter Wärme in der Tiefe.
    Das Ergebnis: straffere Haut, ein verfeinertes Hautbild und ein frischer Glow – ganz ohne OP.

    Alle wichtigen Infos zur Behandlung findest du weiter unten.
  `,
      `
    Radiofrequency microneedling combines fine micro-needles with targeted warmth deep in the skin.
    The result: firmer skin, a refined complexion and a fresh glow, all without surgery.

    You will find all the key details about the treatment further down.
  `
    );
  }

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
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: 'https://farewell.salon' },
            { '@type': 'ListItem', position: 2, name: 'Behandlungen', item: 'https://farewell.salon/behandlungen' },
            { '@type': 'ListItem', position: 3, name: 'Microneedling Radiofrequenz', item: this.pageUrl }
          ]
        }
      ]
    };

    this.structuredData = JSON.stringify(jsonLd);
  }
}