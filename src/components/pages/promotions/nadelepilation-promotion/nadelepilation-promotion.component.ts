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

const PAGE_PATH = '/nadelepilation-angebot-nuernberg';
const PAGE_TITLE_DE = 'Nadelepilation Angebot Nürnberg: permanente Haarentfernung | FareWell';
const PAGE_TITLE_EN = 'Needle Epilation Offer Nuremberg: Permanent Hair Removal | FareWell';
const PAGE_DESCRIPTION_DE =
  'Permanente Haarentfernung mit Nadelepilation (Elektrolyse) in Nürnberg. 50% Rabatt auf die erste Behandlung für Neukund:innen mit dem Code ERSTEBEHANDLUNG.';
const PAGE_DESCRIPTION_EN =
  'Permanent hair removal with needle epilation (electrolysis) in Nuremberg. 50% off your first treatment for new clients with the code ERSTEBEHANDLUNG.';
const HERO_IMAGE = 'assets/images/treatment/nadel.jpg';
const HERO_IMAGE_URL = `https://farewell.salon/${HERO_IMAGE}`;
const HERO_IMAGE_ALT_DE =
  'Nadelepilation bei FareWell in Nürnberg zur permanenten Haarentfernung mit feiner Sonde';
const HERO_IMAGE_ALT_EN =
  'Needle epilation at FareWell in Nuremberg for permanent hair removal with a fine probe';

interface FaqJsonLdEntry {
  question: string;
  answer: string;
}

@Component({
  standalone: true,
  selector: 'app-nadelepilation-promotion',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './nadelepilation-promotion.component.html',
})
export class NadelepilationPromotionComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'nadelepilation-promo-schema';

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
        value: this.t('einzeln', 'one by one'),
        label: this.t('jedes Haar an der Wurzel behandelt', 'each hair treated at the root'),
      },
      {
        value: '50%',
        label: this.t('Rabatt auf deine erste Behandlung', 'off your first treatment'),
      },
      {
        value: this.t('alle', 'all'),
        label: this.t('Haarfarben, auch hell und grau', 'hair colours, incl. light and grey'),
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
      { id: 'methode', label: this.t('Was ist Nadelepilation?', 'What is needle epilation?') },
      { id: 'vergleich', label: this.t('Nadelepilation oder Laser?', 'Needle epilation or laser?') },
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
        question: this.t(
          'Was ist der Unterschied zwischen Nadelepilation und Elektrolyse?',
          'What is the difference between needle epilation and electrolysis?'
        ),
        answer: this.t(
          'Im Alltag meint beides dasselbe. Elektrolyse ist der Überbegriff für die permanente Haarentfernung mit Strom, Nadelepilation die klassische, nadelbasierte Variante davon: Eine feine Sonde wird an die Haarwurzel geführt und verödet sie gezielt.',
          'In everyday use both mean the same thing. Electrolysis is the umbrella term for permanent hair removal using electric current; needle epilation is the classic, needle-based variant of it: a fine probe is guided to the hair root and deactivates it precisely.'
        ),
      },
      {
        question: this.t('Wie fühlt sich die Behandlung an?', 'How does the treatment feel?'),
        answer: this.t(
          'Pro Haar spürst du ein kurzes, warmes Prickeln. Die Sonde durchsticht die Haut nicht, sondern gleitet in den natürlichen Follikelkanal. Wir stimmen die Intensität individuell auf dich ab, damit es so angenehm wie möglich bleibt.',
          "Per hair you feel a brief, warm tingle. The probe doesn't pierce the skin but slides into the natural follicle canal. We adjust the intensity individually to you so it stays as comfortable as possible."
        ),
      },
      {
        question: this.t(
          'Für welche Zonen eignet sich Nadelepilation?',
          'Which areas is needle epilation suitable for?'
        ),
        answer: this.t(
          'Besonders für Gesicht, Oberlippe, Kinn, Augenbrauenkontur und andere kleine, präzise Zonen, und überall dort, wo helle, feine oder graue Haare wachsen. Für große Flächen mit dunklem Haar ist oft der Diodenlaser die schnellere Ergänzung.',
          'Especially for the face, upper lip, chin, eyebrow contour and other small, precise areas, and everywhere light, fine or grey hair grows. For large areas with dark hair, the diode laser is often the faster complement.'
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
            'Nadelepilation: permanente Haarentfernung in Nürnberg',
            'Needle epilation: permanent hair removal in Nuremberg'
          ),
          description: this.t(
            'Permanente Haarentfernung mit Nadelepilation (Elektrolyse) bei FareWell in Nürnberg, jedes Haar einzeln an der Wurzel verödet. 50% Rabatt auf die erste Behandlung für Neukund:innen mit dem Code ERSTEBEHANDLUNG.',
            'Permanent hair removal with needle epilation (electrolysis) at FareWell in Nuremberg, every hair deactivated individually at the root. 50% off the first treatment for new clients with the code ERSTEBEHANDLUNG.'
          ),
          serviceType: this.t('Nadelepilation Haarentfernung', 'Needle epilation hair removal'),
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
              '50% Rabatt auf die erste Nadelepilation',
              '50% off your first needle epilation'
            ),
            description: this.t(
              'Neukundenangebot für die erste Behandlung zur permanenten Haarentfernung mit Nadelepilation bei FareWell in Nürnberg. Code: ERSTEBEHANDLUNG.',
              'New-client offer for the first permanent needle epilation hair removal treatment at FareWell in Nuremberg. Code: ERSTEBEHANDLUNG.'
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
              name: this.t('Nadelepilation Angebot Nürnberg', 'Needle epilation offer Nuremberg'),
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
