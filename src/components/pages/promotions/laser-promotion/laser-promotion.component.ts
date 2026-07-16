import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { SeoService } from 'src/services/seo.service';
import { LanguageService } from 'src/services/language.service';
import {
  GUIDE_COMPONENTS,
  GuideLang,
  GuideStat,
  GuideTocItem,
} from 'src/components/molecules/guide';

const PAGE_PATH = '/laser-haarentfernung-aktion-nuernberg';
const PAGE_TITLE_DE = 'Laser-Haarentfernung in Nürnberg: 50% Rabatt für Neukunden | FareWell';
const PAGE_TITLE_EN = 'Laser Hair Removal in Nuremberg: 50% Off for New Clients | FareWell';
const PAGE_DESCRIPTION_DE =
  'Dauerhafte Haarentfernung mit dem 4-Wellen-Diodenlaser in Nürnberg. 50% Rabatt auf die erste Laser-Behandlung mit dem Code FIRSTLASER.';
const PAGE_DESCRIPTION_EN =
  'Long-lasting hair removal with the 4-wavelength diode laser in Nuremberg. 50% off your first laser treatment with the code FIRSTLASER.';
const HERO_IMAGE = 'assets/images/treatment/laser2.webp';
const HERO_IMAGE_URL = `https://farewell.salon/${HERO_IMAGE}`;
const HERO_IMAGE_ALT_DE =
  'FareWell Studio in Nürnberg für moderne dauerhafte Haarentfernung mit 4-Wellen-Diodenlaser';
const HERO_IMAGE_ALT_EN =
  'FareWell studio in Nuremberg for modern long-lasting hair removal with the 4-wavelength diode laser';

interface FaqJsonLdEntry {
  question: { de: string; en: string };
  answer: { de: string; en: string };
}

