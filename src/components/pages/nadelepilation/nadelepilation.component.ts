import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';

const PAGE_PATH = '/behandlungen/nadelepilation';
const HERO_IMAGE_URL = 'https://farewell.salon/assets/images/treatment/nadel.jpg';

const DE_TITLE = 'Elektrolyse / Nadelepilation in Nürnberg | FareWell';
const EN_TITLE = 'Electrolysis (Nadelepilation) in Nuremberg | FareWell';
const DE_DESCRIPTION =
  'Professionelle Elektrolyse (Nadelepilation) in Nürnberg: die einzige wirklich permanente Haarentfernungsmethode.';
const EN_DESCRIPTION =
  'Professional electrolysis in Nuremberg: the only truly permanent hair removal method. Works on every hair colour and skin type. Free initial consultation in English.';

@Component({
  selector: 'app-nadelepilation',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent],
  templateUrl: './nadelepilation.component.html',
  styleUrl: './nadelepilation.component.scss'
})
export class NadelepilationComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  readonly lang = inject(LanguageService);
  private readonly jsonLdId = 'nadelepilation-schema';

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  p(path: string): string {
    return this.lang.localizePath(path);
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

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: this.t(DE_TITLE, EN_TITLE),
      description: this.t(DE_DESCRIPTION, EN_DESCRIPTION),
      path: PAGE_PATH,
      image: HERO_IMAGE_URL,
      imageAlt: this.t(
        'Elektrolyse / Nadelepilation bei FareWell in Nürnberg: permanente Haarentfernung',
        'Electrolysis (Nadelepilation) at FareWell in Nuremberg: permanent hair removal'
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
            'Elektrolyse / Nadelepilation in Nürnberg',
            'Electrolysis (Nadelepilation) in Nuremberg'
          ),
          description: this.t(
            'Permanente Haarentfernung mit Elektrolyse (Nadelepilation) bei FareWell in Nürnberg, wirksam für alle Haut- und Haartypen.',
            'Permanent hair removal with electrolysis (Nadelepilation) at FareWell in Nuremberg, effective for all skin and hair types.'
          ),
          serviceType: this.t('Elektrolyse / Nadelepilation', 'Electrolysis (Nadelepilation)'),
          areaServed: {
            '@type': 'City',
            name: this.t('Nürnberg', 'Nuremberg')
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
          name: this.t(DE_TITLE, EN_TITLE),
          description: this.t(DE_DESCRIPTION, EN_DESCRIPTION),
          inLanguage: isEn ? 'en' : 'de',
          isPartOf: {
            '@id': 'https://farewell.salon/#website'
          },
          about: {
            '@id': `${pageUrl}#service`
          },
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: HERO_IMAGE_URL
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
              name: this.t('Nadelepilation', 'Electrolysis (Nadelepilation)'),
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
