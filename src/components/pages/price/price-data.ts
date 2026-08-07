/**
 * Preiskatalog der Preisseite — einzige Quelle für die sichtbaren Tabellen UND
 * das JSON-LD (Service/Offer). Quelle der Preise: Salonkee
 * (salonkee.de/salon/farewell), Stand 30. Juli 2026, Preise in Euro inkl. 19%
 * MwSt. Bei Preisänderungen nur diese Datei pflegen — Tabellen und
 * strukturierte Daten ziehen automatisch nach.
 *
 * Gliederung wie im Buchungssystem: sortiert nach Methode, nicht nach
 * Geschlecht. Getrennt wird allein der Intimbereich, und zwar nach Anatomie
 * (Vulva / Penis), damit trans und nicht binäre Kund:innen buchen können, ohne
 * sich falsch einordnen zu müssen.
 *
 * Hausregel: „permanente Haarentfernung" = allein die Nadelepilation
 * (Elektrolyse); „dauerhafte" = Laser, Microneedling, Body Forming und alle
 * anderen Methoden.
 *
 * Preise sind wortwörtlich aus Salonkee übernommen. Dauern sind dort, wo
 * Salonkee sie nicht ausweist, aus der bisherigen Katalogpflege übernommen;
 * sie erscheinen nur im JSON-LD und bei den Massagen, nicht in den
 * Zonen-Tabellen. Die 15 Minuten Nachbearbeitungszeit je Behandlung sind
 * interne Pufferzeit und stehen bewusst nicht in den Kundenpreisen.
 */

export interface PriceRow {
  /** Optionsname wie in Salonkee (deutsch). */
  de: string;
  en: string;
  minutes: number;
  /** Preis in Euro inkl. MwSt.; null = kostenlos. */
  price: number | null;
  /**
   * Vorbereitungs-Zusatzleistung (Betäubungscreme): bleibt als Offer im
   * JSON-LD, zählt aber nicht als günstigste Behandlung (lowPrice).
   */
  addon?: boolean;
  /**
   * Dieselbe Behandlung unter ärztlicher Delegation, nur zu einem anderen
   * Preis: steht direkt unter ihrer Basiszeile, wird ihr untergeordnet
   * dargestellt (eingerückt, mit Tag) und trägt deshalb denselben Namen.
   * Im JSON-LD hängt DELEGATION_DE/EN als Zusatz am Namen des Offers.
   */
  delegation?: boolean;
}

/** Namenszusatz der Delegationsvarianten (Tag in der Tabelle, Name im JSON-LD). */
export const DELEGATION_DE = 'mit ärztlicher Delegation';
export const DELEGATION_EN = 'with medical delegation';

export interface PriceTable {
  /** Sichtbare Tabellenüberschrift (leer, wenn die Sektion nur eine Tabelle hat). */
  de: string;
  en: string;
  rows: PriceRow[];
}

