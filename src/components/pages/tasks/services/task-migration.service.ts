import { Injectable } from '@angular/core';
import {
  PersistedTaskState,
  STORAGE_SCHEMA_VERSION,
  TaskCompletion,
  TaskDefinition,
  TaskMutableState,
  TaskPrefs,
  createDefaultPrefs,
  createEmptyState,
  createMutableState,
} from '../models';
import { parseIso } from '../utils/date.util';
import { sanitiseEdits } from '../utils/task-edits';

/**
 * Validates, migrates and merges persisted state.
 *
 * On startup the canonical seed definitions are merged with stored mutable
 * state by stable task id, so that:
 *  - newly added plan tasks appear without touching existing history,
 *  - renamed/updated tasks keep history (their id is unchanged),
 *  - retired tasks are archived (history preserved) rather than deleted,
 *  - schema changes migrate forward,
 *  - corrupt/partial data falls back to safe defaults.
 */
@Injectable({ providedIn: 'root' })
export class TaskDataMigrationService {
  /** Turn raw (possibly invalid) loaded data into a valid, current-schema state. */
  normalise(raw: PersistedTaskState | null, seedVersion: string): PersistedTaskState {
    if (!raw || typeof raw !== 'object') {
      return createEmptyState(seedVersion);
    }

    let state: PersistedTaskState = {
      schemaVersion:
        typeof raw.schemaVersion === 'number' ? raw.schemaVersion : STORAGE_SCHEMA_VERSION,
      seedVersion: typeof raw.seedVersion === 'string' ? raw.seedVersion : seedVersion,
      tasks: this.sanitiseTasks(raw.tasks),
      prefs: this.sanitisePrefs(raw.prefs),
      // v1 states have no edits section; sanitiseEdits returns an empty one.
      edits: sanitiseEdits(raw.edits),
    };

    state = this.runSchemaMigrations(state);
    state.schemaVersion = STORAGE_SCHEMA_VERSION;
    return state;
  }

  /**
   * Merge the EFFECTIVE definitions (seed + user-added tasks, overrides
   * applied) into stored state by id. Missing tasks get a fresh empty state;
   * stored tasks with no matching definition id are archived. Callers must
   * pass effective definitions — passing only the seed would archive the
   * history of user-added (`custom--…`) tasks on every load.
   */
  mergeSeed(
    state: PersistedTaskState,
    definitions: TaskDefinition[],
    seedVersion: string,
  ): PersistedTaskState {
    const tasks: Record<string, TaskMutableState> = { ...state.tasks };
    const seedIds = new Set(definitions.map((d) => d.id));

    for (const def of definitions) {
      if (!tasks[def.id]) {
        tasks[def.id] = createMutableState(def.id);
      } else {
        tasks[def.id] = { ...tasks[def.id], archived: false };
      }
    }

    // Archive (but keep) history for tasks no longer in the seed.
    for (const id of Object.keys(tasks)) {
      if (!seedIds.has(id)) {
        tasks[id] = { ...tasks[id], archived: true };
      }
    }

    return { ...state, tasks, seedVersion };
  }

  // ---- sanitisation ------------------------------------------------------

  private sanitiseTasks(raw: unknown): Record<string, TaskMutableState> {
    const out: Record<string, TaskMutableState> = {};
    if (!raw || typeof raw !== 'object') return out;
    for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
      out[id] = this.sanitiseTaskState(id, value);
    }
    return out;
  }

  private sanitiseTaskState(id: string, value: unknown): TaskMutableState {
    const base = createMutableState(id);
    if (!value || typeof value !== 'object') return base;
    const v = value as Partial<TaskMutableState>;
    const history = Array.isArray(v.history)
      ? v.history.filter((c): c is TaskCompletion => this.isValidCompletion(c))
      : [];
    return {
      ...base,
      lastCompletedAt: this.validIso(v.lastCompletedAt),
      lastCompletedBy: (v.lastCompletedBy as TaskMutableState['lastCompletedBy']) ?? null,
      lastCompletedByName: typeof v.lastCompletedByName === 'string' ? v.lastCompletedByName : null,
      lastAction: (v.lastAction as TaskMutableState['lastAction']) ?? null,
      history,
      rotationIndex: Number.isInteger(v.rotationIndex) ? (v.rotationIndex as number) : 0,
      plannedDate: this.validIso(v.plannedDate),
      openTrigger:
        v.openTrigger && typeof v.openTrigger === 'object' && this.validIso(v.openTrigger.triggeredAt)
          ? v.openTrigger
          : null,
      archived: v.archived === true,
    };
  }

  private isValidCompletion(c: unknown): c is TaskCompletion {
    if (!c || typeof c !== 'object') return false;
    const x = c as Partial<TaskCompletion>;
    return (
      typeof x.id === 'string' &&
      typeof x.taskId === 'string' &&
      typeof x.userId === 'string' &&
      this.validIso(x.completedAt) !== null
    );
  }

  private sanitisePrefs(raw: unknown): Record<string, TaskPrefs> {
    const out: Record<string, TaskPrefs> = {};
    if (!raw || typeof raw !== 'object') return out;
    for (const [userId, value] of Object.entries(raw as Record<string, unknown>)) {
      const base = createDefaultPrefs();
      if (value && typeof value === 'object') {
        const v = value as Partial<TaskPrefs>;
        out[userId] = {
          viewMode: v.viewMode === 'calendar' ? 'calendar' : 'list',
          collapsedCategories:
            v.collapsedCategories && typeof v.collapsedCategories === 'object'
              ? (v.collapsedCategories as Record<string, boolean>)
              : {},
          activityCollapsed: v.activityCollapsed !== false,
        };
      } else {
        out[userId] = base;
      }
    }
    return out;
  }

  private validIso(value: unknown): string | null {
    return typeof value === 'string' && parseIso(value) !== null ? value : null;
  }

  /** Forward-only schema migrations. Extend as the schema evolves. */
  private runSchemaMigrations(state: PersistedTaskState): PersistedTaskState {
    let migrated = state;
    // Example scaffold for future migrations:
    // if (migrated.schemaVersion < 2) { migrated = migrateV1toV2(migrated); }
    return migrated;
  }
}
