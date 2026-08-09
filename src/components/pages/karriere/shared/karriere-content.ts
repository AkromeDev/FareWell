/**
 * Gemeinsame Inhalte aller Karriere-Seiten.
 *
 * Der Deal bei FareWell ist für jeden Beruf identisch: derselbe Raum, dieselbe
 * Infrastruktur, dieselbe Erwartung. Deshalb steht er genau einmal hier und
 * wird von drei Stellen gelesen:
 *   1. <app-karriere-deal>  – die sichtbaren Panels auf jeder Detailseite
 *   2. karriere-seo.ts      – die „Wir bieten“-Liste in der JobPosting-Beschreibung
 *   3. <app-karriere-faq>   – die vier Standardfragen selbständiger Bewerber:innen
 * Eine Änderung hier schlägt damit überall gleichzeitig durch.
 *
 * Sprachwahl läuft über die übergebene t()-Funktion (LanguageService.t), damit
 * die Daten sowohl im Template als auch im JSON-LD in der Sprache der Route
 * herauskommen.
 */

import { type GuideStat } from 'src/components/molecules/guide/guide-stats/guide-stats.component';

/** Signatur von LanguageService.t. */
export type Translate = (de: string, en: string) => string;

/** Ein Punkt in den „Was wir geben“/„Was wir erwarten“-Panels. */
export interface KarriereDealItem {
  /** Fettes Schlagwort am Zeilenanfang. */
  title: string;
  text: string;
}

/** Eine Frage-Antwort-Paarung; der Text landet 1:1 im FAQPage-Schema. */
export interface KarriereFaqEntry {
  question: string;
  /** Klartext ohne Markup – sichtbare Antwort und Schema-Text sind identisch. */
  answer: string;
  /** Optionaler weiterführender interner Link unter der Antwort. */
  linkPath?: string;
  linkLabel?: string;
  /** Anker auf der Zielseite, wenn der Link auf einen Abschnitt zeigt. */
  linkFragment?: string;
}

/** Ersetzt Frage und/oder Antwort einer Standardfrage. */
export interface KarriereFaqOverride {
  question?: string;
  answer?: string;
}

/**
 * Passt einzelne Standardfragen an den Beruf an (z. B. „Patient:innen“ statt
 * „Kund:innen“ auf der ärztlichen Seite) und hängt fachspezifische Fragen an.
 *
 * Die Frage nach den Zeiten steht bewusst NICHT mehr hier: Raumbelegung und
 * Zeitfenster sind zu wichtig, um in einem zugeklappten Akkordeon zu landen.
 * Sie haben einen eigenen Abschnitt mit Wochenkalender (<app-karriere-zeiten>).
 */
export interface KarriereFaqOverrides {
  model?: KarriereFaqOverride;
  clients?: KarriereFaqOverride;
  support?: KarriereFaqOverride;
  /** Zusätzliche Fragen, die ans Ende der Liste gehängt werden. */
  extra?: KarriereFaqEntry[];
}

export const KARRIERE_EMAIL = 'info@farewell.salon';
export const KARRIERE_PHONE = '+49 157 5799 5694';
export const KARRIERE_INSTAGRAM = 'https://www.instagram.com/farewell.salon/';

/** Einzelne Kennzahlen der Hero-Leiste pro Beruf ersetzen. */
export interface KarriereStatsOverrides {
  /** Dritte Kachel: gilt nicht für Kurse mit festem Zeitfenster (Yoga, Tanz). */
  hours?: GuideStat;
  /** Vierte Kachel, z. B. „Approbation“ auf der ärztlichen Seite. */
  last?: GuideStat;
}

/**
 * Kennzahlen-Leiste unter dem Hero. Die ersten beiden Werte beschreiben den
 * Deal und sind auf allen Karriere-Seiten gleich; die dritte und vierte lassen
 * sich pro Beruf ersetzen.
 */
export function karriereStats(
  t: Translate,
  overrides: KarriereStatsOverrides = {}
): GuideStat[] {
  return [
    { value: '0 €', label: t('feste Raummiete', 'fixed room rent'), animate: false },
    { value: '100%', label: t('deine Kund:innen', 'your own clients') },
    overrides.hours ?? {
      value: t('flexibel', 'flexible'),
      label: t('deine Zeiten', 'your hours'),
    },
    overrides.last ?? {
      value: t('selbständig', 'freelance'),
      label: t('dein Status', 'your status'),
    },
  ];
}

/**
 * Kennzahl-Kachel für Kursformate: Kurse liegen vor und nach dem
 * Behandlungsbetrieb. Die vollständigen Fenster stehen im Abschnitt
 * „Zeiten und Raumbelegung“ (<app-karriere-zeiten>).
 */
