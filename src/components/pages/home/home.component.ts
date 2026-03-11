import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ParallaxComponent } from 'src/components/atoms/parallax/parallax.component';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { TextBlockComponent } from 'src/components/molecules/text-block/text-block.component';
import { ButtonItem } from 'src/models/ButtonItem';
import { OpeningHoursComponent } from 'src/components/atoms/opening-hours/opening-hours.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TextBlockComponent,
    ImageHeroComponent,
    CommonModule,
    ParallaxComponent,
    OpeningHoursComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  private readonly pageUrl = 'https://farewell.salon/';
  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/farewell/studio.jpg';

  paragraphText: string = `
Der Beauty Salon FareWell ist spezialisiert auf Nadelepilation, die einzige Methode zur Haarentfernung, die von medizinischen Fachstellen als wirklich permanent anerkannt ist. Unabhängig von Haarfarbe oder Hauttyp.

Ergänzend bieten wir Laser Haarentfernung zur dauerhaften Haarreduktion, Microneedling mit Radiofrequenz zur Hautverjüngung und Narbenbehandlung sowie Körperforming mit Ultraschall und Radiofrequenz zur Straffung und Behandlung von Cellulite an.

Willkommen in deiner neuen permanenten Freiheit.
`;

  buttonList: ButtonItem[] = [
    { label: 'Mehr erfahren', link: '/behandlung', theme: 'dark' },
    { label: 'Unsere Preise', link: '/price', theme: 'dark' },
    {
      label: 'Termin buchen',
      link: 'https://salonkee.de/salon/farewell?lang=de',
      theme: 'dark',
      external: true
    }
  ];

  activeTab: string = 'home';
  structuredData = '';

  protected setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  constructor() {}

  ngOnInit(): void {
    this.setSeoTags();
    this.setStructuredData();
  }

  private setSeoTags(): void {
    const pageTitle =
      'Permanente Haarentfernung in Nürnberg | FareWell';

    const description =
      'FareWell in Nürnberg ist spezialisiert auf permanente Haarentfernung mit Elektrolyse. ' +
      'Zusätzlich bieten wir Laser Haarentfernung, Radiofrequenz-Microneedling und Körperforming in moderner Studioatmosphäre.';

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
        'FareWell Studio in Nürnberg für permanente Haarentfernung und ästhetische Behandlungen'
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
        'FareWell Studio in Nürnberg für permanente Haarentfernung und ästhetische Behandlungen'
    });
  }

  private setStructuredData(): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BeautySalon',
          '@id': 'https://farewell.salon/#organization',
          name: 'FareWell',
          url: 'https://farewell.salon',
          image: this.heroImageUrl,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Frauentorgraben 5',
            postalCode: '90443',
            addressLocality: 'Nürnberg',
            addressCountry: 'DE'
          }
        },
        {
          '@type': 'WebSite',
          '@id': 'https://farewell.salon/#website',
          url: 'https://farewell.salon',
          name: 'FareWell',
          publisher: {
            '@id': 'https://farewell.salon/#organization'
          }
        },
        {
          '@type': 'WebPage',
          '@id': `${this.pageUrl}#webpage`,
          url: this.pageUrl,
          name: 'Permanente Haarentfernung in Nürnberg | FareWell',
          description:
            'FareWell in Nürnberg ist spezialisiert auf permanente Haarentfernung mit Elektrolyse. Zusätzlich bieten wir Laser Haarentfernung, Radiofrequenz-Microneedling und Körperforming.',
          isPartOf: {
            '@id': 'https://farewell.salon/#website'
          },
          about: {
            '@id': 'https://farewell.salon/#organization'
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