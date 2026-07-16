import {
  CUSTOM_TASK_ID_PREFIX,
  CustomTask,
  MAX_INTERVAL_DAYS,
  MIN_INTERVAL_DAYS,
  TaskDefinition,
  TaskDefinitionOverride,
  TaskEditsState,
  TaskRecurrence,
  TaskType,
  TaskUserId,
  createEmptyEdits,
  rec,
} from '../models';
import { GENERAL_ELIGIBLE, MASSAGE_ELIGIBLE, categoryById } from '../config/task-access.config';
import { parseIso } from './date.util';

/**
 * Layering of team edits over the seed definitions.
 *
 * Pure functions only — the TaskService derives its effective definitions
 * from these on every state change, so an edit made on one device reshapes
 * the plan on all devices the moment it syncs.
 */

export interface EffectiveDefinitions {
  /**
   * Every definition (seed + custom) with overrides applied. User-archived
   * tasks are included with `active: false`, so their stored history is
   * never mistaken for a retired seed task.
   */
  all: TaskDefinition[];
  /** The user-archived subset, offered for restoring in the edit UI. */
  userArchived: TaskDefinition[];
}

export function buildEffectiveDefinitions(
  seed: TaskDefinition[],
  edits: TaskEditsState | undefined,
): EffectiveDefinitions {
  const safe = edits ?? createEmptyEdits();
  const seedIds = new Set(seed.map((d) => d.id));
  const all: TaskDefinition[] = [];
  const userArchived: TaskDefinition[] = [];

  for (const def of seed) {
    const effective = applyOverride(def, safe.overrides[def.id]);
    all.push(effective);
    if (!effective.active) userArchived.push(effective);
  }

  safe.customTasks.forEach((custom, index) => {
    if (seedIds.has(custom.id)) return; // defensive: never shadow a seed task
    const base = customTaskToDefinition(custom, index);
    const effective = applyOverride(base, safe.overrides[custom.id]);
    all.push(effective);
    if (!effective.active) userArchived.push(effective);
  });

  return { all, userArchived };
}

/** Which recurrence kinds expose an editable "every X days" rhythm. */
export function isIntervalEditable(recurrence: TaskRecurrence): boolean {
  return (
    recurrence.kind === 'fixedInterval' ||
    recurrence.kind === 'checkInterval' ||
    recurrence.kind === 'seasonalInterval' ||
    recurrence.kind === 'rotating'
  );
}

/** Current base interval of an interval-editable recurrence. */
export function currentIntervalDays(recurrence: TaskRecurrence): number | null {
  switch (recurrence.kind) {
    case 'fixedInterval':
    case 'checkInterval':
    case 'rotating':
      return recurrence.intervalDays;
    case 'seasonalInterval':
      return recurrence.baseIntervalDays;
    default:
      return null;
  }
}

function withIntervalDays(recurrence: TaskRecurrence, days: number): TaskRecurrence {
  switch (recurrence.kind) {
    case 'fixedInterval':
    case 'checkInterval':
    case 'rotating':
      return { ...recurrence, intervalDays: days };
    case 'seasonalInterval':
      return { ...recurrence, baseIntervalDays: days };
    default:
      return recurrence;
  }
}

function applyOverride(
  def: TaskDefinition,
  override: TaskDefinitionOverride | undefined,
): TaskDefinition {
  if (!override) return def;
  let out = { ...def };
  if (typeof override.nameDe === 'string' && override.nameDe.trim()) {
    // German-only editing: the English toggle shows the edited German text.
    out.nameDe = override.nameDe;
    out.nameEn = override.nameDe;
  }
  if (override.notesDe !== undefined) {
    out.notesDe = override.notesDe ?? undefined;
    out.notesEn = override.notesDe ?? undefined;
  }
  if (
    typeof override.intervalDays === 'number' &&
    clampInterval(override.intervalDays) !== null &&
    isIntervalEditable(def.recurrence)
  ) {
    out.recurrence = withIntervalDays(def.recurrence, override.intervalDays);
  }
  if (override.primaryOwner !== undefined) {
    out.primaryOwner = override.primaryOwner ?? undefined;
  }
  if (override.archived === true) {
    out = { ...out, active: false };
  }
  return out;
}

function customTaskToDefinition(custom: CustomTask, index: number): TaskDefinition {
  const type: TaskType = categoryById(custom.category)?.type ?? 'general';
  const eligibleUsers: TaskUserId[] =
    type === 'massage' ? [...MASSAGE_ELIGIBLE] : [...GENERAL_ELIGIBLE];
  return {
    id: custom.id,
    nameDe: custom.nameDe,
    nameEn: custom.nameDe,
    category: custom.category,
    type,
    eligibleUsers,
    primaryOwner: custom.primaryOwner,
    recurrence: rec.fixed(custom.intervalDays),
    active: true,
    notesDe: custom.notesDe,
    notesEn: custom.notesDe,
    // After the seed tasks of the category (seed uses small per-category counters).
    displayOrder: 1000 + index,
    sourcePlanId: 'user-added',
    sourcePlanVersion: custom.createdAt,
  };
}