export function kursZeitStat(t: Translate): GuideStat {
  return {
    value: t('früh & spät', 'early & late'),
    label: t('07–09 · ab 19:30', '07–09 · from 19:30'),
    animate: false,
  };
}

/** Kennzahl-Kachel für Behandlungsberufe mit festem Betriebsfenster. */
export function zeitStat(t: Translate, value: string, de: string, en: string): GuideStat {
  return { value, label: t(de, en), animate: false };
}

/** Was FareWell stellt – Ort und Infrastruktur, für alle Berufe gleich. */
export function karriereWeGive(t: Translate): KarriereDealItem[] {
  return [
    {
      title: t('Raum und Ausstattung', 'Room and equipment'),
      text: t(
        'Ein voll ausgestatteter Behandlungsraum mitten in Nürnberg, Frauentorgraben 5. Du nutzt die Räumlichkeiten und die Infrastruktur des Salons.',
        'A fully equipped treatment room in the centre of Nuremberg, Frauentorgraben 5. You use the salon’s rooms and its entire infrastructure.'
      ),
    },
    {
      title: t('Deine eigene Seite', 'Your own page'),
      text: t(
        'Eine eigene Seite auf farewell.salon mit deinem Namen, deinen Leistungen und deinen Preisen.',
        'Your own page on farewell.salon with your name, your services and your prices.'
      ),
    },
    {
      title: t('Online-Buchung', 'Online booking'),
      text: t(
        'Deine Leistungen liegen im Buchungssystem Salonkee. Kund:innen buchen dich direkt, deine Termine siehst du mobil.',
        'Your services live in the Salonkee booking system. Clients book you directly and you see your appointments on your phone.'
      ),
    },
    {
      title: t('Eigenes Google-Business-Profil', 'Your own Google Business profile'),
      text: t(
        'Wir helfen dir Schritt für Schritt beim eigenen Profil. Es ist gratis, die Bewertungen gehören dir, und wenn du eines Tages weiterziehst, nimmst du es einfach mit.',
        'We help you set up your own profile step by step. It is free, the reviews belong to you, and if you move on one day you simply take it with you.'
      ),
    },
    {
      title: t('Sichtbarkeit', 'Visibility'),
      text: t(
        'Ein Start-Video auf unserem Instagram, Reposts über unsere Kanäle und die Möglichkeit, bei Online-Kampagnen mitzulaufen.',
        'A launch video on our Instagram, reposts through our channels and the option to join our online campaigns.'
      ),
    },
    {
      title: t('Google Ads auf Wunsch', 'Google Ads if you want them'),
      text: t(
        'Wir richten deine Anzeigen ein und erklären dir, wie du sie steuerst. Das Budget bestimmst und trägst du selbst.',
        'We set up your ads and explain how to steer them. You decide on the budget and you carry it.'
      ),
    },
    {
      title: t('Kein organisatorischer Aufwand', 'No admin overhead'),
      text: t(
        'Buchungssystem, Wäsche, Technik und der ganze Rahmen laufen im Hintergrund. Du kümmerst dich um deine Kund:innen.',
        'The booking system, laundry, technology and the whole frame run in the background. You look after your clients.'
      ),
    },
    {
      title: t('Keine feste Miete', 'No fixed rent'),
      text: t(
        'Du zahlst keine Raummiete und kein Fixum. Wir arbeiten mit einer Umsatzbeteiligung, die wir vor dem Start gemeinsam festlegen.',
        'You pay no room rent and no flat fee. We work with a revenue share that we agree together before you start.'
      ),
    },
  ];
}

