import { TaskViewMode } from './access.model';
import { TaskMutableState } from './task.model';

/** Current storage schema version. Bump when the persisted shape changes. */
export const STORAGE_SCHEMA_VERSION = 1;

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
}

export function createEmptyState(seedVersion: string): PersistedTaskState {
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    seedVersion,
    tasks: {},
    prefs: {},
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
