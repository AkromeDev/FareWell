import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';
import { BookingCtaComponent } from 'src/components/atoms/booking-cta/booking-cta';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';

const PAGE_PATH = '/behandlungen/diodenlaser-4-wellen';

@Component({
  selector: 'app-diodenlaser',
  standalone: true,
  imports: [ImageHeroComponent, ImageTextBlockComponent, BookingCtaComponent],
  templateUrl: './diodenlaser.html',
  styleUrls: ['./diodenlaser.scss']
})
export class Diodenlaser implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  readonly lang = inject(LanguageService);
  private readonly jsonLdId = 'diodenlaser-schema';

  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/treatment/laser.webp';

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  p(path: string): string {
    return this.lang.localizePath(path);
  }

  get paragraphText(): string {
    return this.t(
      `
    Der 4-Wellen-Diodenlaser ist eine moderne Methode zur dauerhaften Haarentfernung.
    Durch mehrere Wellenlängen können verschiedene Haar- und Hauttypen effektiv behandelt werden,
    komfortabel, schnell und mit planbaren Intervallen.

    Alle wichtigen Infos zur Behandlung findest du weiter unten.
  `,
      `
    The 4-wavelength diode laser is a modern method for long-lasting hair removal.
    Its multiple wavelengths treat a wide range of hair and skin types effectively,
    comfortably, quickly and with predictable intervals.

    You will find all the key information about the treatment further down.
  `
    );
  }

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: this.t(
        'Diodenlaser Haarentfernung Nürnberg | FareWell',
        'Laser Hair Removal Nuremberg (4-Wavelength Diode Laser) | FareWell'
      ),
      description: this.t(
        'Moderne Diodenlaser Haarentfernung in Nürnberg: effektive und schonende dauerhafte Haarreduktion.',
        'Modern diode laser hair removal in Nuremberg: effective, gentle, long-lasting hair reduction for larger body areas. Free consultation, English spoken.'
      ),
      path: PAGE_PATH,
      image: this.heroImageUrl,
      imageAlt: this.t(
        '4-Wellen Diodenlaser Haarentfernung bei FareWell in Nürnberg',
        '4-wavelength diode laser hair removal at FareWell in Nuremberg'
      ),
      largeImage: true
    });

    const isEn = this.lang.lang() === 'en';
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;
    const homeUrl = isEn ? 'https://farewell.salon/en' : 'https://farewell.salon';

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: this.t(
            '4-Wellen Diodenlaser Haarentfernung in Nürnberg',
            '4-wavelength diode laser hair removal in Nuremberg'
          ),
          description: this.t(
            'Dauerhafte Haarreduktion mit dem 4-Wellen-Diodenlaser bei FareWell in Nürnberg. Effektiv, schonend und für viele Haut- und Haartypen geeignet.',
            'Long-lasting hair reduction with the 4-wavelength diode laser at FareWell in Nuremberg. Effective, gentle and suitable for many skin and hair types.'
          ),
          serviceType: this.t('Diodenlaser Haarentfernung', 'Diode laser hair removal'),
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
          name: this.t(
            'Diodenlaser Haarentfernung Nürnberg | FareWell',
            'Laser Hair Removal Nuremberg (4-Wavelength Diode Laser) | FareWell'
          ),
          description: this.t(
            'Moderne Diodenlaser Haarentfernung in Nürnberg: effektive und schonende dauerhafte Haarreduktion.',
            'Modern diode laser hair removal in Nuremberg: effective, gentle, long-lasting hair reduction for larger body areas. Free consultation, English spoken.'
          ),
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
              item: homeUrl
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
              name: this.t('Diodenlaser Haarentfernung', 'Diode laser hair removal'),
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
