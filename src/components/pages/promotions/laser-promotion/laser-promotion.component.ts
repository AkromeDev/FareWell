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
const PAGE_URL = `https://farewell.salon${PAGE_PATH}`;
const PAGE_TITLE = 'Laser-Haarentfernung in Nürnberg: 50% Rabatt für Neukunden | FareWell';
const PAGE_DESCRIPTION =
  'Dauerhafte Haarentfernung mit dem 4-Wellen-Diodenlaser in Nürnberg: KI-gestützte Hautanalyse, alle Körperzonen, kostenlose Erstberatung. Jetzt 50% Rabatt auf die erste Laser-Behandlung mit dem Code FIRSTLASER sichern.';
const HERO_IMAGE = 'assets/images/treatment/laser2.webp';
const HERO_IMAGE_URL = `https://farewell.salon/${HERO_IMAGE}`;
const HERO_IMAGE_ALT =
  'FareWell Studio in Nürnberg für moderne dauerhafte Haarentfernung mit 4-Wellen-Diodenlaser';

interface FaqJsonLdEntry {
  question: string;
  answer: string;
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
  readonly heroImageAlt = HERO_IMAGE_ALT;

  get lang(): GuideLang {
    return this.language.lang();
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
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
      question: 'Wie viele Sitzungen brauche ich beim Diodenlaser?',
      answer:
        'Haare wachsen in Zyklen, und nur Haare in der Wachstumsphase reagieren auf den Laser. Deshalb sind immer mehrere Sitzungen im Abstand von einigen Wochen nötig. Wie viele genau, hängt von Körperzone, Haardichte und Hormonlage ab – eine realistische Einschätzung bekommst du in der kostenlosen Erstberatung.',
    },
    {
      question: 'Tut die Laser-Behandlung weh?',
      answer:
        'Die meisten empfinden die Impulse als kurzes, warmes Zwicken – deutlich sanfter als Wachsen oder Epilieren. Wir stimmen die Intensität individuell auf deine Haut ab und tasten uns gemeinsam an das richtige Setting heran.',
    },
    {
      question: 'Für welche Haut- und Haartypen eignet sich der Diodenlaser?',
      answer:
        'Am wirksamsten ist der Laser bei dunkleren Haaren. Durch die Kombination von vier Wellenlängen und die KI-gestützte Hauterkennung kann unser Gerät mehr Haut- und Haartypen behandeln als klassische IPL-Systeme. Für helle, feine oder graue Haare empfehlen wir die Elektrolyse – sie wirkt unabhängig von der Haarfarbe.',
    },
    {
      question: 'Ist das Ergebnis dauerhaft oder permanent?',
      answer:
        'Der Diodenlaser erreicht eine dauerhafte Haarentfernung, also eine deutliche, langanhaltende Reduktion des Haarwuchses. Permanent ist in Deutschland allein die Elektrolyse (Nadelepilation), die jede Haarwurzel einzeln und endgültig verödet. Bei FareWell bekommst du beide Methoden – und eine ehrliche Empfehlung, was zu dir passt.',
    },
  ];

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      path: PAGE_PATH,
      image: HERO_IMAGE_URL,
      imageAlt: HERO_IMAGE_ALT,
      largeImage: true,
    });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${PAGE_URL}#service`,
          name: 'Dauerhafte Haarentfernung mit 4-Wellen-Diodenlaser in Nürnberg',
          description:
            'Dauerhafte Haarentfernung mit modernem 4-Wellen-Diodenlaser bei FareWell in Nürnberg. 50% Rabatt auf die erste Laser-Behandlung für Neukunden mit dem Code FIRSTLASER.',
          serviceType: 'Laser Haarentfernung',
          areaServed: { '@type': 'City', name: 'Nürnberg' },
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
            name: '50% Rabatt auf die erste Laser-Behandlung',
            description:
              'Neukundenangebot für die erste Behandlung zur dauerhaften Haarentfernung mit Diodenlaser bei FareWell in Nürnberg. Code: FIRSTLASER.',
            url: PAGE_URL,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            eligibleCustomerType: { '@type': 'BusinessEntityType', name: 'Neukunden' },
          },
        },
        {
          '@type': 'WebPage',
          '@id': `${PAGE_URL}#webpage`,
          url: PAGE_URL,
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          inLanguage: 'de',
          about: { '@id': `${PAGE_URL}#service` },
          primaryImageOfPage: { '@type': 'ImageObject', url: HERO_IMAGE_URL },
        },
        {
          '@type': 'FAQPage',
          '@id': `${PAGE_URL}#faq`,
          url: `${PAGE_URL}#faq`,
          mainEntity: this.faqEntries.map((entry) => ({
            '@type': 'Question',
            name: entry.question,
            acceptedAnswer: { '@type': 'Answer', text: entry.answer },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'FareWell', item: 'https://farewell.salon' },
            { '@type': 'ListItem', position: 2, name: 'Laser-Haarentfernung Aktion', item: PAGE_URL },
          ],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
