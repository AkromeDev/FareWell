import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { SeoService } from 'src/services/seo.service';
import { LanguageService } from 'src/services/language.service';
import {
  GUIDE_COMPONENTS,
  GuideLang,
  GuideStat,
  GuideTocItem,
} from 'src/components/molecules/guide';

const PAGE_PATH = '/ipl-dauerhafte-haarentfernung-aktion-nuernberg';
const PAGE_URL = `https://farewell.salon${PAGE_PATH}`;
const PAGE_TITLE = 'IPL-Haarentfernung in Nürnberg? Die modernere Alternative | FareWell';
const PAGE_DESCRIPTION =
  'Du suchst IPL zur dauerhaften Haarentfernung in Nürnberg? FareWell setzt bewusst auf den präziseren 4-Wellen-Diodenlaser mit KI-Hautanalyse. Jetzt 50% Rabatt auf die erste Behandlung mit dem Code ERSTEBEHANDLUNG.';
const HERO_IMAGE = 'assets/images/treatment/laser2.webp';
const HERO_IMAGE_URL = `https://farewell.salon/${HERO_IMAGE}`;
const HERO_IMAGE_ALT =
  'FareWell Studio in Nürnberg für professionelle dauerhafte Haarreduktion mit 4-Wellen-Diodenlaser';

interface FaqJsonLdEntry {
  question: string;
  answer: string;
}

@Component({
  standalone: true,
  selector: 'app-ipl-promotion',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './ipl-promotion.component.html',
})
export class IplPromotionComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly language = inject(LanguageService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly jsonLdId = 'ipl-promotion-schema';

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
      {
        value: '4',
        label: this.t('Wellenlängen statt breitem Streulicht', 'wavelengths instead of broad scattered light'),
      },
      {
        value: this.t('KI', 'AI'),
        label: this.t('gestützte Hauterkennung', 'assisted skin detection'),
      },
      {
        value: '50%',
        label: this.t('Rabatt auf deine erste Behandlung', 'off your first treatment'),
      },
      {
        value: this.t('gratis', 'free'),
        label: this.t('Erstberatung mit Hautanalyse', 'initial consultation with skin analysis'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'angebot', label: this.t('Neukunden-Angebot', 'New-client offer') },
      { id: 'ipl-vs-laser', label: this.t('IPL vs. Diodenlaser', 'IPL vs. diode laser') },
      { id: 'warum-farewell', label: this.t('Warum FareWell', 'Why FareWell') },
      { id: 'ablauf', label: this.t('So läuft es ab', 'How it works') },
      { id: 'faq', label: this.t('Häufige Fragen', 'FAQ') },
    ];
  }

  /**
   * Fragen und Antworten als Klartext für das FAQPage-Schema (deutsche Fassung).
   * Inhaltlich deckungsgleich mit dem sichtbaren Akkordeon im Template halten!
   */
  private readonly faqEntries: FaqJsonLdEntry[] = [
    {
      question: 'Warum bietet FareWell kein IPL an?',
      answer:
        'Weil wir von der präziseren Technologie überzeugt sind: IPL arbeitet mit breit gestreutem Licht, der 4-Wellen-Diodenlaser mit gezielt abgestimmten Wellenlängen, die direkt auf das Haarfollikel wirken. Das macht die Behandlung kontrollierter, wirksamer und für mehr Haut- und Haartypen geeignet.',
    },
    {
      question: 'Ist IPL oder Diodenlaser besser für dauerhafte Haarentfernung?',
      answer:
        'Der Diodenlaser gilt als die präzisere und meist wirksamere Methode: Er bündelt die Energie gezielt auf das Haarfollikel, während IPL-Geräte ihr Licht breit streuen. Unser 4-Wellen-Diodenlaser kombiniert zusätzlich mehrere Wellenlängen und passt sich per KI-Hauterkennung deinem Hauttyp an.',
    },
    {
      question: 'Ich habe schon IPL-Behandlungen hinter mir – kann ich zu FareWell wechseln?',
      answer:
        'Ja, jederzeit. Bring am besten die Infos zu deinen bisherigen Behandlungen mit in die kostenlose Erstberatung. Wir analysieren Haut und Haare, schauen uns den aktuellen Stand an und erstellen dir einen ehrlichen Plan, wie es sinnvoll weitergeht.',
    },
    {
      question: 'Was kostet die erste Behandlung mit dem Neukunden-Code?',
      answer:
        'Mit dem Code ERSTEBEHANDLUNG zahlst du auf deine erste Behandlung nur die Hälfte des regulären Preises. Alle regulären Preise stehen je Körperzone auf unserer Preisseite unter farewell.salon/price. Die Erstberatung ist kostenlos und unverbindlich.',
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
          name: 'Dauerhafte Haarentfernung in Nürnberg – moderne Alternative zu IPL',
          description:
            'Dauerhafte Haarreduktion mit 4-Wellen-Diodenlaser statt IPL bei FareWell in Nürnberg. 50% Rabatt auf die erste Behandlung für Neukunden mit dem Code ERSTEBEHANDLUNG.',
          serviceType: 'Dauerhafte Haarentfernung',
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
            name: '50% Rabatt auf die erste Behandlung',
            description:
              'Neukundenangebot für die erste Behandlung zur dauerhaften Haarentfernung bei FareWell in Nürnberg. Code: ERSTEBEHANDLUNG.',
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
            { '@type': 'ListItem', position: 2, name: 'IPL-Alternative Nürnberg', item: PAGE_URL },
          ],
        },
      ],
    });

    if (this.isBrowser) {
      const fromQuery = this.route.snapshot.queryParamMap.get('lang');
      if (fromQuery === 'de' || fromQuery === 'en') {
        this.language.setLang(fromQuery);
      }
    }
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
