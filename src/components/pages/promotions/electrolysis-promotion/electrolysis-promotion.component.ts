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

const PAGE_PATH = '/elektrolyse-permanente-haarentfernung-aktion-nuernberg';
const PAGE_TITLE_DE = 'Elektrolyse Aktion Nürnberg: permanente Haarentfernung | FareWell';
const PAGE_TITLE_EN = 'Electrolysis Offer Nuremberg: Permanent Hair Removal | FareWell';
const PAGE_DESCRIPTION_DE =
  'Permanente Haarentfernung mit Elektrolyse in Nürnberg. 50% Rabatt auf die erste Behandlung für Neukund:innen mit dem Code ERSTEBEHANDLUNG.';
const PAGE_DESCRIPTION_EN =
  'Permanent hair removal with electrolysis in Nuremberg. 50% off your first treatment for new clients with the code ERSTEBEHANDLUNG.';
const HERO_IMAGE = 'assets/images/treatment/nadel.jpg';
const HERO_IMAGE_URL = `https://farewell.salon/${HERO_IMAGE}`;
const HERO_IMAGE_ALT_DE =
  'Elektrolyse Behandlung bei FareWell in Nürnberg zur permanenten Haarentfernung';
const HERO_IMAGE_ALT_EN =
  'Electrolysis treatment at FareWell in Nuremberg for permanent hair removal';

interface FaqJsonLdEntry {
  question: string;
  answer: string;
}

