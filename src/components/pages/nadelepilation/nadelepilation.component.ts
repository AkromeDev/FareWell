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

const PAGE_PATH = '/behandlungen/nadelepilation';
const HERO_IMAGE = 'assets/images/treatment/nadel.jpg';
const HERO_IMAGE_URL = `https://farewell.salon/${HERO_IMAGE}`;

const DE_TITLE = 'Elektrolyse / Nadelepilation in Nürnberg | FareWell';
const EN_TITLE = 'Electrolysis (Nadelepilation) in Nuremberg | FareWell';
const DE_DESCRIPTION =
  'Professionelle Elektrolyse (Nadelepilation) in Nürnberg: die einzige wirklich permanente Haarentfernungsmethode.';
const EN_DESCRIPTION =
  'Professional electrolysis in Nuremberg: the only truly permanent hair removal method. Works on every hair colour and skin type. Free initial consultation in English.';
const HERO_ALT_DE =
  'Elektrolyse / Nadelepilation bei FareWell in Nürnberg: permanente Haarentfernung';
const HERO_ALT_EN =
  'Electrolysis (Nadelepilation) at FareWell in Nuremberg: permanent hair removal';

interface FaqEntry {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-nadelepilation',
  standalone: true,
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './nadelepilation.component.html',
})
export class NadelepilationComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'nadelepilation-schema';

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
        value: '60 %',
        label: this.t(
          'der sichtbaren Haare je Sitzung behandelbar (Anagen)',
          'of visible hairs treatable per session (anagen)',
        ),
      },
      {
        value: this.t('~10 Wochen', '~10 weeks'),
        label: this.t('empfohlener Abstand zwischen Terminen', 'recommended gap between appointments'),
      },
      {
        value: '1–4',
        label: this.t('Kosmetikerinnen gleichzeitig, 2–4× schneller', 'aestheticians at once, 2–4× faster'),
      },
      {
        value: this.t('Alle', 'All'),
        label: this.t('Haut- & Haartypen, auch hell, grau, rot', 'skin & hair types, incl. light, grey, red'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'funktion', label: this.t('Wie funktioniert die Elektrolyse?', 'How electrolysis works') },
      { id: 'sicherheit', label: this.t('Sanft & sicher', 'Gentle & safe') },
      { id: 'dauer', label: this.t('Wie lange dauert es?', 'How long it takes') },
      { id: 'vorbereitung', label: this.t('Vorbereitung & Nachsorge', 'Preparation & aftercare') },
    ];
  }

  /**
   * Frage-Antwort-Paare als Klartext für das FAQPage-Schema, inhaltlich
   * deckungsgleich mit den (als Fragen formulierten) Abschnitten im Template.
   */
  private get faqEntries(): FaqEntry[] {
    return [
      {
        question: this.t('Wie funktioniert die Elektrolyse?', 'How does electrolysis work?'),
        answer: this.t(
          'Eine feine Sonde wird in den Haarfollikel eingeführt, ohne die Haut zu durchdringen, und ein schwacher Stromimpuls verödet die Haarwurzel gezielt. Als einzige wissenschaftlich anerkannte Methode wirkt sie bei allen Haar- und Hauttypen, auch bei feinen, hellen, grauen oder roten Haaren, und zielt anders als Laser oder IPL auf die vollständige Zerstörung der Wachstumszellen ab, sodass das behandelte Haar nie wieder nachwächst.',
          'A fine probe is guided into the hair follicle without piercing the skin, and a mild electrical pulse precisely deactivates the hair root. As the only scientifically recognised method it works on all hair and skin types, including fine, light, grey or red hair, and unlike laser or IPL aims for complete destruction of the growth cells so the treated hair never grows back.',
        ),
      },
      {
        question: this.t('Gibt es Nebenwirkungen bei der Elektrolyse?', 'Are there any side effects with electrolysis?'),
        answer: this.t(
          'Es ist ein sehr sicheres, bewährtes Verfahren. Möglich sind nur leichte, vorübergehende Reaktionen: Rötungen oder leichte Schwellungen, ein Wärme- oder Spannungsgefühl und in seltenen Fällen kleine Krusten, die sich nach wenigen Tagen von selbst lösen. Die Effekte sind harmlos und klingen schnell ab; mit der richtigen Nachsorge bei FareWell regeneriert sich die Haut optimal.',
          'It is a very safe, well-proven procedure. Only mild, temporary reactions can occur: redness or slight swelling, a feeling of warmth or tightness, and in rare cases small crusts that fall away on their own after a few days. The effects are harmless and settle quickly; with the right aftercare at FareWell the skin regenerates beautifully.',
        ),
      },
      {
        question: this.t('Wie lange dauert eine Behandlung?', 'How long does a treatment take?'),
        answer: this.t(
          'Das hängt von Behandlungsareal, Haardichte und Körpergröße ab. Nur etwa 60 % der sichtbaren Haare sind gerade in der behandelbaren Anagenphase, daher empfehlen wir rund 10 Wochen Abstand zwischen den Terminen. Bei FareWell können 1 bis 4 Kosmetikerinnen gleichzeitig arbeiten, was die Sitzung um das Zwei- bis Vierfache verkürzt. Eine persönliche Einschätzung liefert unser Online-Zeit-Rechner.',
          'That depends on the treatment area, hair density and body size. Only about 60 % of visible hairs are in the treatable anagen phase at any time, so we recommend a gap of around 10 weeks between appointments. At FareWell 1 to 4 aestheticians can work at once, cutting the session by two to four times. Our online time calculator gives a personal estimate.',
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
            'Elektrolyse / Nadelepilation in Nürnberg',
            'Electrolysis (Nadelepilation) in Nuremberg',
          ),
          description: this.t(
            'Permanente Haarentfernung mit Elektrolyse (Nadelepilation) bei FareWell in Nürnberg, wirksam für alle Haut- und Haartypen.',
            'Permanent hair removal with electrolysis (Nadelepilation) at FareWell in Nuremberg, effective for all skin and hair types.',
          ),
          serviceType: this.t('Elektrolyse / Nadelepilation', 'Electrolysis (Nadelepilation)'),
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
              name: this.t('Nadelepilation', 'Electrolysis (Nadelepilation)'),
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