@Component({
  standalone: true,
  selector: 'app-laser-promotion',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './laser-promotion.component.html',
})
export class LaserPromotionComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'laser-promotion-schema';

  readonly heroImage = HERO_IMAGE;

  get heroImageAlt(): string {
    return this.t(HERO_IMAGE_ALT_DE, HERO_IMAGE_ALT_EN);
  }

  get lang(): GuideLang {
    return this.language.lang();
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  p(path: string): string {
    return this.language.localizePath(path);
  }

  get stats(): GuideStat[] {
    return [
      { value: '4', label: this.t('Wellenlängen in einem Laser', 'Wavelengths in one laser') },
      {
        value: '50%',
        label: this.t('Rabatt auf deine erste Behandlung', 'Discount on your first treatment'),
      },
      {
        value: this.t('gratis', 'free'),
        label: this.t('Erstberatung mit Hautanalyse', 'Initial consultation with skin analysis'),
      },
      { value: '6', label: this.t('Tage pro Woche geöffnet', 'Days open per week') },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'angebot', label: this.t('Preise & Neukunden-Rabatt', 'Prices & new-client discount') },
      {
        id: 'vorteile',
        label: this.t('Warum der 4-Wellen-Diodenlaser', 'Why the 4-wavelength diode laser'),
      },
      {
        id: 'dauerhaft-permanent',
        label: this.t('Dauerhaft oder permanent?', 'Long-lasting or permanent?'),
      },
      { id: 'ablauf', label: this.t('So läuft deine Behandlung ab', 'How your treatment works') },
      { id: 'zonen', label: this.t('Alle Körperzonen', 'All body areas') },
      { id: 'faq', label: this.t('Häufige Fragen', 'Common questions') },
    ];
  }

  /**
   * Fragen und Antworten als Klartext für das FAQPage-Schema. Inhaltlich
   * deckungsgleich mit dem sichtbaren Akkordeon im Template halten!
   */
  private readonly faqEntries: FaqJsonLdEntry[] = [
    {
      question: {
        de: 'Wie viele Sitzungen brauche ich beim Diodenlaser?',
        en: 'How many sessions do I need with the diode laser?',
      },
      answer: {
        de: 'Haare wachsen in Zyklen, und nur Haare in der Wachstumsphase reagieren auf den Laser. Deshalb sind immer mehrere Sitzungen im Abstand von einigen Wochen nötig. Wie viele genau, hängt von Körperzone, Haardichte und Hormonlage ab. Eine realistische Einschätzung bekommst du in der kostenlosen Erstberatung.',
        en: "Hair grows in cycles, and only hair in the growth phase responds to the laser. That's why several sessions a few weeks apart are always needed. Exactly how many depends on the body area, hair density and hormones. You'll get a realistic estimate in the free initial consultation.",
      },
    },
    {
      question: {
        de: 'Tut die Laser-Behandlung weh?',
        en: 'Does the laser treatment hurt?',
      },
      answer: {
        de: 'Die meisten empfinden die Impulse als kurzes, warmes Zwicken, deutlich sanfter als Wachsen oder Epilieren. Wir stimmen die Intensität individuell auf deine Haut ab und tasten uns gemeinsam an das richtige Setting heran.',
        en: 'Most people feel the pulses as a brief, warm pinch, much gentler than waxing or epilating. We adjust the intensity individually to your skin and find the right setting together.',
      },
    },
    {
      question: {
        de: 'Für welche Haut- und Haartypen eignet sich der Diodenlaser?',
        en: 'Which skin and hair types is the diode laser suitable for?',
      },
      answer: {
        de: 'Am wirksamsten ist der Laser bei dunkleren Haaren. Durch die Kombination von vier Wellenlängen und die KI-gestützte Hauterkennung kann unser Gerät mehr Haut- und Haartypen behandeln als klassische IPL-Systeme. Für helle, feine oder graue Haare empfehlen wir die Elektrolyse, sie wirkt unabhängig von der Haarfarbe.',
        en: 'The laser is most effective on darker hair. By combining four wavelengths with AI-assisted skin detection, our device can treat more skin and hair types than classic IPL systems. For light, fine or grey hair we recommend electrolysis, which works independently of hair colour.',
      },
    },
    {
      question: {
        de: 'Ist das Ergebnis dauerhaft oder permanent?',
        en: 'Is the result long-lasting or permanent?',
      },
      answer: {
        de: 'Der Diodenlaser erreicht eine dauerhafte Haarentfernung, also eine deutliche, langanhaltende Reduktion des Haarwuchses. Permanent ist in Deutschland allein die Elektrolyse (Nadelepilation), die jede Haarwurzel einzeln und endgültig verödet. Bei FareWell bekommst du beide Methoden und eine ehrliche Empfehlung, was zu dir passt.',
        en: 'The diode laser achieves long-lasting hair removal, meaning a clear, enduring reduction of hair growth. In Germany, only electrolysis (needle epilation) is permanent, deactivating every hair root individually and for good. At FareWell you get both methods, and an honest recommendation about what suits you.',
      },
    },
  ];

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: this.t(PAGE_TITLE_DE, PAGE_TITLE_EN),
      description: this.t(PAGE_DESCRIPTION_DE, PAGE_DESCRIPTION_EN),
      path: PAGE_PATH,
      image: HERO_IMAGE_URL,
      imageAlt: this.t(HERO_IMAGE_ALT_DE, HERO_IMAGE_ALT_EN),
      largeImage: true,
    });

    const isEn = this.language.lang() === 'en';
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: this.t(
            'Dauerhafte Haarentfernung mit 4-Wellen-Diodenlaser in Nürnberg',
            'Long-lasting hair removal with the 4-wavelength diode laser in Nuremberg',
          ),
          description: this.t(
            'Dauerhafte Haarentfernung mit modernem 4-Wellen-Diodenlaser bei FareWell in Nürnberg. 50% Rabatt auf die erste Laser-Behandlung für Neukunden mit dem Code FIRSTLASER.',
            'Long-lasting hair removal with a modern 4-wavelength diode laser at FareWell in Nuremberg. 50% off the first laser treatment for new clients with the code FIRSTLASER.',
          ),
          serviceType: this.t('Laser Haarentfernung', 'Laser hair removal'),
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
          offers: {
            '@type': 'Offer',
            name: this.t(
              '50% Rabatt auf die erste Laser-Behandlung',
              '50% off your first laser treatment',
            ),
            description: this.t(
              'Neukundenangebot für die erste Behandlung zur dauerhaften Haarentfernung mit Diodenlaser bei FareWell in Nürnberg. Code: FIRSTLASER.',
              'New-client offer for the first long-lasting diode laser hair removal treatment at FareWell in Nuremberg. Code: FIRSTLASER.',
            ),
            url: pageUrl,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            eligibleCustomerType: {
              '@type': 'BusinessEntityType',
              name: this.t('Neukunden', 'New clients'),
            },
          },
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: this.t(PAGE_TITLE_DE, PAGE_TITLE_EN),
          description: this.t(PAGE_DESCRIPTION_DE, PAGE_DESCRIPTION_EN),
          inLanguage: isEn ? 'en' : 'de',
          about: { '@id': `${pageUrl}#service` },
          primaryImageOfPage: { '@type': 'ImageObject', url: HERO_IMAGE_URL },
        },
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          url: `${pageUrl}#faq`,
          inLanguage: isEn ? 'en' : 'de',
          mainEntity: this.faqEntries.map((entry) => ({
            '@type': 'Question',
            name: this.t(entry.question.de, entry.question.en),
            acceptedAnswer: {
              '@type': 'Answer',
              text: this.t(entry.answer.de, entry.answer.en),
            },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'FareWell',
              item: isEn ? 'https://farewell.salon/en' : 'https://farewell.salon',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: this.t('Laser-Haarentfernung Aktion', 'Laser hair removal offer'),
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
