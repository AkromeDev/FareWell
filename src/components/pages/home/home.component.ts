import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ParallaxComponent } from 'src/components/atoms/parallax/parallax.component';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { TextBlockComponent } from 'src/components/molecules/text-block/text-block.component';
import { ButtonItem } from 'src/models/ButtonItem';
import { OpeningHoursComponent } from 'src/components/atoms/opening-hours/opening-hours.component';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';

const PAGE_PATH = '/';

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
export class HomeComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  readonly lang = inject(LanguageService);
  private readonly jsonLdId = 'home-schema';

  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/farewell/studio.webp';

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  p(path: string): string {
    return this.lang.localizePath(path);
  }

  get paragraphText(): string {
    return this.t(
      `
Der Beauty Salon FareWell ist spezialisiert auf Nadelepilation, die einzige Methode zur Haarentfernung, die von medizinischen Fachstellen als wirklich permanent anerkannt ist. Unabhängig von Haarfarbe oder Hauttyp.

Ergänzend bieten wir Laser Haarentfernung zur dauerhaften Haarreduktion, Microneedling mit Radiofrequenz zur Hautverjüngung und Narbenbehandlung sowie Körperforming mit Ultraschall und Radiofrequenz zur Straffung und Behandlung von Cellulite an.

Willkommen in deiner neuen permanenten Freiheit.
`,
      `
The FareWell beauty salon specialises in electrolysis (Nadelepilation), the only hair removal method recognised by medical authorities as truly permanent, regardless of hair colour or skin type.

We also offer laser hair removal for long-lasting hair reduction, radiofrequency microneedling for skin rejuvenation and scar treatment, and body forming with ultrasound and radiofrequency to firm the skin and treat cellulite.

Welcome to your new permanent freedom.
`
    );
  }

  get buttonList(): ButtonItem[] {
    return [
      { label: this.t('Mehr erfahren', 'Learn more'), link: this.p('/behandlungen/nadelepilation'), theme: 'dark' },
      { label: this.t('Unsere Preise', 'Our prices'), link: this.p('/price'), theme: 'dark' },
      {
        label: this.t('Termin buchen', 'Book now'),
        link: 'https://salonkee.de/salon/farewell?lang=de',
        theme: 'dark',
        external: true,
        analyticsEvent: 'generate_lead',
        analyticsLocation: 'home-page',
        analyticsLabel: 'Termin Buchen Home Page'
      }
    ];
  }

  activeTab: string = 'home';

  protected setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  ngOnInit(): void {
    const pageTitle = this.t(
      'FareWell Nürnberg | Permanente Haarentfernung & Beauty Studio',
      'FareWell Nuremberg | Permanent Hair Removal & Beauty Studio'
    );
    const description = this.t(
      'FareWell Nürnberg: spezialisiert auf Elektrolyse (permanente Haarentfernung), Laserbehandlungen, Microneedling und weitere Beauty Behandlungen.',
      'FareWell in Nuremberg specialises in electrolysis (permanent hair removal), laser hair removal, RF microneedling and body treatments. Consultations in English, near the main station.'
    );
    const imageAlt = this.t(
      'FareWell Studio in Nürnberg für permanente Haarentfernung und ästhetische Behandlungen',
      'FareWell studio in Nuremberg for permanent hair removal and aesthetic treatments'
    );

    this.seo.setPageSeo({
      title: pageTitle,
      description: description,
      path: PAGE_PATH,
      image: this.heroImageUrl,
      imageAlt: imageAlt,
      largeImage: true
    });

    const isEn = this.lang.lang() === 'en';
    const pageUrl = isEn ? 'https://farewell.salon/en' : 'https://farewell.salon/';

    this.seo.setJsonLd(this.jsonLdId, {
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
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: pageTitle,
          description: description,
          inLanguage: isEn ? 'en' : 'de',
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
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