/** Clamped, valid rhythm value or null when unusable. */
export function clampInterval(value: unknown): number | null {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  if (n < MIN_INTERVAL_DAYS || n > MAX_INTERVAL_DAYS) return null;
  // Half-day granularity keeps the recurrence engine's decimals tidy.
  return Math.round(n * 2) / 2;
}

/** Unique, stable id for a task created from the UI. */
export function makeCustomTaskId(): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${CUSTOM_TASK_ID_PREFIX}${Date.now().toString(36)}-${rand}`;
}

// ---------------------------------------------------------------------------
// Sanitisation (used by TaskDataMigrationService for loaded/foreign data)
// ---------------------------------------------------------------------------

export function sanitiseEdits(raw: unknown): TaskEditsState {
  const out = createEmptyEdits();
  if (!raw || typeof raw !== 'object') return out;
  const v = raw as Partial<TaskEditsState>;

  if (v.overrides && typeof v.overrides === 'object') {
    for (const [taskId, value] of Object.entries(v.overrides)) {
      const o = sanitiseOverride(value);
      if (o) out.overrides[taskId] = o;
    }
  }

  if (Array.isArray(v.customTasks)) {
    const seen = new Set<string>();
    for (const value of v.customTasks) {
      const c = sanitiseCustomTask(value);
      if (c && !seen.has(c.id)) {
        seen.add(c.id);
        out.customTasks.push(c);
      }
    }
  }
  return out;
}

function sanitiseOverride(raw: unknown): TaskDefinitionOverride | null {
  if (!raw || typeof raw !== 'object') return null;
  const v = raw as Partial<TaskDefinitionOverride>;
  if (typeof v.updatedAt !== 'string' || parseIso(v.updatedAt) === null) return null;
  if (typeof v.updatedBy !== 'string') return null;
  const out: TaskDefinitionOverride = { updatedAt: v.updatedAt, updatedBy: v.updatedBy };
  if (typeof v.nameDe === 'string' && v.nameDe.trim()) out.nameDe = v.nameDe.trim();
  if (v.notesDe === null) out.notesDe = null;
  else if (typeof v.notesDe === 'string') out.notesDe = v.notesDe;
  const interval = clampInterval(v.intervalDays);
  if (typeof v.intervalDays === 'number' && interval !== null) out.intervalDays = interval;
  if (v.primaryOwner === null || typeof v.primaryOwner === 'string') {
    out.primaryOwner = v.primaryOwner as TaskDefinitionOverride['primaryOwner'];
  }
  if (v.archived === true) out.archived = true;
  return out;
}

function sanitiseCustomTask(raw: unknown): CustomTask | null {
  if (!raw || typeof raw !== 'object') return null;
  const v = raw as Partial<CustomTask>;
  const interval = clampInterval(v.intervalDays);
  if (
    typeof v.id !== 'string' ||
    !v.id.startsWith(CUSTOM_TASK_ID_PREFIX) ||
    typeof v.nameDe !== 'string' ||
    !v.nameDe.trim() ||
    typeof v.category !== 'string' ||
    interval === null ||
    typeof v.createdAt !== 'string' ||
    parseIso(v.createdAt) === null ||
    typeof v.createdBy !== 'string'
  ) {
    return null;
  }
  return {
    id: v.id,
    nameDe: v.nameDe.trim(),
    notesDe: typeof v.notesDe === 'string' ? v.notesDe : undefined,
    category: v.category,
    intervalDays: interval,
    primaryOwner: typeof v.primaryOwner === 'string' ? v.primaryOwner : undefined,
    createdAt: v.createdAt,
    createdBy: v.createdBy,
  };
}

// ---------------------------------------------------------------------------
// Cross-device merging (used by SupabaseTaskRepository.mergeStates)
// ---------------------------------------------------------------------------

/**
 * Merge two edits sections: overrides win per task by newer `updatedAt`
 * (ties keep local), custom tasks are unioned by id. Nothing is ever
 * dropped by a merge — archiving is itself an override that wins by time.
 *
 * Granularity is the WHOLE override per task: if the single editor edits
 * the same task on two devices within one sync window, the newer edit wins
 * entirely (accepted for a one-curator feature; field-level merging would
 * add version stamps per field for a scenario that requires the same person
 * racing themselves).
 */
export function mergeEdits(
  local: TaskEditsState | undefined,
  remote: TaskEditsState | undefined,
): TaskEditsState {
  const l = local ?? createEmptyEdits();
  const r = remote ?? createEmptyEdits();

  const overrides: Record<string, TaskDefinitionOverride> = { ...r.overrides };
  for (const [taskId, o] of Object.entries(l.overrides)) {
    const other = overrides[taskId];
    if (!other || o.updatedAt >= other.updatedAt) overrides[taskId] = o;
  }

  const byId = new Map<string, CustomTask>();
  for (const c of [...r.customTasks, ...l.customTasks]) {
    if (!byId.has(c.id)) byId.set(c.id, c);
  }

  return { overrides, customTasks: [...byId.values()] };
}

/** Whether any team edits exist (counts as progress worth preserving). */
export function hasEdits(edits: TaskEditsState | undefined): boolean {
  if (!edits) return false;
  return Object.keys(edits.overrides ?? {}).length > 0 || (edits.customTasks ?? []).length > 0;
}
