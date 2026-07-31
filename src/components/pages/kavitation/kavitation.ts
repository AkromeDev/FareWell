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

const DE_TITLE = 'Body Forming Nürnberg: Ultraschall Kavitation & Cellulite | FareWell';
const EN_TITLE = 'Body Forming Nuremberg: Ultrasound Cavitation & Cellulite | FareWell';
const DE_DESCRIPTION =
  'Kosmetisches Body Forming in Nürnberg mit Ultraschall Kavitation und Radiofrequenz: Cellulite Behandlung und lokale Zonen, ab 80 €. Keine Abnehmbehandlung.';
const EN_DESCRIPTION =
  'Cosmetic body forming in Nuremberg with ultrasound cavitation and radio frequency: cellulite treatment and local areas, from €80. Not a weight-loss treatment.';
const HERO_ALT_DE =
  'FareWell Studio in Nürnberg für Body Forming mit Ultraschall Kavitation und Radiofrequenz';
const HERO_ALT_EN =
  'FareWell studio in Nuremberg for body forming with ultrasound cavitation and radio frequency';

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
        value: '5–10',
        label: this.t('empfohlene Sitzungen', 'recommended sessions'),
      },
      {
        value: '2–4',
        label: this.t('Tage Abstand zwischen Terminen', 'days between appointments'),
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
      { id: 'was', label: this.t('Was ist Body Forming?', 'What is body forming?') },
      { id: 'wirkung', label: this.t('Wie es funktioniert', 'How it works') },
      { id: 'cellulite', label: this.t('Cellulite Behandlung', 'Cellulite treatment') },
      { id: 'geeignet', label: this.t('Für wen geeignet?', "Who it's for") },
      { id: 'grenzen', label: this.t('Grenzen & Nebenwirkungen', 'Limits & side effects') },
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
        question: this.t('Was ist Body Forming?', 'What is body forming?'),
        answer: this.t(
          'Body Forming bündelt bei FareWell zwei kosmetische Körperbehandlungen mit Ultraschall Kavitation und Radiofrequenz: die Behandlung lokaler Zonen und die Cellulite Behandlung. Beide arbeiten nicht-invasiv, ohne Nadeln und ohne OP. Es ist eine kosmetische Anwendung, keine medizinische Maßnahme und keine Abnehmbehandlung.',
          'At FareWell, body forming covers two cosmetic body treatments with ultrasound cavitation and radio frequency: the treatment of local areas and the cellulite treatment. Both work non-invasively, without needles and without surgery. It is a cosmetic application, not a medical procedure and not a weight-loss treatment.',
        ),
      },
      {
        question: this.t('Wie funktioniert Body Forming?', 'How does body forming work?'),
        answer: this.t(
          'Ultraschallwellen werden gezielt in das Gewebe abgegeben und erzeugen dort Mikro-Impulse; die Radiofrequenz erwärmt das Gewebe zusätzlich. Am deutlichsten zeigt sich das am Bauch: Direkt nach einer Sitzung von 60 Minuten messen wir dort meist 1 bis 3 Zentimeter weniger Umfang. Das gelöste Fett ist danach im Blut unterwegs, deshalb solltest du viel trinken und dich nach dem Termin leicht bewegen. Es bleibt ein kosmetisches Verfahren und kein Ersatz für eine medizinische Therapie, und es ist keine Behandlung zur Gewichtsabnahme.',
          'Ultrasound waves are directed precisely into the tissue, creating micro-impulses; the radio frequency additionally warms the tissue. This shows most clearly on the stomach: directly after a 60-minute session we usually measure 1 to 3 centimetres less circumference there. The released fat then travels in your bloodstream, so drink plenty and get some light movement after your appointment. It remains a cosmetic procedure and no replacement for medical therapy, and it is not a weight-loss treatment.',
        ),
      },
      {
        question: this.t('Für wen ist Body Forming geeignet?', 'Who is body forming right for?'),
        answer: this.t(
          'Body Forming passt, wenn du eine nicht-invasive kosmetische Körperbehandlung ohne Ausfallzeit möchtest. Häufige Zonen sind Bauch, Taille, Hüfte, Oberschenkel, Gesäß und Oberarme. Ob es für dich infrage kommt, klären wir vorher persönlich, gegebenenfalls mit ärztlicher Abklärung. Wenn eine andere Behandlung sinnvoller ist oder gar keine, sagen wir das auch.',
          'Body forming is a fit if you want a non-invasive cosmetic body treatment with no downtime. Common areas are the stomach, waist, hips, thighs, buttocks and upper arms. Whether it is an option for you is something we clarify in person beforehand, if necessary with a medical assessment. If another treatment makes more sense, or none at all, we say so too.',
        ),
      },
      {
        question: this.t('Gibt es Nebenwirkungen?', 'Are there any side effects?'),
        answer: this.t(
          'Body Forming wird meist als sehr angenehm empfunden. Möglich sind nur leichte, vorübergehende Reaktionen: ein leichtes Wärmegefühl während oder kurz nach der Behandlung, gelegentlich eine milde Rötung und bei manchen ein leises Piepen im Ohr (ultraschallbedingt), das schnell wieder verschwindet. Wir arbeiten mit professionellen Einstellungen und geben klare Nachsorge-Hinweise, damit alles sicher und angenehm bleibt.',
          'Cavitation is usually experienced as very pleasant. Only mild, temporary reactions can occur: a slight feeling of warmth during or shortly after the treatment, occasionally a mild redness and, for some people, a soft ringing in the ear (caused by the ultrasound) that quickly fades again. We work with professional settings and give clear aftercare guidance, so everything stays safe and comfortable.',
        ),
      },
      {
        question: this.t('Wie viele Sitzungen sind sinnvoll?', 'How many sessions make sense?'),
        answer: this.t(
          'Je nach Ziel und Zone sind oft 5 bis 10 Sitzungen sinnvoll, mit einem Abstand von etwa 2 bis 4 Tagen. Wie stark der Effekt ausfällt, hängt auch davon ab, wie gut du die Behandlung unterstützt: viel trinken, leichte Bewegung und idealerweise ein leichtes Kaloriendefizit, damit dein Körper das freigesetzte Fett verbraucht.',
          'Depending on your goal and the area, 5 to 10 sessions often make sense, spaced about 2 to 4 days apart. How strong the effect is also depends on how well you support the treatment: drink plenty, get light movement and ideally keep a slight calorie deficit, so your body uses the released fat.',
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
          name: this.t('Body Forming in Nürnberg', 'Body forming in Nuremberg'),
          description: this.t(
            'Kosmetische Körperbehandlung mit Ultraschall Kavitation und Radiofrequenz bei FareWell in Nürnberg, inklusive Cellulite Behandlung. Keine medizinische Maßnahme und keine Abnehmbehandlung.',
            'Cosmetic body treatment with ultrasound cavitation and radio frequency at FareWell in Nuremberg, including the cellulite treatment. Not a medical procedure and not a weight-loss treatment.',
          ),
          serviceType: this.t('Body Forming', 'Body forming'),
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
              name: this.t('Body Forming', 'Body forming'),
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
