import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import type { PersistedTaskState } from '../models';
import { SUPABASE_CONFIG } from '../config/supabase.config';
// Type-only: keeps the task-repository.ts ↔ this-file module cycle out of the
// runtime graph (the factory there constructs this class).
import type { LocalTaskRepository, TaskRepository } from './task-repository';
import type { SupabaseSessionService } from './supabase-session.service';
import type { TaskStorageService } from './task-storage.service';
import type { TaskSyncService } from './task-sync.service';

/** localStorage key for this device's stable id (dedupes our own echoes). */
const DEVICE_ID_KEY = 'fw_tasks_device_id';
/** One-time flag: this device already seeded the empty remote table. */
const SEEDED_KEY = 'fw_tasks_remote_seeded_v1';
/** Collapse bursts of saves (e.g. collapsing categories) into one push. */
const PUSH_DEBOUNCE_MS = 300;
/** Retry delay after a failed push (offline, expired token, …). */
const PUSH_RETRY_MS = 5000;

interface TasksRow {
  id: string;
  state: PersistedTaskState;
  updated_at: string;
  updated_by: string | null;
}

/**
 * Remote-backed repository: Supabase (Postgres + Realtime) is the shared
 * source of truth, the wrapped {@link LocalTaskRepository} is the synchronous
 * cache in front of it.
 *
 * The {@link TaskRepository} contract is synchronous, so this class keeps the
 * app reading/writing localStorage exactly as before and replicates in the
 * background:
 *
 * - `save()` writes locally, then debounce-pushes the whole state row up.
 * - After sign-in it hydrates: adopts the remote state, or — exactly once,
 *   guarded by an empty-remote check — seeds the table from this device
 *   (migration of pre-Supabase data).
 * - A Realtime subscription on the `tasks` table treats events as a ping and
 *   refetches the row (robust against any payload size limits), then routes
 *   the change through the existing {@link TaskSyncService} path so the
 *   {@link TaskService} reload logic is reused unchanged.
 *
 * Conflict model: last write wins on the whole state row. With live sync the
 * write window between four devices is seconds wide, which is acceptable for
 * this team-of-four cleaning plan.
 */
export class SupabaseTaskRepository implements TaskRepository {
  private readonly deviceId: string;
  private channel: RealtimeChannel | null = null;
  private pushTimer: ReturnType<typeof setTimeout> | null = null;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private pushChain: Promise<void> = Promise.resolve();
  private hydrating = false;
  private readonly visibilityHandler = () => {
    if (document.visibilityState === 'visible') void this.refetchAndReconcile();
  };
  private readonly onlineHandler = () => {
    void this.refetchAndReconcile();
    this.schedulePush(0);
  };

  constructor(
    private readonly local: LocalTaskRepository,
    private readonly session: SupabaseSessionService,
    private readonly sync: TaskSyncService,
    private readonly storage: TaskStorageService,
  ) {
    this.deviceId = this.ensureDeviceId();
    this.session.statusChanges.subscribe((status) => {
      if (status === 'signed-in') void this.onSignedIn();
      else this.teardownRealtime();
    });
    // The session may already be restored before we subscribed.
    if (this.session.status() === 'signed-in') void this.onSignedIn();
  }

  // ---- synchronous contract (served from the local cache) -----------------

  load(): PersistedTaskState | null {
    return this.local.load();
  }

  save(state: PersistedTaskState): void {
    this.local.save(state);
    this.schedulePush(PUSH_DEBOUNCE_MS);
  }

  clear(): void {
    this.local.clear();
    void this.withClient(async (client) => {
      await client.from(SUPABASE_CONFIG.table).delete().eq('id', SUPABASE_CONFIG.stateRowId);
    });
  }

  // ---- sign-in: hydrate + migrate + subscribe ------------------------------

  private async onSignedIn(): Promise<void> {
    await this.hydrate();
    this.setupRealtime();
  }

  /**
   * Reconcile local and remote once per sign-in.
   *
   * - Remote row with completion history → remote is the truth, adopt it.
   * - Remote row without history but local has some → this device is the
   *   canonical source (pre-Supabase data): push local up, keeping any
   *   remote-only prefs.
   * - No remote row → seed it from local once ({@link SEEDED_KEY} +
   *   insert-only, so a concurrent seeder can never be overwritten).
   */
  private async hydrate(): Promise<void> {
    if (this.hydrating) return;
    this.hydrating = true;
    try {
      await this.withClient(async (client) => {
        const remote = await this.fetchRow(client);
        const localState = this.local.load();

        if (remote) {
          if (hasProgress(remote.state) || !localState || !hasProgress(localState)) {
            this.adoptRemote(remote.state);
          } else {
            // Remote exists but is prefs-only while this device holds real
            // history (e.g. another device saved a view toggle first).
            const merged = mergeUnknownPrefs(localState, remote.state);
            this.local.save(merged);
            await this.pushNow(client, merged);
          }
          return;
        }

        if (localState && hasProgress(localState) && !this.storage.getRaw(SEEDED_KEY)) {
          // Migration: empty table, this device has pre-Supabase data.
          // insert (NOT upsert) so a racing device's seed is never clobbered.
          const { error } = await client
            .from(SUPABASE_CONFIG.table)
            .insert(this.toRow(localState));
          if (error && !isDuplicateKey(error.code)) throw error;
          this.storage.setRaw(SEEDED_KEY, new Date().toISOString());
          // Adopt whatever won (ours, or a concurrent seeder's).
          const winner = await this.fetchRow(client);
          if (winner) this.adoptRemote(winner.state);
        }
        // No remote row and nothing local worth seeding: the first real
        // save() will create the row via upsert.
      });
    } catch (err) {
      console.warn('[tasks] Supabase hydrate failed, staying on local cache', err);
    } finally {
      this.hydrating = false;
    }
  }

