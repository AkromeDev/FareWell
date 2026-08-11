/**
 * „Kund:innen gewinnen“ — die Wege, einen leeren Kalender zu füllen, und was
 * von jedem am Ende übrig bleibt.
 *
 * Die Tabelle macht drei Dinge bewusst nebeneinander sichtbar:
 *   1. Tempo und Kosten. Schnell ist nie gratis, gratis ist nie schnell.
 *   2. Den FareWell-Anteil als eigene Spalte. Auf Plattformumsätzen (Groupon,
 *      Urban Sports Club) nehmen wir nichts: Die Plattform hat sich ihren Teil
 *      schon geholt, und was übrig bleibt, ist ohnehin eher Werbebudget in
 *      Arbeitsform als Verdienst.
 *   3. Echte Zahlen statt Prozentgefühl — die Groupon-Beispiele stammen aus
 *      dem Rechner der Plattform und stehen genauso im Masseur-Onboarding.
 *
 * Rollen: Behandlungsberufe sehen Google Ads, Google Business und Groupon,
 * Kursformate zusätzlich Urban Sports Club. Die ärztliche Seite sieht bewusst
 * keine Rabattplattform: Werbung für verschreibungspflichtige Präparate und
 * ärztliche Behandlungen ist im Heilmittelwerbegesetz eng geregelt, ein
 * Rabatt-Deal auf Injektionen gehört nicht auf diese Seite.
 */

import { type Translate } from 'src/components/pages/karriere/shared/karriere-content';
import { type KarriereRole } from '../karriere-zeiten/karriere-zeiten.model';

/** Varianten von <app-guide-pill>. */
export type KanalTon = 'sand' | 'ok' | 'warn' | 'hot';

export interface KanalPill {
  label: string;
  variant: KanalTon;
}

/** Eine Zeile der Kanal-Tabelle. */
export interface KanalRow {
  name: string;
  /** Leise zweite Zeile unter dem Namen. */
  sub: string;
  tempo: KanalPill;
  kosten: KanalPill;
  /** Was FareWell von diesem Umsatz nimmt. */
  anteil: KanalPill;
  text: string;
}

/** Ein Rechenbeispiel aus dem Groupon-Rechner, gerechnet auf 70 €. */
export interface GrouponBeispiel {
  rabatt: string;
  zahlt: string;
  bekommst: string;
  behaelt: string;
  /** Grün oder rot einfärben — 19 € für eine Behandlung tun sichtbar weh. */
  gut: boolean;
}

/** Der Preis, auf den die Groupon-Beispiele gerechnet sind. */
export const GROUPON_BEISPIEL_PREIS = 70;

export const GROUPON_BEISPIELE: GrouponBeispiel[] = [
  { rabatt: '50%', zahlt: '35,00', bekommst: '19,17', behaelt: '15,83', gut: false },
  { rabatt: '25%', zahlt: '52,50', bekommst: '28,76', behaelt: '23,74', gut: true },
];

/** Rabattplattformen gibt es überall außer in der ärztlichen Ästhetik. */
export function hasPlattformen(role: KarriereRole): boolean {
  return role !== 'botox';
}

/** Urban Sports Club steht nur bei Kursformaten (und in der Übersicht). */
export function hasUrbanSports(role: KarriereRole): boolean {
  return role === 'kurs' || role === 'uebersicht';
}

/** Wer gewonnen werden soll, heißt je nach Fach anders. */
export function kanaeleHeading(t: Translate, role: KarriereRole): string {
  switch (role) {
    case 'kurs':
      return t('Teilnehmende gewinnen', 'Filling your classes');
    case 'botox':
      return t('Patient:innen gewinnen', 'Getting patients');
    default:
      return t('Kund:innen gewinnen', 'Getting clients');
  }
}

