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

const PAGE_PATH = '/behandlungen/kavitation';
const HERO_IMAGE = 'assets/images/treatment/kavitation2.webp';
const HERO_IMAGE_URL = `https://farewell.salon/${HERO_IMAGE}`;

const DE_TITLE = 'Kavitation Fettabbau Nürnberg | FareWell';
const EN_TITLE = 'Ultrasound Cavitation & Body Forming Nuremberg | FareWell';
const DE_DESCRIPTION =
  'Ultraschall Kavitation in Nürnberg: nicht invasive Fettreduktion für Körperformung und Hautstraffung.';
const EN_DESCRIPTION =
  'Non-invasive ultrasound cavitation in Nuremberg for body contouring and skin firming. Free consultation, English spoken.';
const HERO_ALT_DE =
  'FareWell Studio in Nürnberg für Kavitation und nicht-invasive Ultraschall-Behandlungen zur Kontur';
const HERO_ALT_EN =
  'FareWell studio in Nuremberg for cavitation and non-invasive ultrasound contour treatments';

interface FaqEntry {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-kavitation',
  standalone: true,
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective, RouterLink],
  templateUrl: './kavitation.html',
})
export class KavitationComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly jsonLdId = 'kavitation-schema';

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
        value: '4–8',
        label: this.t('empfohlene Sitzungen', 'recommended sessions'),
      },
      {
        value: '1–2',
        label: this.t('Wochen Abstand zwischen Terminen', 'weeks between appointments'),
      },
      {
        value: '0',
        label: this.t('Ausfallzeit', 'downtime'),
      },
      {
        value: this.t('Ultraschall', 'Ultrasound'),
        label: this.t('nicht-invasive Methode', 'non-invasive method'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 'was', label: this.t('Was ist Kavitation?', 'What is cavitation?') },
      { id: 'wirkung', label: this.t('Wie es funktioniert', 'How it works') },
      { id: 'geeignet', label: this.t('Für wen geeignet?', "Who it's for") },
      { id: 'nebenwirkungen', label: this.t('Nebenwirkungen', 'Side effects') },
      { id: 'sitzungen', label: this.t('Wie viele Sitzungen?', 'How many sessions') },
      { id: 'hinweise', label: this.t('Vor & nach der Behandlung', 'Before & after') },
    ];
  }

  /**
   * Frage-Antwort-Paare als Klartext für das FAQPage-Schema, inhaltlich
   * deckungsgleich mit den (als Fragen formulierten) Abschnitten im Template.
   */
  private get faqEntries(): FaqEntry[] {
    return [
      {
        question: this.t('Was ist Kavitation?', 'What is cavitation?'),
        answer: this.t(
          'Kavitation ist eine nicht-invasive Behandlung, die mit Ultraschall arbeitet. Ziel ist es, die Körperkontur zu unterstützen und das Hautbild zu verbessern, sanft und angenehm, ganz ohne Nadeln oder OP. Beliebt ist sie als Body-Treatment für eine glattere Optik an Zonen, die trotz Sport und Ernährung hartnäckig wirken.',
          'Cavitation is a non-invasive treatment that works with ultrasound. The goal is to support your body contour and improve the look of your skin, gently and comfortably, with no needles or surgery. It is popular as a body treatment for a smoother look in areas that feel stubborn despite exercise and a balanced diet.',
        ),
      },
      {
        question: this.t('Wie funktioniert Kavitation?', 'How does cavitation work?'),
        answer: this.t(
          'Ultraschallwellen werden gezielt in das Gewebe abgegeben und erzeugen dort Mikro-Impulse, die den gewünschten Effekt unterstützen. Wichtig: Kavitation ist ein kosmetisches Verfahren und kein Ersatz für eine medizinische Therapie. Sie ist keine Abnehmbehandlung, kann aber im Rahmen eines gesunden Lebensstils die Kontur unterstützen.',
          'Ultrasound waves are directed precisely into the tissue, creating micro-impulses that support the desired effect. Important: cavitation is a cosmetic procedure and no replacement for medical therapy. It is not a weight-loss treatment, but as part of a healthy lifestyle it can support your contour.',
        ),
      },
      {
        question: this.t('Für wen ist Kavitation geeignet?', 'Who is cavitation right for?'),
        answer: this.t(
          'Kavitation eignet sich besonders, wenn du eine nicht-invasive Kontur-Unterstützung möchtest, die Hautoptik an bestimmten Zonen verbessern willst oder ein Treatment ohne Ausfallzeit bevorzugst. Häufige Zonen sind Bauch, Taille, Hüfte, Oberschenkel oder Po. Wir beraten dich ehrlich, ob Kavitation zu deinem Ziel passt oder ob eine andere Behandlung sinnvoller ist.',
          'Cavitation is especially suited to you if you want non-invasive contour support, want to improve how your skin looks in certain areas, or prefer a treatment with no downtime. Common areas are the belly, waist, hips, thighs or bottom. We advise you honestly on whether cavitation fits your goal or whether another treatment makes more sense.',
        ),
      },
      {
        question: this.t('Gibt es Nebenwirkungen?', 'Are there any side effects?'),
        answer: this.t(
          'Kavitation wird meist als sehr angenehm empfunden. Möglich sind nur leichte, vorübergehende Reaktionen: ein leichtes Wärmegefühl während oder kurz nach der Behandlung, gelegentlich eine milde Rötung und bei manchen ein leises Piepen im Ohr (ultraschallbedingt), das schnell wieder verschwindet. Wir arbeiten mit professionellen Einstellungen und geben klare Nachsorge-Hinweise, damit alles sicher und angenehm bleibt.',
          'Cavitation is usually experienced as very pleasant. Only mild, temporary reactions can occur: a slight feeling of warmth during or shortly after the treatment, occasionally a mild redness and, for some people, a soft ringing in the ear (caused by the ultrasound) that quickly fades again. We work with professional settings and give clear aftercare guidance, so everything stays safe and comfortable.',
        ),
      },
      {
        question: this.t('Wie viele Sitzungen sind sinnvoll?', 'How many sessions make sense?'),
        answer: this.t(
          'Je nach Ziel und Zone sind oft 4 bis 8 Sitzungen sinnvoll, mit einem Abstand von etwa 1 bis 2 Wochen. Der Effekt ist individuell und hängt auch davon ab, wie gut du die Behandlung durch Trinken, Bewegung und passende Pflege unterstützt.',
          'Depending on your goal and the area, 4 to 8 sessions often make sense, spaced about 1 to 2 weeks apart. The effect is individual and also depends on how well you support the treatment through drinking water, movement and suitable care.',
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
          name: this.t('Kavitation in Nürnberg', 'Cavitation in Nuremberg'),
          description: this.t(
            'Nicht-invasive Ultraschall-Behandlung zur Unterstützung der Körperkontur und Verbesserung des Hautbilds bei FareWell in Nürnberg. Kosmetisches Body-Treatment, keine Abnehmbehandlung.',
            'Non-invasive ultrasound treatment to support your body contour and improve the look of your skin at FareWell in Nuremberg. A cosmetic body treatment, not a weight-loss treatment.',
          ),
          serviceType: this.t('Kavitation', 'Cavitation'),
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
              name: this.t('Kavitation', 'Cavitation'),
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