/** Was FareWell erwartet – dieselbe Haltung, unabhängig vom Fach. */
export function karriereWeExpect(t: Translate): KarriereDealItem[] {
  return [
    {
      title: t('Eine eigene Marke', 'A brand of your own'),
      text: t(
        'Den echten Willen, etwas Eigenes aufzubauen, statt nur Stunden abzuarbeiten.',
        'A real will to build something of your own, rather than just working through hours.'
      ),
    },
    {
      title: t('Eigenen Input', 'Your own input'),
      text: t(
        'Eigene Ideen, ein eigenes Konzept und die Motivation, es umzusetzen. Wir geben den Ort, die Richtung gibst du.',
        'Your own ideas, your own concept and the drive to carry it out. We provide the place, you provide the direction.'
      ),
    },
    {
      title: t('Echte Selbständigkeit', 'Genuine self-employment'),
      text: t(
        'Angemeldetes Gewerbe oder freiberufliche Tätigkeit, eigene Preise, eigene Kund:innen, eigene Werkzeuge.',
        'A registered trade or freelance activity, your own prices, your own clients, your own tools.'
      ),
    },
    {
      title: t('Fachliche Qualifikation', 'Professional qualification'),
      text: t(
        'Die Ausbildung und die Nachweise, die dein Beruf verlangt.',
        'The training and the credentials your profession requires.'
      ),
    },
    {
      title: t('Eigene Berufshaftpflicht', 'Your own liability insurance'),
      text: t(
        'Eine eigene Versicherung für deine Tätigkeit. Sie schützt dich und den Salon.',
        'Your own professional liability cover. It protects you and the salon.'
      ),
    },
    {
      title: t('Verlässlichkeit', 'Reliability'),
      text: t(
        'Zugesagte Zeiten einhalten, Hygienestandards ernst nehmen und den geteilten Raum so hinterlassen, dass die nächste Person sofort loslegen kann.',
        'Keeping to agreed hours, taking hygiene standards seriously and leaving the shared room ready for the next person to start right away.'
      ),
    },
    {
      title: t('Neugier auf den Salon', 'Curiosity about the salon'),
      text: t(
        'Ein Grundwissen über das übrige Angebot bei FareWell, damit du Kund:innen weiterhelfen kannst.',
        'A basic feel for what else FareWell offers, so you can point clients in the right direction.'
      ),
    },
  ];
}

/**
 * Die vier Fragen, die selbständige Bewerber:innen wirklich stellen. Jede
 * Antwort lässt sich pro Beruf überschreiben (siehe KarriereFaqOverrides);
 * fachspezifische Fragen kommen über `extra` dazu.
 */
export function karriereFaqEntries(
  t: Translate,
  overrides: KarriereFaqOverrides = {}
): KarriereFaqEntry[] {
  const apply = (base: KarriereFaqEntry, override?: KarriereFaqOverride): KarriereFaqEntry => ({
    question: override?.question ?? base.question,
    answer: override?.answer ?? base.answer,
  });

  return [
    apply(
      {
        question: t(
          'Was kostet mich die Raumnutzung, und wie ist das Modell?',
          'What does using the space cost me, and how does the model work?'
        ),
        answer: t(
          'Du zahlst keine feste Miete und kein Fixum. Wir arbeiten mit einer Umsatzbeteiligung: Du behältst den größeren Teil von dem, was du tatsächlich einnimmst, FareWell einen kleineren Anteil für Raum, Buchungssystem, Rahmen und Sichtbarkeit. Die genaue Aufteilung und den Abrechnungsrhythmus halten wir im Erstgespräch schriftlich fest, bevor du startest.',
          'You pay no fixed rent and no flat fee. We work with a revenue share: you keep the larger part of what you actually take in, FareWell keeps a smaller share for the room, the booking system, the frame around it and the visibility. We put the exact split and the settlement rhythm in writing at the first meeting, before you start.'
        ),
      },
      overrides.model
    ),
    apply(
      {
        question: t('Wem gehören meine Kund:innen?', 'Who do my clients belong to?'),
        answer: t(
          'Dir. Du arbeitest selbständig: deine Kund:innen, deine Preise, dein Stil. Wir empfehlen dir ausdrücklich, ein eigenes Google-Business-Profil auf deinen Namen anzulegen. Bewertungen landen dann bei dir, und wenn du eines Tages weiterziehst, nimmst du Profil und Bewertungen einfach mit.',
          'You. You work as a freelancer: your clients, your prices, your style. We actively encourage you to set up your own Google Business profile in your name. Reviews then land with you, and if you move on one day you simply take the profile and the reviews with you.'
        ),
      },
      overrides.clients
    ),
    apply(
      {
        question: t(
          'Wie unterstützt ihr mich beim Start, etwa bei Google Business und Sichtbarkeit?',
          'How do you support me at the start, for example with Google Business and visibility?'
        ),
        answer: t(
          'Du bekommst eine eigene Seite auf farewell.salon, deine Leistungen im Buchungssystem Salonkee, ein Start-Video auf unserem Instagram und Reposts über unsere Kanäle. Beim eigenen Google-Business-Profil helfen wir dir Schritt für Schritt, Google Ads richten wir auf Wunsch ein und erklären dir, wie du sie steuerst; das Budget bestimmst du. Was wir nicht versprechen: ein festes Einkommen. Wie voll dein Kalender wird, hängt am Ende an deiner Arbeit.',
          'You get your own page on farewell.salon, your services in the Salonkee booking system, a launch video on our Instagram and reposts through our channels. We help you set up your own Google Business profile step by step, and if you want them we set up Google Ads and explain how to steer them; you decide on the budget. What we do not promise is a fixed income. How full your calendar gets depends in the end on your work.'
        ),
      },
      overrides.support
    ),
    ...(overrides.extra ?? []),
  ];
}
