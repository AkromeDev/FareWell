import { Injectable, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import type { SupabaseClient, Subscription } from '@supabase/supabase-js';
import { SUPABASE_CONFIG, isSupabaseEnabled } from '../config/supabase.config';

/**
 * Where the shared-login flow currently stands.
 *
 * - `disabled`     remote persistence is off (no config / SSR) → no gate.
 * - `initializing` restoring a possibly persisted session.
 * - `signed-out`   Supabase is on but this device has not entered the
 *                  passphrase yet → the dashboard shows the unlock gate.
 * - `signed-in`    ready; the repository may talk to the database.
 */
export type SupabaseSessionStatus = 'disabled' | 'initializing' | 'signed-out' | 'signed-in';

/**
 * Why an unlock attempt failed.
 *
 * - `credentials` the server judged the passphrase and rejected it.
 * - `unreachable` the server never judged anything: DNS/network/gateway
 *   failure, or a paused Supabase project (its hostname stops resolving).
 *
 * The distinction matters: telling staff to "check the passphrase" when the
 * backend is simply down sends them hunting for a secret that is perfectly
 * correct.
 */
export type SignInFailureKind = 'credentials' | 'unreachable';

export interface SignInFailure {
  kind: SignInFailureKind;
  /** Raw underlying message, for the console — never shown verbatim in the UI. */
  detail: string;
}

/**
 * True when the failure happened before the credentials were ever checked.
 *
 * supabase-js reports an unrejectable request as `AuthRetryableFetchError`
 * with `status` 0; a rejected passphrase is an `AuthApiError` with status 400.
 * Gateway-level failures (5xx, and the 540 a paused project can return) are
 * likewise not verdicts on the passphrase.
 */
function isUnreachable(error: { name?: string; status?: number; message?: string }): boolean {
  if (error.name === 'AuthRetryableFetchError') return true;
  const status = error.status ?? 0;
  if (status === 0 || status >= 500) return true;
  return /failed to fetch|load failed|network|fetch failed|timed? ?out|not resolve/i.test(
    error.message ?? '',
  );
}

/**
 * Owns the Supabase client and the single shared "household" session.
 *
 * The whole team shares ONE auth user ({@link SUPABASE_CONFIG.authEmail});
 * its passphrase is the secret staff enter once per device. supabase-js
 * persists the session in browser storage, so unlocking really is
 * once-per-device. Row Level Security on the server rejects the bare anon
 * key, which is why signing in is required at all.
 *
 * The SDK is imported dynamically on first use: with remote persistence
 * disabled (or during prerender) it never loads at all.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseSessionService implements OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private clientPromise: Promise<SupabaseClient> | null = null;
  private authSub: Subscription | null = null;

  private readonly _status = signal<SupabaseSessionStatus>(
    this.isBrowser && isSupabaseEnabled() ? 'initializing' : 'disabled',
  );
  /** Reactive session status for templates (drives the unlock gate). */
  readonly status = this._status.asReadonly();

  /** Mirror of {@link status} for plain (non-Angular) consumers. */
  readonly statusChanges = new Subject<SupabaseSessionStatus>();

  private readonly _firstSyncDone = signal(false);
  /**
   * Flips true once the repository's first post-sign-in reconcile attempt
   * has finished (success or failure). The dashboard keeps its gate up until
   * then, so no mutation can race the initial hydration.
   */
  readonly firstSyncDone = this._firstSyncDone.asReadonly();

  constructor() {
    if (this._status() === 'initializing') {
      // Fire and forget: restores a persisted session or lands on signed-out.
      void this.getClient().catch((err) => {
        console.error('[tasks] Supabase client failed to initialise', err);
        this.setStatus('signed-out');
      });
    }
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  /** Called by the repository when the first reconcile attempt completes. */
  markFirstSyncDone(): void {
    this._firstSyncDone.set(true);
  }

  /** The lazily created client. Rejects when remote persistence is disabled. */
  getClient(): Promise<SupabaseClient> {
    if (!this.isBrowser || !isSupabaseEnabled()) {
      return Promise.reject(new Error('[tasks] Supabase is not enabled'));
    }
    this.clientPromise ??= import('@supabase/supabase-js')
      .then(({ createClient }) => {
        const client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
          auth: { persistSession: true, autoRefreshToken: true },
        });
        const { data } = client.auth.onAuthStateChange((_event, session) => {
          this.setStatus(session ? 'signed-in' : 'signed-out');
        });
        this.authSub = data.subscription;
        return client;
      })
      .catch((err) => {
        // Never cache a rejection: a flaky chunk load on first visit must not
        // brick sign-in until a hard reload — the next call retries cleanly.
        this.clientPromise = null;
        throw err;
      });
    return this.clientPromise;
  }

  /**
   * Unlock this device with the shared passphrase. Resolves to null on
   * success, or to a classified failure the gate can phrase honestly.
   */
  async signIn(passphrase: string): Promise<SignInFailure | null> {
    try {
      const client = await this.getClient();
      const { error } = await client.auth.signInWithPassword({
        email: SUPABASE_CONFIG.authEmail,
        password: passphrase,
      });
      if (!error) return null;
      console.warn('[tasks] sign-in failed', error);
      return { kind: isUnreachable(error) ? 'unreachable' : 'credentials', detail: error.message };
    } catch (err) {
      // Nothing reached the server at all (client/chunk load, DNS, offline).
      const detail = err instanceof Error ? err.message : String(err);
      console.warn('[tasks] sign-in could not reach Supabase', err);
      return { kind: 'unreachable', detail };
    }
  }

  async signOut(): Promise<void> {
    if (!this.clientPromise) return;
    const client = await this.clientPromise;
    await client.auth.signOut();
  }

  private setStatus(status: SupabaseSessionStatus): void {
    if (this._status() === status) return;
    this._status.set(status);
    this.statusChanges.next(status);
  }
}
