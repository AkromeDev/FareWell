/**
 * Preiskatalog der Preisseite — einzige Quelle für die sichtbaren Tabellen UND
 * das JSON-LD (Service/Offer). Quelle der Preise: Salonkee
 * (salonkee.de/salon/farewell), Stand Juli 2026, Preise in Euro inkl. 19% MwSt.
 * Bei Preisänderungen nur diese Datei pflegen — Tabellen und strukturierte
 * Daten ziehen automatisch nach.
 *
 * Hausregel: „permanente Haarentfernung" = allein die Nadelepilation
 * (Elektrolyse); „dauerhafte" = Laser und alle anderen Methoden.
 *
 * Optionsnamen sind gegenüber Salonkee leicht normalisiert (Schreibweise/
 * Leerzeichen, z. B. „Bikinielinie" → „Bikinilinie", „Ganze Körper" →
 * „Ganzer Körper", „Narben Behandlung" → „Narbenbehandlung", „Behandlungsvorbereitung mit
 * Betäubungscreme" → „Betäubungscreme"); Dauer und
 * Preis sind immer wortwörtlich aus Salonkee übernommen.
 */

export type PriceAudience = 'damen' | 'herren' | 'alle';

export interface PriceRow {
  /** Optionsname wie in Salonkee (deutsch). */
  de: string;
  en: string;
  minutes: number;
  /** Preis in Euro inkl. MwSt.; null = kostenlos. */
  price: number | null;
  /** Nur gesetzt, wenn eine Zeile in einer gemischten Tabelle geschlechtsspezifisch ist. */
  audience?: PriceAudience;
  /**
   * Vorbereitungs-Zusatzleistung (Betäubungscreme): bleibt als Offer im
   * JSON-LD, zählt aber nicht als günstigste Behandlung (lowPrice).
   */
  addon?: boolean;
}

export interface PriceTable {
  /** Sichtbare Tabellenüberschrift (leer, wenn die Sektion nur eine Tabelle hat). */
  de: string;
  en: string;
  audience: PriceAudience;
  rows: PriceRow[];
}

