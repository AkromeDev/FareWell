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
const PAGE_TITLE_DE = 'IPL-Haarentfernung in Nürnberg? Die modernere Alternative | FareWell';
const PAGE_TITLE_EN = 'IPL Hair Removal in Nuremberg? The More Modern Alternative | FareWell';
const PAGE_DESCRIPTION_DE =
  'Statt IPL: dauerhafte Haarentfernung mit dem präziseren 4-Wellen-Diodenlaser in Nürnberg. 50% Rabatt auf die erste Behandlung mit dem Code ERSTEBEHANDLUNG.';
const PAGE_DESCRIPTION_EN =
  'Instead of IPL: long-lasting hair removal with the more precise 4-wavelength diode laser in Nuremberg. 50% off your first treatment with the code ERSTEBEHANDLUNG.';
const HERO_IMAGE = 'assets/images/treatment/laser2.webp';
const HERO_IMAGE_URL = `https://farewell.salon/${HERO_IMAGE}`;
const HERO_IMAGE_ALT_DE =
  'FareWell Studio in Nürnberg für professionelle dauerhafte Haarreduktion mit 4-Wellen-Diodenlaser';
const HERO_IMAGE_ALT_EN =
  'FareWell studio in Nuremberg for professional long-lasting hair reduction with a 4-wavelength diode laser';

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
   * Fragen und Antworten als Klartext für das FAQPage-Schema, in der jeweils
   * aktiven Sprache. Inhaltlich deckungsgleich mit dem sichtbaren Akkordeon
   * im Template halten!
   */
  private get faqEntries(): FaqJsonLdEntry[] {
    return [
      {
        question: this.t(
          'Warum bietet FareWell kein IPL an?',
          "Why doesn't FareWell offer IPL?"
        ),
        answer: this.t(
          'Weil wir von der präziseren Technologie überzeugt sind: IPL arbeitet mit breit gestreutem Licht, der 4-Wellen-Diodenlaser mit gezielt abgestimmten Wellenlängen, die direkt auf das Haarfollikel wirken. Das macht die Behandlung kontrollierter, wirksamer und für mehr Haut- und Haartypen geeignet.',
          "Because we're convinced by the more precise technology: IPL works with broadly scattered light, while the 4-wavelength diode laser uses precisely tuned wavelengths that act directly on the hair follicle. That makes the treatment more controlled, more effective and suitable for more skin and hair types."
        ),
      },
      {
        question: this.t(
          'Ist IPL oder Diodenlaser besser für dauerhafte Haarentfernung?',
          'Is IPL or a diode laser better for long-lasting hair removal?'
        ),
        answer: this.t(
          'Der Diodenlaser gilt als die präzisere und meist wirksamere Methode: Er bündelt die Energie gezielt auf das Haarfollikel, während IPL-Geräte ihr Licht breit streuen. Unser 4-Wellen-Diodenlaser kombiniert zusätzlich mehrere Wellenlängen und passt sich per KI-Hauterkennung deinem Hauttyp an.',
          'The diode laser is considered the more precise and usually more effective method: it focuses the energy directly on the hair follicle, while IPL devices scatter their light broadly. Our 4-wavelength diode laser also combines several wavelengths and adapts to your skin type through AI-assisted skin detection.'
        ),
      },
      {
        question: this.t(
          'Ich habe schon IPL-Behandlungen hinter mir, kann ich zu FareWell wechseln?',
          "I've already had IPL treatments, can I switch to FareWell?"
        ),
        answer: this.t(
          'Ja, jederzeit. Bring am besten die Infos zu deinen bisherigen Behandlungen mit in die kostenlose Erstberatung. Wir analysieren Haut und Haare, schauen uns den aktuellen Stand an und erstellen dir einen ehrlichen Plan, wie es sinnvoll weitergeht.',
          "Yes, any time. It's best to bring the details of your previous treatments to the free initial consultation. We analyse your skin and hair, look at where things stand and put together an honest plan for how to sensibly continue."
        ),
      },
      {
        question: this.t(
          'Was kostet die erste Behandlung mit dem Neukunden-Code?',
          'How much does the first treatment cost with the new-client code?'
        ),
        answer: this.t(
          'Mit dem Code ERSTEBEHANDLUNG zahlst du auf deine erste Behandlung nur die Hälfte des regulären Preises. Alle regulären Preise stehen je Körperzone auf unserer Preisseite. Die Erstberatung ist kostenlos und unverbindlich.',
          'With the code ERSTEBEHANDLUNG you pay only half the regular price for your first treatment. All regular prices are listed per body area on our price page. The initial consultation is free and without obligation.'
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
            'Dauerhafte Haarentfernung in Nürnberg: moderne Alternative zu IPL',
            'Long-lasting hair removal in Nuremberg: the more modern alternative to IPL'
          ),
          description: this.t(
            'Dauerhafte Haarreduktion mit 4-Wellen-Diodenlaser statt IPL bei FareWell in Nürnberg. 50% Rabatt auf die erste Behandlung für Neukunden mit dem Code ERSTEBEHANDLUNG.',
            'Long-lasting hair reduction with the 4-wavelength diode laser instead of IPL at FareWell in Nuremberg. 50% off the first treatment for new clients with the code ERSTEBEHANDLUNG.'
          ),
          serviceType: this.t('Dauerhafte Haarentfernung', 'Long-lasting hair removal'),
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
              '50% Rabatt auf die erste Behandlung',
              '50% off your first treatment'
            ),
            description: this.t(
              'Neukundenangebot für die erste Behandlung zur dauerhaften Haarentfernung bei FareWell in Nürnberg. Code: ERSTEBEHANDLUNG.',
              'New-client offer for the first long-lasting hair removal treatment at FareWell in Nuremberg. Code: ERSTEBEHANDLUNG.'
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
              name: this.t('IPL-Alternative Nürnberg', 'IPL alternative Nuremberg'),
              item: pageUrl,
            },
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
