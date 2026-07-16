import { PLATFORM_ID, Injectable, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Thin, SSR-safe key/value wrapper around `localStorage`.
 *
 * - On the server (prerender) there is no storage → an in-memory map is used.
 * - If `localStorage` is unavailable or throws (private mode, quota) it falls
 *   back to the in-memory map so the page never breaks.
 *
 * This is the only place that touches browser storage directly; everything else
 * goes through the repository abstraction.
 */
@Injectable({ providedIn: 'root' })
export class TaskStorageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly memory = new Map<string, string>();
  /** Keys whose last localStorage write failed → serve them from memory. */
  private readonly dirtyKeys = new Set<string>();
  private readonly available = this.detect();

  /** Whether changes will actually survive a refresh (true = real storage). */
  get isPersistent(): boolean {
    return this.available;
  }

  getRaw(key: string): string | null {
    // Prefer real storage unless our last write to it failed (quota/private
    // mode), in which case the in-memory mirror holds the fresher value.
    if (this.available && !this.dirtyKeys.has(key)) {
      try {
        return localStorage.getItem(key);
      } catch {
        return this.memory.get(key) ?? null;
      }
    }
    return this.memory.get(key) ?? null;
  }

  setRaw(key: string, value: string): void {
    this.memory.set(key, value);
    if (this.available) {
      try {
        localStorage.setItem(key, value);
        this.dirtyKeys.delete(key);
      } catch (err) {
        this.dirtyKeys.add(key);
        console.warn('[tasks] could not persist to localStorage, keeping in memory only', err);
      }
    }
  }

  remove(key: string): void {
    this.memory.delete(key);
    this.dirtyKeys.delete(key);
    if (this.available) {
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    }
  }

  private detect(): boolean {
    if (!this.isBrowser) return false;
    try {
      const probe = '__fw_tasks_probe__';
      localStorage.setItem(probe, '1');
      localStorage.removeItem(probe);
      return true;
    } catch {
      return false;
    }
  }
}