export const PRICE_TABLES = {
  beratung: {
    de: '',
    en: '',
    audience: 'alle',
    rows: [
      { de: 'Beratungstermin für Neukund:innen', en: 'Consultation for new clients', minutes: 30, price: null },
      { de: 'Massage Beratungsgespräch', en: 'Massage consultation', minutes: 30, price: null },
    ],
  },

  nadelepilation: {
    de: '',
    en: '',
    audience: 'alle',
    rows: [
      { de: 'Sitzung 30 Minuten', en: '30-minute session', minutes: 30, price: 40 },
      { de: 'Sitzung 45 Minuten', en: '45-minute session', minutes: 45, price: 60 },
      { de: 'Sitzung 60 Minuten', en: '60-minute session', minutes: 60, price: 80 },
      { de: 'Sitzung 120 Minuten', en: '120-minute session', minutes: 120, price: 160 },
      { de: 'Betäubungscreme', en: 'Numbing cream', minutes: 15, price: 20, addon: true },
    ],
  },

  laserDamenGesicht: {
    de: 'Damen: Gesicht',
    en: 'Women: face',
    audience: 'damen',
    rows: [
      { de: 'Augenbraue', en: 'Eyebrows', minutes: 15, price: 40 },
      { de: 'Koteletten', en: 'Sideburns', minutes: 15, price: 50 },
      { de: 'Wangen', en: 'Cheeks', minutes: 15, price: 50 },
      { de: 'Oberlippe', en: 'Upper lip', minutes: 15, price: 50 },
      { de: 'Kinn', en: 'Chin', minutes: 15, price: 50 },
      { de: 'Unterkinn', en: 'Under the chin', minutes: 15, price: 50 },
      { de: 'Unteres Gesicht komplett', en: 'Complete lower face', minutes: 45, price: 180 },
      { de: 'Nacken', en: 'Nape of the neck', minutes: 15, price: 50 },
    ],
  },

  laserDamenKoerper: {
    de: 'Damen: Körper',
    en: 'Women: body',
    audience: 'damen',
    rows: [
      { de: 'Achseln', en: 'Underarms', minutes: 15, price: 60 },
      { de: 'Schultern', en: 'Shoulders', minutes: 15, price: 50 },
      { de: 'Oberarme', en: 'Upper arms', minutes: 30, price: 70 },
      { de: 'Unterarme', en: 'Forearms', minutes: 30, price: 70 },
      { de: 'Arme komplett', en: 'Complete arms', minutes: 60, price: 120 },
      { de: 'Bauch', en: 'Stomach', minutes: 30, price: 70 },
      { de: 'Rücken', en: 'Back', minutes: 45, price: 120 },
      { de: 'Oberschenkel', en: 'Thighs', minutes: 45, price: 90 },
      { de: 'Unterschenkel', en: 'Lower legs', minutes: 30, price: 80 },
      { de: 'Knie', en: 'Knees', minutes: 15, price: 30 },
      { de: 'Füße', en: 'Feet', minutes: 15, price: 30 },
      { de: 'Beine komplett', en: 'Complete legs', minutes: 105, price: 180 },
      { de: 'Ganzer Körper', en: 'Full body', minutes: 180, price: 650 },
      { de: 'Brust', en: 'Chest', minutes: 30, price: 70 },
    ],
  },

  laserDamenIntim: {
    de: 'Damen: Intimbereich',
    en: 'Women: intimate area',
    audience: 'damen',
    rows: [
      { de: 'Bikinilinie', en: 'Bikini line', minutes: 15, price: 60 },
      { de: 'Brazilian', en: 'Brazilian', minutes: 30, price: 100 },
      { de: 'Damm', en: 'Perineum', minutes: 15, price: 50 },
      { de: 'Pofalte', en: 'Gluteal fold', minutes: 15, price: 60 },
      { de: 'Gesäß', en: 'Buttocks', minutes: 15, price: 60 },
      { de: 'Intim komplett', en: 'Complete intimate area', minutes: 30, price: 200 },
    ],
  },

  laserHerrenGesicht: {
    de: 'Herren: Gesicht & Kopf',
    en: 'Men: face & head',
    audience: 'herren',
    rows: [
      { de: 'Augenbraue', en: 'Eyebrows', minutes: 15, price: 40 },
      { de: 'Koteletten', en: 'Sideburns', minutes: 15, price: 50 },
      { de: 'Wangen', en: 'Cheeks', minutes: 15, price: 50 },
      { de: 'Oberlippe', en: 'Upper lip', minutes: 15, price: 40 },
      { de: 'Kinn', en: 'Chin', minutes: 15, price: 50 },
      { de: 'Hals', en: 'Neck (front)', minutes: 15, price: 60 },
      { de: 'Unteres Gesicht komplett', en: 'Complete lower face', minutes: 45, price: 180 },
      { de: 'Nacken', en: 'Nape of the neck', minutes: 15, price: 50 },
      { de: 'Ohren', en: 'Ears', minutes: 15, price: 40 },
      { de: 'Bartkontur Wangen', en: 'Beard contour (cheeks)', minutes: 15, price: 40 },
      { de: 'Kopf inkl. Nacken', en: 'Head incl. nape', minutes: 45, price: 140 },
    ],
  },

  laserHerrenKoerper: {
    de: 'Herren: Körper',
    en: 'Men: body',
    audience: 'herren',
    rows: [
      { de: 'Schultern', en: 'Shoulders', minutes: 30, price: 50 },
      { de: 'Rücken Hälfte', en: 'Half back', minutes: 30, price: 70 },
      { de: 'Rücken komplett', en: 'Complete back', minutes: 45, price: 120 },
      { de: 'Brust', en: 'Chest', minutes: 30, price: 60 },
      { de: 'Bauch', en: 'Stomach', minutes: 30, price: 60 },
      { de: 'Brust und Bauch', en: 'Chest and stomach', minutes: 60, price: 110 },
      { de: 'Achseln', en: 'Underarms', minutes: 15, price: 60 },
      { de: 'Oberarme', en: 'Upper arms', minutes: 30, price: 80 },
      { de: 'Unterarme', en: 'Forearms', minutes: 30, price: 80 },
      { de: 'Oberschenkel', en: 'Thighs', minutes: 45, price: 90 },
      { de: 'Unterschenkel', en: 'Lower legs', minutes: 30, price: 80 },
      { de: 'Knie', en: 'Knees', minutes: 15, price: 40 },
      { de: 'Füße', en: 'Feet', minutes: 15, price: 40 },
      { de: 'Zehen', en: 'Toes', minutes: 15, price: 30 },
      { de: 'Beine komplett', en: 'Complete legs', minutes: 75, price: 200 },
      { de: 'Ganzer Körper', en: 'Full body', minutes: 210, price: 750 },
    ],
  },

  laserHerrenIntim: {
    de: 'Herren: Intimbereich',
    en: 'Men: intimate area',
    audience: 'herren',
    rows: [
      { de: 'Pofalte', en: 'Gluteal fold', minutes: 15, price: 60 },
      { de: 'Gesäß', en: 'Buttocks', minutes: 15, price: 60 },
      { de: 'Damm', en: 'Perineum', minutes: 15, price: 60 },
      { de: 'Hoden', en: 'Testicles', minutes: 15, price: 60 },
      { de: 'Schaft', en: 'Shaft', minutes: 15, price: 60 },
      { de: 'Kompletter Bereich', en: 'Complete intimate area', minutes: 60, price: 220 },
      { de: 'Pubischer Bereich', en: 'Pubic area', minutes: 15, price: 60 },
    ],
  },

  microneedling: {
    de: '',
    en: '',
    audience: 'alle',
    rows: [
      { de: 'Gesicht', en: 'Face', minutes: 45, price: 200 },
      { de: 'Hals', en: 'Neck', minutes: 30, price: 180 },
      { de: 'Dekolleté (Damen)', en: 'Décolleté (women)', minutes: 45, price: 180, audience: 'damen' },
      { de: 'Brust (Herren)', en: 'Chest (men)', minutes: 45, price: 180, audience: 'herren' },
      { de: 'Komplett', en: 'Complete treatment', minutes: 90, price: 450 },
      { de: 'Narbenbehandlung', en: 'Scar treatment', minutes: 60, price: 250 },
      { de: 'Betäubungscreme', en: 'Numbing cream', minutes: 15, price: 20, addon: true },
    ],
  },

  // Laut Salonkee nur im Damen-Katalog buchbar.
  cellulite: {
    de: '',
    en: '',
    audience: 'damen',
    rows: [
      { de: 'Cellulite Massage 30 Min', en: '30-minute session', minutes: 30, price: 80 },
      { de: 'Cellulite Massage 1 Std', en: '60-minute session', minutes: 60, price: 140 },
      { de: 'Cellulite Massage 1 Std 30', en: '90-minute session', minutes: 90, price: 200 },
    ],
  },

  fettreduktion: {
    de: '',
    en: '',
    audience: 'alle',
    rows: [
      { de: 'Fettreduktion 30 Min', en: '30-minute session', minutes: 30, price: 80 },
      { de: 'Fettreduktion 1 Std', en: '60-minute session', minutes: 60, price: 140 },
      { de: 'Fettreduktion 1 Std 30', en: '90-minute session', minutes: 90, price: 200 },
    ],
  },

  wellnessMassage: {
    de: '',
    en: '',
    audience: 'alle',
    rows: [
      { de: 'Rücken-Schulter-Nacken-Massage', en: 'Back, shoulder & neck massage', minutes: 45, price: 58 },
      { de: 'Rücken-Schulter-Nacken-Massage', en: 'Back, shoulder & neck massage', minutes: 60, price: 78 },
      { de: 'Aromaöl-Massage für Rücken, Schulter & Nacken', en: 'Aroma-oil massage for back, shoulder & neck', minutes: 45, price: 78 },
      { de: 'Aromaöl-Massage für Rücken, Schulter & Nacken', en: 'Aroma-oil massage for back, shoulder & neck', minutes: 60, price: 90 },
      { de: 'Ganzkörpermassage mit Aromaölen', en: 'Full-body massage with aroma oils', minutes: 60, price: 78 },
      { de: 'Ganzkörpermassage mit Aromaölen', en: 'Full-body massage with aroma oils', minutes: 90, price: 120 },
      { de: 'Teilkörpermassage', en: 'Partial-body massage', minutes: 30, price: 45 },
    ],
  },

  therapeutischeMassage: {
    de: '',
    en: '',
    audience: 'alle',
    rows: [
      { de: 'Ersttermin mit Anamnese & Befundaufnahme', en: 'First appointment with intake & assessment', minutes: 90, price: 99 },
      { de: 'Sport- & Regenerationsmassage', en: 'Sports & recovery massage', minutes: 30, price: 50 },
      { de: 'Sport- & Regenerationsmassage', en: 'Sports & recovery massage', minutes: 60, price: 90 },
      { de: 'Sport- & Regenerationsmassage', en: 'Sports & recovery massage', minutes: 90, price: 120 },
      { de: 'Medizinisch-funktionelle Massage', en: 'Medical-functional massage', minutes: 30, price: 60 },
      { de: 'Medizinisch-funktionelle Massage', en: 'Medical-functional massage', minutes: 60, price: 100 },
      { de: 'Medizinisch-funktionelle Massage', en: 'Medical-functional massage', minutes: 90, price: 135 },
    ],
  },
} satisfies Record<string, PriceTable>;

