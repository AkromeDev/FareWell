/**
 * Belegungsmodell des Studios — die eine Quelle für den Wochenkalender, die
 * Fließtexte und JobPosting.workHours auf allen Karriere-Seiten.
 *
 * Der Grundtakt:
 *   Kosmetik & ästhetische Medizin  Mo–Fr 10–20, Sa 08–17  (Behandlungsbetrieb)
 *   Massage                         Mo–Sa 08–22            (eigener Raum)
 *   Yoga & Tanz                     nur außerhalb des Behandlungsbetriebs:
 *                                   Mo–Fr 07–09 und ab 19:30, Sa ab 18:00,
 *                                   So ganztägig
 *
 * Warum Kurse ihr eigenes Fenster brauchen: Sie bringen Musik und Bewegung mit
 * und passen nicht neben eine laufende Behandlung. Die Massagezeiten (08–22)
 * überlappen die Kursfenster bewusst — beides ist *möglich*, belegt ist es erst
 * durch eine Buchung. Wer zuerst da ist, hat den Platz.
 */

/** Aus wessen Perspektive der Kalender gelesen wird. */
export type KarriereRole = 'kosmetik' | 'massage' | 'botox' | 'kurs' | 'uebersicht';

/** Die drei Spuren, die sich im Studio den Tag teilen. */
export type ZeitLane = 'behandlung' | 'massage' | 'kurs';

export interface ZeitBand {
  lane: ZeitLane;
  /** Dezimalstunde: 19.5 = 19:30. */
  start: number;
  end: number;
  /**
   * Fenster mit einer festen monatlichen Belegung (aktuell nur der letzte
   * Dienstagabend, der dem Yoga gehört).
   */
  reserved?: boolean;
}

export interface ZeitTag {
  key: string;
  de: string;
  en: string;
  /** Kürzel für die Spaltenköpfe. */
  shortDe: string;
  shortEn: string;
  bands: ZeitBand[];
}

/** Erste und letzte im Raster dargestellte Stunde. */
export const GRID_START = 7;
export const GRID_END = 22;
export const GRID_SPAN = GRID_END - GRID_START;

/** Reihenfolge der Spuren im Tagesstreifen (links nach rechts). */
export const LANE_ORDER: ZeitLane[] = ['behandlung', 'massage', 'kurs'];

/** Welche Spur der jeweiligen Rolle gehört; 'uebersicht' hebt nichts hervor. */
export const ROLE_LANE: Record<KarriereRole, ZeitLane | null> = {
  kosmetik: 'behandlung',
  botox: 'behandlung',
  massage: 'massage',
  kurs: 'kurs',
  uebersicht: null,
};

/** Werktags-Streifen: Behandlungen 10–20, Massage 08–22, Kurse davor und danach. */
function weekday(reservedEvening = false): ZeitBand[] {
  return [
    { lane: 'behandlung', start: 10, end: 20 },
    { lane: 'massage', start: 8, end: 22 },
    { lane: 'kurs', start: 7, end: 9 },
    { lane: 'kurs', start: 19.5, end: 22, reserved: reservedEvening },
  ];
}

export const ZEIT_WOCHE: ZeitTag[] = [
  { key: 'mo', de: 'Montag', en: 'Monday', shortDe: 'Mo', shortEn: 'Mon', bands: weekday() },
  // Der letzte Dienstag im Monat gehört dem Yoga — bislang die einzige feste
  // Belegung im ganzen Kursraster.
  { key: 'di', de: 'Dienstag', en: 'Tuesday', shortDe: 'Di', shortEn: 'Tue', bands: weekday(true) },
  { key: 'mi', de: 'Mittwoch', en: 'Wednesday', shortDe: 'Mi', shortEn: 'Wed', bands: weekday() },
  { key: 'do', de: 'Donnerstag', en: 'Thursday', shortDe: 'Do', shortEn: 'Thu', bands: weekday() },
  { key: 'fr', de: 'Freitag', en: 'Friday', shortDe: 'Fr', shortEn: 'Fri', bands: weekday() },
  {
    key: 'sa',
    de: 'Samstag',
    en: 'Saturday',
    shortDe: 'Sa',
    shortEn: 'Sat',
    // Samstags öffnet der Behandlungsbetrieb früher und schließt früher; für
    // ein Morgenfenster vor 08:00 bleibt keine sinnvolle Stunde übrig.
    bands: [
      { lane: 'behandlung', start: 8, end: 17 },
      { lane: 'massage', start: 8, end: 22 },
      { lane: 'kurs', start: 18, end: 22 },
    ],
  },
  {
    key: 'so',
    de: 'Sonntag',
    en: 'Sunday',
    shortDe: 'So',
    shortEn: 'Sun',
    // Sonntags ruht der Behandlungsbetrieb: das einzige Fenster ohne
    // Lärmkonflikt, und damit der ruhigste Slot für Kurse.
    bands: [{ lane: 'kurs', start: GRID_START, end: GRID_END }],
  },
];

/** Dezimalstunde als 'HH:MM'. */
export function formatTime(value: number): string {
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** Position eines Bandes im Raster, in Prozent der Gesamthöhe. */
export function bandTop(band: ZeitBand): number {
  return ((band.start - GRID_START) / GRID_SPAN) * 100;
}

export function bandHeight(band: ZeitBand): number {
  return ((band.end - band.start) / GRID_SPAN) * 100;
}
