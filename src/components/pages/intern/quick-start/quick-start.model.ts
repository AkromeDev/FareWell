import { QsIconName } from 'src/components/atoms/qs-icon/qs-icon.component';

/**
 * Der Inhalt einer Quick-Start-Seite, so wie er versiegelt in
 * src/assets/intern/<slug>.sealed.json liegt. Der Klartext entsteht im
 * FareWell-Projektordner (domains/marketing/quick-start/), nie in diesem
 * öffentlichen Repository. Worte und Zahlen stehen nur dort, die Komponente
 * zeichnet sie.
 */

export type QsLang = 'de' | 'uk';

/** Ein Text. Ein einfacher String gilt in jeder Sprache, sonst je Sprache. */
export type Txt = string | { de: string; uk?: string };

/** Wer eine Aufgabe trägt oder wem eine Frage gilt. */
export type Owner = 'joe' | 'leo' | 'ruslana' | 'beide';

/** Farbe eines Diagrammteils. Immer mit Beschriftung, nie allein Bedeutungsträger. */
export type Tone = 'emerald' | 'gold' | 'sage' | 'ink' | 'muted' | 'rose';

export interface QuickStartContent {
  v: 1;
  /** Stand der Seite, z. B. „20.10.2026“. */
  updated: string;
  /** Sprachen der Seite; die erste ist die Vorgabe. */
  languages: QsLang[];
  person: { first: string; full: Txt; role: Txt; owner: Owner };
  /** Start und Ende als ISO-Datum, z. B. „2026-11-15“. */
  start: string;
  end: string;
  hero: { title: Txt; goal: Txt; sub: Txt };
  /** Was jeden Monat neben dem Video steht: „Rabatt des Monats“ oder, beim Arzt, „Thema des Monats“. */
  offerLabel: Txt;
  metrics: QsMetric[];
  metricsNote?: Txt;
  months: QsMonth[];
  funnel: QsFunnel;
  money: QsMoney;
  ads: QsAds;
  /** Was nur diese Person betrifft: Zahlung, Regeln, Deutsch, Schild. */
  sections: QsSection[];
  todos: QsTodo[];
  questions: QsQuestion[];
}

export interface QsMetric {
  value: string;
  label: Txt;
  icon: QsIconName;
  note?: Txt;
}

export interface QsMonth {
  n: number;
  /** ISO-Daten. */
  from: string;
  to: string;
  theme: Txt;
  occasion?: { date: string; label: Txt };
  video: { title: Txt; idea: Txt };
  offer: { title: Txt; detail: Txt; code?: string; flag?: Txt };
}

export interface QsFunnel {
  title: Txt;
  channels: { icon: QsIconName; label: Txt; detail: Txt; badge?: Txt }[];
  steps: { icon: QsIconName; label: Txt }[];
  note?: Txt;
}

export interface QsMoney {
  title: Txt;
  splits: QsSplit[];
  examples: QsExample[];
  note?: Txt;
}

/** Ein Ring: wer von einem Euro wie viel bekommt. */
export interface QsSplit {
  label: Txt;
  caption?: Txt;
  parts: { label: Txt; pct: number; tone: Tone }[];
}

/** Ein Balken: ein Beispielpreis und wohin er geht. */
export interface QsExample {
  label: Txt;
  total: number;
  bars: { label: Txt; amount: number; tone: Tone }[];
  note?: Txt;
}

export interface QsAds {
  budget: number;
  payer: Txt;
  clicks: [number, number];
  leads: [number, number];
  words: Txt[];
  avoid?: Txt[];
  note?: Txt;
}

interface QsSectionBase {
  id: string;
  nav: Txt;
  eyebrow: Txt;
  title: Txt;
  intro?: Txt;
  note?: Txt;
}

/** Wege zur Wahl, nebeneinander, der empfohlene markiert. */
export interface QsOptions extends QsSectionBase {
  kind: 'options';
  options: {
    name: Txt;
    tag?: Txt;
    recommended?: boolean;
    cost: Txt;
    flow: { icon: QsIconName; label: Txt }[];
    good: Txt[];
    bad: Txt[];
  }[];
}

/** Ampel: Idee, wie riskant sie ist, und was stattdessen geht. */
export interface QsRules extends QsSectionBase {
  kind: 'rules';
  items: { status: 'ok' | 'risk' | 'no'; idea: Txt; instead: Txt }[];
}

/** Ein Wochenplan in Minuten, als gestapelte Balken. */
export interface QsWeek extends QsSectionBase {
  kind: 'week';
  minutesPerDay: number;
  legend: { key: string; label: Txt; tone: Tone }[];
  days: { day: Txt; parts: { key: string; min: number }[] }[];
}

export interface QsCourses extends QsSectionBase {
  kind: 'courses';
  items: { name: Txt; cost: Txt; when: Txt; tag?: Txt; recommended?: boolean; url?: string }[];
}

/** Sätze für den Termin, Deutsch mit Übersetzung. */
export interface QsPhrases extends QsSectionBase {
  kind: 'phrases';
  items: { de: string; uk: string }[];
}

/** Stufen auf einer Skala (Sprachniveau): heute, Ziel, später. */
export interface QsLevels extends QsSectionBase {
  kind: 'levels';
  levels: string[];
  marks: { at: number; label: Txt; date: Txt; tone: Tone }[];
}

/** Eine Reihe Schritte mit Symbol, z. B. das Schild am Eingang. */
export interface QsSteps extends QsSectionBase {
  kind: 'steps';
  steps: { icon: QsIconName; label: Txt; detail?: Txt }[];
}

/** Preise als Etiketten, z. B. ein Preisvorschlag. */
export interface QsPrices extends QsSectionBase {
  kind: 'prices';
  items: { name: Txt; minutes: number; price: number; note?: Txt }[];
}

export type QsSection = QsOptions | QsRules | QsWeek | QsCourses | QsPhrases | QsLevels | QsSteps | QsPrices;

export interface QsTodo {
  owner: Owner;
  text: Txt;
  /** Fällig am, DD.MM.YYYY. */
  due?: string;
  done?: boolean;
}

export interface QsQuestion {
  to: Owner;
  text: Txt;
  options?: Txt[];
  hint?: Txt;
}

/** Löst einen Text in der gewünschten Sprache auf; fehlt sie, gilt Deutsch. */
export function tx(text: Txt | undefined, lang: QsLang): string {
  if (text === undefined) return '';
  if (typeof text === 'string') return text;
  return text[lang] ?? text.de;
}

/** Tage zwischen zwei ISO-Daten, ganzzahlig. */
export function daysBetween(fromIso: string, toIso: string): number {
  const from = Date.UTC(+fromIso.slice(0, 4), +fromIso.slice(5, 7) - 1, +fromIso.slice(8, 10));
  const to = Date.UTC(+toIso.slice(0, 4), +toIso.slice(5, 7) - 1, +toIso.slice(8, 10));
  return Math.round((to - from) / 86_400_000);
}

/** „2026-11-15“ → „15.11.“ */
export function shortDate(iso: string): string {
  return `${iso.slice(8, 10)}.${iso.slice(5, 7)}.`;
}

/** Euro im FareWell-Format: 32,32 € (ganze Beträge ohne Nachkommastellen). */
export function euro(amount: number): string {
  const whole = Number.isInteger(amount);
  return `${amount.toLocaleString('de-DE', { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 })} €`;
}
