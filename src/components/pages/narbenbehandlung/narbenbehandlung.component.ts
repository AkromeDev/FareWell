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

const PAGE_PATH = '/behandlungen/narbenbehandlung';
const HERO_IMAGE = 'assets/images/treatment/microneedling4.webp';
const HERO_IMAGE_URL = `https://farewell.salon/${HERO_IMAGE}`;

const DE_TITLE = 'Narbenbehandlung Nürnberg: Aknenarben & Dehnungsstreifen | FareWell';
const EN_TITLE = 'Scar Treatment Nuremberg: Acne Scars & Stretch Marks | FareWell';
const DE_DESCRIPTION =
  'Narbenbehandlung mit Radiofrequenz Microneedling in Nürnberg: Aknenarben, Narben nach OP und Verletzungen, Dehnungsstreifen. 250 € pro Sitzung, Beratung kostenlos.';
const EN_DESCRIPTION =
  'Scar treatment with RF microneedling in Nuremberg: acne scars, scars after surgery or injury, stretch marks. €250 per session, free consultation, English spoken.';
const HERO_ALT_DE =
  'Narbenbehandlung mit Radiofrequenz Microneedling bei FareWell in Nürnberg';
const HERO_ALT_EN =
  'Scar treatment with radio-frequency microneedling at FareWell in Nuremberg';

interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * Eigene Seite für die Narbenbehandlung. Technisch dasselbe Gerät wie beim
 * Radiofrequenz-Microneedling, inhaltlich aber ein eigener Anlass (Aknenarben,
 * Narben nach OP und Verletzungen, Dehnungsstreifen) und eine eigene
 * Salonkee-Leistung mit eigenem Preis, deshalb eine eigene URL.
 */