export const PRICE_TABLES = {
  beratung: {
    de: '',
    en: '',
    rows: [
      { de: 'Beratungstermin für Neukund:innen', en: 'Consultation for new clients', minutes: 30, price: null },
      { de: 'Massage Beratungsgespräch', en: 'Massage consultation', minutes: 30, price: null },
    ],
  },

  nadelepilation: {
    de: '',
    en: '',
    rows: [
      { de: 'Sitzung 30 Minuten', en: '30-minute session', minutes: 30, price: 40 },
      { de: 'Sitzung 45 Minuten', en: '45-minute session', minutes: 45, price: 60 },
      // Termine unter ärztlicher Delegation: nur als volle Stunde buchbar,
      // deshalb jeweils direkt unter der passenden Sitzungsdauer.
      { de: 'Sitzung 60 Minuten', en: '60-minute session', minutes: 60, price: 80 },
      { de: 'Sitzung 60 Minuten', en: '60-minute session', minutes: 60, price: 120, delegation: true },
      { de: 'Sitzung 120 Minuten', en: '120-minute session', minutes: 120, price: 160 },
      { de: 'Sitzung 120 Minuten', en: '120-minute session', minutes: 120, price: 240, delegation: true },
      { de: 'Behandlungsvorbereitung mit Betäubungscreme', en: 'Preparation with numbing cream', minutes: 15, price: 20, addon: true },
    ],
  },

  laserGesicht: {
    de: 'Gesicht & Kopf',
    en: 'Face & head',
    rows: [
      { de: 'Augenbrauen', en: 'Eyebrows', minutes: 15, price: 40 },
      { de: 'Ohren', en: 'Ears', minutes: 15, price: 40 },
      { de: 'Oberlippe', en: 'Upper lip', minutes: 15, price: 50 },
      { de: 'Bartkontur Wangen', en: 'Beard contour (cheeks)', minutes: 15, price: 40 },
      { de: 'Koteletten', en: 'Sideburns', minutes: 15, price: 50 },
      { de: 'Wangen', en: 'Cheeks', minutes: 15, price: 50 },
      { de: 'Kinn', en: 'Chin', minutes: 15, price: 50 },
      { de: 'Unterkinn', en: 'Under the chin', minutes: 15, price: 50 },
      { de: 'Hals', en: 'Neck (front)', minutes: 15, price: 60 },
      { de: 'Nacken', en: 'Nape of the neck', minutes: 15, price: 50 },
      { de: 'Unteres Gesicht komplett', en: 'Complete lower face', minutes: 45, price: 180 },
      { de: 'Unteres Gesicht komplett', en: 'Complete lower face', minutes: 45, price: 250, delegation: true },
      { de: 'Kopf inkl. Nacken', en: 'Head incl. nape', minutes: 45, price: 140 },
    ],
  },

  laserKoerper: {
    de: 'Körper',
    en: 'Body',
    rows: [
      { de: 'Achseln', en: 'Underarms', minutes: 15, price: 60 },
      { de: 'Schultern', en: 'Shoulders', minutes: 30, price: 50 },
      { de: 'Oberarme', en: 'Upper arms', minutes: 30, price: 80 },
      { de: 'Unterarme', en: 'Forearms', minutes: 30, price: 80 },
      { de: 'Arme komplett', en: 'Complete arms', minutes: 60, price: 120 },
      { de: 'Brust', en: 'Chest', minutes: 30, price: 70 },
      { de: 'Bauch', en: 'Stomach', minutes: 30, price: 70 },
      { de: 'Brust und Bauch', en: 'Chest and stomach', minutes: 60, price: 110 },
      { de: 'Rücken Hälfte', en: 'Half back', minutes: 30, price: 70 },
      { de: 'Rücken komplett', en: 'Complete back', minutes: 45, price: 120 },
      { de: 'Oberschenkel', en: 'Thighs', minutes: 45, price: 90 },
      { de: 'Unterschenkel', en: 'Lower legs', minutes: 30, price: 80 },
      { de: 'Knie', en: 'Knees', minutes: 15, price: 40 },
      { de: 'Füße', en: 'Feet', minutes: 15, price: 40 },
      { de: 'Zehen', en: 'Toes', minutes: 15, price: 30 },
      { de: 'Beine komplett', en: 'Complete legs', minutes: 105, price: 180 },
      { de: 'Ganzer Körper', en: 'Full body', minutes: 210, price: 750 },
    ],
  },

  // Intern: wird von Nicole behandelt. Auf der Website steht dazu bewusst
  // nichts — die Einteilung nach Anatomie erklärt sich über die Tabellen.
  laserIntimVulva: {
    de: 'Intimbereich: Vulva',
    en: 'Intimate area: vulva',
    rows: [
      { de: 'Bikinielinie', en: 'Bikini line', minutes: 15, price: 60 },
      { de: 'Brazilian', en: 'Brazilian', minutes: 30, price: 100 },
      { de: 'Damm', en: 'Perineum', minutes: 15, price: 60 },
      { de: 'Pofalte', en: 'Gluteal fold', minutes: 15, price: 60 },
      { de: 'Gesäß', en: 'Buttocks', minutes: 15, price: 60 },
      { de: 'Intim komplett', en: 'Complete intimate area', minutes: 30, price: 200 },
    ],
  },

  // Intern: wird von Joé behandelt (siehe Hinweis oben).
  laserIntimPenis: {
    de: 'Intimbereich: Penis',
    en: 'Intimate area: penis',
    rows: [
      { de: 'Pofalte', en: 'Gluteal fold', minutes: 15, price: 60 },
      { de: 'Gesäß', en: 'Buttocks', minutes: 15, price: 60 },
      { de: 'Damm', en: 'Perineum', minutes: 15, price: 60 },
      { de: 'Hoden', en: 'Testicles', minutes: 15, price: 60 },
      { de: 'Pubischer Bereich', en: 'Pubic area', minutes: 15, price: 60 },
      { de: 'Schaft', en: 'Shaft', minutes: 15, price: 60 },
      {
        de: 'Intim vorne (Schaft, Hoden, Damm, Pubis)',
        en: 'Front intimate area (shaft, testicles, perineum, pubic area)',
        minutes: 45,
        price: 180,
      },
      {
        de: 'Intim vorne (Schaft, Hoden, Damm, Pubis)',
        en: 'Front intimate area (shaft, testicles, perineum, pubic area)',
        minutes: 45,
        price: 250,
        delegation: true,
      },
      { de: 'Intim komplett', en: 'Complete intimate area', minutes: 60, price: 220 },
      { de: 'Intim komplett', en: 'Complete intimate area', minutes: 60, price: 300, delegation: true },
    ],
  },

  hautverjuengung: {
    de: 'Hautverjüngung',
    en: 'Skin rejuvenation',
    rows: [
      { de: 'Gesicht', en: 'Face', minutes: 45, price: 200 },
      { de: 'Hals', en: 'Neck', minutes: 30, price: 180 },
      { de: 'Dekolleté', en: 'Décolleté', minutes: 45, price: 180 },
      { de: 'Brust', en: 'Chest', minutes: 45, price: 180 },
      { de: 'Komplett', en: 'Complete treatment', minutes: 90, price: 450 },
      { de: 'Behandlungsvorbereitung mit Betäubungscreme', en: 'Preparation with numbing cream', minutes: 15, price: 20, addon: true },
    ],
  },

  narbenbehandlung: {
    de: 'Narbenbehandlung',
    en: 'Scar treatment',
    rows: [
      { de: 'Narbenbehandlung', en: 'Scar treatment', minutes: 60, price: 250 },
      { de: 'Behandlungsvorbereitung mit Betäubungscreme', en: 'Preparation with numbing cream', minutes: 15, price: 20, addon: true },
    ],
  },

  fettreduktion: {
    de: 'Fettreduktion',
    en: 'Fat reduction',
    rows: [
      { de: 'Sitzung 30 Minuten', en: '30-minute session', minutes: 30, price: 80 },
      { de: 'Sitzung 60 Minuten', en: '60-minute session', minutes: 60, price: 140 },
      { de: 'Sitzung 90 Minuten', en: '90-minute session', minutes: 90, price: 200 },
      { de: 'Paket 2 Stunden', en: '2-hour package', minutes: 120, price: 230 },
      { de: 'Paket 5 Stunden', en: '5-hour package', minutes: 300, price: 550 },
    ],
  },

  cellulite: {
    de: 'Cellulite Behandlung',
    en: 'Cellulite treatment',
    rows: [
      { de: 'Sitzung 30 Minuten', en: '30-minute session', minutes: 30, price: 80 },
      { de: 'Sitzung 60 Minuten', en: '60-minute session', minutes: 60, price: 140 },
      { de: 'Sitzung 90 Minuten', en: '90-minute session', minutes: 90, price: 200 },
      { de: 'Paket 2 Stunden', en: '2-hour package', minutes: 120, price: 230 },
      { de: 'Paket 5 Stunden', en: '5-hour package', minutes: 300, price: 550 },
    ],
  },

  wellnessMassage: {
    de: '',
    en: '',
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
  /** Anker der Sektion auf der Seite; bildet zugleich die url des Service. */
  anchor: string;
  /**
   * Fragment für die @id, falls sich mehrere Services eine Sektion teilen
   * (Body Forming). Ohne Angabe gilt der anchor.
   */
  id?: string;
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
    nameDe: 'Kostenlose Beratung',
    nameEn: 'Free consultation',
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
      'Elektrolyse ist die einzige Methode, die in Deutschland als permanente Haarentfernung bezeichnet werden darf. Jedes Haar wird einzeln an der Wurzel deaktiviert, geeignet für alle Haarfarben und Hauttypen. Abgerechnet wird nach Sitzungsdauer, für alle gleich.',
    descriptionEn:
      'Electrolysis is the only method that may legally be called permanent hair removal in Germany. Each hair is deactivated individually at the root, suitable for all hair colours and skin types. Charged by session length, the same for everyone.',
    tables: ['nadelepilation'],
  },
  {
    anchor: 'laser',
    nameDe: 'Laser (4 Wellen Diodenlaser)',
    nameEn: 'Laser (4-wavelength diode laser)',
    serviceTypeDe: 'Dauerhafte Haarentfernung',
    serviceTypeEn: 'Long-lasting hair removal',
    descriptionDe:
      'Dauerhafte Haarentfernung mit dem 4 Wellen Diodenlaser und KI gestützter Hauttyp-Erkennung, für Gesicht, Körper und Intimbereich. Sortiert nach Zone, der Intimbereich nach Anatomie (Vulva / Penis).',
    descriptionEn:
      'Long-lasting hair removal with the four-wavelength diode laser and AI-assisted skin-type detection, for the face, body and intimate area. Sorted by area, the intimate area by anatomy (vulva / penis).',
    tables: ['laserGesicht', 'laserKoerper', 'laserIntimVulva', 'laserIntimPenis'],
  },
  {
    anchor: 'microneedling',
    nameDe: 'Radiofrequenz Microneedling: Hautverjüngung',
    nameEn: 'Radio-frequency microneedling: skin rejuvenation',
    serviceTypeDe: 'Hautverjüngung',
    serviceTypeEn: 'Skin rejuvenation',
    descriptionDe:
      'Hautverjüngung durch Microneedling mit Radiofrequenz: regt Kollagen und Elastin an, strafft die Haut und verfeinert Poren. Für Gesicht, Hals, Dekolleté und Brust.',
    descriptionEn:
      'Skin rejuvenation through microneedling with radio frequency: it stimulates collagen and elastin, firms the skin and refines pores. For the face, neck, décolleté and chest.',
    tables: ['hautverjuengung'],
  },
  {
    anchor: 'narbenbehandlung',
    nameDe: 'Narbenbehandlung mit Radiofrequenz Microneedling',
    nameEn: 'Scar treatment with radio-frequency microneedling',
    serviceTypeDe: 'Narbenbehandlung',
    serviceTypeEn: 'Scar treatment',
    descriptionDe:
      'Behandlung von Aknenarben, Narben nach OP und Verletzungen sowie Dehnungsstreifen mit Radiofrequenz Microneedling bei FareWell Nürnberg. 60 Minuten, auf Wunsch mit Betäubungscreme.',
    descriptionEn:
      'Treatment of acne scars, scars after surgery or injury and stretch marks with radio-frequency microneedling at FareWell Nuremberg. 60 minutes, with numbing cream on request.',
    tables: ['narbenbehandlung'],
  },
  {
    anchor: 'body-forming',
    id: 'fettreduktion',
    nameDe: 'Body Forming: Fettreduktion',
    nameEn: 'Body forming: fat reduction',
    serviceTypeDe: 'Body Forming',
    serviceTypeEn: 'Body forming',
    descriptionDe:
      'Kosmetische Körperbehandlung mit Ultraschall Kavitation und Radiofrequenz an lokalen Zonen. Keine medizinische Behandlung und keine Abnehmbehandlung.',
    descriptionEn:
      'Cosmetic body treatment with ultrasound cavitation and radio frequency on local areas. Not a medical treatment and not a weight-loss treatment.',
    tables: ['fettreduktion'],
  },
  {
    anchor: 'body-forming',
    id: 'cellulite',
    nameDe: 'Body Forming: Cellulite Behandlung',
    nameEn: 'Body forming: cellulite treatment',
    serviceTypeDe: 'Body Forming',
    serviceTypeEn: 'Body forming',
    descriptionDe:
      'Kosmetische Cellulite Behandlung mit Ultraschall und Vakuumtechnik. Sie aktiviert das Gewebe, fördert die Durchblutung und verbessert das Hautbild.',
    descriptionEn:
      'Cosmetic cellulite treatment with ultrasound and vacuum technology. It activates the tissue, supports circulation and improves the appearance of the skin.',
    tables: ['cellulite'],
  },
  {
    anchor: 'wellness-massage',
    nameDe: 'Wellness Massage',
    nameEn: 'Wellness massage',
    serviceTypeDe: 'Massage',
    serviceTypeEn: 'Massage',
    descriptionDe:
      'Wellness Massagen bei FareWell Nürnberg: Rücken-Schulter-Nacken-Massage, Ganzkörpermassage mit Aromaölen und Teilkörpermassage.',
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
      'Therapeutische Massagen: Sport- und Regenerationsmassage, medizinisch-funktionelle Massage sowie Ersttermin mit Anamnese und Befundaufnahme.',
    descriptionEn:
      'Therapeutic massages: sports & recovery massage, medical-functional massage, plus a first appointment with intake & assessment.',
    tables: ['therapeutischeMassage'],
  },
];
