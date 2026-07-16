import {
  MassageSchedule,
  TaskAccessConfiguration,
  TaskCategory,
  TaskType,
  TaskUser,
  TaskUserId,
} from '../models';

/**
 * Central identity, permission and schedule configuration for the task system.
 *
 * Everything route-specific (current user, visible task types, completion
 * permissions, activity filters, overview access, massage-room weekdays) is
 * expressed here so components stay generic. Change a rule in one place rather
 * than scattering it across templates.
 */

/** Plan name → internal user id. Keep name conversions here, not in components. */
export const IDENTITY_MAP: Record<string, TaskUserId> = {
  Nicole: 'nicolita',
  Anna: 'annasun',
  Nika: 'nikkita',
  'Joé': 'mojo',
};

/** Massage-room use days (JS weekday: Mon = 1, Wed = 3, Thu = 4). */
export const MASSAGE_SCHEDULE: MassageSchedule = {
  useDaysByUser: {
    annasun: [1, 3],
    nikkita: [4],
  },
};

export const TASK_USERS: TaskUser[] = [
  {
    id: 'nicolita',
    name: 'Nicolita',
    routeSegment: 'nicolita',
    routeArea: 'tasks',
    visibleTypes: ['general'],
    overview: false,
  },
  {
    id: 'mojo',
    name: 'Mojo',
    routeSegment: 'mojo',
    routeArea: 'tasks',
    visibleTypes: ['general', 'massage'],
    overview: true,
  },
  {
    id: 'nikkita',
    name: 'Nikkita',
    routeSegment: 'nikkita',
    routeArea: 'massage-tasks',
    visibleTypes: ['massage'],
    overview: false,
  },
  {
    id: 'annasun',
    name: 'Annasun',
    routeSegment: 'annasun',
    routeArea: 'massage-tasks',
    visibleTypes: ['massage'],
    overview: false,
  },
];

/** Default eligibility by task type (a named owner never removes these). */
export const GENERAL_ELIGIBLE: TaskUserId[] = ['nicolita', 'mojo'];
export const MASSAGE_ELIGIBLE: TaskUserId[] = ['nikkita', 'annasun', 'mojo'];

/** Zones cycled through by the weekly deep-clean rotation. */
export const DEEP_CLEAN_ZONES = [
  'Empfang & Wartebereich',
  'Flur',
  'Laserraum',
  'Elektrolyseraum',
  'Massageraum',
  'Küche',
  'WC & Waschraum',
  'Pflanzen',
];

export const PLAN_ID = 'salon-task-cleaning-plan';
export const PLAN_VERSION = '2026-07';

export const TASK_ACCESS_CONFIG: TaskAccessConfiguration = {
  users: TASK_USERS,
  identityMap: IDENTITY_MAP,
  massageSchedule: MASSAGE_SCHEDULE,
  planId: PLAN_ID,
  planVersion: PLAN_VERSION,
};

/**
 * Categories mirror the plan's sections/rooms. `type` decides massage vs
 * general (only Massageraum is massage, per the rules) unless a task overrides.
 */
export const TASK_CATEGORIES: TaskCategory[] = [
  { id: 'empfang', labelDe: 'Empfang & Wartebereich', labelEn: 'Reception & Waiting Area', type: 'general', order: 1 },
  { id: 'flur', labelDe: 'Flur', labelEn: 'Hallway', type: 'general', order: 2 },
  { id: 'laserraum', labelDe: 'Laserraum', labelEn: 'Laser Room', type: 'general', order: 3 },
  { id: 'elektrolyseraum', labelDe: 'Elektrolyseraum', labelEn: 'Electrolysis Room', type: 'general', order: 4 },
  { id: 'massageraum', labelDe: 'Massageraum', labelEn: 'Massage Room', type: 'massage', order: 5 },
  { id: 'kueche', labelDe: 'Küche', labelEn: 'Kitchen', type: 'general', order: 6 },
  { id: 'wc', labelDe: 'WC & Waschraum', labelEn: 'WC & Washroom', type: 'general', order: 7 },
  { id: 'pflanzen', labelDe: 'Pflanzen', labelEn: 'Plants', type: 'general', order: 8 },
  { id: 'salon', labelDe: 'Ganzer Salon', labelEn: 'Whole Salon', type: 'general', order: 9 },
  { id: 'mehrwert', labelDe: 'Wertschöpfende Aufgaben', labelEn: 'Value-Adding Tasks', type: 'general', order: 10 },
];

const CATEGORY_BY_ID = new Map(TASK_CATEGORIES.map((c) => [c.id, c]));

export function categoryById(id: string): TaskCategory | undefined {
  return CATEGORY_BY_ID.get(id);
}

export function categoryLabel(id: string, lang: 'de' | 'en'): string {
  const cat = CATEGORY_BY_ID.get(id);
  if (!cat) return id;
  return lang === 'de' ? cat.labelDe : cat.labelEn;
}

/** Union of all configured massage-room use days (deduped, ascending). */
export function allMassageUseDays(schedule: MassageSchedule): number[] {
  const set = new Set<number>();
  for (const days of Object.values(schedule.useDaysByUser)) {
    for (const d of days ?? []) set.add(d);
  }
  return [...set].sort((a, b) => a - b);
}

export function userBySegment(segment: string): TaskUser | undefined {
  return TASK_USERS.find((u) => u.routeSegment === segment);
}

export function userVisibleTypes(user: TaskUser): TaskType[] {
  return user.visibleTypes;
}
