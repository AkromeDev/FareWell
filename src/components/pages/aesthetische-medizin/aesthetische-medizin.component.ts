import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { ScrollToDirective } from 'src/directives/scroll-to.directive';
import { Lang, LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';

const PAGE_PATH = '/behandlungen/aesthetische-medizin';
const ORIGIN = 'https://farewell.salon';
const PORTRAIT = 'assets/images/team/dr-andrea-leo.jpg';
// Vorschaubild beim Teilen: JPEG in 1200x630, WebP zeigen mehrere Messenger nicht.
const OG_IMAGE = `${ORIGIN}/assets/images/treatment/og-aesthetische-medizin.jpg`;
const PHONE_HREF = 'tel:+4915757995694';
const PHONE_LABEL = '+49 157 5799 5694';
/**
 * Solange Dr. Leos Leistungen nicht in Salonkee angelegt sind, läuft die
 * Anfrage per Mail an das Studio. Danach: Salonkee-Deeplink hier eintragen und
 * die beiden Beratungs-CTAs im Template auf target="_blank" umstellen.
 */
const CONTACT_EMAIL = 'info@farewell.salon';
const INSTAGRAM_URL = 'https://www.instagram.com/dr.leoaesthet1c/';

/** Erstes Jahr der Zeitachse (Studienbeginn). */
const AXIS_START = 2008;
/** Abstand der Jahresmarken auf der Zeitachse in Jahren. */
const TICK_STEP = 4;

const DE_TITLE = 'Ästhetische Medizin in Nürnberg: Dr. med. Andrea Leo bei FareWell';
const EN_TITLE = 'Aesthetic Medicine in Nuremberg: Dr. med. Andrea Leo at FareWell';
const DE_DESCRIPTION =
  'Botulinumtoxin, Hyaluronsäure, Skinbooster und PRP bei FareWell in Nürnberg, durchgeführt von Dr. med. Andrea Leo: approbierter Arzt seit 2016, seit 2017 in Kliniken in Bayern, seit 2018 in der ästhetischen Medizin. Ärztliche Beratung auf Deutsch, Englisch und Italienisch.';
const EN_DESCRIPTION =
  'Botulinum toxin, hyaluronic acid, skin boosters and PRP at FareWell in Nuremberg, performed by Dr. med. Andrea Leo: licensed physician since 2016, in Bavarian hospitals since 2017, in aesthetic medicine since 2018. Medical consultations in German, English and Italian.';

/** Zweisprachiger Text. Beide Fassungen stehen im DOM, das globale CSS blendet eine aus. */
export interface Bi {
  de: string;
  en: string;
}

export type StationKind = 'studium' | 'klinik' | 'aesthetik' | 'approbation';

interface YearMonth {
  y: number;
  m: number;
}

/** Eine Station der Laufbahn, Quelle: Lebenslauf vom 03.09.2026. */
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

interface TreatmentItem {
  name: Bi;
  /** Preisliste steht noch aus; sobald sie da ist, hier eintragen, z. B. { de: 'ab 180 €', en: 'from €180' }. */
  price?: Bi;
}

interface TreatmentGroup {
  id: string;
  num: string;
  title: Bi;
  blurb: Bi;
  items: TreatmentItem[];
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
  klinik: { de: 'Klinik', en: 'Hospital' },
  studium: { de: 'Studium und Lehre', en: 'Studies and teaching' },
  aesthetik: { de: 'Ästhetische Medizin', en: 'Aesthetic medicine' },
  approbation: { de: 'Approbation', en: 'Medical licence' },
};

/**
 * Laufbahn laut Lebenslauf. Die ästhetische Tätigkeit „seit 2018“ ist seine
 * eigene Angabe (Bewerbungsmail vom 03.09.2026), der Monat ist nicht bekannt.
 */
const STATIONS: Station[] = [
  {
    kind: 'studium',
    from: { y: 2008, m: 9 },
    to: { y: 2015, m: 6 },
    place: { de: 'Semmelweis Universität, Budapest', en: 'Semmelweis University, Budapest' },
    role: {
      de: 'Studium der Humanmedizin, Abschluss cum laude, Doktorarbeit zum Pathomechanismus der Sepsis',
      en: 'Medical studies, graduated cum laude, doctoral thesis on the pathomechanism of sepsis',
    },
  },
  {
    kind: 'studium',
    from: { y: 2012, m: 9 },
    to: { y: 2014, m: 5 },
    place: { de: 'Semmelweis Universität, Budapest', en: 'Semmelweis University, Budapest' },
    role: { de: 'Lehrassistent am Institut für Pathologie', en: 'Teaching assistant at the Institute of Pathology' },
  },
  {
    kind: 'approbation',
    from: { y: 2016, m: 8 },
    to: { y: 2016, m: 8 },
    place: { de: 'Frankfurt am Main', en: 'Frankfurt am Main' },
    role: { de: 'Deutsche Approbation als Arzt', en: 'German licence to practise medicine' },
  },
  {
    kind: 'klinik',
    from: { y: 2017, m: 1 },
    to: { y: 2017, m: 9 },
    place: { de: 'Kliniken am Goldenen Steig, Freyung', en: 'Kliniken am Goldenen Steig, Freyung' },
    role: { de: 'Gefäßchirurgie', en: 'Vascular surgery' },
  },
  {
    kind: 'klinik',
    from: { y: 2017, m: 10 },
    to: { y: 2018, m: 7 },
    place: { de: 'Klinikum Passau', en: 'Klinikum Passau' },
    role: { de: 'Gynäkologie und Geburtshilfe', en: 'Gynaecology and obstetrics' },
  },
  {
    kind: 'aesthetik',
    from: { y: 2018, m: 1 },
    to: null,
    place: { de: 'Ästhetische Medizin, neben der Klinik', en: 'Aesthetic medicine, alongside hospital work' },
    role: {
      de: 'Botulinumtoxin, Hyaluronsäure, Skinbooster, Biostimulatoren, PRP',
      en: 'Botulinum toxin, hyaluronic acid, skin boosters, biostimulators, PRP',
    },
  },
  {
    kind: 'klinik',
    from: { y: 2019, m: 4 },
    to: { y: 2019, m: 10 },
    place: { de: 'Schön Klinik Fürth', en: 'Schön Klinik Fürth' },
    role: { de: 'Allgemein- und Unfallchirurgie', en: 'General and trauma surgery' },
  },
  {
    kind: 'klinik',
    from: { y: 2019, m: 10 },
    to: { y: 2023, m: 1 },
    place: { de: 'Klinikum Schwabach', en: 'Klinikum Schwabach' },
    role: {
      de: 'Unfallchirurgie und Orthopädie, Intensivstation und Notaufnahme',
      en: 'Trauma surgery and orthopaedics, intensive care and emergency department',
    },
  },
  {
    kind: 'klinik',
    from: { y: 2023, m: 1 },
    to: { y: 2025, m: 1 },
    place: { de: 'Malteser Waldkrankenhaus, Erlangen', en: 'Malteser Waldkrankenhaus, Erlangen' },
    role: { de: 'Orthopädie und Unfallchirurgie', en: 'Orthopaedics and trauma surgery' },
  },
  {
    kind: 'klinik',
    from: { y: 2025, m: 2 },
    to: null,
    place: { de: 'Klinikum Amberg', en: 'Klinikum Amberg' },
    role: { de: 'Orthopädie und Unfallchirurgie', en: 'Orthopaedics and trauma surgery' },
  },
];

const STATS: Stat[] = [
  {
    value: { de: '2016', en: '2016' },
    label: { de: 'Deutsche Approbation, Frankfurt am Main', en: 'German medical licence, Frankfurt am Main' },
  },
  {
    value: { de: '6', en: '6' },
    label: { de: 'Kliniken in Bayern seit 2017', en: 'Bavarian hospitals since 2017' },
  },
  {
    value: { de: 'seit 2018', en: 'since 2018' },
    label: {
      de: 'Ästhetische Medizin: Botulinumtoxin, Filler, Skinbooster, PRP',
      en: 'Aesthetic medicine: botulinum toxin, fillers, skin boosters, PRP',
    },
  },
  {
    value: { de: '4', en: '4' },
    label: {
      de: 'Sprachen: Deutsch, Englisch, Italienisch, Ungarisch',
      en: 'Languages: German, English, Italian, Hungarian',
    },
  },
];

const CERTS: CertGroup[] = [
  {
    title: { de: 'Ästhetische Medizin', en: 'Aesthetic medicine' },
    items: [
      {
        de: 'Master in Medizinischer Ästhetik, Laser und Anti-Aging (II. Niveau), Università degli Studi eCampus',
        en: 'Master in Medical Aesthetics, Laser and Anti-Ageing (level II), Università degli Studi eCampus',
      },
      {
        de: 'Lips for Kiss Certification, Dr. Marina Aisina, Dubai: Full-Face-Botulinumtoxin, Russian Lips und Doll Lips',
        en: 'Lips for Kiss Certification, Dr. Marina Aisina, Dubai: full-face botulinum toxin, Russian lips and doll lips',
      },
    ],
  },
  {
    title: { de: 'Notfall- und Klinikmedizin', en: 'Emergency and hospital medicine' },
    items: [
      { de: 'ATLS, Advanced Trauma Life Support, LMU München', en: 'ATLS, Advanced Trauma Life Support, LMU Munich' },
      {
        de: 'ITLS und ALS, International Trauma Life Support und Advanced Life Support',
        en: 'ITLS and ALS, International Trauma Life Support and Advanced Life Support',
      },
      {
        de: 'Notarztkurs, Institut für notfallmedizinische Bildung Fürth, 2024',
        en: 'Emergency physician course, Institut für notfallmedizinische Bildung Fürth, 2024',
      },
      { de: 'AO Trauma Kurs, Baden-Baden, 2024', en: 'AO Trauma course, Baden-Baden, 2024' },
      { de: 'TECC, Tactical Emergency Casualty Care', en: 'TECC, Tactical Emergency Casualty Care' },
      {
        de: 'Sonografie, DEGUM Grundkurs, Universitätsklinikum Bonn, 2020',
        en: 'Ultrasound, DEGUM basic course, University Hospital Bonn, 2020',
      },
      {
        de: 'Fachkunde Strahlenschutz, Universitätsklinikum Erlangen, 2020',
        en: 'Radiation protection qualification, University Hospital Erlangen, 2020',
      },
    ],
  },
];

/**
 * Behandlungsangebot, seine Liste vom 02.10.2026, hier nur geordnet und mit
 * Einordnungssätzen versehen. Preise und Dauer liegen noch nicht vor.
 */
const TREATMENT_GROUPS: TreatmentGroup[] = [
  {
    id: 'botulinumtoxin',
    num: '01',
    title: { de: 'Botulinumtoxin', en: 'Botulinum toxin' },
    blurb: {
      de: 'Entspannt gezielt die Muskeln, die Mimikfalten entstehen lassen. Die Wirkung baut sich über einige Tage auf und lässt nach einigen Monaten von selbst wieder nach.',
      en: 'Precisely relaxes the muscles that create expression lines. The effect builds over a few days and wears off on its own after a few months.',
    },
    items: [
      { name: { de: 'Stirnfalten', en: 'Forehead lines' } },
      { name: { de: 'Zornesfalte (Glabella)', en: 'Frown lines (glabella)' } },
      { name: { de: 'Krähenfüße', en: "Crow's feet" } },
      { name: { de: 'Brow Lift', en: 'Brow lift' } },
      { name: { de: 'Bunny Lines', en: 'Bunny lines' } },
      { name: { de: 'Gummy Smile', en: 'Gummy smile' } },
      { name: { de: 'Lip Flip', en: 'Lip flip' } },
      { name: { de: 'Kinn (Pflastersteinkinn)', en: 'Chin (cobblestone chin)' } },
      { name: { de: 'Mundwinkel (DAO)', en: 'Corners of the mouth (DAO)' } },
      { name: { de: 'Masseter und Gesichtskonturierung', en: 'Masseter and facial contouring' } },
      { name: { de: 'Bruxismus (Zähneknirschen)', en: 'Bruxism (teeth grinding)' } },
      { name: { de: 'Nefertiti Lift (Platysma)', en: 'Nefertiti lift (platysma)' } },
      { name: { de: 'Hyperhidrose (starkes Schwitzen)', en: 'Hyperhidrosis (excessive sweating)' } },
      { name: { de: 'Individuelle Full-Face-Behandlung', en: 'Individual full-face treatment' } },
    ],
  },
  {
    id: 'filler',
    num: '02',
    title: { de: 'Hyaluronsäure und Filler', en: 'Hyaluronic acid and fillers' },
    blurb: {
      de: 'Gibt Volumen zurück, zeichnet Konturen nach und harmonisiert Proportionen. Immer mit dem Ziel, dass das Gesicht deins bleibt.',
      en: 'Restores volume, redraws contours and harmonises proportions. Always with the aim that your face stays yours.',
    },
    items: [
      { name: { de: 'Lippenaugmentation', en: 'Lip augmentation' } },
      { name: { de: 'Russian Lips', en: 'Russian lips' } },
      { name: { de: 'Baby Doll Lips, natürliche Lippenaugmentation', en: 'Baby doll lips, natural lip augmentation' } },
      { name: { de: 'Lippenkontur und Harmonisierung', en: 'Lip contour and harmonisation' } },
      { name: { de: 'Kinnaufbau und Kinnprojektion', en: 'Chin augmentation and projection' } },
      { name: { de: 'Jawline Contouring', en: 'Jawline contouring' } },
      { name: { de: 'Wangen (Cheek Contouring)', en: 'Cheeks (cheek contouring)' } },
      { name: { de: 'Nasolabialfalten', en: 'Nasolabial folds' } },
      { name: { de: 'Marionettenfalten', en: 'Marionette lines' } },
      { name: { de: 'Full-Face-Harmonisierung', en: 'Full-face harmonisation' } },
      { name: { de: 'Profilharmonisierung', en: 'Profile harmonisation' } },
      { name: { de: 'Nicht-operative Nasenkorrektur (Rhinofiller)', en: 'Non-surgical nose correction (rhinofiller)' } },
      { name: { de: 'Individuelle Volumen- und Konturbehandlungen', en: 'Individual volume and contour treatments' } },
    ],
  },
  {
    id: 'biostimulation',
    num: '03',
    title: { de: 'Biostimulation und Hautqualität', en: 'Biostimulation and skin quality' },
    blurb: {
      de: 'Regt die Haut an, selbst wieder Kollagen zu bilden. Weniger Volumen, mehr Struktur: für Gesicht, Hals, Dekolleté und die Augenregion.',
      en: 'Encourages the skin to build its own collagen again. Less volume, more structure: for face, neck, décolleté and the eye area.',
    },
    items: [
      { name: { de: 'Poly-L-Milchsäure (Sculptra)', en: 'Poly-L-lactic acid (Sculptra)' } },
      { name: { de: 'Calciumhydroxylapatit (Radiesse)', en: 'Calcium hydroxylapatite (Radiesse)' } },
      { name: { de: 'Weitere Biostimulatoren je nach Indikation', en: 'Further biostimulators depending on indication' } },
      { name: { de: 'Skinbooster (Profhilo und vergleichbare)', en: 'Skin boosters (Profhilo and comparable products)' } },
      { name: { de: 'Mesotherapie', en: 'Mesotherapy' } },
      { name: { de: 'Individuelle Skinbooster-Konzepte', en: 'Individual skin booster plans' } },
      { name: { de: 'Gesicht, Hals und Dekolleté', en: 'Face, neck and décolleté' } },
      { name: { de: 'Augenregion (periorbital)', en: 'Eye area (periorbital)' } },
    ],
  },
  {
    id: 'prp',
    num: '04',
    title: { de: 'PRP und regenerative Behandlungen', en: 'PRP and regenerative treatments' },
    blurb: {
      de: 'Eigenblutbehandlung: Aus einer kleinen Blutprobe wird plättchenreiches Plasma gewonnen und gezielt in Haut oder Kopfhaut eingebracht.',
      en: 'Autologous blood treatment: platelet-rich plasma is prepared from a small blood sample and placed precisely into the skin or scalp.',
    },
    items: [
      { name: { de: 'PRP Gesicht', en: 'PRP face' } },
      { name: { de: 'PRP Kopfhaut und Haartherapie', en: 'PRP scalp and hair therapy' } },
      { name: { de: 'PRP nach Haartransplantation', en: 'PRP after hair transplantation' } },
      { name: { de: 'PRP kombiniert mit Microneedling', en: 'PRP combined with microneedling' } },
      { name: { de: 'Regenerative Hautbehandlungen', en: 'Regenerative skin treatments' } },
      { name: { de: 'Individuelle Kombinationstherapien', en: 'Individual combination therapies' } },
    ],
  },
  {
    id: 'microneedling',
    num: '05',
    title: { de: 'Microneedling und Mesotherapie', en: 'Microneedling and mesotherapy' },
    blurb: {
      de: 'Medizinisches Microneedling und Wirkstoffe, die dort ankommen, wo sie gebraucht werden: für Hautbild, Pigmentierung und Haar.',
      en: 'Medical microneedling and active ingredients that reach where they are needed: for skin texture, pigmentation and hair.',
    },
    items: [
      { name: { de: 'Medizinisches Microneedling', en: 'Medical microneedling' } },
      {
        name: {
          de: 'Mesotherapie mit verschiedenen Wirkstoffkombinationen',
          en: 'Mesotherapy with various active-ingredient combinations',
        },
      },
      { name: { de: 'Hautregeneration und Hautqualität', en: 'Skin regeneration and skin quality' } },
      { name: { de: 'Anti-Aging-Behandlungen', en: 'Anti-ageing treatments' } },
      { name: { de: 'Pigmentierung und Hautstruktur', en: 'Pigmentation and skin texture' } },
      { name: { de: 'Haar-Mesotherapie', en: 'Hair mesotherapy' } },
    ],
  },
  {
    id: 'faeden',
    num: '06',
    title: { de: 'Fadenbehandlungen', en: 'Thread treatments' },
    blurb: {
      de: 'Resorbierbare Fäden, die Konturen stützen und die Kollagenbildung anregen. Für eine sanfte Straffung ohne Operation.',
      en: 'Absorbable threads that support contours and stimulate collagen. For gentle lifting without surgery.',
    },
    items: [
      { name: { de: 'PDO-Fäden', en: 'PDO threads' } },
      { name: { de: 'Fadenlifting', en: 'Thread lift' } },
      { name: { de: 'Kollagenstimulierende Fäden', en: 'Collagen-stimulating threads' } },
      { name: { de: 'Individuelle Kontur- und Straffungsbehandlungen', en: 'Individual contour and tightening treatments' } },
    ],
  },
  {
    id: 'infusionen',
    num: '07',
    title: { de: 'Infusionstherapien', en: 'Infusion therapies' },
    blurb: {
      de: 'Vitamine und Flüssigkeit direkt über die Vene, individuell zusammengestellt und nur nach ärztlicher Indikation.',
      en: 'Vitamins and fluids delivered intravenously, individually composed and only on medical indication.',
    },
    items: [
      { name: { de: 'Vitamininfusionen', en: 'Vitamin infusions' } },
      { name: { de: 'Hydration- und Recovery-Infusionen', en: 'Hydration and recovery infusions' } },
      { name: { de: 'Individuell zusammengestellte Infusionskonzepte', en: 'Individually composed infusion plans' } },
    ],
  },
];

const FAQ: FaqEntry[] = [
  {
    q: { de: 'Wer führt die Behandlungen durch?', en: 'Who performs the treatments?' },
    a: {
      de: 'Ausschließlich Dr. med. Andrea Leo selbst. Botulinumtoxin ist verschreibungspflichtig und die Injektion Ärzt:innen vorbehalten, und auch alle anderen Behandlungen auf dieser Seite führt er persönlich durch.',
      en: 'Only Dr. med. Andrea Leo himself. Botulinum toxin is prescription-only and injecting it is reserved for physicians, and he also performs every other treatment on this page personally.',
    },
  },
  {
    q: {
      de: 'Woran erkenne ich, ob eine Behandlung für mich sinnvoll ist?',
      en: 'How do I know whether a treatment makes sense for me?',
    },
    a: {
      de: 'Im ärztlichen Gespräch. Dr. Leo schaut sich Anatomie, Hautzustand und deine Vorgeschichte an und sagt dir ehrlich, was eine Behandlung bewirken kann und was nicht. Es gibt Situationen, in denen er abrät, zum Beispiel in Schwangerschaft und Stillzeit, bei bestimmten Erkrankungen oder bei einer akuten Infektion im Behandlungsbereich.',
      en: 'In the medical consultation. Dr. Leo looks at anatomy, skin condition and your medical history and tells you honestly what a treatment can and cannot do. There are situations in which he advises against it, for example pregnancy and breastfeeding, certain conditions or an acute infection in the treatment area.',
    },
  },
  {
    q: { de: 'Was kostet eine Behandlung?', en: 'What does a treatment cost?' },
    a: {
      de: 'Der Preis hängt von der Region, der Menge an Präparat und dem Aufwand ab und wird dir im Beratungsgespräch vor der Behandlung genannt, schriftlich und ohne Überraschungen. Ästhetische Behandlungen sind in der Regel Privatleistungen.',
      en: 'The price depends on the area, the amount of product and the effort involved and is given to you in the consultation before treatment, in writing and without surprises. Aesthetic treatments are as a rule private services.',
    },
  },
  {
    q: { de: 'Wie lange hält die Wirkung von Botulinumtoxin?', en: 'How long does botulinum toxin last?' },
    a: {
      de: 'In der Regel setzt die Wirkung nach drei bis sieben Tagen ein, ist nach etwa zwei Wochen voll da und lässt nach drei bis sechs Monaten von selbst nach. Wie lange genau, ist individuell und hängt von Region, Dosis und Stoffwechsel ab.',
      en: 'As a rule the effect sets in after three to seven days, is fully there after about two weeks and wears off on its own after three to six months. Exactly how long is individual and depends on the area, the dose and your metabolism.',
    },
  },
  {
    q: { de: 'Gibt es Risiken und Nebenwirkungen?', en: 'Are there risks and side effects?' },
    a: {
      de: 'Ja, wie bei jeder medizinischen Behandlung. Häufig und harmlos sind kleine Rötungen, Schwellungen oder blaue Flecken an der Einstichstelle, die nach wenigen Tagen verschwinden. Seltene, ernstere Komplikationen bespricht Dr. Leo offen mit dir in der Aufklärung, bevor du dich entscheidest. Dass er notfallmedizinisch geschult ist und seit Jahren in der Klinik arbeitet, ist genau dafür da.',
      en: 'Yes, as with any medical treatment. Common and harmless are small areas of redness, swelling or bruising at the injection site, which disappear within a few days. Rare, more serious complications are discussed openly with you by Dr. Leo during informed consent, before you decide. His emergency training and years of hospital work are there for exactly that.',
    },
  },
  {
    q: { de: 'In welchen Sprachen kann ich mich beraten lassen?', en: 'Which languages can I be advised in?' },
    a: {
      de: 'Auf Deutsch, Englisch und Italienisch, Dr. Leos Muttersprache. Ungarisch spricht er ebenfalls.',
      en: "In German, English and Italian, Dr. Leo's mother tongue. He also speaks Hungarian.",
    },
  },
  {
    q: { de: 'Wie vereinbare ich einen Termin?', en: 'How do I book an appointment?' },
    a: {
      de: 'Schreib uns kurz per E-Mail oder ruf an. Wir stimmen einen Termin für das ärztliche Gespräch bei FareWell ab, Frauentorgraben 5, zwei Minuten vom Hauptbahnhof.',
      en: 'Send us a short email or call. We arrange an appointment for the medical consultation at FareWell, Frauentorgraben 5, two minutes from the main station.',
    },
  },
];

function fmt(ym: YearMonth): string {
  return `${String(ym.m).padStart(2, '0')}/${ym.y}`;
}

/**
 * Behandlungsseite für die ästhetische Medizin mit Dr. med. Andrea Leo als
 * Kooperationsarzt. Eine Vertrauensseite: Porträt, belegbare Zahlen, die
 * Laufbahn als Zeitstrahl, Qualifikationen, dann erst das Angebot.
 *
 * Status: versteckte Vorschau für den Arzt selbst (Zusage vom 24.09.2026).
 * Deshalb noindex, nicht in der Sitemap, nicht im Header, Footer oder in
 * llms.txt verlinkt. Vor der Freischaltung gehören Vertrag, Nachweise und
 * Preisliste auf den Tisch, siehe Personalordner.
 *
 * Der Zeitstrahl ist eine semantische Liste (jede Station mit Zeitraum, Ort,
 * Rolle und Art als Text); die Balken sind reine Dekoration (aria-hidden), auf
 * schmalen Bildschirmen werden sie zu einem vertikalen Zeitstrahl. Farbe trägt
 * dort nie allein die Bedeutung: Klinik gefüllt, Studium gedämpft, Ästhetik
 * nur umrandet, Approbation als Raute, und jede Zeile nennt ihre Art im Text.
 */
@Component({
  selector: 'app-aesthetische-medizin',
  standalone: true,
  imports: [RevealOnScrollDirective, ScrollToDirective],
  templateUrl: './aesthetische-medizin.component.html',
  styleUrls: ['./aesthetische-medizin.component.scss'],
})
export class AesthetischeMedizinComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly jsonLdId = 'aesthetische-medizin-schema';

  readonly portrait = PORTRAIT;
  readonly phoneHref = PHONE_HREF;
  readonly phoneLabel = PHONE_LABEL;
  readonly instagramUrl = INSTAGRAM_URL;
  readonly stats = STATS;
  readonly certs = CERTS;
  readonly groups = TREATMENT_GROUPS;
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
    const subject = this.t('Beratung ästhetische Medizin', 'Consultation: aesthetic medicine');
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
  }

  /** Lead-Ereignis wie bei den Buchungs-Buttons der Startseite; die Mail öffnet normal weiter. */
  trackLead(location: string): void {
    if (!this.isBrowser || typeof window.gtag !== 'function') return;
    window.gtag('event', 'generate_lead', {
      event_category: 'engagement',
      event_label: 'Beratung ästhetische Medizin',
      location,
      destination: 'mail',
    });
  }

  ngOnInit(): void {
    const isEn = this.language.lang() === 'en';
    const pageUrl = `${ORIGIN}${isEn ? '/en' : ''}${PAGE_PATH}`;
    const homeUrl = isEn ? `${ORIGIN}/en` : ORIGIN;
    const title = this.t(DE_TITLE, EN_TITLE);
    const description = this.t(DE_DESCRIPTION, EN_DESCRIPTION);
    const inLanguage = isEn ? 'en' : 'de';

    this.seo.setPageSeo({
      title,
      description,
      path: PAGE_PATH,
      image: OG_IMAGE,
      imageAlt: this.t(
        'Ästhetische Behandlung bei FareWell in Nürnberg',
        'An aesthetic treatment at FareWell in Nuremberg',
      ),
      largeImage: true,
      // Vorschau für den Arzt; wird erst mit Vertrag, Nachweisen und Preisliste indexierbar.
      noindex: true,
    });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Physician',
          '@id': `${pageUrl}#physician`,
          name: 'Dr. med. Andrea Leo',
          honorificPrefix: 'Dr. med.',
          givenName: 'Andrea',
          familyName: 'Leo',
          image: `${ORIGIN}/${PORTRAIT}`,
          url: pageUrl,
          description,
          knowsLanguage: ['de', 'en', 'it', 'hu'],
          knowsAbout: TREATMENT_GROUPS.map((group) => (isEn ? group.title.en : group.title.de)),
          alumniOf: {
            '@type': 'CollegeOrUniversity',
            name: this.t('Semmelweis Universität', 'Semmelweis University'),
            address: { '@type': 'PostalAddress', addressLocality: 'Budapest', addressCountry: 'HU' },
          },
          hasCredential: {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: this.t(
              'Approbation als Arzt (Deutschland, 2016)',
              'Licence to practise medicine (Germany, 2016)',
            ),
          },
          sameAs: [INSTAGRAM_URL],
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
          about: { '@id': `${pageUrl}#physician` },
          primaryImageOfPage: { '@type': 'ImageObject', url: `${ORIGIN}/${PORTRAIT}` },
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
              item: `${ORIGIN}${isEn ? '/en' : ''}/behandlungen`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: this.t('Ästhetische Medizin', 'Aesthetic medicine'),
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
    const start = station.from.y + (station.from.m - 1) / 12;
    // Das Ende schließt den letzten Monat ein; laufende Stationen reichen bis zum Achsenende.
    const end = station.to ? station.to.y + station.to.m / 12 : this.axisEnd;
    const left = ((start - AXIS_START) / span) * 100;
    // Mindestbreite, damit auch eine kurze Station als Balken sichtbar bleibt.
    const width = Math.min(Math.max(((end - start) / span) * 100, 1.2), 100 - left);

    return { ...station, when: this.when(station), kindLabel: KIND_LABEL[station.kind], left, width };
  }

  private when(station: Station): Bi {
    if (station.kind === 'approbation') {
      const date = fmt(station.from);
      return { de: date, en: date };
    }
    if (station.kind === 'aesthetik') {
      return { de: `seit ${station.from.y}`, en: `since ${station.from.y}` };
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
    for (let year = AXIS_START; year < this.axisEnd; year += TICK_STEP) {
      ticks.push({ year, left: ((year - AXIS_START) / span) * 100 });
    }
    return ticks;
  }
}
