import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';
import { BookingCtaComponent } from "src/components/atoms/booking-cta/booking-cta";
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';

const PAGE_PATH = '/behandlungen/kavitation';

@Component({
  selector: 'app-kavitation',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent, BookingCtaComponent],
  templateUrl: './kavitation.html',
  styleUrls: ['./kavitation.scss']
})
export class KavitationComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  readonly lang = inject(LanguageService);
  private readonly jsonLdId = 'kavitation-schema';

  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/treatment/kavitation2.webp';

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  p(path: string): string {
    return this.lang.localizePath(path);
  }

  get paragraphText(): string {
    return this.t(
      `
    Kavitation ist eine moderne, nicht-invasive Body-Treatment Methode mit Ultraschall.
    Sie unterstützt die Kontur und kann das Hautbild glätten: sanft, komfortabel und ohne Ausfallzeit.

    Alle wichtigen Infos zur Behandlung findest du weiter unten.
  `,
      `
    Cavitation is a modern, non-invasive body treatment that works with ultrasound.
    It supports your contour and can smooth the look of your skin, gently, comfortably and with no downtime.

    You will find all the key details about the treatment further down.
  `
    );
  }

  ngOnInit(): void {
    const isEn = this.lang.lang() === 'en';
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;

    const pageTitle = this.t(
      'Kavitation Fettabbau Nürnberg | FareWell',
      'Ultrasound Cavitation & Body Forming Nuremberg | FareWell'
    );
    const pageDescription = this.t(
      'Ultraschall Kavitation in Nürnberg: nicht invasive Fettreduktion für Körperformung und Hautstraffung.',
      'Non-invasive ultrasound cavitation in Nuremberg for body contouring and skin firming. Free consultation, English spoken.'
    );

    this.seo.setPageSeo({
      title: pageTitle,
      description: pageDescription,
      path: PAGE_PATH,
      image: this.heroImageUrl,
      imageAlt: this.t(
        'FareWell Studio in Nürnberg für Kavitation und nicht-invasive Ultraschall-Behandlungen zur Kontur',
        'FareWell studio in Nuremberg for cavitation and non-invasive ultrasound contour treatments'
      ),
      largeImage: true
    });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: this.t('Kavitation in Nürnberg', 'Cavitation in Nuremberg'),
          description: this.t(
            'Nicht-invasive Ultraschall-Behandlung zur Unterstützung der Körperkontur und Verbesserung des Hautbilds bei FareWell in Nürnberg.',
            'Non-invasive ultrasound treatment to support your body contour and improve the look of your skin at FareWell in Nuremberg.'
          ),
          serviceType: this.t('Kavitation', 'Cavitation'),
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
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: pageTitle,
          description: pageDescription,
          inLanguage: isEn ? 'en' : 'de',
          isPartOf: {
            '@id': 'https://farewell.salon/#website'
          },
          about: {
            '@id': `${pageUrl}#service`
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
              item: isEn ? 'https://farewell.salon/en' : 'https://farewell.salon'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: this.t('Behandlungen', 'Treatments'),
              item: `https://farewell.salon${isEn ? '/en' : ''}/behandlungen`
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: this.t('Kavitation', 'Cavitation'),
              item: pageUrl
            }
          ]
        }
      ]
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
