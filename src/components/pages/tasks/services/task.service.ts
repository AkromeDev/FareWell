import {
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CompletionAction,
  PersistedTaskState,
  TaskCompletion,
  TaskDefinition,
  TaskMutableState,
  TaskPrefs,
  TaskRecord,
  TaskTriggerOccurrence,
  TaskUser,
  TaskViewMode,
  createDefaultPrefs,
  createMutableState,
} from '../models';
import { SEED_VERSION, TASK_SEED, assertUniqueSeedIds } from '../data/task-seed.data';
import { RecurrenceService } from './recurrence.service';
import { TASK_REPOSITORY } from './task-repository';
import { TaskDataMigrationService } from './task-migration.service';
import { TaskSyncService } from './task-sync.service';
import { TaskStorageService } from './task-storage.service';

interface UndoSnapshot {
  taskId: string;
  previous: TaskMutableState;
  taskName: string;
}

/** How long an interval waits before refreshing derived urgency (ms). */
const NOW_TICK_MS = 60_000;

/**
 * Central application state for the task system, built on Angular signals.
 *
 * Owns the single, shared persisted state (completion history is global so
 * every route sees the same "last completed by / when"); only UI preferences
 * are per-user. Merges the versioned seed with stored state on startup, derives
 * live view records, and persists + broadcasts every mutation.
 */
