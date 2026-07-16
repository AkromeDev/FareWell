/**
 * Supabase connection settings for the shared task state.
 *
 * This is the ONE place the project URL and anon key live — nothing else in
 * the app may inline them. Both values are public by design (they ship in the
 * client bundle; access control is enforced server-side by Row Level Security
 * + the shared household login). The service_role key and the database
 * password must NEVER appear anywhere in this repository.
 *
 * Leaving `url`/`anonKey` empty disables the remote layer entirely: the app
 * then runs on the original localStorage-only repository (the fallback).
 */
export const SUPABASE_CONFIG = {
  /** Project URL, e.g. 'https://abcdefghij.supabase.co'. */
  url: 'https://kpwiujyprexemkfmvjhk.supabase.co',
  /** The anon PUBLIC key (Project Settings → API). Safe to commit. */
  anonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwd2l1anlwcmV4ZW1rZm12amhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTk2NjEsImV4cCI6MjA5OTc5NTY2MX0.9peB5dUCpeJKJAgGkU7WMX5xgqGxBfMDljOlPMjknKw',
  /**
   * Email of the single shared "household" auth user. The passphrase for it is
   * the shared secret staff enter once per device — it is never committed.
   */
  authEmail: 'putzplan@farewell.salon',
  /** Table holding the shared state. */
  table: 'tasks',
  /** Primary-key value of the single state row. */
  stateRowId: 'main',
} as const;

/** Remote persistence is active only when both public credentials are set. */
export function isSupabaseEnabled(): boolean {
  return SUPABASE_CONFIG.url.length > 0 && SUPABASE_CONFIG.anonKey.length > 0;
}
