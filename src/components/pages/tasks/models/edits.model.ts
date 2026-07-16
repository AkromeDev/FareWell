import { TaskUserId } from './task.model';

/**
 * Team edits to the task plan, made from the dashboard (Mojo only) and stored
 * in the shared persisted state — synced and merged like completions.
 *
 * The seed in code stays the baseline; edits layer on top of it by stable
 * task id, so history always survives (same rule as editing the seed).
 */

/** Id prefix for tasks created from the UI (never collides with seed slugs). */
export const CUSTOM_TASK_ID_PREFIX = 'custom--';

/** Bounds for the editable "every X days" rhythm (0.5 = twice a day). */
export const MIN_INTERVAL_DAYS = 0.5;
export const MAX_INTERVAL_DAYS = 365;

/**
 * A per-task override. Fields left `undefined` keep the seed value; `null`
 * (where allowed) explicitly clears it. Edited names/notes are entered in
 * German only — the English toggle then shows the German text for that task.
 */
export interface TaskDefinitionOverride {
  nameDe?: string;
  /** `null` clears the seed note. */
  notesDe?: string | null;
  /** Applied only to interval-based recurrence kinds (see isIntervalEditable). */
  intervalDays?: number;
  /** `null` clears the responsible person. */
  primaryOwner?: TaskUserId | null;
  /** Hidden from the plan (history kept); restorable from the edit UI. */
  archived?: boolean;
  /** ISO timestamp of the edit — newer wins when devices merge. */
  updatedAt: string;
  updatedBy: TaskUserId;
}

/** A task added from the UI. Always a simple every-X-days rhythm. */
export interface CustomTask {
  /** `custom--…` id, stable forever (history is keyed by it). */
  id: string;
  nameDe: string;
  notesDe?: string;
  /** Category id; decides general vs massage like seed tasks do. */
  category: string;
  intervalDays: number;
  primaryOwner?: TaskUserId;
  createdAt: string;
  createdBy: TaskUserId;
}

export interface TaskEditsState {
  /** Keyed by task id (seed or custom). */
  overrides: Record<string, TaskDefinitionOverride>;
  customTasks: CustomTask[];
}

export function createEmptyEdits(): TaskEditsState {
  return { overrides: {}, customTasks: [] };
}
