import { Injectable, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { STORAGE_KEY, SYNC_CHANNEL } from '../models';

/**
 * Cross-tab synchronisation within the same browser profile.
 *
 * Uses {@link BroadcastChannel} when supported and falls back to the `storage`
 * event otherwise. Neither delivers to the originating tab, so there is no echo
 * loop. On the server / when unsupported this is a silent no-op.
 *
 * NOTE: this only synchronises tabs of the same browser profile — it cannot
 * sync across different devices, browsers or profiles. A hosted backend would
 * be required for that (see repository abstraction).
 */
@Injectable({ providedIn: 'root' })
export class TaskSyncService implements OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private channel: BroadcastChannel | null = null;
  private storageHandler?: (e: StorageEvent) => void;

  private readonly _changes = new Subject<void>();
  /** Emits when another tab changed the shared task state. */
  readonly changes$ = this._changes.asObservable();

  /** True when cross-tab sync is actually active in this environment. */
  readonly supported: boolean;

  constructor() {
    let supported = false;
    if (this.isBrowser) {
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          this.channel = new BroadcastChannel(SYNC_CHANNEL);
          this.channel.onmessage = () => this._changes.next();
        } catch {
          this.channel = null;
        }
      }
      // Only fall back to the storage event when BroadcastChannel is
      // unavailable, so a change never triggers both paths (double reload).
      if (!this.channel) {
        this.storageHandler = (e: StorageEvent) => {
          if (e.key === STORAGE_KEY) this._changes.next();
        };
        window.addEventListener('storage', this.storageHandler);
      }
      supported = true;
    }
    this.supported = supported;
  }

  /** Broadcast that this tab changed the shared state. */
  notify(): void {
    try {
      this.channel?.postMessage('changed');
    } catch {
      /* ignore */
    }
  }

  ngOnDestroy(): void {
    try {
      this.channel?.close();
    } catch {
      /* ignore */
    }
    if (this.isBrowser && this.storageHandler) {
      window.removeEventListener('storage', this.storageHandler);
    }
  }
}
