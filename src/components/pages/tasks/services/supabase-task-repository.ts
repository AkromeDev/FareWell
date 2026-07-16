import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import type { PersistedTaskState, TaskMutableState } from '../models';
import { SUPABASE_CONFIG } from '../config/supabase.config';
// Type-only: keeps the task-repository.ts ↔ this-file module cycle out of the
// runtime graph (the factory there constructs this class).
import type { LocalTaskRepository, TaskRepository } from './task-repository';
import type { SupabaseSessionService } from './supabase-session.service';
import type { TaskStorageService } from './task-storage.service';
import type { TaskSyncService } from './task-sync.service';

/** localStorage key for this device's stable id (dedupes our own echoes). */
const DEVICE_ID_KEY = 'fw_tasks_device_id';
/** One-time flag: the remote table was already seeded (by us or adopted). */
const SEEDED_KEY = 'fw_tasks_remote_seeded_v1';
/**
 * Persisted "unpushed local changes exist" marker. Set synchronously with
 * every save and cleared only once that state (or a newer one) has landed
 * remotely — it survives tab/PWA death, so a relaunch never mistakes
 * unpushed completions for stale data.
 */
const DIRTY_KEY = 'fw_tasks_dirty_v1';
/** Collapse bursts of saves (e.g. collapsing categories) into one push. */
const PUSH_DEBOUNCE_MS = 300;
/** Retry delay after a failed push (offline, expired token, …). */
const PUSH_RETRY_MS = 5000;
/** Safety valve: never hold the UI gate longer than this for the first sync. */
const FIRST_SYNC_TIMEOUT_MS = 8000;

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
 * - `save()` writes locally, marks the persisted {@link DIRTY_KEY}, and
 *   debounce-pushes the whole state row up. The marker is cleared only when
 *   the latest state has landed remotely.
 * - After sign-in it hydrates: reconciles with the remote row, or — exactly
 *   once, guarded by an empty-remote check — seeds the table from this device
 *   (migration of pre-Supabase data). The dashboard stays gated until the
 *   first reconcile attempt finishes ({@link SupabaseSessionService.firstSyncDone}).
 * - A Realtime subscription on the `tasks` table treats events as a ping and
 *   refetches the row (robust against any payload size limits), then routes
 *   changes through the existing {@link TaskSyncService} path so the
 *   TaskService reload logic is reused unchanged.
 *
 * Conflict model: while this device has NO unpushed changes, a newer remote
 * row is adopted wholesale. The moment unpushed local changes exist (dirty),
 * remote states are MERGED task-by-task instead (completion histories are
 * unioned, the newer side wins per task), so a device holding unpushed
 * changes never loses them to a concurrent write — see {@link mergeStates}.
 * Accepted residual edges (no server-side versioning): two devices whose
 * pushes cross within roughly the same second can still lose the earlier
 * write, and an undo racing a concurrent remote write can resurface the
 * undone completion.
 *
 * All remote work (hydrate, refetch, push, clear) runs on one serial
 * operation queue, so a refetch can never interleave with an in-flight push.
 */
