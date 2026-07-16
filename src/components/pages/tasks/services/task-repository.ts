import { InjectionToken, inject } from '@angular/core';
import { PersistedTaskState, STORAGE_KEY } from '../models';
import { TaskStorageService } from './task-storage.service';

/**
 * Repository abstraction over persisted task state.
 *
 * Components never see this — only {@link TaskService} does — so replacing the
 * local (browser storage) implementation with a hosted backend (Firebase,
 * Supabase, a custom API) means implementing this interface and swapping the
 * `TASK_REPOSITORY` provider. The task UI does not change.
 */
export interface TaskRepository {
  /** Returns the stored state, or null if nothing valid is stored yet. */
  load(): PersistedTaskState | null;
  save(state: PersistedTaskState): void;
  clear(): void;
}

/** Local, browser-storage implementation. */
export class LocalTaskRepository implements TaskRepository {
  constructor(private readonly storage: TaskStorageService) {}

  load(): PersistedTaskState | null {
    const raw = this.storage.getRaw(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!parsed || typeof parsed !== 'object') return null;
      // Deep validation/migration happens in TaskDataMigrationService.
      return parsed as PersistedTaskState;
    } catch {
      console.warn('[tasks] stored task state is corrupt and will be reset');
      return null;
    }
  }

  save(state: PersistedTaskState): void {
    try {
      this.storage.setRaw(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('[tasks] failed to serialise task state', err);
    }
  }

  clear(): void {
    this.storage.remove(STORAGE_KEY);
  }
}

/**
 * Root-provided repository token. To move to a backend, override this provider
 * with a class that implements {@link TaskRepository} against your API.
 */
export const TASK_REPOSITORY = new InjectionToken<TaskRepository>('fw.TaskRepository', {
  providedIn: 'root',
  factory: () => new LocalTaskRepository(inject(TaskStorageService)),
});
