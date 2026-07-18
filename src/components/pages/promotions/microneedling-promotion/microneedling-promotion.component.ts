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

const PAGE_PATH = '/microneedling-aktion-nuernberg';
const PAGE_TITLE_DE = 'Microneedling Aktion Nürnberg: Hautverjüngung mit Radiofrequenz | FareWell';
const PAGE_TITLE_EN = 'Microneedling Offer Nuremberg: RF Skin Rejuvenation | FareWell';
const PAGE_DESCRIPTION_DE =
  'Radiofrequenz-Microneedling in Nürnberg: Hautstraffung und Faltenreduktion. 50% Rabatt auf die erste Behandlung für Neukund:innen mit dem Code ERSTEBEHANDLUNG.';
const PAGE_DESCRIPTION_EN =
  'Radiofrequency microneedling in Nuremberg: skin firming and fewer fine lines. 50% off your first treatment for new clients with the code ERSTEBEHANDLUNG.';
const HERO_IMAGE = 'assets/images/treatment/microneedling.webp';
const HERO_IMAGE_URL = `https://farewell.salon/${HERO_IMAGE}`;
const HERO_IMAGE_ALT_DE =
  'Radiofrequenz-Microneedling bei FareWell in Nürnberg zur Hautstraffung und Hautverjüngung';
const HERO_IMAGE_ALT_EN =
  'Radiofrequency microneedling at FareWell in Nuremberg for skin firming and rejuvenation';

interface FaqJsonLdEntry {
  question: string;
  answer: string;
}

@Component({
  standalone: true,
  selector: 'app-microneedling-promotion',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './microneedling-promotion.component.html',
})
export class MicroneedlingPromotionComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'microneedling-promo-schema';

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
        value: this.t('RF', 'RF'),
        label: this.t('Radiofrequenz plus Microneedling kombiniert', 'radiofrequency plus microneedling combined'),
      },
      {
        value: '50%',
        label: this.t('Rabatt auf deine erste Behandlung', 'off your first treatment'),
      },
      {
        value: this.t('kurz', 'short'),
        label: this.t('Ausfallzeit nach der Behandlung', 'downtime after the treatment'),
      },
      {
        value: this.t('gratis', 'free'),
        label: this.t('Erstberatung mit Hautanalyse', 'initial consultation with skin analysis'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'angebot', label: this.t('Preise & Neukunden-Rabatt', 'Prices & new-client discount') },
      { id: 'wirkung', label: this.t('Wie es wirkt', 'How it works') },
      { id: 'anwendung', label: this.t('Wobei es hilft', 'What it helps with') },
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
          'Tut Radiofrequenz-Microneedling weh?',
          'Does radiofrequency microneedling hurt?'
        ),
        answer: this.t(
          'Dank betäubender Creme empfinden die meisten die Behandlung als gut aushaltbar, spürbar, aber nicht schmerzhaft. Wir stimmen Tiefe und Intensität individuell auf deine Haut und dein Empfinden ab.',
          'Thanks to a numbing cream, most people find the treatment easily tolerable, noticeable but not painful. We adjust depth and intensity individually to your skin and how you feel.'
        ),
      },
      {
        question: this.t('Wie lange ist die Ausfallzeit?', 'How long is the downtime?'),
        answer: this.t(
          'Meist ist die Haut nur für ein bis zwei Tage leicht gerötet, ähnlich wie ein leichter Sonnenbrand. Danach kannst du dein gewohntes Programm in der Regel wieder aufnehmen. Alle Pflegehinweise bekommst du von uns mit.',
          'Usually the skin is only slightly red for one to two days, similar to a mild sunburn. After that you can normally resume your usual routine. We give you all the aftercare tips you need.'
        ),
      },
      {
        question: this.t('Wie viele Sitzungen brauche ich?', 'How many sessions do I need?'),
        answer: this.t(
          'Für ein sichtbares, gleichmäßiges Ergebnis empfehlen wir meist eine kleine Serie von Sitzungen im Abstand von einigen Wochen, weil sich Kollagen erst nach und nach aufbaut. Wie viele genau, besprechen wir in der kostenlosen Erstberatung.',
          'For a visible, even result we usually recommend a small series of sessions a few weeks apart, because collagen only builds up gradually. Exactly how many we discuss in the free initial consultation.'
        ),
      },
      {
        question: this.t('Ab wann sieht man erste Ergebnisse?', 'When do first results become visible?'),
        answer: this.t(
          'Einen frischen Glow bemerken viele schon nach wenigen Tagen. Die eigentliche Straffung durch neues Kollagen entwickelt sich über die folgenden Wochen und baut sich mit jeder Sitzung weiter auf.',
          'Many notice a fresh glow after just a few days. The actual firming through new collagen develops over the following weeks and continues to build with each session.'
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
            'Radiofrequenz-Microneedling in Nürnberg',
            'Radiofrequency microneedling in Nuremberg'
          ),
          description: this.t(
            'Hautverjüngung mit Radiofrequenz-Microneedling bei FareWell in Nürnberg: strafft die Haut und verfeinert das Hautbild. 50% Rabatt auf die erste Behandlung für Neukund:innen mit dem Code ERSTEBEHANDLUNG.',
            'Skin rejuvenation with radiofrequency microneedling at FareWell in Nuremberg: firms the skin and refines the complexion. 50% off the first treatment for new clients with the code ERSTEBEHANDLUNG.'
          ),
          serviceType: this.t('Radiofrequenz-Microneedling', 'Radiofrequency microneedling'),
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
              '50% Rabatt auf die erste Microneedling-Behandlung',
              '50% off your first microneedling treatment'
            ),
            description: this.t(
              'Neukundenangebot für die erste Radiofrequenz-Microneedling Behandlung bei FareWell in Nürnberg. Code: ERSTEBEHANDLUNG.',
              'New-client offer for the first radiofrequency microneedling treatment at FareWell in Nuremberg. Code: ERSTEBEHANDLUNG.'
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
              name: this.t('Microneedling Aktion Nürnberg', 'Microneedling offer Nuremberg'),
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
