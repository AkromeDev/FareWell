import { TaskViewMode } from './access.model';
import { TaskEditsState, createEmptyEdits } from './edits.model';
import { TaskMutableState } from './task.model';

/**
 * Current storage schema version. Bump when the persisted shape changes.
 * v2 (2026-07-16): added the `edits` section (team edits to the plan).
 */
export const STORAGE_SCHEMA_VERSION = 2;

/** localStorage key holding the whole task state blob. */
export const STORAGE_KEY = 'fw_tasks_state_v1';

/** BroadcastChannel name for cross-tab synchronisation. */
export const SYNC_CHANNEL = 'fw_tasks_sync';

/** Per-user interface preferences (view mode, collapsed categories, …). */
export interface TaskPrefs {
  viewMode: TaskViewMode;
  collapsedCategories: Record<string, boolean>;
  activityCollapsed: boolean;
}

/**
 * The complete persisted state. Mutable task state is shared (keyed by task
 * id); only `prefs` is per-user. The activity feed is derived from the tasks'
 * completion history, so it is not stored separately.
 */
export interface PersistedTaskState {
  schemaVersion: number;
  /** Version of the seed data this state was last merged against. */
  seedVersion: string;
  tasks: Record<string, TaskMutableState>;
  prefs: Record<string, TaskPrefs>;
  /** Team edits to the plan (overrides + added tasks), shared like tasks. */
  edits: TaskEditsState;
}

export function createEmptyState(seedVersion: string): PersistedTaskState {
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    seedVersion,
    tasks: {},
    prefs: {},
    edits: createEmptyEdits(),
  };
}

export function createDefaultPrefs(): TaskPrefs {
  return {
    viewMode: 'list',
    collapsedCategories: {},
    activityCollapsed: true,
  };
}

export function createMutableState(taskId: string): TaskMutableState {
  return {
    taskId,
    lastCompletedAt: null,
    lastCompletedBy: null,
    lastCompletedByName: null,
    lastAction: null,
    history: [],
    rotationIndex: 0,
    plannedDate: null,
    openTrigger: null,
    archived: false,
  };
}
