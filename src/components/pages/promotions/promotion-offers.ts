import { Bi } from './promotion-page.model';

/**
 * Die laufenden Aktionen, wie in src/llms.txt unter „Aktionen (aktuell)".
 * Eine Quelle für die Übersicht /promotionen und beide Varianten ihres
 * A/B-Tests. Rückseiten-Sätze (fact) stammen wörtlich aus den Aktionsseiten.
 */

export type OfferId = 'botox' | 'laser' | 'ipl' | 'elektrolyse' | 'nadelepilation' | 'microneedling';

/** Ein kleiner Rechner auf der Karte: Auswahl → Ergebnis. */
export interface ZoneCalc {
  label: Bi;
  options: readonly string[];
  results: readonly Bi[];
  note: Bi;
}

export interface PromoOffer {
  id: OfferId;
  path: string;
  tag: Bi;
  title: Bi;
  text: Bi;
  /** Kurzer Name auf der Karte der Drehbühne. */
  short: Bi;
  /** Der Wert, groß gesetzt: „50 %" oder „ab 89 €". */
  value: Bi;
  /** Derselbe Wert ohne „ab", für die große Ziffer im Hintergrund. */
  figure: Bi;
  image: string;
  imageAlt: Bi;
  imagePos: string;
  withCode: boolean;
  fact: Bi;
  foot: Bi;
  zones?: ZoneCalc;
}

export const PROMO_CODE = 'ERSTEBEHANDLUNG';
export const BOOKING_URL = 'https://salonkee.de/salon/farewell?lang=de';

const NB = ' ';
const FIFTY: Bi = { de: `50${NB}%`, en: '50%' };
const CODE_FOOT: Bi = { de: `Code ${PROMO_CODE}`, en: `Code ${PROMO_CODE}` };