export function kanaeleLead(t: Translate, role: KarriereRole): string {
  if (role === 'uebersicht') {
    return t(
      'Die Wege, einen Kalender zu füllen: was sie kosten, wie schnell sie wirken und was am Ende bei dir bleibt. Kombinieren ist ausdrücklich erlaubt.',
      'The ways to fill a calendar: what they cost, how fast they work and what is left with you at the end. Combining them is expressly allowed.'
    );
  }
  return t(
    'Die Wege, deinen Kalender zu füllen: was sie kosten, wie schnell sie wirken und was am Ende bei dir bleibt. Du kannst sie kombinieren.',
    'The ways to fill your calendar: what they cost, how fast they work and what is left with you at the end. You can combine them.'
  );
}

/**
 * Die Zeilen der Tabelle in der Reihenfolge „eigene Arbeit zuerst, fremde
 * Reichweite zuletzt“ — wer nur die erste Zeile liest, soll nicht bei Groupon
 * landen.
 */
export function kanaeleRows(t: Translate, role: KarriereRole): KanalRow[] {
  const anteilUeblich: KanalPill = {
    label: t('wie vereinbart', 'as agreed'),
    variant: 'sand',
  };
  const anteilNull: KanalPill = { label: '0%', variant: 'ok' };

  const rows: KanalRow[] = [
    {
      name: 'Google Business',
      sub: t('dein eigenes Profil', 'your own profile'),
      tempo: { label: t('langsam', 'slow'), variant: 'sand' },
      kosten: { label: t('gratis', 'free'), variant: 'ok' },
      anteil: anteilUeblich,
      text: t(
        'Stetige, bleibende Sichtbarkeit und echte Bewertungen, die auf deinen Namen laufen. Wir helfen dir beim Anlegen; wenn du eines Tages weiterziehst, nimmst du Profil und Bewertungen mit.',
        'Steady, lasting visibility and real reviews that run in your name. We help you set it up; if you move on one day you take the profile and the reviews with you.'
      ),
    },
    {
      name: 'Google Ads',
      sub: t('bezahlte Suche', 'paid search'),
      tempo: { label: t('schnell', 'fast'), variant: 'ok' },
      kosten: { label: t('dein Budget', 'your budget'), variant: 'warn' },
      anteil: anteilUeblich,
      text: t(
        'Reichweite genau dann, wenn du sie brauchst. Wir richten die Kampagne ein und erklären dir die Steuerung, das Budget bestimmst und trägst du selbst.',
        'Reach exactly when you need it. We set the campaign up and explain how to steer it; you decide on the budget and you carry it.'
      ),
    },
  ];

  if (hasPlattformen(role)) {
    rows.push({
      name: 'Groupon',
      sub: t('Rabattplattform', 'discount platform'),
      tempo: { label: t('sehr schnell', 'very fast'), variant: 'ok' },
      kosten: { label: t('hohe Gebühr', 'high fee'), variant: 'hot' },
      anteil: anteilNull,
      text: t(
        'Ein Schub neuer Gesichter zum Kennenlernpreis. Die Plattform nimmt sich einen großen Teil, wir nehmen von dem Rest nichts. Deine Aufgabe: aus dem einen Mal ein zweites machen.',
        'A burst of new faces at a taster price. The platform takes a large cut, and we take nothing from what is left. Your job: turn the one visit into a second one.'
      ),
    });
  }

  if (hasUrbanSports(role)) {
    rows.push({
      name: 'Urban Sports Club',
      sub:
        role === 'uebersicht'
          ? t('Mitgliedschaft, nur Kurse', 'membership, courses only')
          : t('Mitgliedschaftsplattform', 'membership platform'),
      tempo: { label: t('schnell', 'fast'), variant: 'ok' },
      kosten: { label: t('weniger pro Platz', 'less per spot'), variant: 'warn' },
      anteil: anteilNull,
      text: t(
        'Mitglieder suchen dort ohnehin nach Kursen in der Nähe und checken spontan bei dir ein. Du gibst nur so viele Plätze frei, wie du willst; die Vergütung pro Check-in vereinbarst du direkt mit der Plattform, und sie bleibt komplett bei dir.',
        'Members are already looking there for classes nearby and check in with you spontaneously. You release only as many spots as you want; you agree the rate per check-in directly with the platform, and it stays with you in full.'
      ),
    });
  }

  return rows;
}
