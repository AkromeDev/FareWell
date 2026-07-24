import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';
import {
  GUIDE_COMPONENTS,
  GuideLang,
  GuideStat,
  GuideTocItem,
} from 'src/components/molecules/guide';

const PAGE_PATH = '/behandlungen/diodenlaser-4-wellen';
const HERO_IMAGE = 'assets/images/treatment/laser.webp';
const HERO_IMAGE_URL = `https://farewell.salon/${HERO_IMAGE}`;

const DE_TITLE = 'Diodenlaser Haarentfernung Nürnberg | FareWell';
const EN_TITLE = 'Laser Hair Removal Nuremberg (4-Wavelength Diode Laser) | FareWell';
const DE_DESCRIPTION =
  'Moderne Diodenlaser Haarentfernung in Nürnberg: effektive und schonende dauerhafte Haarreduktion.';
const EN_DESCRIPTION =
  'Modern diode laser hair removal in Nuremberg: effective, gentle, long-lasting hair reduction for larger body areas. Free consultation, English spoken.';
const HERO_ALT_DE =
  '4-Wellen Diodenlaser Haarentfernung bei FareWell in Nürnberg';
const HERO_ALT_EN =
  '4-wavelength diode laser hair removal at FareWell in Nuremberg';

interface FaqEntry {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-diodenlaser',
  standalone: true,
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './diodenlaser.html',
})
export class Diodenlaser implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'diodenlaser-schema';

  readonly heroImage = HERO_IMAGE;

  get lang(): GuideLang {
    return this.language.lang();
  }

  get heroImageAlt(): string {
    return this.t(HERO_ALT_DE, HERO_ALT_EN);
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  p(path: string): string {
    return this.language.localizePath(path);
  }

  get stats(): GuideStat[] {
    return [
      {
        value: '4',
        label: this.t(
          'Wellenlängen für viele Haut- und Haartypen',
          'wavelengths for many skin & hair types',
        ),
      },
      {
        value: '6–10',
        label: this.t('Sitzungen für sichtbare Reduktion', 'sessions for visible reduction'),
      },
      {
        value: '1–4',
        label: this.t('Wochen Abstand zwischen den Sitzungen', 'weeks between sessions'),
      },
      {
        value: this.t('Große Areale', 'Large areas'),
        label: this.t('Beine, Rücken & Achseln schnell behandelt', 'legs, back & underarms treated fast'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'angebot', label: this.t('Aktuelle Aktion', 'Current offer') },
      { id: 'was', label: this.t('Was ist ein 4-Wellen-Diodenlaser?', 'What it is') },
      { id: 'funktion', label: this.t('Wie funktioniert es?', 'How it works') },
      { id: 'geeignet', label: this.t('Für wen geeignet?', 'Who it suits') },
      { id: 'nebenwirkungen', label: this.t('Nebenwirkungen', 'Side effects') },
      { id: 'sitzungen', label: this.t('Wie viele Sitzungen?', 'How many sessions') },
    ];
  }

  /**
   * Frage-Antwort-Paare als Klartext für das FAQPage-Schema, inhaltlich
   * deckungsgleich mit den (als Fragen formulierten) Abschnitten im Template.
   */
  private get faqEntries(): FaqEntry[] {
    return [
      {
        question: this.t('Was ist ein 4-Wellen-Diodenlaser?', 'What is a 4-wavelength diode laser?'),
        answer: this.t(
          'Der 4-Wellen-Diodenlaser arbeitet mit mehreren Wellenlängen, um Haare in unterschiedlichen Tiefen zu erreichen. Ziel ist eine dauerhafte Reduktion des Haarwachstums über mehrere Sitzungen. Er eignet sich besonders für größere Areale wie Beine, Rücken oder Achseln und ist in der Regel schnell und gut verträglich.',
          'The 4-wavelength diode laser works with several wavelengths to reach hairs at different depths. The aim is a long-lasting reduction in hair growth across several sessions. It is especially suited to larger areas such as the legs, back or underarms and is usually quick and well tolerated.',
        ),
      },
      {
        question: this.t('Wie funktioniert die Laser-Haarentfernung?', 'How does laser hair removal work?'),
        answer: this.t(
          'Laserlicht wird vom Melanin im Haar aufgenommen und in Wärme umgewandelt, die die Haarwurzel in ihrer Wachstumsfähigkeit beeinträchtigt. Laser führt zu einer dauerhaften Haarreduktion, nicht zu einer permanenten Entfernung wie bei der Elektrolyse. Das Ergebnis hängt stark von Haarfarbe, Hauttyp und Wachstumsphase ab.',
          'Laser light is absorbed by the melanin in the hair and turned into heat, which weakens the growth capacity of the hair root. Laser leads to a long-lasting hair reduction, not permanent removal like electrolysis. The result depends strongly on hair colour, skin type and growth phase.',
        ),
      },
      {
        question: this.t('Für wen ist der Diodenlaser geeignet?', 'Who is the diode laser right for?'),
        answer: this.t(
          'Der Diodenlaser passt besonders gut zu dunkleren Haaren auf heller bis mittlerer Haut, wenn du größere Areale schnell behandeln und den Haarwuchs sichtbar reduzieren möchtest. Bei FareWell sagen wir dir ehrlich, ob Laser für dich sinnvoll ist oder ob die Elektrolyse die bessere Wahl wäre.',
          'The diode laser is a particularly good fit for darker hair on light to medium skin when you want to treat larger areas fast and visibly reduce hair growth. At FareWell we tell you honestly whether laser makes sense for you or whether electrolysis would be the better choice.',
        ),
      },
      {
        question: this.t('Gibt es Nebenwirkungen?', 'Are there any side effects?'),
        answer: this.t(
          'Möglich sind Rötung oder ein Wärmegefühl nach der Sitzung, eine leichte Schwellung um die Haarfollikel und selten Pigmentveränderungen bei Sonnenexposition. Mit professioneller Durchführung und konsequentem UV-Schutz ist die Behandlung sehr gut kontrollierbar.',
          'Possible reactions include redness or a feeling of warmth after the session, slight swelling around the hair follicles and, rarely, pigment changes after sun exposure. With professional care and consistent UV protection, the treatment stays very well under control.',
        ),
      },
      {
        question: this.t('Wie viele Sitzungen sind nötig?', 'How many sessions do you need?'),
        answer: this.t(
          'Haare sind nur in der Anagenphase, der aktiven Wachstumsphase, effektiv behandelbar, deshalb sind mehrere Sitzungen notwendig. Üblich sind 6 bis 10 Sitzungen mit Abständen von 1 bis 4 Wochen. Anzahl und Abstand hängen von Körperregion und Haarstruktur ab.',
          'Hair can only be treated effectively during the anagen phase, the active growth phase, so several sessions are needed. Typically you need 6 to 10 sessions, spaced 1 to 4 weeks apart. The number and spacing depend on the body area and hair structure.',
        ),
      },
    ];
  }

  ngOnInit(): void {
    const isEn = this.language.lang() === 'en';
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;
    const homeUrl = isEn ? 'https://farewell.salon/en' : 'https://farewell.salon';
    const title = this.t(DE_TITLE, EN_TITLE);
    const description = this.t(DE_DESCRIPTION, EN_DESCRIPTION);

    this.seo.setPageSeo({
      title,
      description,
      path: PAGE_PATH,
      image: HERO_IMAGE_URL,
      imageAlt: this.heroImageAlt,
      largeImage: true,
    });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: this.t(
            '4-Wellen Diodenlaser Haarentfernung in Nürnberg',
            '4-wavelength diode laser hair removal in Nuremberg',
          ),
          description: this.t(
            'Dauerhafte Haarreduktion mit dem 4-Wellen-Diodenlaser bei FareWell in Nürnberg. Effektiv, schonend und für viele Haut- und Haartypen geeignet.',
            'Long-lasting hair reduction with the 4-wavelength diode laser at FareWell in Nuremberg. Effective, gentle and suitable for many skin and hair types.',
          ),
          serviceType: this.t('Diodenlaser Haarentfernung', 'Diode laser hair removal'),
          areaServed: { '@type': 'City', name: this.t('Nürnberg', 'Nuremberg') },
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
              addressCountry: 'DE',
            },
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: this.t('Diodenlaser-Areale', 'Diode laser areas'),
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t('Diodenlaser Beine', 'Diode laser legs'),
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t('Diodenlaser Rücken', 'Diode laser back'),
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: this.t('Diodenlaser Achseln', 'Diode laser underarms'),
                },
              },
            ],
          },
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title,
          description,
          inLanguage: isEn ? 'en' : 'de',
          isPartOf: { '@id': 'https://farewell.salon/#website' },
          about: { '@id': `${pageUrl}#service` },
          primaryImageOfPage: { '@type': 'ImageObject', url: HERO_IMAGE_URL },
        },
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          inLanguage: isEn ? 'en' : 'de',
          mainEntity: this.faqEntries.map((entry) => ({
            '@type': 'Question',
            name: entry.question,
            acceptedAnswer: { '@type': 'Answer', text: entry.answer },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: homeUrl },
            {
              '@type': 'ListItem',
              position: 2,
              name: this.t('Behandlungen', 'Treatments'),
              item: `https://farewell.salon${isEn ? '/en' : ''}/behandlungen`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: this.t('Diodenlaser Haarentfernung', 'Diode laser hair removal'),
              item: pageUrl,
            },
          ],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
