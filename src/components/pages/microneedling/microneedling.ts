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

const PAGE_PATH = '/behandlungen/microneedling-radiofrequenz';
const HERO_IMAGE = 'assets/images/treatment/microneedling2.webp';
const HERO_IMAGE_URL = `https://farewell.salon/${HERO_IMAGE}`;

const DE_TITLE = 'Microneedling Radiofrequenz Nürnberg | FareWell';
const EN_TITLE = 'RF Microneedling Nuremberg | FareWell';
const DE_DESCRIPTION =
  'Microneedling mit Radiofrequenz in Nürnberg: moderne Hautverjüngung, Faltenreduktion und Hautstraffung.';
const EN_DESCRIPTION =
  'Radiofrequency microneedling in Nuremberg: skin rejuvenation, scar treatment and firmer skin. Book online, free initial consultation in English.';
const HERO_ALT_DE =
  'FareWell Studio in Nürnberg für Microneedling mit Radiofrequenz zur Hautstraffung und Hautbildverbesserung';
const HERO_ALT_EN =
  'FareWell studio in Nuremberg for radiofrequency microneedling for skin firming and a better complexion';

interface FaqEntry {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-microneedling',
  standalone: true,
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './microneedling.html',
})
export class MicroneedlingComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'microneedling-schema';

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
        value: '3–6',
        label: this.t('Sitzungen für sichtbare Ergebnisse', 'sessions for visible results'),
      },
      {
        value: this.t('4–6 Wochen', '4–6 weeks'),
        label: this.t('Abstand zwischen den Sitzungen', 'between each session'),
      },
      {
        value: this.t('1–2 Tage', '1–2 days'),
        label: this.t('kurze Rötung als Ausfallzeit', 'short redness downtime'),
      },
      {
        value: this.t('Ohne OP', 'No surgery'),
        label: this.t('Straffung durch Kollagen-Boost', 'firming via collagen boost'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'grundlagen', label: this.t('Was ist RF-Microneedling?', 'What is RF microneedling?') },
      { id: 'wirkung', label: this.t('Wie wirkt es?', 'How it works') },
      { id: 'geeignet', label: this.t('Für wen ist es geeignet?', 'Who it is for') },
      { id: 'sicherheit', label: this.t('Nebenwirkungen & Ausfallzeit', 'Side effects & downtime') },
      { id: 'sitzungen', label: this.t('Wie viele Sitzungen?', 'How many sessions') },
      { id: 'vorbereitung', label: this.t('Wichtige Hinweise', 'Important notes') },
    ];
  }

  /**
   * Frage-Antwort-Paare als Klartext für das FAQPage-Schema, inhaltlich
   * deckungsgleich mit den (als Fragen formulierten) Abschnitten im Template.
   */
  private get faqEntries(): FaqEntry[] {
    return [
      {
        question: this.t(
          'Wie wirkt Microneedling mit Radiofrequenz?',
          'How does radiofrequency microneedling work?',
        ),
        answer: this.t(
          'Das Prinzip ist zweifach: Mikrokanäle durch feine Nadeln geben einen Impuls zur Regeneration, und Radiofrequenz-Wärme in der Tiefe stimuliert gezielt die Hautstruktur. So wird die Kollagen- und Elastinbildung angeregt. Die Ergebnisse bauen sich schrittweise über Wochen auf.',
          'The principle is twofold: micro-channels from fine needles trigger regeneration, and radiofrequency warmth deep in the skin targets and stimulates the skin structure. This boosts collagen and elastin formation. Results build up gradually over weeks.',
        ),
      },
      {
        question: this.t('Für wen ist RF-Microneedling geeignet?', 'Who is RF microneedling for?'),
        answer: this.t(
          'Besonders geeignet, wenn du die Haut straffen und glätten möchtest, das Hautbild bei Poren oder Texturunruhe verbessern willst oder bei Aknenarben Unterstützung suchst. Typische Zonen sind Wangen, Kinnlinie, Stirn, Hals und Dekolleté. Bei FareWell beraten wir vorab ehrlich, was für deine Haut realistisch ist.',
          'Especially suitable if you want to firm and smooth the skin, improve the complexion where you have enlarged pores or uneven texture, or want support with acne scars. Typical areas are the cheeks, jawline, forehead, neck and décolleté. At FareWell we give honest advice up front on what is realistic for your skin.',
        ),
      },
      {
        question: this.t(
          'Gibt es Nebenwirkungen oder Ausfallzeit?',
          'Are there side effects or downtime?',
        ),
        answer: this.t(
          'RF-Microneedling ist sehr gut steuerbar. Vorübergehende Reaktionen sind normal: Rötung (ähnlich Sonnenbrand) für einige Stunden bis 1–2 Tage, leichte Schwellung oder Wärmegefühl, gelegentlich Trockenheit oder feine Krüstchen. Mit sanfter Pflege, Feuchtigkeit und konsequentem SPF regeneriert sich die Haut optimal.',
          'RF microneedling is highly controllable. Temporary reactions are normal: redness (similar to sunburn) for a few hours up to one or two days, slight swelling or warmth, occasionally dryness or fine flaking. With gentle care, moisture and consistent SPF the skin regenerates beautifully.',
        ),
      },
      {
        question: this.t('Wie viele Sitzungen sind sinnvoll?', 'How many sessions make sense?'),
        answer: this.t(
          'Je nach Ziel (Poren, Narben, Straffung) sind häufig 3 bis 6 Sitzungen im Abstand von etwa 4 bis 6 Wochen sinnvoll. Die Haut braucht Zeit für die Kollagenneubildung; erste Effekte sind schneller sichtbar, die echte Verbesserung entwickelt sich über Wochen. Wir erstellen dir gern einen groben Behandlungsplan.',
          'Depending on your goal (pores, scars, firming), 3 to 6 sessions spaced about 4 to 6 weeks apart are often sensible. The skin needs time to form new collagen; first effects show sooner, but the real improvement develops over weeks. We are happy to put together a rough treatment plan.',
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
            'Microneedling mit Radiofrequenz in Nürnberg',
            'Radiofrequency microneedling in Nuremberg',
          ),
          description: this.t(
            'RF-Microneedling bei FareWell in Nürnberg zur Hautstraffung, Hautbildverbesserung sowie zur Unterstützung bei Poren, Aknenarben und unruhiger Hautstruktur.',
            'RF microneedling at FareWell in Nuremberg for skin firming, a better complexion and support with enlarged pores, acne scars and uneven skin texture.',
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
              name: this.t('Microneedling Radiofrequenz', 'RF Microneedling'),
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