export class SupabaseTaskRepository implements TaskRepository {
  private readonly deviceId: string;
  private channel: RealtimeChannel | null = null;
  private realtimeClient: SupabaseClient | null = null;
  private pushTimer: ReturnType<typeof setTimeout> | null = null;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  /** Serial queue for ALL remote operations — no interleaving, ever. */
  private ops: Promise<void> = Promise.resolve();
  /** Uniquifies this tab's dirty tokens (the marker is shared per profile). */
  private readonly tabId = Math.random().toString(36).slice(2, 8);
  private dirtySeq = 0;
  private listenersAttached = false;
  private readonly visibilityHandler = () => {
    if (document.visibilityState === 'visible') this.enqueueReconcile();
  };
  private readonly onlineHandler = () => {
    // Both run on the serial queue: reconcile (merges if dirty) first, then
    // the push of whatever survived — no concurrent GET/POST race.
    this.enqueueReconcile();
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
      if (status === 'signed-in') this.onSignedIn();
      else this.teardownRealtime();
    });
    // The session may already be restored before we subscribed.
    if (this.session.status() === 'signed-in') this.onSignedIn();
  }

  // ---- synchronous contract (served from the local cache) -----------------

  load(): PersistedTaskState | null {
    return this.local.load();
  }

  save(state: PersistedTaskState): void {
    // Order matters: state BEFORE marker. A concurrent pusher that reads an
    // older token but newer state merely re-pushes; the reverse order could
    // let it clear the marker for a state it never pushed.
    this.local.save(state);
    this.markDirty();
    this.schedulePush(PUSH_DEBOUNCE_MS);
  }

  clear(): void {
    this.local.clear();
    this.storage.remove(DIRTY_KEY);
    // Best effort; other devices keep their local copies (documented).
    this.enqueue(async () => {
      const client = await this.session.getClient();
      const { error } = await client
        .from(SUPABASE_CONFIG.table)
        .delete()
        .eq('id', SUPABASE_CONFIG.stateRowId);
      if (error) console.warn('[tasks] remote clear failed', error);
    });
  }

  // ---- sign-in: hydrate + subscribe ----------------------------------------

  private onSignedIn(): void {
    // Never hold the unlock gate hostage to a hanging first fetch.
    const gateTimeout = setTimeout(
      () => this.session.markFirstSyncDone(),
      FIRST_SYNC_TIMEOUT_MS,
    );
    this.enqueue(() => this.hydrate()).then(() => {
      clearTimeout(gateTimeout);
      this.session.markFirstSyncDone();
      // Re-check: the session may have died while hydrate was in flight.
      if (this.session.status() !== 'signed-in') return;
      this.setupRealtime();
      if (this.isDirty()) this.schedulePush(0);
    });
  }

  /**
   * First reconcile after sign-in. Also handles the one-time migration:
   * an empty remote table is seeded from this device's pre-Supabase data via
   * INSERT (never upsert), so a concurrent seeder can never be overwritten.
   */
  private async hydrate(): Promise<void> {
    try {
      const client = await this.session.getClient();
      const remote = await this.fetchRow(client);
      const localState = this.local.load();

      if (remote) {
        this.applyRemote(remote.state);
        return;
      }

      if (localState && hasProgress(localState) && !this.storage.getRaw(SEEDED_KEY)) {
        // Compare-and-clear token: a save() landing during the insert's
        // round-trip must keep its marker (same guard pushLatest uses).
        const token = this.storage.getRaw(DIRTY_KEY);
        const { error } = await client.from(SUPABASE_CONFIG.table).insert(this.toRow(localState));
        if (error && !isDuplicateKey(error.code)) throw error;
        this.storage.setRaw(SEEDED_KEY, new Date().toISOString());
        if (!error && token !== null) this.clearDirtyIfCurrent(token);
        // Adopt whatever won (ours, or a concurrent seeder's).
        const winner = await this.fetchRow(client);
        if (winner) this.applyRemote(winner.state);
      }
      // No remote row and nothing local worth seeding: the first real
      // save() will create the row via upsert.
    } catch (err) {
      console.warn('[tasks] Supabase hydrate failed, staying on local cache', err);
    }
  }

  /**
   * Bring a fetched remote state into this device.
   *
   * Clean device → adopt wholesale. A task-level merge happens instead when
   * this device holds unpushed changes, when the remote row suspiciously
   * lost all progress while we have some, or on this device's FIRST contact
   * with the shared row while it still holds pre-Supabase history (the
   * secondary-device migration promised in SUPABASE-SETUP §5). Either way
   * the change flows through the existing sync pipeline.
   */
  private applyRemote(remote: PersistedTaskState): void {
    // Anyone who has seen a populated table must never seed again, even if
    // the row is deleted later (e.g. an explicit reset).
    const firstContact = this.storage.getRaw(SEEDED_KEY) === null;
    this.storage.setRaw(SEEDED_KEY, new Date().toISOString());

    const localState = this.local.load();
    if (!localState) {
      this.local.save(remote);
      this.storage.remove(DIRTY_KEY);
      this.sync.emitRemoteChange();
      return;
    }

    // A row written by a NEWER app schema must not be merged (we would strip
    // fields we do not know) — adopt it read-only style and never push until
    // this client is updated and saves again on its own.
    if ((remote.schemaVersion ?? 1) > (localState.schemaVersion ?? 1)) {
      console.warn('[tasks] remote state has a newer schema; adopting without push');
      this.local.save(remote);
      this.storage.remove(DIRTY_KEY);
      this.sync.emitRemoteChange();
      return;
    }

    const mustMerge =
      this.isDirty() ||
      (hasProgress(localState) && (!hasProgress(remote) || firstContact));
    if (mustMerge) {
      const merged = mergeStates(localState, remote);
      this.local.save(merged);
      this.sync.emitRemoteChange();
      this.markDirty();
      this.schedulePush(0);
      return;
    }

    if (JSON.stringify(localState) !== JSON.stringify(remote)) {
      this.local.save(remote);
      this.sync.emitRemoteChange();
    }
  }

  // ---- realtime -------------------------------------------------------------

  private setupRealtime(): void {
    if (this.channel || this.session.status() !== 'signed-in') return;
    void this.session
      .getClient()
      .then((client) => {
        if (this.channel || this.session.status() !== 'signed-in') return;
        this.realtimeClient = client;
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
            // a large row ever exceeded the realtime payload limit.
            () => this.enqueueReconcile(),
          )
          .subscribe();
        if (!this.listenersAttached) {
          document.addEventListener('visibilitychange', this.visibilityHandler);
          window.addEventListener('online', this.onlineHandler);
          this.listenersAttached = true;
        }
      })
      .catch((err) => console.warn('[tasks] realtime setup failed', err));
  }

  private teardownRealtime(): void {
    if (this.channel) {
      // removeChannel (not just unsubscribe) drops the topic from the client
      // registry, so a quick sign-out → sign-in gets a FRESH channel instead
      // of the stale, half-closed instance client.channel() would return.
      const staleChannel = this.channel;
      this.channel = null;
      if (this.realtimeClient) {
        void this.realtimeClient
          .removeChannel(staleChannel)
          .catch((err) => console.warn('[tasks] realtime channel removal failed', err));
      } else {
        void staleChannel.unsubscribe();
      }
    }
    if (this.listenersAttached && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      window.removeEventListener('online', this.onlineHandler);
      this.listenersAttached = false;
    }
    if (this.pushTimer) clearTimeout(this.pushTimer);
    if (this.retryTimer) clearTimeout(this.retryTimer);
  }

  /** Pull the authoritative row and reconcile (serialised on the op queue). */
  private enqueueReconcile(): void {
    this.enqueue(async () => {
      if (this.session.status() !== 'signed-in') return;
      const client = await this.session.getClient();
      const row = await this.fetchRow(client);
      if (!row) return;
      // Our own write coming back: the push machinery owns that path.
      if (row.updated_by === this.deviceId) return;
      this.applyRemote(row.state);
    });
  }

  // ---- push -----------------------------------------------------------------

  private schedulePush(delayMs: number): void {
    if (this.session.status() !== 'signed-in') return;
    if (this.pushTimer) clearTimeout(this.pushTimer);
    this.pushTimer = setTimeout(() => {
      this.pushTimer = null;
      this.enqueue(() => this.pushLatest());
    }, delayMs);
  }

  private async pushLatest(): Promise<void> {
    // Capture the token BEFORE the state: if a save (this tab or a sibling
    // tab of the same profile) lands in between, we push the newer state
    // under the older token — compare-and-clear then leaves the marker in
    // place and the follow-up push converges. The reverse order could clear
    // a sibling tab's marker for a state that was never pushed.
    const token = this.storage.getRaw(DIRTY_KEY);
    if (token === null) return;
    const state = this.local.load();
    if (!state) return;
    try {
      const client = await this.session.getClient();
      const { error } = await client
        .from(SUPABASE_CONFIG.table)
        .upsert(this.toRow(state), { onConflict: 'id' });
      if (error) throw error;
      // Only clean when no newer save (any tab) replaced the token meanwhile.
      this.clearDirtyIfCurrent(token);
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

  // ---- helpers ---------------------------------------------------------------

  /** Everything remote runs through here — strictly one operation at a time. */
  private enqueue(fn: () => Promise<void>): Promise<void> {
    this.ops = this.ops.then(fn).catch((err) => {
      console.warn('[tasks] Supabase operation failed', err);
    });
    return this.ops;
  }

  /**
   * The dirty marker is a unique token, not a boolean: it is shared by all
   * tabs of the profile, so clearing must be compare-and-clear — a pusher may
   * only remove the exact token it captured, never a sibling tab's newer one.
   */
  private markDirty(): void {
    this.dirtySeq++;
    this.storage.setRaw(DIRTY_KEY, `${Date.now().toString(36)}_${this.tabId}_${this.dirtySeq}`);
  }

  private clearDirtyIfCurrent(token: string): void {
    if (this.storage.getRaw(DIRTY_KEY) === token) this.storage.remove(DIRTY_KEY);
  }

  private isDirty(): boolean {
    return this.storage.getRaw(DIRTY_KEY) !== null;
  }

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

/**
 * Task-level merge of two whole states. Used whenever this device holds
 * unpushed changes, so a concurrent remote write can never erase them:
 *
 * - completion histories are UNIONED by completion id (capped like the app),
 * - per task, the side with the newer activity wins the scalar fields,
 * - `rotationIndex` takes the max, `archived` is sticky,
 * - prefs are per-user unioned with the local side winning conflicts.
 *
 * Known, accepted edge: an undo racing a concurrent remote write within the
 * push debounce can resurface the undone completion (union semantics).
 */
export function mergeStates(
  local: PersistedTaskState,
  remote: PersistedTaskState,
): PersistedTaskState {
  const taskIds = new Set([...Object.keys(local.tasks ?? {}), ...Object.keys(remote.tasks ?? {})]);
  const tasks: Record<string, TaskMutableState> = {};
  for (const id of taskIds) {
    const l = local.tasks?.[id];
    const r = remote.tasks?.[id];
    if (!l || !r) {
      tasks[id] = (l ?? r) as TaskMutableState;
      continue;
    }
    tasks[id] = mergeTaskState(l, r);
  }

  const prefs = { ...(remote.prefs ?? {}), ...(local.prefs ?? {}) };
  return { ...local, tasks, prefs };
}

/** History cap, mirrors TaskService's `.slice(0, 200)`. */
const HISTORY_CAP = 200;

function mergeTaskState(local: TaskMutableState, remote: TaskMutableState): TaskMutableState {
  // Completion scalars come from the side that truly completed last — never
  // from a side whose only claim to recency is a logged trigger, which would
  // regress lastCompletedAt/-By below a completion that survives in history.
  const completionWinner =
    (remote.lastCompletedAt ?? '') > (local.lastCompletedAt ?? '') ? remote : local;

  const byId = new Map<string, TaskMutableState['history'][number]>();
  for (const completion of [...(remote.history ?? []), ...(local.history ?? [])]) {
    byId.set(completion.id, completion);
  }
  const history = [...byId.values()]
    .sort((a, b) => (a.completedAt < b.completedAt ? 1 : a.completedAt > b.completedAt ? -1 : 0))
    .slice(0, HISTORY_CAP);

  // Keep the newest trigger of either side, but only while no completion has
  // consumed it (completing an event task clears its trigger).
  const lt = local.openTrigger;
  const rt = remote.openTrigger;
  const newestTrigger = (rt?.triggeredAt ?? '') > (lt?.triggeredAt ?? '') ? rt : (lt ?? rt);
  const openTrigger =
    newestTrigger && newestTrigger.triggeredAt > (completionWinner.lastCompletedAt ?? '')
      ? newestTrigger
      : null;

  // plannedDate has no own timestamp: take it from the side with the newer
  // overall activity (accepted imprecision for ad-hoc planning).
  const overallWinner = activityStamp(remote) > activityStamp(local) ? remote : local;

  return {
    taskId: local.taskId,
    lastCompletedAt: completionWinner.lastCompletedAt,
    lastCompletedBy: completionWinner.lastCompletedBy,
    lastCompletedByName: completionWinner.lastCompletedByName,
    lastAction: completionWinner.lastAction,
    history,
    rotationIndex: Math.max(local.rotationIndex ?? 0, remote.rotationIndex ?? 0),
    plannedDate: overallWinner.plannedDate,
    openTrigger,
    archived: local.archived || remote.archived,
  };
}

/** Latest activity timestamp of a task state ('' when it has none). */
function activityStamp(t: TaskMutableState): string {
  const completed = t.lastCompletedAt ?? '';
  const triggered = t.openTrigger?.triggeredAt ?? '';
  return completed > triggered ? completed : triggered;
}