@Component({
  selector: 'app-narbenbehandlung',
  standalone: true,
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './narbenbehandlung.component.html',
})
export class NarbenbehandlungComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'narbenbehandlung-schema';

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
        value: '250 €',
        label: this.t('pro Sitzung, 60 Minuten', 'per session, 60 minutes'),
      },
      {
        value: '3–6',
        label: this.t('Sitzungen je nach Narbe', 'sessions depending on the scar'),
      },
      {
        value: this.t('4–6 Wochen', '4–6 weeks'),
        label: this.t('Abstand zwischen den Sitzungen', 'between each session'),
      },
      {
        value: this.t('Ohne OP', 'No surgery'),
        label: this.t('Umbau durch eigenes Kollagen', 'remodelling via your own collagen'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'was', label: this.t('Was die Behandlung macht', 'What the treatment does') },
      { id: 'narben', label: this.t('Welche Narben wir behandeln', 'Which scars we treat') },
      { id: 'ablauf', label: this.t('Ablauf & Betäubung', 'Process & numbing') },
      { id: 'sitzungen', label: this.t('Wie viele Sitzungen?', 'How many sessions') },
      { id: 'nachsorge', label: this.t('Nachsorge', 'Aftercare') },
      { id: 'grenzen', label: this.t('Grenzen & Kontraindikationen', 'Limits & contraindications') },
    ];
  }

  /**
   * Frage-Antwort-Paare als Klartext für das FAQPage-Schema, inhaltlich
   * deckungsgleich mit den Abschnitten im Template.
   */
  private get faqEntries(): FaqEntry[] {
    return [
      {
        question: this.t(
          'Was kostet eine Narbenbehandlung in Nürnberg?',
          'How much does a scar treatment cost in Nuremberg?',
        ),
        answer: this.t(
          'Die Narbenbehandlung mit Radiofrequenz Microneedling kostet bei FareWell in Nürnberg 250 € pro Sitzung (60 Minuten). Die Behandlungsvorbereitung mit Betäubungscreme kostet 20 €. Die Beratung vorab ist kostenlos.',
          'The scar treatment with radio-frequency microneedling at FareWell in Nuremberg costs €250 per session (60 minutes). Preparation with numbing cream costs €20. The consultation beforehand is free.',
        ),
      },
      {
        question: this.t(
          'Welche Narben lassen sich behandeln?',
          'Which scars can be treated?',
        ),
        answer: this.t(
          'Wir behandeln Aknenarben, Narben nach Operationen und Verletzungen sowie Dehnungsstreifen. Am besten sprechen eingesunkene, atrophe Narben und Dehnungsstreifen an. Wulstige Narben und Keloide gehören in ärztliche Hände, hier behandeln wir nicht.',
          'We treat acne scars, scars after surgery or injury and stretch marks. Sunken, atrophic scars and stretch marks respond best. Raised scars and keloids belong in medical hands, and we do not treat those.',
        ),
      },
      {
        question: this.t(
          'Verschwindet die Narbe komplett?',
          'Will the scar disappear completely?',
        ),
        answer: this.t(
          'Eine Narbe zu 100% wegzubekommen, kann niemand seriös versprechen. Eine deutliche Verbesserung ist nach einigen Sitzungen aber realistisch: Die Narbe wird weicher, flacher und in Farbe und Struktur gleichmäßiger, sodass sie viel weniger auffällt. Wie viel möglich ist, hängt vom Alter der Narbe, ihrer Art und ihrer Tiefe ab; frische Narben sprechen besser an als alte. Wir sagen dir vorher ehrlich, was zu erwarten ist.',
          'No one can seriously promise to remove a scar 100%. A clear improvement after a few sessions is realistic though: the scar becomes softer, flatter and more even in colour and texture, so it stands out far less. How much is possible depends on the age of the scar, its type and its depth; fresh scars respond better than old ones. We tell you honestly beforehand what to expect.',
        ),
      },
      {
        question: this.t(
          'Tut die Narbenbehandlung weh?',
          'Does the scar treatment hurt?',
        ),
        answer: this.t(
          'Die Behandlung ist spürbar, aber gut auszuhalten. Auf Wunsch tragen wir vorher eine Betäubungscreme auf, die etwa 15 Minuten einwirkt und 20 € kostet. Danach fühlt sich die Haut ein bis zwei Tage an wie ein leichter Sonnenbrand.',
          'The treatment is noticeable but manageable. On request we apply a numbing cream beforehand, which takes about 15 minutes to work and costs €20. Afterwards the skin feels like mild sunburn for one to two days.',
        ),
      },
      {
        question: this.t(
          'Wie viele Sitzungen braucht eine Narbe?',
          'How many sessions does a scar need?',
        ),
        answer: this.t(
          'Je nach Narbe sind meist 3 bis 6 Sitzungen im Abstand von 4 bis 6 Wochen sinnvoll. Der Umbau des Gewebes läuft über Monate weiter, das Ergebnis entwickelt sich also auch nach der letzten Sitzung noch.',
          'Depending on the scar, 3 to 6 sessions spaced 4 to 6 weeks apart usually make sense. The remodelling of the tissue continues over months, so the result keeps developing even after the last session.',
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
            'Narbenbehandlung mit Radiofrequenz Microneedling in Nürnberg',
            'Scar treatment with radio-frequency microneedling in Nuremberg',
          ),
          description: this.t(
            'Narbenbehandlung bei FareWell in Nürnberg: Aknenarben, Narben nach Operationen und Verletzungen sowie Dehnungsstreifen, behandelt mit Radiofrequenz Microneedling.',
            'Scar treatment at FareWell in Nuremberg: acne scars, scars after surgery or injury and stretch marks, treated with radio-frequency microneedling.',
          ),
          serviceType: this.t('Narbenbehandlung', 'Scar treatment'),
          areaServed: { '@type': 'City', name: this.t('Nürnberg', 'Nuremberg') },
          provider: {
            '@type': 'BeautySalon',
            '@id': 'https://farewell.salon/#organization',
            name: 'FareWell – Kosmetikstudio & dauerhafte Haarentfernung',
            alternateName: 'FareWell',
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
            name: this.t('Narbenbehandlung, 60 Minuten', 'Scar treatment, 60 minutes'),
            price: 250,
            priceCurrency: 'EUR',
            url: `https://farewell.salon${isEn ? '/en' : ''}/price#narbenbehandlung`,
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: 250,
              priceCurrency: 'EUR',
              valueAddedTaxIncluded: true,
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
              name: this.t('Narbenbehandlung', 'Scar treatment'),
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