export type PriceTableKey = keyof typeof PRICE_TABLES;

/** Ein Service-Knoten im JSON-LD, gespeist aus einer oder mehreren Tabellen. */
export interface PriceService {
  /** Fragment für die @id und zugleich Anker der Sektion auf der Seite. */
  anchor: string;
  nameDe: string;
  nameEn: string;
  serviceTypeDe: string;
  serviceTypeEn: string;
  descriptionDe: string;
  descriptionEn: string;
  tables: PriceTableKey[];
}

export const PRICE_SERVICES: PriceService[] = [
  {
    anchor: 'beratung',
    nameDe: 'Kostenlose Erstberatung',
    nameEn: 'Free initial consultation',
    serviceTypeDe: 'Beratung',
    serviceTypeEn: 'Consultation',
    descriptionDe:
      'Kostenloser Beratungstermin bei FareWell Nürnberg: Anamnese, Methodenwahl und persönlicher Behandlungsplan, ganz ohne Verpflichtung.',
    descriptionEn:
      'Free consultation at FareWell Nuremberg: assessment, choice of method and a personal treatment plan, entirely without obligation.',
    tables: ['beratung'],
  },
  {
    anchor: 'nadelepilation',
    nameDe: 'Nadelepilation (Elektrolyse)',
    nameEn: 'Needle epilation (electrolysis)',
    serviceTypeDe: 'Permanente Haarentfernung',
    serviceTypeEn: 'Permanent hair removal',
    descriptionDe:
      'Elektrolyse ist die einzige Methode der permanenten Haarentfernung. Jedes Haar wird einzeln an der Wurzel deaktiviert, geeignet für alle Haarfarben und Hauttypen. Preise für Damen und Herren gleich.',
    descriptionEn:
      'Electrolysis is the only method of permanent hair removal. Each hair is deactivated individually at the root, suitable for all hair colours and skin types. Prices are the same for women and men.',
    tables: ['nadelepilation'],
  },
  {
    anchor: 'laser',
    nameDe: 'Laser-Haarentfernung (Diodenlaser)',
    nameEn: 'Laser hair removal (diode laser)',
    serviceTypeDe: 'Dauerhafte Haarentfernung',
    serviceTypeEn: 'Long-lasting hair removal',
    descriptionDe:
      'Dauerhafte Haarentfernung mit modernem 4-Wellen-Diodenlaser und KI-gestützter Hauttyp-Erkennung, für Gesicht, Körper und Intimbereich.',
    descriptionEn:
      'Long-lasting hair removal with a modern four-wavelength diode laser and AI-assisted skin-type detection, for the face, body and intimate area.',
    tables: [
      'laserDamenGesicht',
      'laserDamenKoerper',
      'laserDamenIntim',
      'laserHerrenGesicht',
      'laserHerrenKoerper',
      'laserHerrenIntim',
    ],
  },
  {
    anchor: 'microneedling',
    nameDe: 'Radiofrequenz-Microneedling',
    nameEn: 'Radio-frequency microneedling',
    serviceTypeDe: 'Hautverjüngung',
    serviceTypeEn: 'Skin rejuvenation',
    descriptionDe:
      'Hautverjüngung durch Microneedling mit Radiofrequenz: regt Kollagen und Elastin an, strafft die Haut, glättet Narben und verfeinert Poren.',
    descriptionEn:
      'Skin rejuvenation through microneedling with radio frequency: it stimulates collagen and elastin, firms the skin, smooths scars and refines pores.',
    tables: ['microneedling'],
  },
  {
    anchor: 'cellulite',
    nameDe: 'Cellulite-Behandlung',
    nameEn: 'Cellulite treatment',
    serviceTypeDe: 'Body Forming',
    serviceTypeEn: 'Body forming',
    descriptionDe:
      'Kosmetische Cellulite-Behandlung mit Ultraschall und Vakuumtechnik. Sie aktiviert das Gewebe, fördert die Durchblutung und verbessert das Hautbild.',
    descriptionEn:
      'Cosmetic cellulite treatment with ultrasound and vacuum technology. It activates the tissue, supports circulation and improves the appearance of the skin.',
    tables: ['cellulite'],
  },
  {
    anchor: 'fettreduktion',
    nameDe: 'Ultraschall-Fettreduktion (Kavitation)',
    nameEn: 'Ultrasonic fat reduction (cavitation)',
    serviceTypeDe: 'Body Forming',
    serviceTypeEn: 'Body forming',
    descriptionDe:
      'Kosmetische Fettreduktion mit 40-kHz-Ultraschall und Vakuumtechnik zur gezielten Behandlung lokaler Fettdepots.',
    descriptionEn:
      'Cosmetic fat reduction with 40 kHz ultrasound (cavitation) and vacuum technology for the targeted treatment of local fat deposits.',
    tables: ['fettreduktion'],
  },
  {
    anchor: 'wellness-massage',
    nameDe: 'Wellness-Massage',
    nameEn: 'Wellness massage',
    serviceTypeDe: 'Massage',
    serviceTypeEn: 'Massage',
    descriptionDe:
      'Wellness-Massagen bei FareWell Nürnberg: Rücken-Schulter-Nacken-Massage, Ganzkörpermassage mit Aromaölen und Teilkörpermassage.',
    descriptionEn:
      'Wellness massages at FareWell Nuremberg: back, shoulder & neck massage, full-body massage with aroma oils and partial-body massage.',
    tables: ['wellnessMassage'],
  },
  {
    anchor: 'therapeutische-massage',
    nameDe: 'Therapeutische Massage',
    nameEn: 'Therapeutic massage',
    serviceTypeDe: 'Massage',
    serviceTypeEn: 'Massage',
    descriptionDe:
      'Therapeutische Massagen: Sport- & Regenerationsmassage, medizinisch-funktionelle Massage sowie Ersttermin mit Anamnese & Befundaufnahme.',
    descriptionEn:
      'Therapeutic massages: sports & recovery massage, medical-functional massage, plus a first appointment with intake & assessment.',
    tables: ['therapeutischeMassage'],
  },
];