@Component({
  standalone: true,
  selector: 'app-electrolysis-promotion',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './electrolysis-promotion.component.html',
})
export class ElectrolysisPromotionComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'electrolysis-promo-schema';

  readonly heroImage = HERO_IMAGE;

  get lang(): GuideLang {
    return this.language.lang();
  }

  get heroImageAlt(): string {
    return this.t(HERO_IMAGE_ALT_DE, HERO_IMAGE_ALT_EN);
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
        value: this.t('permanent', 'permanent'),
        label: this.t('endgültig verödete Haarwurzeln', 'hair roots deactivated for good'),
      },
      {
        value: '50%',
        label: this.t('Rabatt auf deine erste Behandlung', 'off your first treatment'),
      },
      {
        value: this.t('alle', 'all'),
        label: this.t('Haar- und Hauttypen behandelbar', 'hair and skin types treatable'),
      },
      {
        value: this.t('gratis', 'free'),
        label: this.t('Erstberatung mit Haaranalyse', 'initial consultation with hair analysis'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'angebot', label: this.t('Preise & Neukunden-Rabatt', 'Prices & new-client discount') },
      { id: 'permanent', label: this.t('Warum permanent?', 'Why permanent?') },
      { id: 'geeignet', label: this.t('Für wen geeignet?', 'Who it suits') },
      { id: 'ablauf', label: this.t('So läuft es ab', 'How it works') },
      { id: 'faq', label: this.t('Häufige Fragen', 'Common questions') },
    ];
  }

  /**
   * Fragen und Antworten als Klartext für das FAQPage-Schema, in der jeweils
   * aktiven Sprache. Inhaltlich deckungsgleich mit dem sichtbaren Akkordeon
   * im Template halten!
   */
  private get faqEntries(): FaqJsonLdEntry[] {
    return [
      {
        question: this.t('Ist Elektrolyse wirklich permanent?', 'Is electrolysis really permanent?'),
        answer: this.t(
          'Ja. Elektrolyse ist die einzige in Deutschland rechtlich als permanent anerkannte Methode der Haarentfernung. Jede behandelte Haarwurzel wird endgültig verödet und wächst nicht mehr nach, im Unterschied zu Laser und IPL, die den Haarwuchs nur dauerhaft reduzieren.',
          'Yes. Electrolysis is the only hair removal method legally recognised as permanent in Germany. Every treated hair root is deactivated for good and does not grow back, unlike laser and IPL, which only reduce hair growth long-term.'
        ),
      },
      {
        question: this.t('Tut die Elektrolyse weh?', 'Does electrolysis hurt?'),
        answer: this.t(
          'Die meisten empfinden pro Haar ein kurzes, warmes Prickeln. Wir stimmen die Intensität individuell auf dich ab und tasten uns gemeinsam an ein angenehmes Setting heran, damit die Behandlung so komfortabel wie möglich ist.',
          'Most people feel a brief, warm tingle per hair. We adjust the intensity individually to you and find a comfortable setting together, so the treatment is as comfortable as possible.'
        ),
      },
      {
        question: this.t(
          'Für welche Haare und Hauttypen eignet sich Elektrolyse?',
          'Which hair and skin types is electrolysis suitable for?'
        ),
        answer: this.t(
          'Für alle. Weil die Elektrolyse nicht auf Farbpigmente angewiesen ist, wirkt sie auch bei hellen, grauen, roten oder sehr feinen Haaren und unabhängig von der Hormonlage, etwa bei PCOS. Genau dort, wo Laser und IPL an ihre Grenzen kommen.',
          "For everyone. Because electrolysis doesn't rely on colour pigment, it also works on light, grey, red or very fine hair and independently of hormones, for example with PCOS, exactly where laser and IPL reach their limits."
        ),
      },
      {
        question: this.t('Wie viele Sitzungen brauche ich?', 'How many sessions do I need?'),
        answer: this.t(
          'Weil jedes Haar einzeln behandelt wird und Haare in Zyklen wachsen, sind mehrere Sitzungen im Abstand von einigen Wochen nötig. Wie viele genau, hängt von Zone, Haardichte und Hormonlage ab. Eine realistische Einschätzung bekommst du in der kostenlosen Erstberatung.',
          "Because every hair is treated individually and hair grows in cycles, several sessions a few weeks apart are needed. Exactly how many depends on the area, hair density and hormones. You'll get a realistic estimate in the free initial consultation."
        ),
      },
    ];
  }

  ngOnInit(): void {
    const isEn = this.language.lang() === 'en';
    const pageUrl = `https://farewell.salon${isEn ? '/en' : ''}${PAGE_PATH}`;
    const title = this.t(PAGE_TITLE_DE, PAGE_TITLE_EN);
    const description = this.t(PAGE_DESCRIPTION_DE, PAGE_DESCRIPTION_EN);

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
            'Elektrolyse: permanente Haarentfernung in Nürnberg',
            'Electrolysis: permanent hair removal in Nuremberg'
          ),
          description: this.t(
            'Permanente Haarentfernung mit Elektrolyse bei FareWell in Nürnberg, die einzige wirklich permanente Methode. 50% Rabatt auf die erste Behandlung für Neukund:innen mit dem Code ERSTEBEHANDLUNG.',
            'Permanent hair removal with electrolysis at FareWell in Nuremberg, the only truly permanent method. 50% off the first treatment for new clients with the code ERSTEBEHANDLUNG.'
          ),
          serviceType: this.t('Elektrolyse Haarentfernung', 'Electrolysis hair removal'),
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
              '50% Rabatt auf die erste Elektrolyse-Behandlung',
              '50% off your first electrolysis treatment'
            ),
            description: this.t(
              'Neukundenangebot für die erste Behandlung zur permanenten Haarentfernung bei FareWell in Nürnberg. Code: ERSTEBEHANDLUNG.',
              'New-client offer for the first permanent hair removal treatment at FareWell in Nuremberg. Code: ERSTEBEHANDLUNG.'
            ),
            url: pageUrl,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            eligibleCustomerType: {
              '@type': 'BusinessEntityType',
              name: this.t('Neukund:innen', 'New clients'),
            },
          },
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title,
          description,
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
            name: entry.question,
            acceptedAnswer: { '@type': 'Answer', text: entry.answer },
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
              name: this.t('Elektrolyse Aktion Nürnberg', 'Electrolysis offer Nuremberg'),
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
