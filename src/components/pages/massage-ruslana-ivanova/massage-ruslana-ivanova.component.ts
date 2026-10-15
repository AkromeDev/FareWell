import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { ScrollToDirective } from 'src/directives/scroll-to.directive';
import { Lang, LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';

const PAGE_PATH = '/behandlungen/massage-ruslana-ivanova';
const ORIGIN = 'https://farewell.salon';
/**
 * Noch kein Porträt. Sobald eines da ist: auf 4:5 zuschneiden (720x900),
 * als assets/images/team/ruslana-ivanova.webp ablegen und hier eintragen;
 * bis dahin zeigt der Bogenrahmen ihre Initialen.
 */
const PORTRAIT: string | null = null;
const INITIALS = 'RI';
// Vorschaubild beim Teilen: das Massagebild der Wellness-Seite, bis es ein eigenes gibt.
const OG_IMAGE = `${ORIGIN}/assets/images/treatment/massage-hero.jpg`;
const PHONE_HREF = 'tel:+4915757995694';
const PHONE_LABEL = '+49 157 5799 5694';
/**
 * Solange Ruslanas Massagen nicht in Salonkee angelegt sind, läuft die Anfrage
 * per Mail an das Studio. Danach: Salonkee-Deeplink hier eintragen und die
 * beiden Termin-CTAs im Template auf target="_blank" umstellen.
 */
const CONTACT_EMAIL = 'info@farewell.salon';

/** Erstes Jahr der Zeitachse (rund um den Studienbeginn, auf eine runde Jahreszahl gelegt). */
const AXIS_START = 2000;
/** Abstand der Jahresmarken auf der Zeitachse in Jahren. */
const TICK_STEP = 5;

const DE_TITLE = 'Massage in Nürnberg: Ruslana Ivanova bei FareWell';
const EN_TITLE = 'Massage in Nuremberg: Ruslana Ivanova at FareWell';
const DE_DESCRIPTION =
  'Rücken-, Ganzkörper-, Anti-Cellulite-, Honig-, Schröpf- und Gesichtsmassage bei FareWell in Nürnberg mit Ruslana Ivanova: Masseurin seit 2018, fünf Massagezertifikate für Gesicht und Körper.';
const EN_DESCRIPTION =
  'Back, full-body, anti-cellulite, honey, cupping and facial massage at FareWell in Nuremberg with Ruslana Ivanova: massage therapist since 2018, five massage certificates for face and body.';

/** Zweisprachiger Text. Beide Fassungen stehen im DOM, das globale CSS blendet eine aus. */
export interface Bi {
  de: string;
  en: string;
}

export type StationKind = 'massage' | 'beruf' | 'ausbildung' | 'zertifikat';

interface YearMonth {
  y: number;
  /** null = Monat unbekannt, angezeigt wird nur das Jahr. */
  m: number | null;
}

/** Eine Station des Wegs, Quelle: Lebenslauf und Zertifikate (Personalordner). */
interface Station {
  kind: StationKind;
  from: YearMonth;
  /** null = bis heute. */
  to: YearMonth | null;
  place: Bi;
  role: Bi;
}

/** Station plus berechnete Lage auf der Zeitachse (Prozent der Achsenbreite). */
export interface TimelineRow extends Station {
  when: Bi;
  kindLabel: Bi;
  left: number;
  width: number;
}

/**
 * Eine Zeile des Angebots. Preis und Dauer sind optional: solange Ruslana sie
 * nicht genannt hat, steht dort „Preis folgt“.
 */
interface TreatmentItem {
  name: Bi;
  /** Startpreis in Euro; leer, solange keine Preisliste vorliegt. */
  priceFrom?: number;
  /** Dauer in Minuten; leer, solange nicht bekannt. */
  minutes?: number;
  /** Kleingedrucktes unter dem Namen. */
  detail?: Bi;
}

interface TreatmentGroup {
  id: string;
  num: string;
  title: Bi;
  blurb: Bi;
  /** Volle Breite im Raster, mit zweispaltiger Liste. */
  wide?: boolean;
  items: TreatmentItem[];
}

/** Zeile mit fertig formatiertem Preis für das Template. */
export interface PricedItem extends TreatmentItem {
  price: Bi;
}

export interface PricedGroup extends Omit<TreatmentGroup, 'items'> {
  items: PricedItem[];
}

interface Stat {
  value: Bi;
  label: Bi;
}

interface CertGroup {
  title: Bi;
  items: Bi[];
}

interface FaqEntry {
  q: Bi;
  a: Bi;
}

const KIND_LABEL: Record<StationKind, Bi> = {
  massage: { de: 'Massage', en: 'Massage' },
  beruf: { de: 'Beruf vor der Massage', en: 'Work before massage' },
  ausbildung: { de: 'Studium', en: 'Studies' },
  zertifikat: { de: 'Zertifikat', en: 'Certificate' },
};

/**
 * Weg laut Lebenslauf und den fünf Zertifikaten im Personalordner. Die beiden
 * Zertifikate von „Partner Plus“ tragen nur „Kyiv 2026“, ohne Tag und Monat.
 * Geburtsdatum und Geburtsort stehen bewusst nicht auf der Seite.
 */
const STATIONS: Station[] = [
  {
    kind: 'ausbildung',
    from: { y: 2001, m: 9 },
    to: { y: 2007, m: 6 },
    place: {
      de: 'Wirtschafts- und Geisteswissenschaftliches Institut Kramatorsk',
      en: 'Institute of Economics and Humanities, Kramatorsk',
    },
    role: { de: 'Studium Finanzen, Fachhochschulabschluss', en: 'Finance studies, degree' },
  },
  {
    kind: 'beruf',
    from: { y: 2009, m: 9 },
    to: { y: 2021, m: 12 },
    place: { de: 'Großhandel, Ukraine', en: 'Wholesale company, Ukraine' },
    role: { de: 'Buchhalterin', en: 'Accountant' },
  },
  {
    kind: 'beruf',
    from: { y: 2016, m: 1 },
    to: { y: 2019, m: 12 },
    place: { de: 'Behandlungs- und Diagnosezentrum, Ukraine', en: 'Treatment and diagnostic centre, Ukraine' },
    role: {
      de: 'Patientenberatung und Verwaltung',
      en: 'Patient advice and administration',
    },
  },
  {
    kind: 'massage',
    from: { y: 2018, m: 1 },
    to: { y: 2021, m: 12 },
    place: { de: 'Selbständig, Ukraine', en: 'Self-employed, Ukraine' },
    role: { de: 'Massage für eigene Kundinnen und Kunden', en: 'Massage for her own clients' },
  },
  {
    kind: 'zertifikat',
    from: { y: 2023, m: 9 },
    to: null,
    place: { de: 'Kosmetikstudio Elona Gerzen', en: 'Kosmetikstudio Elona Gerzen' },
    role: { de: 'Ausbildung zur Wellness-Masseurin', en: 'Training as a wellness massage therapist' },
  },
  {
    kind: 'massage',
    from: { y: 2025, m: 1 },
    to: null,
    place: { de: 'Selbständig, Deutschland', en: 'Self-employed, Germany' },
    role: { de: 'Massage, Beratung und eigene Terminplanung', en: 'Massage, advice and her own bookings' },
  },
  {
    kind: 'zertifikat',
    from: { y: 2025, m: 10 },
    to: null,
    place: { de: 'GOGOSCHOOL', en: 'GOGOSCHOOL' },
    role: {
      de: 'Lifting-Gesichtsmassage und modellierende Körpermassage',
      en: 'Lifting facial massage and sculpting body massage',
    },
  },
  {
    kind: 'zertifikat',
    from: { y: 2026, m: null },
    to: null,
    place: { de: 'Akademie „Partner Plus“, Kyjiw', en: 'Partner Plus Academy, Kyiv' },
    role: { de: 'Sportmassage und Bukkalmassage', en: 'Sports massage and buccal massage' },
  },
];

const STATS: Stat[] = [
  {
    value: { de: 'seit 2018', en: 'since 2018' },
    label: { de: 'Massage, erst in der Ukraine, seit 2025 in Deutschland', en: 'Massage, first in Ukraine, in Germany since 2025' },
  },
  {
    value: { de: '5', en: '5' },
    label: { de: 'Massagezertifikate, 2023 bis 2026', en: 'Massage certificates, 2023 to 2026' },
  },
  {
    value: { de: 'Gesicht', en: 'Face' },
    label: { de: 'Gesichtsmassage, zertifiziert in Lifting- und Bukkalmassage', en: 'Facial massage, certified in lifting and buccal massage' },
  },
  {
    value: { de: 'Körper', en: 'Body' },
    label: { de: 'Rücken, Ganzkörper, Anti-Cellulite, Honig und Schröpfen', en: 'Back, full body, anti-cellulite, honey and cupping' },
  },
];

const CERTS: CertGroup[] = [
  {
    title: { de: 'Körper', en: 'Body' },
    items: [
      {
        de: 'Wellness-Masseurin, Kosmetikstudio Elona Gerzen, 03.09.2023',
        en: 'Wellness massage therapist, Kosmetikstudio Elona Gerzen, 3 September 2023',
      },
      {
        de: 'Sportmassage, Akademie „Partner Plus“, Kyjiw, 2026',
        en: 'Sports massage, Partner Plus Academy, Kyiv, 2026',
      },
      {
        de: 'Modellierende Körpermassage (Sculpting Body Massage), GOGOSCHOOL, 29.10.2025',
        en: 'Sculpting body massage, GOGOSCHOOL, 29 October 2025',
      },
    ],
  },
  {
    title: { de: 'Gesicht', en: 'Face' },
    items: [
      {
        de: 'Lifting-Gesichtsmassage, GOGOSCHOOL, 29.10.2025',
        en: 'Lifting facial massage, GOGOSCHOOL, 29 October 2025',
      },
      {
        de: 'Bukkalmassage, Akademie „Partner Plus“, Kyjiw, 2026',
        en: 'Buccal massage, Partner Plus Academy, Kyiv, 2026',
      },
    ],
  },
];

/**
 * Ihre Massagen, wie sie sie Joé genannt hat (WhatsApp, Oktober 2026): Rücken,
 * Ganzkörper, Anti-Cellulite, Honig, Schröpfen, Gesicht. Gruppen und
 * Einordnungssätze stammen von uns. Dauer und Preis fehlen noch; bis dahin
 * rendert jede Zeile „Preis folgt“.
 */
const TREATMENT_GROUPS: TreatmentGroup[] = [
  {
    id: 'entspannung',
    num: '01',
    title: { de: 'Entspannung', en: 'Relaxation' },
    blurb: {
      de: 'Ruhige, fließende Griffe zum Abschalten: gezielt für Rücken, Schultern und Nacken oder als Massage für den ganzen Körper.',
      en: 'Calm, flowing strokes to switch off: focused on back, shoulders and neck, or as a massage for the whole body.',
    },
    items: [
      { name: { de: 'Rückenmassage', en: 'Back massage' } },
      { name: { de: 'Ganzkörpermassage', en: 'Full-body massage' } },
    ],
  },
  {
    id: 'koerper',
    num: '02',
    title: { de: 'Intensive Körpermassagen', en: 'Intensive body massages' },
    blurb: {
      de: 'Kräftige Techniken, die das Gewebe durchkneten, mit Honig oder mit Schröpfgläsern. Ein Wohlfühlprogramm für Körper und Haut, kein Abnehmprogramm.',
      en: 'Firm techniques that knead the tissue, with honey or with cupping glasses. A feel-good programme for body and skin, not a weight-loss programme.',
    },
    items: [
      { name: { de: 'Anti-Cellulite-Massage', en: 'Anti-cellulite massage' } },
      {
        name: { de: 'Honigmassage', en: 'Honey massage' },
        detail: { de: 'mit Honig, der beim Abheben der Hände ansaugt', en: 'with honey that creates suction as the hands lift off' },
      },
      {
        name: { de: 'Schröpfmassage', en: 'Cupping massage' },
        detail: { de: 'mit Schröpfgläsern, die über die Haut gleiten', en: 'with cupping glasses gliding over the skin' },
      },
    ],
  },
  {
    id: 'gesicht',
    num: '03',
    title: { de: 'Gesichtsmassage', en: 'Facial massage' },
    blurb: {
      de: 'Die Hände lockern die Gesichtsmuskulatur, die beim Kauen, Sprechen und Anspannen ständig arbeitet. Das Gesicht wirkt danach entspannter und frischer.',
      en: 'The hands loosen the facial muscles that work constantly when chewing, talking and tensing. Afterwards the face looks more relaxed and fresher.',
    },
    items: [{ name: { de: 'Gesichtsmassage', en: 'Facial massage' } }],
  },
];

const FAQ: FaqEntry[] = [
  {
    q: { de: 'Wer massiert?', en: 'Who gives the massage?' },
    a: {
      de: 'Ruslana Ivanova selbst. Sie massiert seit 2018, erst in der Ukraine und seit 2025 selbständig in Deutschland, und hat fünf Massagezertifikate für Gesicht und Körper.',
      en: 'Ruslana Ivanova herself. She has been giving massages since 2018, first in Ukraine and since 2025 self-employed in Germany, and holds five massage certificates for face and body.',
    },
  },
  {
    q: { de: 'Was ist eine Honig- oder Schröpfmassage?', en: 'What is a honey or cupping massage?' },
    a: {
      de: 'Bei der Honigmassage wird Honig auf die Haut gegeben. Die Hände werden immer wieder aufgelegt und abgehoben, dabei entsteht ein leichter Sog. Bei der Schröpfmassage gleiten Gläser mit Unterdruck über die Haut. Beide sind intensiv, und nach dem Schröpfen sind rote Stellen auf der Haut normal, sie verschwinden nach einigen Tagen.',
      en: 'In a honey massage, honey is applied to the skin. The hands are placed and lifted again and again, which creates a light suction. In a cupping massage, glasses under suction glide over the skin. Both are intense, and red marks after cupping are normal; they fade after a few days.',
    },
  },
  {
    q: { de: 'Ist das eine medizinische Behandlung?', en: 'Is this a medical treatment?' },
    a: {
      de: 'Nein. Alle Massagen auf dieser Seite sind Wellnessanwendungen. Sie ersetzen keine ärztliche oder physiotherapeutische Behandlung. Bei Beschwerden, die dich beunruhigen, geh bitte zuerst zur Ärztin oder zum Arzt.',
      en: 'No. All massages on this page are wellness treatments. They do not replace medical or physiotherapy treatment. If you have symptoms that worry you, please see a doctor first.',
    },
  },
  {
    q: { de: 'Wann sollte ich nicht massiert werden?', en: 'When should I not have a massage?' },
    a: {
      de: 'Bei Fieber, akuten Entzündungen, frischen Verletzungen oder offenen Hautstellen im Massagebereich, und bei einer Honigallergie keine Honigmassage. Wer Blutverdünner nimmt, sagt es vor dem Schröpfen. Für die Gesichtsmassage gilt außerdem: Hattest du kürzlich Botulinumtoxin oder Filler im Gesicht, sag es vorher, dann wird gemeinsam entschieden, ab wann massiert werden kann. Das gilt auch in der Schwangerschaft und bei Erkrankungen, die dir dazu einfallen.',
      en: 'With a fever, acute inflammation, fresh injuries or broken skin in the area, and no honey massage with a honey allergy. If you take blood thinners, say so before cupping. For facial massage also: if you recently had botulinum toxin or fillers in your face, mention it beforehand, and you will decide together when massage is fine again. The same goes for pregnancy and any condition you think might matter.',
    },
  },
  {
    q: { de: 'Was kostet eine Massage?', en: 'What does a massage cost?' },
    a: {
      de: 'Die Preise und Dauern für Ruslanas Massagen werden gerade festgelegt und erscheinen hier, sobald sie feststehen. Bis dahin nennen wir dir den Preis gern auf Anfrage.',
      en: "Prices and durations for Ruslana's massages are being set right now and will appear here once they are final. Until then we are happy to tell you the price on request.",
    },
  },
  {
    q: { de: 'Wie vereinbare ich einen Termin?', en: 'How do I book an appointment?' },
    a: {
      de: 'Schreib uns kurz per E-Mail oder ruf an. Wir stimmen einen Termin mit Ruslana bei FareWell ab, Frauentorgraben 5, zwei Minuten vom Hauptbahnhof.',
      en: 'Send us a short email or call. We arrange an appointment with Ruslana at FareWell, Frauentorgraben 5, two minutes from the main station.',
    },
  },
];

function fmt(ym: YearMonth): string {
  return ym.m === null ? String(ym.y) : `${String(ym.m).padStart(2, '0')}/${ym.y}`;
}

/** „ab 60 €, 60 Min.“ bzw. „Preis folgt“, solange keine Preisliste vorliegt. */
function priceLabel(item: TreatmentItem): Bi {
  if (item.priceFrom === undefined) {
    return { de: 'Preis folgt', en: 'price to follow' };
  }
  const minutes = item.minutes ? { de: `, ${item.minutes} Min.`, en: `, ${item.minutes} min` } : { de: '', en: '' };
  return {
    de: `ab ${item.priceFrom} €${minutes.de}`,
    en: `from €${item.priceFrom}${minutes.en}`,
  };
}

const PRICED_GROUPS: PricedGroup[] = TREATMENT_GROUPS.map((group) => ({
  ...group,
  items: group.items.map((item) => ({ ...item, price: priceLabel(item) })),
}));

/**
 * Seite für Ruslana Ivanova, Masseurin, als mögliche Kooperationspartnerin
 * für Massagen bei FareWell. Aufbau wie die Seite der ästhetischen Medizin:
 * Porträt, belegbare Zahlen, der Weg als Zeitstrahl, Zertifikate, dann das
 * Angebot.
 *
 * Status: versteckte Vorschau für sie selbst (15.10.2026). Deshalb noindex,
 * nicht in der Sitemap, nicht im Header, Footer oder in llms.txt verlinkt.
 * Vor der Freischaltung gehören Vertrag, Porträt, ihr bestätigtes Angebot und
 * die Preisliste mit Dauer auf den Tisch, siehe Personalordner.
 *
 * Der Zeitstrahl ist eine semantische Liste (jede Station mit Zeitraum, Ort,
 * Rolle und Art als Text); die Balken sind reine Dekoration (aria-hidden), auf
 * schmalen Bildschirmen werden sie zu einem vertikalen Zeitstrahl. Farbe trägt
 * dort nie allein die Bedeutung: Massage gefüllt, Beruf gedämpft, Studium nur
 * umrandet, Zertifikat als Raute, und jede Zeile nennt ihre Art im Text.
 */
@Component({
  selector: 'app-massage-ruslana-ivanova',
  standalone: true,
  imports: [RevealOnScrollDirective, ScrollToDirective],
  templateUrl: './massage-ruslana-ivanova.component.html',
  styleUrls: ['./massage-ruslana-ivanova.component.scss'],
})
export class MassageRuslanaIvanovaComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly jsonLdId = 'massage-ruslana-ivanova-schema';

  readonly portrait = PORTRAIT;
  readonly initials = INITIALS;
  readonly phoneHref = PHONE_HREF;
  readonly phoneLabel = PHONE_LABEL;
  readonly stats = STATS;
  readonly certs = CERTS;
  readonly groups = PRICED_GROUPS;
  readonly faq = FAQ;

  /**
   * Letztes Jahr der Achse: mindestens 2027, sonst das kommende Jahr, damit
   * laufende Stationen („heute“) nie hinter dem Achsenende liegen.
   */
  private readonly axisEnd = Math.max(2027, new Date().getFullYear() + 1);
  readonly timeline: TimelineRow[] = STATIONS.map((station) => this.toRow(station));
  readonly ticks = this.buildTicks();
  /** Abstand der Jahreslinien in Prozent der Achse, für das Raster der Spuren. */
  readonly tickPeriod = `${(TICK_STEP / (this.axisEnd - AXIS_START)) * 100}%`;

  get lang(): Lang {
    return this.language.lang();
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  get mailHref(): string {
    const subject = this.t('Massage mit Ruslana', 'Massage with Ruslana');
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
  }

  /** Lead-Ereignis wie bei den Buchungs-Buttons der Startseite; die Mail öffnet normal weiter. */
  trackLead(location: string): void {
    if (!this.isBrowser || typeof window.gtag !== 'function') return;
    window.gtag('event', 'generate_lead', {
      event_category: 'engagement',
      event_label: 'Massage Ruslana Ivanova',
      location,
      destination: 'mail',
    });
  }

  ngOnInit(): void {
    const isEn = this.language.lang() === 'en';
    const prefix = this.language.prefix();
    const pageUrl = `${ORIGIN}${prefix}${PAGE_PATH}`;
    const homeUrl = `${ORIGIN}${prefix}`;
    const title = this.t(DE_TITLE, EN_TITLE);
    const description = this.t(DE_DESCRIPTION, EN_DESCRIPTION);
    const inLanguage = this.language.lang();

    this.seo.setPageSeo({
      title,
      description,
      path: PAGE_PATH,
      image: OG_IMAGE,
      imageAlt: this.t('Massage bei FareWell in Nürnberg', 'A massage at FareWell in Nuremberg'),
      largeImage: true,
      // Vorschau für Ruslana; wird erst mit Vertrag, Porträt und Preisliste indexierbar.
      noindex: true,
    });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': `${pageUrl}#person`,
          name: 'Ruslana Ivanova',
          givenName: 'Ruslana',
          familyName: 'Ivanova',
          jobTitle: this.t('Masseurin', 'Massage therapist'),
          ...(PORTRAIT ? { image: `${ORIGIN}/${PORTRAIT}` } : {}),
          url: pageUrl,
          description,
          knowsAbout: TREATMENT_GROUPS.map((group) => (isEn ? group.title.en : group.title.de)),
          hasCredential: CERTS.flatMap((group) => group.items).map((item) => ({
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: isEn ? item.en : item.de,
          })),
          workLocation: {
            '@type': 'Place',
            name: 'FareWell',
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
          inLanguage,
          isPartOf: { '@id': `${ORIGIN}/#website` },
          about: { '@id': `${pageUrl}#person` },
        },
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          inLanguage,
          mainEntity: FAQ.map((entry) => ({
            '@type': 'Question',
            name: isEn ? entry.q.en : entry.q.de,
            acceptedAnswer: { '@type': 'Answer', text: isEn ? entry.a.en : entry.a.de },
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
              item: `${ORIGIN}${prefix}/behandlungen`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: this.t('Massage mit Ruslana Ivanova', 'Massage with Ruslana Ivanova'),
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

  private toRow(station: Station): TimelineRow {
    const span = this.axisEnd - AXIS_START;
    const start = station.from.y + ((station.from.m ?? 1) - 1) / 12;
    // Das Ende schließt den letzten Monat ein; laufende Stationen reichen bis zum Achsenende.
    // Zertifikate sind Zeitpunkte: ihre Breite zählt nicht, sie werden als Raute gezeichnet.
    const end = station.to ? station.to.y + (station.to.m ?? 12) / 12 : this.axisEnd;
    const left = ((start - AXIS_START) / span) * 100;
    // Mindestbreite, damit auch eine kurze Station als Balken sichtbar bleibt.
    const width = Math.min(Math.max(((end - start) / span) * 100, 1.2), 100 - left);

    return { ...station, when: this.when(station), kindLabel: KIND_LABEL[station.kind], left, width };
  }

  private when(station: Station): Bi {
    if (station.kind === 'zertifikat') {
      const date = fmt(station.from);
      return { de: date, en: date };
    }
    const from = fmt(station.from);
    if (!station.to) {
      return { de: `${from} – heute`, en: `${from} – today` };
    }
    const range = `${from} – ${fmt(station.to)}`;
    return { de: range, en: range };
  }

  private buildTicks(): { year: number; left: number }[] {
    const span = this.axisEnd - AXIS_START;
    const ticks: { year: number; left: number }[] = [];
    // Keine Marke in den letzten zwei Jahren, dort steht „heute“.
    for (let year = AXIS_START; year < this.axisEnd - 2; year += TICK_STEP) {
      ticks.push({ year, left: ((year - AXIS_START) / span) * 100 });
    }
    return ticks;
  }
}
