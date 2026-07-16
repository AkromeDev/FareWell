import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';
import { LanguageService } from 'src/services/language.service';

@Component({
  selector: 'app-nadelepilation',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent],
  templateUrl: './nadelepilation.component.html',
  styleUrl: './nadelepilation.component.scss'
})
export class NadelepilationComponent implements OnInit {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  readonly lang = inject(LanguageService);

  private readonly pageUrl = 'https://farewell.salon/behandlungen/nadelepilation';
  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/treatment/nadel.jpg';

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  get paragraphText(): string {
    return this.t(
      `
    Die Elektrolyse (Nadelepilation) ist eine medizinisch anerkannte Methode zur permanenten Haarentfernung.
    Sie ist für alle Hauttypen und Haarfarben geeignet und bietet eine sichere, effektive Lösung für unerwünschte Haare.

    Alle wichtigen Infos zur Elektrolyse findest du weiter unten.
  `,
      `
    Electrolysis is a medically recognised method for permanent hair removal.
    It works for every skin type and hair colour, and gives you a safe, effective solution for unwanted hair.

    Everything you need to know about electrolysis is waiting for you further down.
  `
    );
  }

  structuredData = '';

  constructor() {}

  ngOnInit(): void {
    this.setSeoTags();
    this.setStructuredData();
  }

  private setSeoTags(): void {
    const pageTitle =
      'Elektrolyse / Nadelepilation Nürnberg | Permanente Haarentfernung | FareWell';

    const description =
      'Professionelle Elektrolyse (Nadelepilation) in Nürnberg bei FareWell – die einzige wissenschaftlich anerkannte Methode zur dauerhaft permanenten Haarentfernung für alle Haut- und Haartypen.';

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
      content: 'Elektrolyse / Nadelepilation bei FareWell in Nürnberg – permanente Haarentfernung'
    });
    this.meta.updateTag({ property: 'og:locale', content: 'de_DE' });
    this.meta.updateTag({ property: 'og:site_name', content: 'FareWell' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: this.heroImageUrl });
    this.meta.updateTag({
      name: 'twitter:image:alt',
      content: 'Elektrolyse / Nadelepilation bei FareWell in Nürnberg – permanente Haarentfernung'
    });
  }

  private setStructuredData(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${this.pageUrl}#service`,
          name: 'Elektrolyse / Nadelepilation in Nürnberg',
          description:
            'Permanente Haarentfernung mit Elektrolyse (Nadelepilation) bei FareWell in Nürnberg – wirksam für alle Haut- und Haartypen.',
          serviceType: 'Elektrolyse / Nadelepilation',
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
          name: 'Elektrolyse / Nadelepilation Nürnberg | Permanente Haarentfernung | FareWell',
          description:
            'Professionelle Elektrolyse (Nadelepilation) in Nürnberg bei FareWell – permanente Haarentfernung für alle Haut- und Haartypen.',
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
            {
              '@type': 'ListItem',
              position: 1,
              name: 'FareWell',
              item: 'https://farewell.salon'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Behandlungen',
              item: 'https://farewell.salon/behandlungen'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Nadelepilation',
              item: this.pageUrl
            }
          ]
        }
      ]
    };

    this.structuredData = JSON.stringify(jsonLd);
  }
}