  /** Write a remote state into the local cache and reuse the sync path. */
  private adoptRemote(state: PersistedTaskState): void {
    const localRaw = JSON.stringify(this.local.load());
    if (localRaw === JSON.stringify(state)) return; // nothing changed
    this.local.save(state);
    this.sync.emitRemoteChange();
  }

  // ---- realtime -------------------------------------------------------------

  private setupRealtime(): void {
    if (this.channel) return;
    void this.withClient(async (client) => {
      this.channel = client
        .channel('fw-tasks-state')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: SUPABASE_CONFIG.table,
            filter: `id=eq.${SUPABASE_CONFIG.stateRowId}`,
          },
          // The event is only a ping — refetching keeps us correct even if
          // a large row ever exceeds the realtime payload limit.
          () => void this.refetchAndReconcile(),
        )
        .subscribe();
      document.addEventListener('visibilitychange', this.visibilityHandler);
      window.addEventListener('online', this.onlineHandler);
    });
  }

  private teardownRealtime(): void {
    if (this.channel) {
      void this.channel.unsubscribe();
      this.channel = null;
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      window.removeEventListener('online', this.onlineHandler);
    }
    if (this.pushTimer) clearTimeout(this.pushTimer);
    if (this.retryTimer) clearTimeout(this.retryTimer);
  }

  /** Pull the authoritative row and apply it unless we wrote it ourselves. */
  private async refetchAndReconcile(): Promise<void> {
    if (this.session.status() !== 'signed-in') return;
    try {
      await this.withClient(async (client) => {
        const row = await this.fetchRow(client);
        if (!row || row.updated_by === this.deviceId) return;
        this.adoptRemote(row.state);
      });
    } catch (err) {
      console.warn('[tasks] Supabase refetch failed', err);
    }
  }

  // ---- push -----------------------------------------------------------------

  private schedulePush(delayMs: number): void {
    if (this.session.status() !== 'signed-in') return;
    if (this.pushTimer) clearTimeout(this.pushTimer);
    this.pushTimer = setTimeout(() => {
      this.pushTimer = null;
      // Chain pushes so an older payload can never overtake a newer one.
      this.pushChain = this.pushChain.then(() => this.pushLatest());
    }, delayMs);
  }

  private async pushLatest(): Promise<void> {
    const state = this.local.load();
    if (!state) return;
    try {
      await this.withClient((client) => this.pushNow(client, state));
      if (this.retryTimer) {
        clearTimeout(this.retryTimer);
        this.retryTimer = null;
      }
    } catch (err) {
      console.warn('[tasks] Supabase push failed, will retry', err);
      if (this.retryTimer) clearTimeout(this.retryTimer);
      this.retryTimer = setTimeout(() => {
        this.retryTimer = null;
        this.schedulePush(0);
      }, PUSH_RETRY_MS);
    }
  }

  private async pushNow(client: SupabaseClient, state: PersistedTaskState): Promise<void> {
    const { error } = await client
      .from(SUPABASE_CONFIG.table)
      .upsert(this.toRow(state), { onConflict: 'id' });
    if (error) throw error;
  }

  // ---- helpers ---------------------------------------------------------------

  private async fetchRow(client: SupabaseClient): Promise<TasksRow | null> {
    const { data, error } = await client
      .from(SUPABASE_CONFIG.table)
      .select('id, state, updated_at, updated_by')
      .eq('id', SUPABASE_CONFIG.stateRowId)
      .maybeSingle<TasksRow>();
    if (error) throw error;
    return data ?? null;
  }

  private toRow(state: PersistedTaskState): TasksRow {
    return {
      id: SUPABASE_CONFIG.stateRowId,
      state,
      updated_at: new Date().toISOString(),
      updated_by: this.deviceId,
    };
  }

  private async withClient<T>(fn: (client: SupabaseClient) => Promise<T>): Promise<T> {
    const client = await this.session.getClient();
    return fn(client);
  }

  private ensureDeviceId(): string {
    const existing = this.storage.getRaw(DEVICE_ID_KEY);
    if (existing) return existing;
    const id = `dev_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
    this.storage.setRaw(DEVICE_ID_KEY, id);
    return id;
  }
}

/** Postgres unique-violation → someone else seeded first, which is fine. */
function isDuplicateKey(code: string | undefined): boolean {
  return code === '23505';
}

/** Whether a state contains anything worth preserving beyond preferences. */
export function hasProgress(state: PersistedTaskState): boolean {
  return Object.values(state.tasks ?? {}).some(
    (t) =>
      (t.history?.length ?? 0) > 0 ||
      t.lastCompletedAt !== null ||
      (t.rotationIndex ?? 0) > 0 ||
      t.openTrigger !== null ||
      t.plannedDate !== null,
  );
}

/** Keep local as canonical but copy over prefs of users unknown locally. */
export function mergeUnknownPrefs(
  local: PersistedTaskState,
  remote: PersistedTaskState,
): PersistedTaskState {
  const prefs = { ...local.prefs };
  for (const [userId, p] of Object.entries(remote.prefs ?? {})) {
    if (!(userId in prefs)) prefs[userId] = p;
  }
  return { ...local, prefs };
}
