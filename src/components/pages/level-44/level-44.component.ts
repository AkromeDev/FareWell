import {
  FRANZISKA_PREUSCHE_ID,
  LEVEL44_BRAND_ID,
  ORG_REF,
} from 'src/app/domain/entities';
import {
  LEVEL44,
  LEVEL44_SITE_LABEL,
  Level44OfferId,
  Level44Session,
  euroDe,
  euroEn,
  level44BookingUrl,
  level44EventId,
  level44Minutes,
  level44Offer,
  level44Price,
  level44SalonUrl,
  level44SiteUrl,
  sessionWhen,
  upcomingSessions,
} from 'src/app/domain/level44';
import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { ScrollToDirective } from 'src/directives/scroll-to.directive';
import { Lang, LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';
import { sizeOf, srcsetOf } from 'src/services/responsive-images';

const PAGE_PATH = '/behandlungen/level-44';
const ORIGIN = 'https://farewell.salon';
/** Ihr Original-Signet aus der Mail vom 03.11.2026. Nur einbinden, nie nachzeichnen. */
const SIGNET = 'assets/images/partner/level44-signet.png';
/**
 * Echte Bilder ihrer Session bei FareWell am 01.11.2026, von Joé zur Nutzung
 * freigegeben (09.11.2026). Originale: FareWell/domains/media/photo/level-44/.
 */
const PHOTO_HERO = 'assets/images/partner/level44-breathwork-gastgeberin.webp';
const PHOTO_PORTRAIT = 'assets/images/partner/level44-franziska-portrait.jpg';
const GALLERY: { src: string; alt: Bi }[] = [
  {
    src: 'assets/images/partner/level44-session-raum.jpg',
    alt: { de: 'Teilnehmende liegen mit Kopfhörern und Augenmaske auf Matten im Saal von FareWell', en: 'Participants lying on mats with headphones and eye masks in the FareWell hall' },
  },
  {
    src: 'assets/images/partner/level44-session-gruppe.jpg',
    alt: { de: 'Gruppe bei einer 9D Journey am Abend, leuchtende Kopfhörer im warmen Licht', en: 'A group during an evening 9D journey, glowing headphones in warm light' },
  },
  {
    src: 'assets/images/partner/level44-kopfhoerer.jpg',
    alt: { de: 'Die 9D-Kopfhörer im Koffer, blau leuchtend', en: 'The 9D headphones glowing blue in their case' },
  },
];
/** Vorschaubild beim Teilen. */
const OG_IMAGE = `${ORIGIN}/assets/images/partner/level44-breathwork-gastgeberin.jpg`;
const PHONE_HREF = 'tel:+4915757995694';
const PHONE_LABEL = '+49 157 5799 5694';
/** Ihre eigene Website und ihr Instagram: aus level44.json, dort einmal geschrieben. */
const LEVEL44_URL = LEVEL44.brandSite.origin;
const INSTAGRAM_URL = LEVEL44.brandSite.instagram;
/**
 * Die Hörprobe aus ihrer Mail vom 03.11.2026. Wistia lädt von einem US-Server,
 * deshalb Zwei-Klick-Lösung: der iframe entsteht erst nach dem Klick. Das
 * player.js aus ihrem Snippet braucht der iframe nicht und bleibt weg, damit
 * vor dem Klick wirklich keine Anfrage an Wistia geht.
 */
const WISTIA_EMBED = 'https://fast.wistia.net/embed/iframe/nx15jjlaj3?web_component=true&seo=true';
/**
 * Preise, Dauer, Termine, der Code für die erste Journey, die Platzzahl und
 * alle Buchungslinks stehen in src/app/domain/level44.json und nirgends sonst.
 * Dieselbe Datei liest die LEVEL 44 Website (https://farewell.salon/data/level44.json).
 * Salonkee ist die Wahrheit: einen Preis erst dort ändern, dann in der Datei.
 */
const GROUP_PRICE = level44Price('group');
const EVENING_PRICE = level44Price('evening');
const FIRST_PRICE = LEVEL44.firstVisit.price;
const CODE = LEVEL44.firstVisit.code;
const MAX_PLACES = LEVEL44.groupMaxPlaces;
/** Der Abend dauert so lang wie sein Platz im Kalender, in Stunden. */
const EVENING_HOURS = level44Minutes('evening') / 60;

/**
 * Arbeitsteilung mit ihrer eigenen Website (AI-SEO-STRATEGY.md, „The three sites“).
 * false: ihre Website ist noch nicht öffentlich, diese Seite ist das Zuhause der
 * Marke und erklärt auch die Methode und stellt Franziska vor. true: Methode,
 * Journeys, Online-Sessions und Franziska selbst stehen auf ihrer Website, hier
 * bleibt der Ort: Termine, Preise, Buchung, Anfahrt, Kontraindikationen, FAQ.
 * Der Wert steht in level44.json (brandSite.public).
 */
const BRAND_SITE_PUBLIC = LEVEL44.brandSite.public;

const DE_TITLE = '9D Breathwork Nürnberg: LEVEL 44 bei FareWell';
const EN_TITLE = '9D Breathwork Nuremberg: LEVEL 44 at FareWell';
const DE_DESCRIPTION_BASE =
  '9D Breathwork und Soul Touch mit Franziska Preusche bei FareWell in Nürnberg: geführte Atemreisen über Kopfhörer.';
const EN_DESCRIPTION_BASE =
  '9D Breathwork and Soul Touch with Franziska Preusche at FareWell Nuremberg: guided breath journeys on headphones.';

/**
 * Der letzte Satz der Beschreibung nennt die nächsten Termine aus level44.json.
 * Mit null, einem oder zwei Terminen bleibt die Beschreibung zwischen 120 und
 * 155 Zeichen (level-44.component.spec.ts prüft alle drei Fälle).
 */
export function level44Description(sessions: Level44Session[]): Bi {
  const next = sessions.slice(0, 2).map((session) => sessionWhen(session));
  const short = (when: { dateDe: string }) => when.dateDe.slice(3, 9);
  const shortEn = (when: { dateEn: string }) => when.dateEn.split(' ').slice(1, 3).join(' ');
  if (next.length === 0) {
    return {
      de: `${DE_DESCRIPTION_BASE} Jeden zweiten Sonntag um 11:00 Uhr.`,
      en: `${EN_DESCRIPTION_BASE} Every second Sunday at 11:00.`,
    };
  }
  if (next.length === 1) {
    return {
      de: `${DE_DESCRIPTION_BASE} Nächste Journey am ${next[0].dateDe.slice(3)}.`,
      en: `${EN_DESCRIPTION_BASE} Next journey on ${next[0].dateEn.slice(4)}.`,
    };
  }
  return {
    de: `${DE_DESCRIPTION_BASE} Nächste Termine: ${short(next[0])} und ${next[1].dateDe.slice(3)}.`,
    en: `${EN_DESCRIPTION_BASE} Next journeys ${shortEn(next[0])} and ${next[1].dateEn.slice(4)}.`,
  };
}

/** Zweisprachiger Text. Beide Fassungen stehen im DOM, das globale CSS blendet eine aus. */
export interface Bi {
  de: string;
  en: string;
}

interface Stat {
  value: Bi;
  label: Bi;
}

interface NineElement {
  title: Bi;
  text: Bi;
}

export interface Offer {
  /** Bei Breathwork die id des Angebots in level44.json. */
  id: string;
  title: Bi;
  tag: Bi;
  text: Bi;
  facts: Bi[];
  /** „Enthalten“-Liste. */
  includes?: Bi[];
  /**
   * Beschriftung des Buchungsbuttons. Gezeigt wird er nur, wenn das Angebot laut
   * level44.json buchbar ist; wohin er führt, steht dort (directLink, salonkeeServiceId).
   */
  cta?: Bi;
  /** Hinweis statt Button. */
  later?: Bi;
}

interface PriceRow {
  name: Bi;
  duration: Bi;
  price: Bi;
}

interface FaqEntry {
  q: Bi;
  a: Bi;
}

/** Die Eckdaten unter dem Kopf. Jede Zahl kommt aus level44.json. */
const STATS: Stat[] = [
  {
    value: { de: euroDe(GROUP_PRICE), en: euroEn(GROUP_PRICE) },
    label: { de: 'pro Journey in der Gruppe, ca. 2,5–3 Stunden', en: 'per group journey, about 2.5–3 hours' },
  },
  {
    value: { de: euroDe(FIRST_PRICE), en: euroEn(FIRST_PRICE) },
    label: { de: `für deine erste Journey mit dem Code ${CODE}`, en: `for your first journey with the code ${CODE}` },
  },
  {
    value: { de: String(MAX_PLACES), en: String(MAX_PLACES) },
    label: { de: 'Plätze höchstens in jeder Gruppe', en: 'places at most in each group' },
  },
  {
    value: { de: 'So 11:00', en: 'Sun 11:00' },
    label: { de: 'jeden zweiten Sonntag bei FareWell', en: 'every second Sunday at FareWell' },
  },
];

/** Der Satz zum Preis der ersten Journey, überall derselbe. */
const FIRST_VISIT: Bi = {
  de: `deine erste Journey ${euroDe(FIRST_PRICE)} mit dem Code ${CODE}`,
  en: `your first journey ${euroEn(FIRST_PRICE)} with the code ${CODE}`,
};
const FIRST_VISIT_RULE: Bi = {
  de: 'einmal pro Person, nur für Neukunden',
  en: 'once per person, new clients only',
};

const BENEFITS: Bi[] = [
  { de: 'bewusste Wahrnehmung deiner Gefühle und Körperempfindungen', en: 'conscious awareness of your feelings and physical sensations' },
  { de: 'Abstand vom Gedankenkarussell', en: 'distance from the carousel of thoughts' },
  { de: 'persönliche Reflexion und neue Perspektiven', en: 'personal reflection and new perspectives' },
  { de: 'Momente von Ruhe und Entspannung', en: 'moments of calm and relaxation' },
  { de: 'das bewusste Erleben emotionaler Themen', en: 'consciously experiencing emotional themes' },
  { de: 'mehr Aufmerksamkeit für deine eigenen Bedürfnisse', en: 'more attention for your own needs' },
  { de: 'einen bewussten Übergang aus dem Alltag in einen Moment für dich', en: 'a conscious transition from everyday life into a moment for yourself' },
];

/**
 * Die neun Bezeichnungen aus ihrer Mail, an drei Stellen entschärft (Text vom
 * 04.11.2026): ohne „Gehirnwellen“ in den Titeln und ohne das Wort
 * „Hypnosetherapie“, denn sie ist keine Heilpraktikerin (HeilprG, HWG).
 */
const NINE: NineElement[] = [
  {
    title: { de: 'Multidimensionale Klangerfahrung', en: 'Multidimensional sound' },
    text: { de: 'Räumlich gestaltete Klanglandschaften: Musik, Stimmen und Geräusche aus unterschiedlichen Richtungen.', en: 'Spatially designed soundscapes: music, voices and sounds from different directions.' },
  },
  {
    title: { de: 'Binaurale Beats', en: 'Binaural beats' },
    text: { de: 'Leicht unterschiedliche Tonfrequenzen auf beiden Ohren, eingesetzt als akustisches Gestaltungselement. Bestimmte Veränderungen der Gehirnaktivität sind dadurch nicht garantiert.', en: 'Slightly different tone frequencies in each ear, used as an acoustic design element. Specific changes in brain activity are not guaranteed.' },
  },
  {
    title: { de: 'Solfeggio-Frequenzen', en: 'Solfeggio frequencies' },
    text: { de: 'Tonfrequenzen aus spirituellen und meditativen Klangkonzepten.', en: 'Tone frequencies from spiritual and meditative sound concepts.' },
  },
  {
    title: { de: 'Isochronische Töne', en: 'Isochronic tones' },
    text: { de: 'Rhythmisch pulsierende Tonsignale als weiteres Element der Klanggestaltung.', en: 'Rhythmically pulsing tone signals as a further element of the sound design.' },
  },
  {
    title: { de: '432 Hz Tuning', en: '432 Hz tuning' },
    text: { de: 'Musikalische Elemente können auf 432 Hz gestimmt sein. Eine besondere gesundheitliche Wirkung dieser Stimmung ist wissenschaftlich nicht gesichert.', en: 'Musical elements may be tuned to 432 Hz. A particular health effect of this tuning is not scientifically established.' },
  },
  {
    title: { de: 'Somatisches Breathwork', en: 'Somatic breathwork' },
    text: { de: 'Bewusste Atmung, verbunden mit der Wahrnehmung körperlicher Empfindungen.', en: 'Conscious breathing, connected with the awareness of physical sensations.' },
  },
  {
    title: { de: 'Subliminale Audio-Elemente', en: 'Subliminal audio elements' },
    text: { de: 'Unterschwellige sprachliche Audioelemente als Teil des 9D-Konzepts. Eine medizinische oder therapeutische Anwendung findet nicht statt.', en: 'Subliminal spoken audio elements as part of the 9D concept. This is not a medical or therapeutic application.' },
  },
  {
    title: { de: 'Hypnotic Coaching', en: 'Hypnotic coaching' },
    text: { de: 'Gesprochene Impulse begleiten die Journey und laden zur persönlichen Reflexion ein.', en: 'Spoken prompts accompany the journey and invite personal reflection.' },
  },
  {
    title: { de: 'Bioakustische Sound-Effekte', en: 'Bioacoustic sound effects' },
    text: { de: 'Spezielle Soundeffekte, die das räumliche Hörerlebnis verstärken.', en: 'Special sound effects that intensify the spatial listening experience.' },
  },
];

/** Ein Breathwork-Angebot dieser Seite; seine id ist die des Angebots in level44.json. */
interface BreathOffer extends Offer {
  id: Level44OfferId;
}

/** Ein Termin, wie die Liste oben auf der Seite ihn zeigt. */
interface DateRow {
  id: string;
  dateDe: string;
  dateEn: string;
  time: string;
  endTime: string;
  journey: string;
  /** Die Seite der Journey auf ihrer Website. Verlinkt wird sie erst, wenn die öffentlich ist. */
  journeyUrl: string;
}

const OFFERS: BreathOffer[] = [
  {
    id: 'group',
    title: { de: '9D Group Experience', en: '9D Group Experience' },
    tag: { de: 'Gemeinsam atmen. Individuell erleben.', en: 'Breathe together. Experience individually.' },
    text: {
      de: 'Eine Journey, ein gemeinsamer Raum und deine ganz persönliche Erfahrung. Jede Journey hat einen eigenen Schwerpunkt, zum Beispiel bewusstes Loslassen, innere Klarheit oder einen Neubeginn. Niemand erwartet, dass du etwas Bestimmtes fühlst oder mit der Gruppe teilst.',
      en: 'One journey, one shared room and your own very personal experience. Each journey has its own focus, for example conscious letting go, inner clarity or a new beginning. Nobody expects you to feel anything in particular or to share anything with the group.',
    },
    facts: [
      { de: 'Jeden zweiten Sonntag, 11:00 Uhr. Die nächsten Termine stehen oben auf dieser Seite.', en: 'Every second Sunday, 11:00. The next dates are at the top of this page.' },
      { de: `Ca. 2,5–3 Stunden inklusive Einführung und Integration · höchstens ${MAX_PLACES} Plätze`, en: `About 2.5–3 hours including introduction and integration · ${MAX_PLACES} places at most` },
      { de: `${euroDe(GROUP_PRICE)} · ${FIRST_VISIT.de} (${FIRST_VISIT_RULE.de})`, en: `${euroEn(GROUP_PRICE)} · ${FIRST_VISIT.en} (${FIRST_VISIT_RULE.en})` },
    ],
    cta: { de: 'Nächste Journey buchen', en: 'Book the next journey' },
  },
  {
    id: 'group-integration',
    title: { de: '9D Group Experience + Soul Touch Integration', en: '9D Group Experience + Soul Touch Integration' },
    tag: { de: 'Deine Journey darf nachwirken.', en: 'Let your journey resonate.' },
    text: {
      de: 'Im Anschluss an die Sonntagsjourney gibt es einen exklusiven Platz für eine individuelle Soul Touch Session: achtsame Berührung, sanfte Atembegleitung und Zeit für dich.',
      en: 'After the Sunday journey there is one exclusive place for an individual Soul Touch session: mindful touch, gentle breath guidance and time for yourself.',
    },
    includes: [
      { de: 'Teilnahme an der 9D Group Experience', en: 'Taking part in the 9D Group Experience' },
      { de: 'Gemeinsame Integration', en: 'Shared integration' },
      { de: 'Danach 60 Minuten Soul Touch', en: 'Then 60 minutes of Soul Touch' },
    ],
    facts: [{ de: `${euroDe(level44Price('group-integration'))} · ein Platz pro Termin`, en: `${euroEn(level44Price('group-integration'))} · one place per date` }],
    cta: { de: 'Experience mit Integration buchen', en: 'Book the experience with integration' },
    later: { de: 'Online noch nicht buchbar. Bitte frag uns direkt.', en: 'Not bookable online yet. Please ask us directly.' },
  },
  {
    id: 'evening',
    title: { de: '9D Evening Experience', en: '9D Evening Experience' },
    tag: { de: 'Dein bewusster Abschluss des Tages.', en: 'A conscious end to your day.' },
    text: {
      de: 'Eine geführte 9D Atemreise nach einem vollen Tag, mit immersiver Klangwelt und Zeit zur Integration.',
      en: 'A guided 9D breath journey after a full day, with an immersive sound world and time for integration.',
    },
    facts: [{ de: `Geplant donnerstags, 19:30 Uhr · ca. ${EVENING_HOURS} Stunden · ${euroDe(EVENING_PRICE)}, ${FIRST_VISIT.de}`, en: `Planned on Thursdays, 19:30 · about ${EVENING_HOURS} hours · ${euroEn(EVENING_PRICE)}, ${FIRST_VISIT.en}` }],
    cta: { de: 'Evening Experience buchen', en: 'Book the evening experience' },
    later: { de: 'Start folgt.', en: 'Start date to follow.' },
  },
  {
    id: 'private',
    title: { de: '9D Private Experience', en: '9D Private Experience' },
    tag: { de: 'Deine Journey. Dein persönlicher Raum.', en: 'Your journey. Your personal space.' },
    text: {
      de: 'Deine Bedürfnisse und deine persönliche Intention stehen im Mittelpunkt. Wir beginnen mit einem Vorgespräch: Was beschäftigt dich gerade? Welches Thema möchtest du mitnehmen? Danach begleite ich dich durch eine passende 9D Atemreise, anschließend nehmen wir uns Zeit für Integration und Reflexion.',
      en: 'Your needs and your personal intention are at the centre. We begin with a conversation: what is on your mind right now? Which theme would you like to take along? I then guide you through a fitting 9D breath journey, and afterwards we take time for integration and reflection.',
    },
    includes: [
      { de: 'Persönliches Vorgespräch', en: 'Personal conversation beforehand' },
      { de: 'Individuell ausgewählte Journey', en: 'Individually chosen journey' },
      { de: 'Persönliche Begleitung', en: 'Personal guidance' },
      { de: 'Integrationsgespräch', en: 'Integration conversation' },
      { de: 'Reflexionsimpulse für danach', en: 'Reflection prompts for afterwards' },
    ],
    facts: [{ de: `Ca. ${level44Minutes('private')} Minuten · ${euroDe(level44Price('private'))}`, en: `About ${level44Minutes('private')} minutes · ${euroEn(level44Price('private'))}` }],
    cta: { de: 'Private Experience buchen', en: 'Book the private experience' },
  },
  {
    id: 'premium',
    title: { de: '9D Private Premium Experience', en: '9D Private Premium Experience' },
    tag: { de: 'Vom Erleben ins Verkörpern.', en: 'From experiencing to embodying.' },
    text: {
      de: 'Eine persönliche Atemreise mit anschließender achtsamer Soul Touch Körperarbeit. Nach Vorgespräch und Journey folgt eine körperorientierte Integrationsphase: sanfte Berührung, bewusste Atmung und Ruhe, um wieder im Körper anzukommen. Du musst nichts sofort verstehen, erklären oder verändern. Die Körperarbeit richtet sich nach deinem Befinden und deinen Grenzen.',
      en: 'A personal breath journey followed by mindful Soul Touch bodywork. After the conversation and the journey comes a body-oriented integration phase: gentle touch, conscious breathing and quiet, to arrive back in your body. You do not have to understand, explain or change anything right away. The bodywork follows how you feel and your limits.',
    },
    includes: [
      { de: 'Vorgespräch und Intention', en: 'Conversation and intention' },
      { de: 'Individuelle 9D Atemreise', en: 'Individual 9D breath journey' },
      { de: 'Begleitete Integrationsphase', en: 'Guided integration phase' },
      { de: 'Soul Touch Körperarbeit', en: 'Soul Touch bodywork' },
      { de: 'Abschließende Reflexion', en: 'Closing reflection' },
    ],
    facts: [{ de: `Ca. ${level44Minutes('premium')} Minuten · ${euroDe(level44Price('premium'))}`, en: `About ${level44Minutes('premium')} minutes · ${euroEn(level44Price('premium'))}` }],
    cta: { de: 'Premium Experience buchen', en: 'Book the premium experience' },
  },
];

/** „60 Minuten · 99 €“ für eine der drei Soul Touch Längen, aus level44.json. */
function soulTouchTag(id: Level44OfferId): Bi {
  return {
    de: `${level44Minutes(id)} Minuten · ${euroDe(level44Price(id))}`,
    en: `${level44Minutes(id)} minutes · ${euroEn(level44Price(id))}`,
  };
}

const SOUL_TOUCH: Offer[] = [
  {
    id: 'reset',
    title: { de: 'The Reset', en: 'The Reset' },
    tag: soulTouchTag('soul-touch-60'),
    text: {
      de: 'Eine bewusste Auszeit mit kurzem Gespräch, achtsamer Körperarbeit und Raum zum Nachspüren.',
      en: 'A conscious time-out with a short conversation, mindful bodywork and room to feel what follows.',
    },
    facts: [],
  },
  {
    id: 'deep-release',
    title: { de: 'Deep Release', en: 'Deep Release' },
    tag: soulTouchTag('soul-touch-90'),
    text: {
      de: 'Mehr Zeit für deine Intention, achtsame Berührung und begleitete Körperwahrnehmung.',
      en: 'More time for your intention, mindful touch and guided body awareness.',
    },
    facts: [],
  },
  {
    id: 'full',
    title: { de: 'Full Experience', en: 'Full Experience' },
    tag: soulTouchTag('soul-touch-120'),
    text: {
      de: 'Zwei Stunden für Intention, individuelle Körperarbeit, bewusste Atmung und Integration, ohne Zeitdruck.',
      en: 'Two hours for intention, individual bodywork, conscious breathing and integration, with no time pressure.',
    },
    facts: [],
  },
];

/** „ca. 120 Min.“ und „249 €“ einer Zeile der Preistabelle, aus level44.json. */
const minutesCell = (id: Level44OfferId, about = false): Bi => ({
  de: `${about ? 'ca. ' : ''}${level44Minutes(id)} Min.`,
  en: `${about ? 'about ' : ''}${level44Minutes(id)} min`,
});
const priceCell = (id: Level44OfferId): Bi => ({
  de: euroDe(level44Price(id)),
  en: euroEn(level44Price(id)),
});
const firstVisitCell = (id: Level44OfferId): Bi => ({
  de: `${euroDe(level44Price(id))} · erste Journey ${euroDe(FIRST_PRICE)} (Code ${CODE})`,
  en: `${euroEn(level44Price(id))} · first journey ${euroEn(FIRST_PRICE)} (code ${CODE})`,
});

const PRICES: PriceRow[] = [
  {
    name: { de: `9D Group Experience (So 11:00, max. ${MAX_PLACES})`, en: `9D Group Experience (Sun 11:00, max. ${MAX_PLACES})` },
    duration: { de: 'ca. 2,5–3 Std.', en: 'about 2.5–3 h' },
    price: firstVisitCell('group'),
  },
  {
    name: { de: 'Group + Soul Touch Integration (1 Platz)', en: 'Group + Soul Touch Integration (1 place)' },
    duration: { de: `Group + ${level44Minutes('soul-touch-60')} Min.`, en: `Group + ${level44Minutes('soul-touch-60')} min` },
    price: priceCell('group-integration'),
  },
  {
    name: { de: '9D Evening Experience (Do 19:30)', en: '9D Evening Experience (Thu 19:30)' },
    duration: { de: `ca. ${EVENING_HOURS} Std.`, en: `about ${EVENING_HOURS} h` },
    price: firstVisitCell('evening'),
  },
  {
    name: { de: '9D Private Experience', en: '9D Private Experience' },
    duration: minutesCell('private', true),
    price: priceCell('private'),
  },
  {
    name: { de: '9D Private Premium (mit Soul Touch)', en: '9D Private Premium (with Soul Touch)' },
    duration: minutesCell('premium', true),
    price: priceCell('premium'),
  },
  {
    name: { de: 'Soul Touch: The Reset', en: 'Soul Touch: The Reset' },
    duration: minutesCell('soul-touch-60'),
    price: priceCell('soul-touch-60'),
  },
  {
    name: { de: 'Soul Touch: Deep Release', en: 'Soul Touch: Deep Release' },
    duration: minutesCell('soul-touch-90'),
    price: priceCell('soul-touch-90'),
  },
  {
    name: { de: 'Soul Touch: Full Experience', en: 'Soul Touch: Full Experience' },
    duration: minutesCell('soul-touch-120'),
    price: priceCell('soul-touch-120'),
  },
];

const CONTRAINDICATIONS: Bi[] = [
  { de: 'Schwangerschaft', en: 'pregnancy' },
  { de: 'Epilepsie oder Krampfanfälle', en: 'epilepsy or seizures' },
  { de: 'schwere Herz-Kreislauf-Erkrankungen', en: 'serious cardiovascular conditions' },
  { de: 'unkontrollierter Bluthochdruck', en: 'uncontrolled high blood pressure' },
  { de: 'bestimmte Atemwegs- und Lungenerkrankungen', en: 'certain respiratory and lung conditions' },
  { de: 'kürzlich erfolgte Operationen oder schwere Verletzungen', en: 'recent surgery or serious injuries' },
  { de: 'bestimmte neurologische Erkrankungen', en: 'certain neurological conditions' },
  { de: 'akute psychische Krisen', en: 'acute mental health crises' },
  { de: 'psychotische Erkrankungen oder manische Episoden', en: 'psychotic disorders or manic episodes' },
  { de: 'weitere gesundheitliche Umstände, bei denen intensive Atemtechniken ein Risiko sein können', en: 'other health circumstances in which intensive breathing techniques can be a risk' },
];

const REFLECTION: Bi[] = [
  { de: 'Was habe ich wahrgenommen?', en: 'What did I notice?' },
  { de: 'Welche Gefühle oder Gedanken waren besonders präsent?', en: 'Which feelings or thoughts were especially present?' },
  { de: 'Was hat mich überrascht?', en: 'What surprised me?' },
  { de: 'Was möchte ich nicht mehr festhalten?', en: 'What do I no longer want to hold on to?' },
  { de: 'Was braucht mein Körper jetzt?', en: 'What does my body need now?' },
  { de: 'Was möchte ich in meinen Alltag mitnehmen?', en: 'What do I want to take into my everyday life?' },
  { de: 'Was darf noch offenbleiben?', en: 'What may stay open for now?' },
];

const FAQ: FaqEntry[] = [
  {
    q: { de: 'Brauche ich Vorerfahrung?', en: 'Do I need any experience?' },
    a: { de: 'Nein. Du bekommst eine Einführung und wirst während der Journey angeleitet. Voraussetzung ist, dass die Methode gesundheitlich für dich geeignet ist.', en: 'No. You get an introduction and are guided during the journey. The method does have to be suitable for you in terms of health.' },
  },
  {
    q: { de: 'Muss ich etwas Bestimmtes fühlen?', en: 'Do I have to feel anything in particular?' },
    a: { de: 'Nein. Jede Erfahrung ist individuell.', en: 'No. Every experience is individual.' },
  },
  {
    q: { de: 'Kann ich pausieren?', en: 'Can I pause?' },
    a: { de: 'Ja. Du kannst jederzeit zur natürlichen Atmung zurückkehren oder die Teilnahme beenden.', en: 'Yes. You can return to natural breathing or stop taking part at any time.' },
  },
  {
    q: { de: 'Ist Soul Touch eine klassische Massage?', en: 'Is Soul Touch a classic massage?' },
    a: { de: 'Nein. Soul Touch verbindet achtsame Körperarbeit mit persönlicher Intention, bewusster Atmung und Raum für Selbstwahrnehmung. Du bleibst bekleidet, es wird kein Öl verwendet.', en: 'No. Soul Touch combines mindful bodywork with personal intention, conscious breathing and room for self-awareness. You stay dressed and no oil is used.' },
  },
  {
    q: { de: 'Was ist der Unterschied zwischen Gruppen- und Private Breathwork?', en: 'What is the difference between group and private breathwork?' },
    a: { de: 'Die Gruppenjourney findet in einem gemeinsamen Rahmen statt. Die Private Experience hat eine persönliche Begleitung mit Vorgespräch und Integration.', en: 'The group journey takes place in a shared setting. The Private Experience has personal guidance with a conversation beforehand and integration afterwards.' },
  },
  {
    q: { de: 'Was bedeutet Body Integration?', en: 'What does body integration mean?' },
    a: { de: 'Eine anschließende Phase achtsamer Körperarbeit, die Raum zum Nachspüren und Ankommen gibt.', en: 'A subsequent phase of mindful bodywork that gives you room to feel what follows and to arrive.' },
  },
  {
    q: { de: 'Ist das eine medizinische oder therapeutische Behandlung?', en: 'Is this a medical or therapeutic treatment?' },
    a: { de: 'Nein. Die Angebote ersetzen keine medizinische oder psychotherapeutische Behandlung. Bei Beschwerden, die dich beunruhigen, geh bitte zuerst zur Ärztin oder zum Arzt.', en: 'No. The offers do not replace medical or psychotherapeutic treatment. If you have symptoms that worry you, please see a doctor first.' },
  },
  {
    q: { de: 'Wie buche ich?', en: 'How do I book?' },
    a: { de: 'Alle Termine bei FareWell buchst du direkt über Salonkee.', en: 'You book all dates at FareWell directly through Salonkee.' },
  },
];

/**
 * Seite für Franziska Preusche und ihre Marke LEVEL 44: 9D Breathwork und Soul
 * Touch bei FareWell. Gestaltung wie die Seiten von Dr. Leo und Ruslana, Inhalt
 * und Reihenfolge aus ihrer Mail „Website Inhalte/Preise“ vom 03.11.2026 und dem
 * Seitentext vom 04.11.2026 (Personalordner, domains/hr/kandidaten).
 *
 * Anders als die beiden versteckten Vorschauen ist diese Seite zum Start
 * bestimmt: indexierbar, in der Sitemap und in llms.txt. Live geht sie erst mit
 * dem Merge nach main; die offenen Punkte stehen im Personalordner.
 *
 * Wortwahl: kein „Therapy“, „Therapie“ oder „Hypnosetherapie“ als Angebotsname
 * (sie ist keine Heilpraktikerin). Nur echte Bilder, keine Stock- oder KI-Bilder.
 *
 * Salonkee: Einzeltermine buchen direkt über ihren eigenen Link. Die Gruppen und
 * der Abend sind dort Kurse ohne eigenen Link und führen auf die Salonseite.
 *
 * Eine Quelle: jede Zahl, jeder Termin und jeder Buchungslink kommt aus
 * src/app/domain/level44.json. Die Arbeitsteilung mit ihrer eigenen Website
 * schaltet brandSite.public in derselben Datei (siehe BRAND_SITE_PUBLIC oben).
 */
@Component({
  selector: 'app-level-44',
  standalone: true,
  imports: [RevealOnScrollDirective, ScrollToDirective, RouterLink],
  templateUrl: './level-44.component.html',
  styleUrls: ['./level-44.component.scss'],
})
export class Level44Component implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly language = inject(LanguageService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly jsonLdId = 'level-44-schema';

  readonly signet = SIGNET;
  readonly photoHero = PHOTO_HERO;
  readonly srcsetOf = srcsetOf;
  readonly photoPortrait = PHOTO_PORTRAIT;
  readonly gallery = GALLERY;
  readonly phoneHref = PHONE_HREF;
  readonly phoneLabel = PHONE_LABEL;
  readonly level44Url = LEVEL44_URL;
  readonly instagramUrl = INSTAGRAM_URL;
  /** „level44.live“, aus der Adresse in level44.json. */
  readonly siteLabel = LEVEL44_SITE_LABEL;
  /** Arbeitsteilung: true, sobald ihre eigene Website öffentlich ist. */
  readonly brandPublic = BRAND_SITE_PUBLIC;
  readonly methodUrl = level44SiteUrl('method');
  readonly journeysUrl = level44SiteUrl('journeys');
  readonly onlineUrl = level44SiteUrl('online');
  readonly aboutUrl = level44SiteUrl('about');
  readonly code = CODE;
  readonly maxPlaces = MAX_PLACES;
  readonly groupPrice: Bi = { de: euroDe(GROUP_PRICE), en: euroEn(GROUP_PRICE) };
  readonly firstPrice: Bi = { de: euroDe(FIRST_PRICE), en: euroEn(FIRST_PRICE) };
  readonly firstVisitRule = FIRST_VISIT_RULE;
  /**
   * Die Termine aus level44.json, die noch nicht vorbei sind: beim Prerendern
   * zum Zeitpunkt des Builds, im Browser zum Zeitpunkt des Besuchs.
   */
  private readonly sessions: Level44Session[] = upcomingSessions(Date.now());
  readonly dates: DateRow[] = this.sessions.map((session) => ({
    id: session.id,
    ...sessionWhen(session),
    journey: session.journey,
    journeyUrl: level44SiteUrl('journey', session.journeySlug),
  }));
  readonly stats = STATS;
  readonly benefits = BENEFITS;
  readonly nine = NINE;
  readonly offers = OFFERS;
  readonly soulTouch = SOUL_TOUCH;
  readonly prices = PRICES;
  readonly contraindications = CONTRAINDICATIONS;
  readonly reflection = REFLECTION;
  readonly faq = FAQ;

  /** Zwei-Klick-Lösung: erst nach dem Klick existiert der Wistia-iframe. */
  audioUrl: SafeResourceUrl | null = null;

  get lang(): Lang {
    return this.language.lang();
  }

  /** Salonkee kennt Deutsch und Englisch. */
  private get bookingLang(): 'de' | 'en' {
    return this.language.lang() === 'en' ? 'en' : 'de';
  }

  /** Die Salonseite in Salonkee: von dort bucht man die Gruppen (Kurse ohne eigenen Link). */
  get bookingUrl(): string {
    return level44SalonUrl(this.bookingLang);
  }

  /** Die drei Soul Touch Längen sind eine Dienstleistung in Salonkee, die Länge wählt man dort. */
  get soulTouchUrl(): string {
    return level44BookingUrl('soul-touch-60', this.bookingLang);
  }

  offerUrl(offer: BreathOffer): string {
    return level44BookingUrl(offer.id, this.bookingLang);
  }

  /** Buchbar ist, was in Salonkee einen Termin oder einen eigenen Link hat (level44.json). */
  isBookable(offer: BreathOffer): boolean {
    return level44Offer(offer.id).bookable;
  }

  get datenschutzLink(): string {
    return '/datenschutz';
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  loadAudio(): void {
    // Fester Wert aus dieser Datei, keine Eingabe von außen.
    this.audioUrl = this.sanitizer.bypassSecurityTrustResourceUrl(WISTIA_EMBED);
  }

  /** Lead-Ereignis wie bei den Buchungs-Buttons der Startseite; der Link öffnet normal weiter. */
  trackLead(location: string): void {
    if (!this.isBrowser || typeof window.gtag !== 'function') return;
    window.gtag('event', 'generate_lead', {
      event_category: 'engagement',
      event_label: 'LEVEL 44',
      location,
      destination: 'salonkee',
    });
  }

  /**
   * Ein Link zu ihrer eigenen Website: das gemeinsame Ereignis crosslink_click
   * (AI-SEO-STRATEGY.md, „Shared analytics events“). Der Link öffnet normal weiter.
   */
  trackCrosslink(location: string): void {
    if (!this.isBrowser || typeof window.gtag !== 'function') return;
    window.gtag('event', 'crosslink_click', {
      from_site: 'farewell.salon',
      from_page: PAGE_PATH,
      to_site: LEVEL44_SITE_LABEL,
      location,
    });
  }

  ngOnInit(): void {
    const isEn = this.language.lang() === 'en';
    const prefix = this.language.prefix();
    const pageUrl = `${ORIGIN}${prefix}${PAGE_PATH}`;
    const homeUrl = `${ORIGIN}${prefix}`;
    const title = this.t(DE_TITLE, EN_TITLE);
    const descriptions = level44Description(this.sessions);
    const description = this.t(descriptions.de, descriptions.en);
    const inLanguage = this.language.lang();

    this.seo.setPageSeo({
      title,
      description,
      path: PAGE_PATH,
      image: OG_IMAGE,
      imageAlt: this.t('Das Studio von FareWell in Nürnberg', 'The FareWell studio in Nuremberg'),
      largeImage: true,
    });

    this.seo.setJsonLd(this.jsonLdId, {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': FRANZISKA_PREUSCHE_ID,
          name: 'Franziska Preusche',
          givenName: 'Franziska',
          familyName: 'Preusche',
          jobTitle: this.t('Gründerin von LEVEL 44', 'Founder of LEVEL 44'),
          url: pageUrl,
          sameAs: [LEVEL44_URL, INSTAGRAM_URL],
          brand: { '@id': LEVEL44_BRAND_ID },
          description,
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
          '@type': 'Brand',
          '@id': LEVEL44_BRAND_ID,
          name: 'LEVEL 44',
          logo: `${ORIGIN}/${SIGNET}`,
          url: LEVEL44_URL,
          sameAs: [INSTAGRAM_URL],
        },
        // One Event per dated session of level44.json that still lies ahead. The id is
        // the same on the LEVEL 44 site; the place is FareWell, by reference to the
        // organisation block that src/index.html puts on every page.
        ...this.sessions.map((session) => ({
          '@type': 'Event',
          '@id': level44EventId(session),
          name: `${level44Offer('group').name}: ${session.journey}`,
          description: this.t(
            'Geführte 9D Atemreise über Kopfhörer in der Gruppe, mit Einführung und Integration, ca. 2,5–3 Stunden.',
            'Guided 9D breath journey on headphones in a group, with introduction and integration, about 2.5–3 hours.',
          ),
          startDate: session.start,
          endDate: session.end,
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          maximumAttendeeCapacity: MAX_PLACES,
          location: ORG_REF,
          organizer: { '@id': FRANZISKA_PREUSCHE_ID },
          performer: { '@id': FRANZISKA_PREUSCHE_ID },
          image: OG_IMAGE,
          url: pageUrl,
          offers: {
            '@type': 'Offer',
            price: GROUP_PRICE,
            priceCurrency: LEVEL44.currency,
            url: level44SalonUrl(this.bookingLang, false),
          },
        })),
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title,
          description,
          inLanguage,
          isPartOf: { '@id': `${ORIGIN}/#website` },
          about: { '@id': FRANZISKA_PREUSCHE_ID },
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
            { '@type': 'ListItem', position: 3, name: 'LEVEL 44', item: pageUrl },
          ],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.seo.clearJsonLd(this.jsonLdId);
  }
}
