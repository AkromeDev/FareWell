import { InjectionToken } from '@angular/core';

/**
 * Gemeinsames Modell aller Roads: Freelancer Road (Selbständige bei FareWell)
 * und Gastro Road (Restaurant oder Kochkurse, ohne FareWell-Bezug). Eine Road
 * ist nur Inhalt: Auswahl (Beruf, Vorhaben), Etappen, Schritte. Die Mechanik
 * (Häkchen, Notizen, Export und Import) steckt einmal in RoadStateService und
 * RoadChecklistComponent und gilt für jede Road gleich.
 *
 * Zweisprachig: jeder Text ist ein {de, en}-Paar, beide Sprachen landen im DOM
 * (<span class="lang de|en">). Kein Gedankenstrich als Satztrenner (Hausregel).
 */

export interface Bi {
  de: string;
  en: string;
}

export interface Profession<P extends string = string> {
  id: P;
  icon: string;
  label: Bi;
  /** Ein Satz zur Einordnung, die den Rest der Road prägt. */
  status: Bi;
}

export interface Contact {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: Bi;
  url?: string;
}

export interface Link {
  label: Bi;
  url: string;
}

export interface Step<P extends string = string> {
  /** Stabil halten: der Import verwirft unbekannte IDs, Umbenennen kostet Häkchen. */
  id: string;
  title: Bi;
  /** Ein bis zwei Sätze, immer sichtbar. */
  summary: Bi;
  /** Aufzählungspunkte im ausgeklappten Zustand. */
  details: Bi[];
  /** Für welche Auswahl der Schritt gilt. Leer = alle. */
  professions?: P[];
  /** Gewichtung: Pflicht (rechtlich), empfohlen, optional. */
  weight: 'pflicht' | 'empfohlen' | 'optional';
  /** Joés eigene Erfahrung, in der ersten Person. */
  joe?: Bi;
  /** Was FareWell hier konkret abnimmt oder mitbringt (nur Freelancer Road). */
  farewell?: Bi;
  contacts?: Contact[];
  links?: Link[];
}

export interface Phase<P extends string = string> {
  id: string;
  index: string;
  tag: Bi;
  title: Bi;
  lead: Bi;
  steps: Step<P>[];
}

/** Texte der Auswahl-Sektion (00), die sich je Road unterscheiden. */
export interface RoadCopy {
  /** Anker der Sektion, zugleich Ziel des ersten Inhaltsverzeichnis-Eintrags. */
  choiceId: string;
  choiceHeading: Bi;
  choiceLead: Bi;
  /** aria-label der Chip-Gruppe. */
  choiceGroupLabel: Bi;
  /** Mit Platzhalter {n} für die Anzahl ausgeblendeter Schritte. */
  hiddenCount: Bi;
  emptyPhase: Bi;
  storageNote: Bi;
  resetConfirm: Bi;
}

export interface RoadDefinition<P extends string = string> {
  /** Kurzname für Dateinamen beim Export, z. B. 'freelancer-road'. */
  slug: string;
  /** Anzeigename, z. B. 'Freelancer Road'. */
  name: string;
  /** localStorage-Schlüssel. Nie ändern, sonst ist der Stand der Leute weg. */
  storageKey: string;
  professions: Profession<P>[];
  phases: Phase<P>[];
  copy: RoadCopy;
}

/** Die Road der aktuellen Seite; die Seiten-Komponente stellt sie bereit. */
export const ROAD = new InjectionToken<RoadDefinition>('ROAD');

export function roadSteps<P extends string>(road: RoadDefinition<P>): Step<P>[] {
  return road.phases.flatMap((phase) => phase.steps);
}

export function stepAppliesTo(step: Step, profession: string | null): boolean {
  if (!profession || !step.professions || step.professions.length === 0) {
    return true;
  }
  return step.professions.includes(profession);
}

export function professionIn(road: RoadDefinition, id: string | null): Profession | null {
  return road.professions.find((p) => p.id === id) ?? null;
}
