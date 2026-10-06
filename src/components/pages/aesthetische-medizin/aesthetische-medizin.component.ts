import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { ScrollToDirective } from 'src/directives/scroll-to.directive';
import { Lang, LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';

const PAGE_PATH = '/behandlungen/aesthetische-medizin';
const ORIGIN = 'https://farewell.salon';
// Studio-Porträt vom 06.10.2026, auf 4:5 zugeschnitten (720x900), passend zum Bogenrahmen im Hero.
const PORTRAIT = 'assets/images/team/dr-andrea-leo.webp';
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

/** Eine Zeile der Preisliste: Startpreis („ab“) in Euro, optional mit Zusatz und Einheit. */
interface TreatmentItem {
  name: Bi;
  /** Startpreis in Euro laut Preisliste vom 02.10.2026. */
  priceFrom: number;
  /** Kleingedrucktes unter dem Namen, z. B. die Beispielzonen. */
  detail?: Bi;
  /** Einheit hinter dem Preis, z. B. „pro Faden“. */
  unit?: Bi;
}

interface TreatmentGroup {
  id: string;
  num: string;
  title: Bi;
  blurb: Bi;
  /** Volle Breite im Raster, mit zweispaltiger Preisliste. */
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
 * Behandlungsangebot und Startpreise aus seiner Preisliste (Datei vom
 * 02.10.2026, eingegangen am 06.10.2026). Gruppen und Zeilen wie dort, nur
 * die Einordnungssätze stammen von uns. Eine Dauer je Behandlung liegt
 * weiterhin nicht vor.
 */
const TREATMENT_GROUPS: TreatmentGroup[] = [
  {
    id: 'botulinumtoxin',
    num: '01',
    wide: true,
    title: { de: 'Botulinumtoxin', en: 'Botulinum toxin' },
    blurb: {
      de: 'Entspannt gezielt die Muskeln, die Mimikfalten entstehen lassen. Die Wirkung baut sich über einige Tage auf und lässt nach einigen Monaten von selbst wieder nach. Abgerechnet wird nach Zonen, einzelne Regionen stehen eigens in der Liste.',
      en: 'Precisely relaxes the muscles that create expression lines. The effect builds over a few days and wears off on its own after a few months. Priced by zones, with individual regions listed separately.',
    },
    items: [
      {
        name: { de: '1 Zone', en: '1 zone' },
        detail: { de: 'z. B. Stirn, Glabella oder Krähenfüße', en: 'e.g. forehead, glabella or crow\'s feet' },
        priceFrom: 109,
      },
      { name: { de: '2 Zonen', en: '2 zones' }, priceFrom: 179 },
      { name: { de: '3 Zonen', en: '3 zones' }, priceFrom: 229 },
      { name: { de: '4 Zonen', en: '4 zones' }, priceFrom: 279 },
      { name: { de: 'Brow Lift', en: 'Brow lift' }, priceFrom: 99 },
      { name: { de: 'Bunny Lines', en: 'Bunny lines' }, priceFrom: 89 },
      { name: { de: 'Gummy Smile', en: 'Gummy smile' }, priceFrom: 89 },
      { name: { de: 'Lip Flip', en: 'Lip flip' }, priceFrom: 89 },
      { name: { de: 'Kinn (Pflastersteinkinn)', en: 'Chin (cobblestone chin)' }, priceFrom: 89 },
      { name: { de: 'Mundwinkel (DAO)', en: 'Corners of the mouth (DAO)' }, priceFrom: 89 },
      { name: { de: 'Masseter, Bruxismus (Zähneknirschen)', en: 'Masseter, bruxism (teeth grinding)' }, priceFrom: 219 },
      { name: { de: 'Nefertiti Lift (Platysma)', en: 'Nefertiti lift (platysma)' }, priceFrom: 219 },
      { name: { de: 'Hyperhidrose (übermäßiges Schwitzen)', en: 'Hyperhidrosis (excessive sweating)' }, priceFrom: 250 },
    ],
  },
  {
    id: 'filler',
    num: '02',
    wide: true,
    title: { de: 'Hyaluronsäure und Konturierung', en: 'Hyaluronic acid and contouring' },
    blurb: {
      de: 'Gibt Volumen zurück, zeichnet Konturen nach und harmonisiert Proportionen. Immer mit dem Ziel, dass das Gesicht deins bleibt.',
      en: 'Restores volume, redraws contours and harmonises proportions. Always with the aim that your face stays yours.',
    },
    items: [
      { name: { de: 'Lippen, 0,5 ml', en: 'Lips, 0.5 ml' }, priceFrom: 159 },
      { name: { de: 'Lippen, 1 ml', en: 'Lips, 1 ml' }, priceFrom: 249 },
      { name: { de: 'Russian Lips, 1 ml', en: 'Russian lips, 1 ml' }, priceFrom: 269 },
      { name: { de: 'Kinnaufbau', en: 'Chin augmentation' }, priceFrom: 259 },
      { name: { de: 'Jawline Contouring', en: 'Jawline contouring' }, priceFrom: 259 },
      { name: { de: 'Wangen (Cheek Contouring)', en: 'Cheeks (cheek contouring)' }, priceFrom: 259 },
      { name: { de: 'Nasolabialfalten', en: 'Nasolabial folds' }, priceFrom: 259 },
      { name: { de: 'Marionettenfalten', en: 'Marionette lines' }, priceFrom: 259 },
      { name: { de: 'Rhinofiller, nicht-operative Nasenkorrektur', en: 'Rhinofiller, non-surgical nose correction' }, priceFrom: 329 },
      { name: { de: 'Tränenrinne, Augenregion', en: 'Tear trough, eye area' }, priceFrom: 329 },
      { name: { de: 'Jeder weitere ml in derselben Sitzung', en: 'Each additional ml in the same session' }, priceFrom: 189 },
      { name: { de: 'Full-Face- und Profilharmonisierung', en: 'Full-face and profile harmonisation' }, priceFrom: 649 },
    ],
  },
  {
    id: 'biostimulation',
    num: '03',
    title: { de: 'Biostimulation und Hautqualität', en: 'Biostimulation and skin quality' },
    blurb: {
      de: 'Regt die Haut an, selbst wieder Kollagen zu bilden. Weniger Volumen, mehr Struktur: für Gesicht, Hals, Dekolleté, Augenregion und Kopfhaut.',
      en: 'Encourages the skin to build its own collagen again. Less volume, more structure: for face, neck, décolleté, eye area and scalp.',
    },
    items: [
      { name: { de: 'Sculptra (Poly-L-Milchsäure)', en: 'Sculptra (poly-L-lactic acid)' }, priceFrom: 429 },
      { name: { de: 'Radiesse (Calciumhydroxylapatit)', en: 'Radiesse (calcium hydroxylapatite)' }, priceFrom: 429 },
      { name: { de: 'Profhilo', en: 'Profhilo' }, priceFrom: 259 },
      { name: { de: 'Skinbooster', en: 'Skin booster' }, priceFrom: 229 },
      { name: { de: 'Polynukleotide, Augenregion', en: 'Polynucleotides, eye area' }, priceFrom: 259 },
      { name: { de: 'Polynukleotide, Gesicht', en: 'Polynucleotides, face' }, priceFrom: 279 },
      { name: { de: 'Mesotherapie Gesicht', en: 'Mesotherapy, face' }, priceFrom: 149 },
      { name: { de: 'Mesotherapie Hals und Dekolleté', en: 'Mesotherapy, neck and décolleté' }, priceFrom: 149 },
      { name: { de: 'Haar-Mesotherapie', en: 'Hair mesotherapy' }, priceFrom: 149 },
    ],
  },
  {
    id: 'prp',
    num: '04',
    title: { de: 'PRP und regenerative Therapien', en: 'PRP and regenerative therapies' },
    blurb: {
      de: 'Eigenblutbehandlung: Aus einer kleinen Blutprobe wird plättchenreiches Plasma gewonnen und gezielt in Haut oder Kopfhaut eingebracht.',
      en: 'Autologous blood treatment: platelet-rich plasma is prepared from a small blood sample and placed precisely into the skin or scalp.',
    },
    items: [
      { name: { de: 'PRP Gesicht', en: 'PRP face' }, priceFrom: 229 },
      { name: { de: 'PRP Kopfhaut und Haartherapie', en: 'PRP scalp and hair therapy' }, priceFrom: 229 },
      { name: { de: 'PRP nach Haartransplantation', en: 'PRP after hair transplantation' }, priceFrom: 229 },
      { name: { de: 'PRP mit Microneedling', en: 'PRP with microneedling' }, priceFrom: 269 },
      { name: { de: 'Individuelle regenerative Kombinationstherapie', en: 'Individual regenerative combination therapy' }, priceFrom: 269 },
    ],
  },
  {
    id: 'microneedling',
    num: '05',
    title: { de: 'Microneedling', en: 'Microneedling' },
    blurb: {
      de: 'Medizinisches Microneedling, auf Wunsch mit Wirkstoffen, die dort ankommen, wo sie gebraucht werden: für Hautbild und Hautstruktur.',
      en: 'Medical microneedling, if you wish with active ingredients that reach where they are needed: for skin texture and structure.',
    },
    items: [
      { name: { de: 'Medizinisches Microneedling', en: 'Medical microneedling' }, priceFrom: 149 },
      { name: { de: 'Microneedling mit Mesotherapie', en: 'Microneedling with mesotherapy' }, priceFrom: 189 },
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
      {
        name: { de: 'PDO- und kollagenstimulierende Fäden', en: 'PDO and collagen-stimulating threads' },
        priceFrom: 79,
        unit: { de: 'pro Faden', en: 'per thread' },
      },
      { name: { de: 'Fadenlifting', en: 'Thread lift' }, priceFrom: 449 },
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
      { name: { de: 'Vitamininfusion', en: 'Vitamin infusion' }, priceFrom: 89 },
      { name: { de: 'Hydration-, Energy- oder Recovery-Infusion', en: 'Hydration, energy or recovery infusion' }, priceFrom: 129 },
      { name: { de: 'Individuelle Premium-Infusion', en: 'Individual premium infusion' }, priceFrom: 179 },
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
      de: 'Die Preisliste auf dieser Seite nennt Startpreise, zum Beispiel ab 109 € für eine Zone Botulinumtoxin oder ab 159 € für 0,5 ml Lippen. Der endgültige Preis hängt von Befund, Behandlungsumfang und Produktmenge ab und wird dir im Beratungsgespräch vor der Behandlung genannt, schriftlich und ohne Überraschungen. Ästhetische Behandlungen sind in der Regel Privatleistungen.',
      en: 'The price list on this page gives starting prices, for example from €109 for one zone of botulinum toxin or from €159 for 0.5 ml of lip filler. The final price depends on the findings, the extent of treatment and the amount of product, and is given to you in the consultation before treatment, in writing and without surprises. Aesthetic treatments are as a rule private services.',
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

/** „ab 109 €“ bzw. „from €109“, mit geschütztem Leerzeichen vor dem Euro und optionaler Einheit. */
function priceLabel(item: TreatmentItem): Bi {
  return {
    de: `ab ${item.priceFrom}\u00a0€${item.unit ? ` ${item.unit.de}` : ''}`,
    en: `from €${item.priceFrom}${item.unit ? ` ${item.unit.en}` : ''}`,
  };
}

const PRICED_GROUPS: PricedGroup[] = TREATMENT_GROUPS.map((group) => ({
  ...group,
  items: group.items.map((item) => ({ ...item, price: priceLabel(item) })),
}));

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
          // Preisliste als Angebotskatalog, aus derselben Datenquelle wie die sichtbaren Preiskarten.
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: this.t('Preisliste Ästhetische Medizin', 'Price list aesthetic medicine'),
            itemListElement: TREATMENT_GROUPS.map((group) => ({
              '@type': 'OfferCatalog',
              name: isEn ? group.title.en : group.title.de,
              itemListElement: group.items.map((item) => ({
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: isEn ? item.name.en : item.name.de },
                priceCurrency: 'EUR',
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  minPrice: item.priceFrom,
                  priceCurrency: 'EUR',
                },
              })),
            })),
          },
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