@Injectable({ providedIn: 'root' })
export class TaskService implements OnDestroy {
  private readonly recurrence = inject(RecurrenceService);
  private readonly repo = inject(TASK_REPOSITORY);
  private readonly migration = inject(TaskDataMigrationService);
  private readonly sync = inject(TaskSyncService);
  private readonly storage = inject(TaskStorageService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly definitions: TaskDefinition[] = assertUniqueSeedIds(TASK_SEED);
  private readonly defById = new Map(this.definitions.map((d) => [d.id, d]));

  private readonly _state = signal<PersistedTaskState>(this.load());
  private readonly _now = signal<Date>(new Date());
  private nowTimer: ReturnType<typeof setInterval> | null = null;
  private undoSnapshot: UndoSnapshot | null = null;
  private readonly syncSub;

  /** Current wall-clock (refreshed periodically) for relative-time labels. */
  readonly now: Signal<Date> = this._now.asReadonly();

  /** Whether changes survive a refresh on this device. */
  readonly isPersistent = this.storage.isPersistent;
  /** Whether cross-tab sync is active. */
  readonly syncSupported = this.sync.supported;

  /** All task records (definition + state + derived view) at `now`. */
  readonly records = computed<TaskRecord[]>(() => {
    const state = this._state();
    const now = this._now();
    return this.definitions.map((def) => {
      const st = state.tasks[def.id] ?? createMutableState(def.id);
      return { def, state: st, computed: this.recurrence.compute(def, st, now) };
    });
  });

  constructor() {
    this.syncSub = this.sync.changes$.subscribe(() => this.reloadFromStorage());
    if (this.isBrowser) {
      this.nowTimer = setInterval(() => this._now.set(new Date()), NOW_TICK_MS);
    }
  }

  ngOnDestroy(): void {
    if (this.nowTimer) clearInterval(this.nowTimer);
    this.syncSub.unsubscribe();
  }

  // ---- reads -------------------------------------------------------------

  /** Records the given user may see (respecting type visibility + active flag). */
  visibleRecords(user: TaskUser): TaskRecord[] {
    return this.records().filter(
      (r) => r.def.active && !r.state.archived && user.visibleTypes.includes(r.def.type),
    );
  }

  definition(taskId: string): TaskDefinition | undefined {
    return this.defById.get(taskId);
  }

  refreshNow(): void {
    this._now.set(new Date());
  }

  // ---- completion --------------------------------------------------------

  /**
   * Complete a task: record who/when, append immutable history, recalc the next
   * occurrence, persist and broadcast. The previous state is kept for undo.
   */
  complete(taskId: string, user: TaskUser, action: CompletionAction = 'completed', note?: string): void {
    const def = this.defById.get(taskId);
    if (!def) return;
    if (!user.visibleTypes.includes(def.type)) return; // permission guard

    this.mutateTasks((tasks) => {
      const previous = tasks[taskId] ?? createMutableState(taskId);
      this.undoSnapshot = { taskId, previous: clone(previous), taskName: def.name };

      const nowIso = new Date().toISOString();
      const zone =
        def.recurrence.kind === 'rotating'
          ? this.recurrence.compute(def, previous, new Date()).currentZone
          : undefined;

      const completion: TaskCompletion = {
        id: makeId(),
        taskId,
        userId: user.id,
        userName: user.name,
        completedAt: nowIso,
        action,
        note: note?.trim() ? note.trim() : undefined,
        zone,
      };

      tasks[taskId] = {
        ...previous,
        lastCompletedAt: nowIso,
        lastCompletedBy: user.id,
        lastCompletedByName: user.name,
        lastAction: action,
        history: [completion, ...previous.history].slice(0, 200),
        rotationIndex:
          def.recurrence.kind === 'rotating' ? previous.rotationIndex + 1 : previous.rotationIndex,
        openTrigger: null,
        plannedDate: def.recurrence.kind === 'adHoc' ? null : previous.plannedDate,
      };
    });
  }

  /** Restore the state captured before the last completion. */
  undoLast(): { taskName: string } | null {
    const snap = this.undoSnapshot;
    if (!snap) return null;
    this.mutateTasks((tasks) => {
      tasks[snap.taskId] = snap.previous;
    });
    this.undoSnapshot = null;
    return { taskName: snap.taskName };
  }

  canUndo(): boolean {
    return this.undoSnapshot !== null;
  }

  /** Record an external event so an event-triggered task becomes actionable. */
  triggerEvent(taskId: string, user: TaskUser): void {
    const def = this.defById.get(taskId);
    if (!def) return;
    const event =
      def.recurrence.kind === 'eventTriggered' || def.recurrence.kind === 'eventWithFollowUp'
        ? def.recurrence.event
        : null;
    if (!event) return;
    const occurrence: TaskTriggerOccurrence = {
      id: makeId(),
      taskId,
      event,
      triggeredAt: new Date().toISOString(),
      triggeredBy: user.id,
    };
    this.mutateTasks((tasks) => {
      const previous = tasks[taskId] ?? createMutableState(taskId);
      tasks[taskId] = { ...previous, openTrigger: occurrence };
    });
  }

  /** Place an ad-hoc task on a specific calendar day (ISO date), or clear it. */
  setPlannedDate(taskId: string, isoDate: string | null): void {
    this.mutateTasks((tasks) => {
      const previous = tasks[taskId] ?? createMutableState(taskId);
      tasks[taskId] = { ...previous, plannedDate: isoDate };
    });
  }

  // ---- preferences (per user) -------------------------------------------

  prefs(userId: string): TaskPrefs {
    return this._state().prefs[userId] ?? createDefaultPrefs();
  }

  setViewMode(userId: string, mode: TaskViewMode): void {
    this.mutatePrefs(userId, (p) => ({ ...p, viewMode: mode }));
  }

  toggleCategory(userId: string, categoryId: string): void {
    this.mutatePrefs(userId, (p) => ({
      ...p,
      collapsedCategories: {
        ...p.collapsedCategories,
        [categoryId]: !p.collapsedCategories[categoryId],
      },
    }));
  }

  setActivityCollapsed(userId: string, collapsed: boolean): void {
    this.mutatePrefs(userId, (p) => ({ ...p, activityCollapsed: collapsed }));
  }

  // ---- internals ---------------------------------------------------------

  private mutateTasks(fn: (tasks: Record<string, TaskMutableState>) => void): void {
    const current = this._state();
    const tasks = { ...current.tasks };
    fn(tasks);
    this.commit({ ...current, tasks });
  }

  private mutatePrefs(userId: string, fn: (p: TaskPrefs) => TaskPrefs): void {
    const current = this._state();
    const existing = current.prefs[userId] ?? createDefaultPrefs();
    const prefs = { ...current.prefs, [userId]: fn(existing) };
    this.commit({ ...current, prefs });
  }

  private commit(next: PersistedTaskState): void {
    this._state.set(next);
    this.repo.save(next);
    this.sync.notify();
  }

  private load(): PersistedTaskState {
    const raw = this.repo.load();
    const normalised = this.migration.normalise(raw, SEED_VERSION);
    return this.migration.mergeSeed(normalised, this.definitions, SEED_VERSION);
  }

  /** Reload after another tab changed the shared state (no re-broadcast). */
  private reloadFromStorage(): void {
    // An incoming change means our captured undo baseline is no longer
    // authoritative — dropping it prevents undo from reverting another tab's
    // update (cross-tab lost update).
    this.undoSnapshot = null;
    this._state.set(this.load());
  }
}

function makeId(): string {
  const c = typeof crypto !== 'undefined' ? crypto : undefined;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function clone<T>(value: T): T {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}
