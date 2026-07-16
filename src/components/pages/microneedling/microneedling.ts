import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageHeroComponent } from 'src/components/molecules/image-hero/image-hero.component';
import { ImageTextBlockComponent } from 'src/components/molecules/image-text-block/image-text-block.component';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';

const PAGE_PATH = '/behandlungen/microneedling-radiofrequenz';
const DE_TITLE = 'Microneedling Radiofrequenz Nürnberg | FareWell';
const DE_DESCRIPTION =
  'Microneedling mit Radiofrequenz in Nürnberg: moderne Hautverjüngung, Faltenreduktion und Hautstraffung.';
const EN_TITLE = 'RF Microneedling Nuremberg | FareWell';
const EN_DESCRIPTION =
  'Radiofrequency microneedling in Nuremberg: skin rejuvenation, scar treatment and firmer skin. Book online, free initial consultation in English.';

@Component({
  selector: 'app-microneedling',
  standalone: true,
  imports: [RouterModule, ImageHeroComponent, ImageTextBlockComponent],
  templateUrl: './microneedling.html',
  styleUrl: './microneedling.scss'
})
export class MicroneedlingComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  readonly lang = inject(LanguageService);
  private readonly jsonLdId = 'microneedling-schema';

  private readonly heroImageUrl =
    'https://farewell.salon/assets/images/treatment/microneedling2.webp';

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  p(path: string): string {
    return this.lang.localizePath(path);
  }

  get paragraphText(): string {
    return this.t(
      `
    Microneedling mit Radiofrequenz kombiniert feine Mikro-Nadeln mit gezielter Wärme in der Tiefe.
    Das Ergebnis: straffere Haut, ein verfeinertes Hautbild und ein frischer Glow, ganz ohne OP.

    Alle wichtigen Infos zur Behandlung findest du weiter unten.
  `,
      `
    Radiofrequency microneedling combines fine micro-needles with targeted warmth deep in the skin.
    The result: firmer skin, a refined complexion and a fresh glow, all without surgery.

    You will find all the key details about the treatment further down.
  `
    );
  }

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: this.t(DE_TITLE, EN_TITLE),
      description: this.t(DE_DESCRIPTION, EN_DESCRIPTION),
      path: PAGE_PATH,
      image: this.heroImageUrl,
      imageAlt: this.t(
        'FareWell Studio in Nürnberg für Microneedling mit Radiofrequenz zur Hautstraffung und Hautbildverbesserung',
        'FareWell studio in Nuremberg for radiofrequency microneedling for skin firming and a better complexion'
      ),
      largeImage: true,
    });

    const isEn = this.lang.lang() === 'en';
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;
    const homeUrl = isEn ? 'https://farewell.salon/en' : 'https://farewell.salon';
    const treatmentsUrl = `https://farewell.salon${isEn ? '/en' : ''}/behandlungen`;

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: this.t(
            'Microneedling mit Radiofrequenz in Nürnberg',
            'Radiofrequency microneedling in Nuremberg'
          ),
          description: this.t(
            'RF-Microneedling bei FareWell in Nürnberg zur Hautstraffung, Hautbildverbesserung sowie zur Unterstützung bei Poren, Aknenarben und unruhiger Hautstruktur.',
            'RF microneedling at FareWell in Nuremberg for skin firming, a better complexion and support with enlarged pores, acne scars and uneven skin texture.'
          ),
          serviceType: this.t('Radiofrequenz-Microneedling', 'Radiofrequency microneedling'),
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
            url: this.heroImageUrl
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: homeUrl },
            {
              '@type': 'ListItem',
              position: 2,
              name: this.t('Behandlungen', 'Treatments'),
              item: treatmentsUrl
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: this.t('Microneedling Radiofrequenz', 'RF Microneedling'),
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
