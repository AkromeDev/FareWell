import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';
import { BookingCtaComponent } from 'src/components/atoms/booking-cta/booking-cta';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';

const PAGE_PATH = '/behandlungen/therapeutische-massage';

const TITLE_DE = 'Therapeutische Massage Nürnberg | FareWell';
const TITLE_EN = 'Therapeutic Massage Nuremberg | FareWell';
const DESCRIPTION_DE =
  'Gezielte therapeutische Massagen in Nürnberg: Ersttermin mit Anamnese, Sport- & Regenerationsmassage sowie medizinisch-funktionelle Massage bei FareWell.';
const DESCRIPTION_EN =
  'Targeted therapeutic massages in Nuremberg: initial appointment with assessment, sports and recovery massage, and medical functional massage at FareWell.';

@Component({
  selector: 'app-therapeutische-massage',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent, BookingCtaComponent],
  templateUrl: './therapeutische-massage.html',
  styleUrls: ['./therapeutische-massage.scss']
})
export class TherapeutischeMassageComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  readonly lang = inject(LanguageService);
  private readonly jsonLdId = 'therapeutische-massage-schema';

  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/massages/tm%20massaging.jpg';

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  p(path: string): string {
    return this.lang.localizePath(path);
  }

  get paragraphText(): string {
    return this.t(
      `
    Bei FareWell verbinden wir achtsame Berührung mit funktionellem Blick auf deine Beschwerden,
    Belastungen und Ziele. Jede Behandlung wird individuell angepasst,
    für mehr Beweglichkeit, Regeneration und ein besseres Körpergefühl.
  `,
      `
    At FareWell we combine mindful touch with a functional eye on your discomfort,
    strain and goals. Every treatment is tailored to you personally,
    for more mobility, recovery and a better sense of your body.
  `
    );
  }

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: this.t(TITLE_DE, TITLE_EN),
      description: this.t(DESCRIPTION_DE, DESCRIPTION_EN),
      path: PAGE_PATH,
      image: this.heroImageUrl,
      imageAlt: this.t(
        'Therapeutische Massage bei FareWell in Nürnberg',
        'Therapeutic massage at FareWell in Nuremberg'
      ),
      largeImage: true
    });

    this.setJsonLd();
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }

  private setJsonLd(): void {
    const isEn = this.lang.lang() === 'en';
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: this.t(
            'Therapeutische Massagen in Nürnberg',
            'Therapeutic massages in Nuremberg'
          ),
          description: this.t(
            'Gezielte therapeutische Massagen bei FareWell in Nürnberg für Regeneration, muskuläre Entlastung und Wohlbefinden.',
            'Targeted therapeutic massages at FareWell in Nuremberg for recovery, muscular relief and wellbeing.'
          ),
          serviceType: this.t('Therapeutische Massage', 'Therapeutic massage'),
          inLanguage: isEn ? 'en' : 'de',
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
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: this.t(
              'Therapeutische Massage-Angebote',
              'Therapeutic massage offers'
            ),
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t('Massage Beratungsgespräch', 'Massage consultation')
                },
                priceCurrency: 'EUR',
                price: '0'
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t(
                    'Ersttermin mit Anamnese & Befundaufnahme',
                    'Initial appointment with medical history and assessment'
                  )
                },
                priceCurrency: 'EUR',
                price: '99'
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t('Sport- & Regenerationsmassage', 'Sports and recovery massage')
                },
                priceCurrency: 'EUR',
                price: '50'
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t('Medizinisch-funktionelle Massage', 'Medical functional massage')
                },
                priceCurrency: 'EUR',
                price: '60'
              }
            ]
          }
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: this.t(TITLE_DE, TITLE_EN),
          description: this.t(DESCRIPTION_DE, DESCRIPTION_EN),
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
              name: this.t('Therapeutische Massage', 'Therapeutic Massage'),
              item: pageUrl
            }
          ]
        }
      ]
    });
  }
}
