import { CalendarItemKind, CompletionAction, TaskState, UrgencyLevel } from '../models';

export interface Bilingual {
  de: string;
  en: string;
}

/** Short status label per fine-grained task state (DE/EN). */
export const STATE_LABELS: Record<TaskState, Bilingual> = {
  overdue: { de: 'Überfällig', en: 'Overdue' },
  dueToday: { de: 'Heute fällig', en: 'Due today' },
  checkDue: { de: 'Kontrolle fällig', en: 'Check due' },
  dueSoon: { de: 'Bald fällig', en: 'Due soon' },
  attention: { de: 'Demnächst', en: 'Coming up' },
  upcoming: { de: 'Geplant', en: 'Upcoming' },
  eventActionable: { de: 'Bereit', en: 'Ready' },
  waitingForEvent: { de: 'Wartet auf Ereignis', en: 'Waiting for event' },
  adHoc: { de: 'Bei Gelegenheit', en: 'When quiet' },
  recentlyCompleted: { de: 'Erledigt', en: 'Completed' },
  seasonalInactive: { de: 'Saisonpause', en: 'Off-season' },
};

/** A compact glyph per state so meaning is not carried by colour alone. */
export const STATE_GLYPH: Record<TaskState, string> = {
  overdue: '!',
  dueToday: '●',
  checkDue: '🔍',
  dueSoon: '▲',
  attention: '▸',
  upcoming: '○',
  eventActionable: '⚡',
  waitingForEvent: '…',
  adHoc: '＋',
  recentlyCompleted: '✓',
  seasonalInactive: '❄',
};

export const ACTION_LABELS: Record<CompletionAction, Bilingual> = {
  completed: { de: 'erledigt', en: 'completed' },
  'checked-ok': { de: 'geprüft, alles ok', en: 'checked, all ok' },
  corrective: { de: 'nachgebessert', en: 'corrective work done' },
};

export const CALENDAR_KIND_LABELS: Record<CalendarItemKind, Bilingual> = {
  due: { de: 'fällig', en: 'due' },
  completed: { de: 'erledigt', en: 'done' },
  check: { de: 'Kontrolle', en: 'check' },
  event: { de: 'Ereignis', en: 'event' },
};

export const URGENCY_ORDER: UrgencyLevel[] = [
  'critical',
  'warning',
  'attention',
  'neutral',
  'waiting',
  'completed',
  'seasonal',
];

export function stateLabel(state: TaskState, lang: 'de' | 'en'): string {
  return STATE_LABELS[state][lang];
}

/** Active-language name of a task definition. */
export function taskName(def: { nameDe: string; nameEn: string }, lang: 'de' | 'en'): string {
  return lang === 'de' ? def.nameDe : def.nameEn;
}

/** Active-language notes of a task definition (undefined when none). */
export function taskNotes(
  def: { notesDe?: string; notesEn?: string },
  lang: 'de' | 'en',
): string | undefined {
  return lang === 'de' ? def.notesDe : def.notesEn;
}