export const PROMO_OFFERS: readonly PromoOffer[] = [
  {
    id: 'botox',
    path: '/behandlungen/botox-nuernberg',
    tag: { de: 'Ästhetische Medizin', en: 'Aesthetic medicine' },
    title: { de: 'Botox in Nürnberg', en: 'Botox in Nuremberg' },
    text: {
      de: 'Bei Dr. med. Andrea Leo, ab 16.11.2026 bei FareWell. Einzelne Regionen ab 89 €, eine Zone ab 109 €.',
      en: 'With Dr. med. Andrea Leo, at FareWell from 16 November 2026. Single regions from €89, one zone from €109.',
    },
    short: { de: 'Botox bei Dr. med. Andrea Leo', en: 'Botox with Dr. med. Andrea Leo' },
    value: { de: `ab${NB}89${NB}€`, en: `from${NB}€89` },
    figure: { de: `89${NB}€`, en: '€89' },
    image: '/assets/images/farewell/studio.webp',
    imageAlt: { de: 'Empfang im FareWell Salon in Nürnberg', en: 'Reception of the FareWell salon in Nuremberg' },
    imagePos: '50% 64%',
    withCode: false,
    fact: {
      de: 'Dr. med. Andrea Leo behandelt persönlich: approbiert seit 2016, seit 2018 in der ästhetischen Medizin.',
      en: 'Dr. med. Andrea Leo treats you in person: licensed since 2016, in aesthetic medicine since 2018.',
    },
    foot: { de: 'Ab 16.11.2026 bei FareWell', en: 'At FareWell from 16 Nov 2026' },
    zones: {
      label: {
        de: 'Nach Zonen, zum Beispiel Stirn, Zornesfalte oder Krähenfüße.',
        en: "By zones, for example forehead, frown lines or crow's feet.",
      },
      options: ['1', '2', '3', '4'],
      results: [
        { de: 'ab 109 €', en: 'from €109' },
        { de: 'ab 179 €', en: 'from €179' },
        { de: 'ab 229 €', en: 'from €229' },
        { de: 'ab 279 €', en: 'from €279' },
      ],
      note: {
        de: 'Der endgültige Preis hängt von Befund, Umfang und Produktmenge ab und wird dir vor der Behandlung genannt.',
        en: 'The final price depends on findings, scope and amount of product, and you are told it before the treatment.',
      },
    },
  },
  {
    id: 'laser',
    path: '/laser-haarentfernung-aktion-nuernberg',
    tag: { de: 'Laser', en: 'Laser' },
    title: { de: '50 % auf die erste Laserbehandlung', en: '50% off your first laser treatment' },
    text: {
      de: 'Dauerhafte Haarentfernung mit dem 4 Wellen Diodenlaser. Code ERSTEBEHANDLUNG, danach bis zu 30 % Zonen Rabatt.',
      en: 'Long-lasting hair removal with the 4-wavelength diode laser. Code ERSTEBEHANDLUNG, then up to 30% off by number of zones.',
    },
    short: { de: 'Erste Laserbehandlung', en: 'First laser treatment' },
    value: FIFTY,
    figure: FIFTY,
    image: '/assets/images/treatment/diodenlaser.webp',
    imageAlt: {
      de: 'Laserbehandlung am Rücken mit dem Diodenlaser bei FareWell',
      en: 'Diode laser treatment on the back at FareWell',
    },
    imagePos: '60% 50%',
    withCode: true,
    fact: {
      de: 'Je mehr Zonen, desto mehr Rabatt: 10 % ab 3, 20 % ab 4, 30 % ab 5 Zonen.',
      en: 'The more zones, the bigger the discount: 10% from 3, 20% from 4, 30% from 5 zones.',
    },
    foot: CODE_FOOT,
    zones: {
      label: {
        de: 'Wie viele Zonen buchst du nach der ersten Behandlung?',
        en: 'How many zones do you book after your first treatment?',
      },
      options: ['1', '2', '3', '4', '5+'],
      results: [
        { de: 'Ab 3 Zonen gibt es Rabatt', en: 'From 3 zones you get a discount' },
        { de: 'Ab 3 Zonen gibt es Rabatt', en: 'From 3 zones you get a discount' },
        { de: '10 % Zonen Rabatt', en: '10% zone discount' },
        { de: '20 % Zonen Rabatt', en: '20% zone discount' },
        { de: '30 % Zonen Rabatt', en: '30% zone discount' },
      ],
      note: {
        de: 'Der Zonen Rabatt ist nicht mit dem Neukunden-Rabatt kombinierbar.',
        en: 'The zone discount cannot be combined with the new-client discount.',
      },
    },
  },
  {
    id: 'ipl',
    path: '/ipl-dauerhafte-haarentfernung-aktion-nuernberg',
    tag: { de: 'Laser statt IPL', en: 'Laser instead of IPL' },
    title: { de: 'Die Alternative zu IPL', en: 'The alternative to IPL' },
    text: {
      de: '50 % auf die erste Behandlung mit dem Diodenlaser, Code ERSTEBEHANDLUNG.',
      en: '50% off your first diode laser treatment, code ERSTEBEHANDLUNG.',
    },
    short: { de: 'Diodenlaser statt IPL', en: 'Diode laser instead of IPL' },
    value: FIFTY,
    figure: FIFTY,
    image: '/assets/images/treatment/laser2.webp',
    imageAlt: {
      de: 'Laserbehandlung am Bein mit dem Diodenlaser bei FareWell',
      en: 'Diode laser treatment on the leg at FareWell',
    },
    imagePos: '54% 60%',
    withCode: true,
    fact: {
      de: 'Statt IPL der 4 Wellen Diodenlaser: präziser, wirksamer und für mehr Haut- und Haartypen geeignet.',
      en: 'Instead of IPL, the 4-wavelength diode laser: more precise, more effective and suitable for more skin and hair types.',
    },
    foot: CODE_FOOT,
  },
  {
    id: 'elektrolyse',
    path: '/elektrolyse-permanente-haarentfernung-aktion-nuernberg',
    tag: { de: 'Elektrolyse', en: 'Electrolysis' },
    title: { de: 'Permanente Haarentfernung', en: 'Permanent hair removal' },
    text: {
      de: '50 % auf die erste Elektrolyse Behandlung für Neukund:innen.',
      en: '50% off your first electrolysis treatment for new clients.',
    },
    short: { de: 'Erste Elektrolyse', en: 'First electrolysis' },
    value: FIFTY,
    figure: FIFTY,
    image: '/assets/images/treatment/nadelepilation.jpg',
    imageAlt: {
      de: 'Elektrolyse: eine feine Sonde an einem einzelnen Haar',
      en: 'Electrolysis: a fine probe at a single hair',
    },
    imagePos: '42% 62%',
    withCode: true,
    fact: {
      de: 'Die einzige in Deutschland rechtlich als permanent anerkannte Methode.',
      en: 'The only method legally recognised as permanent in Germany.',
    },
    foot: CODE_FOOT,
  },
  {
    id: 'nadelepilation',
    path: '/nadelepilation-angebot-nuernberg',
    tag: { de: 'Nadelepilation', en: 'Needle epilation' },
    title: { de: 'Das Angebot zur Nadelepilation', en: 'The needle epilation offer' },
    text: {
      de: '50 % auf die erste Behandlung für Neukund:innen.',
      en: '50% off your first treatment for new clients.',
    },
    short: { de: 'Erste Nadelepilation', en: 'First needle epilation' },
    value: FIFTY,
    figure: FIFTY,
    image: '/assets/images/treatment/nadel.jpg',
    imageAlt: { de: 'Nadelepilation an der Augenbraue bei FareWell', en: 'Needle epilation at the eyebrow at FareWell' },
    imagePos: '60% 48%',
    withCode: true,
    fact: {
      de: 'Jedes Haar einzeln an der Wurzel verödet, permanent und unabhängig von der Haarfarbe.',
      en: 'Each hair deactivated individually at the root, permanently and independently of hair colour.',
    },
    foot: CODE_FOOT,
  },
  {
    id: 'microneedling',
    path: '/microneedling-aktion-nuernberg',
    tag: { de: 'Microneedling', en: 'Microneedling' },
    title: { de: '50 % auf das erste Microneedling', en: '50% off your first microneedling' },
    text: {
      de: 'Radiofrequenz Microneedling für Gesicht, Hals und Dekolleté.',
      en: 'RF microneedling for face, neck and décolleté.',
    },
    short: { de: 'Erstes Microneedling', en: 'First microneedling' },
    value: FIFTY,
    figure: FIFTY,
    image: '/assets/images/treatment/microneedling.webp',
    imageAlt: {
      de: 'Radiofrequenz Microneedling im Gesicht bei FareWell',
      en: 'RF microneedling on the face at FareWell',
    },
    imagePos: '50% 56%',
    withCode: true,
    fact: {
      de: 'Regt deine natürliche Kollagenbildung an und strafft die Haut von innen, bei kurzer Ausfallzeit.',
      en: 'Stimulates your natural collagen production and firms the skin from within, with little downtime.',
    },
    foot: CODE_FOOT,
  },
];
