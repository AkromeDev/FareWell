# Putzplan — Supabase setup (shared, live-syncing task state)

The task pages persist through the `TASK_REPOSITORY` seam. With
`config/supabase.config.ts` filled in, state lives in a Supabase Postgres
table shared by all devices, with realtime sync; with the config left empty
the app runs exactly as before (localStorage only).

Follow these steps once. Everything here is the OWNER's part (dashboard +
SQL); the code side is already done.

## 1. Create the project

1. https://supabase.com → sign in → **New project** (the free plan is enough).
2. Name: e.g. `farewell-putzplan`. Region: **eu-central-1 (Frankfurt)** — keeps
   the data in the EU.
3. The **database password** it asks you to set is for direct DB access only.
   Store it in your password manager. It must NEVER be given to an assistant
   or appear anywhere in the repo.

## 2. Create the shared household login

1. **Authentication → Sign In / Providers → Email**: make sure the Email
   provider is ON, and turn **OFF** "Allow new users to sign up".
   Leave "Anonymous sign-ins" OFF as well.
   (The SQL below pins access to the household email, so even if these
   toggles are ever flipped, strangers still get nothing — but keep them off.)
2. **Authentication → Users → Add user → Create new user**:
   - Email: `putzplan@farewell.salon` (does not need to be a real mailbox;
     it must match `authEmail` in `config/supabase.config.ts` AND the email
     pinned in the SQL policies below).
   - Password: the **team passphrase**. Minimum 6 characters — use a short
     phrase (e.g. three words), not a 4-digit PIN. This is the secret staff
     type once per device. Do not commit it anywhere.
   - Tick **Auto Confirm User**.

## 3. Run the SQL

**SQL Editor → New query**, paste the whole block, **Run**:

```sql
-- One row holds the entire shared task state as JSONB (id = 'main').
create table public.tasks (
  id text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

-- Lock the table: with RLS on and no anon policies, the anon key alone can do nothing.
alter table public.tasks enable row level security;

-- Every policy is pinned to the household account's email, not just to the
-- 'authenticated' role — defence in depth against the signup toggle ever
-- being re-enabled or anonymous sign-ins being turned on later.

-- The household session may read …
create policy "tasks_select_household" on public.tasks
  for select to authenticated
  using ((select auth.jwt() ->> 'email') = 'putzplan@farewell.salon');

-- … create the row (first save / migration) …
create policy "tasks_insert_household" on public.tasks
  for insert to authenticated
  with check ((select auth.jwt() ->> 'email') = 'putzplan@farewell.salon');

-- … update it on every save …
create policy "tasks_update_household" on public.tasks
  for update to authenticated
  using ((select auth.jwt() ->> 'email') = 'putzplan@farewell.salon')
  with check ((select auth.jwt() ->> 'email') = 'putzplan@farewell.salon');

-- … and delete it (used only by the repository's clear()).
create policy "tasks_delete_household" on public.tasks
  for delete to authenticated
  using ((select auth.jwt() ->> 'email') = 'putzplan@farewell.salon');

-- Publish row changes so the app's realtime subscription gets its ping.
alter publication supabase_realtime add table public.tasks;
```

## 4. Hand over the two public values

**Project Settings → Data API**: copy

- **Project URL** (`https://….supabase.co`)
- **anon public** key

Both go into `config/supabase.config.ts` (`url` / `anonKey`). They are safe
to commit — they ship in the client bundle anyway; security comes from RLS +
the passphrase. The **service_role** key on the same page must never leave
the dashboard.

## 5. First run / migration order (important)

Open the plan on the **canonical device first** — the one whose history should
become the shared starting point (the iPad, unless decided otherwise):

1. Open any task page there, enter the passphrase → the device sees the empty
   table, uploads its existing localStorage state **once** (insert-only: it can
   never overwrite an existing remote state; a device with no history seeds
   nothing).
2. Only then unlock the other devices — they adopt the shared state. If one of
   them had its own pre-Supabase completions, those are **merged** in (per-task,
   histories unioned), not lost.

## 6. Rotating the passphrase / lost device / staff departure

Changing a Supabase user's password does NOT reliably kill already-issued
sessions on other devices. The robust procedure for all three cases is:

1. **Authentication → Users**: delete the `putzplan@farewell.salon` user.
2. Create it again (step 2) with the NEW passphrase, Auto Confirm ticked.
3. Every device (including the lost one) is signed out within the hour at the
   latest, when its access token expires and cannot refresh; each remaining
   device unlocks again with the new passphrase.

The task data is untouched by this — the `tasks` table has no link to the
auth user, and the email-pinned policies match the recreated user.

## 7. Acceptance checklist

- [ ] Two signed-in browsers show the same tasks; completing a task in one
      appears in the other within ~2 seconds (no reload).
- [ ] Without the passphrase: the gate blocks the UI, and the anon key alone
      gets no rows (RLS) — verifiable with a plain `curl` against
      `/rest/v1/tasks?select=id` using only the anon key: it must return `[]`
      or a permission error, never data.
- [ ] Canonical device seeded once with full history; a second device did not
      re-seed or wipe anything (its view matches the canonical history).
- [ ] Emptying `url`/`anonKey` in `supabase.config.ts` returns the app to
      pure-localStorage behavior (no gate, everything works offline).

## Notes

- Sessions persist per device/browser profile (supabase-js stores the session
  in localStorage). Signing out is not exposed in the UI on purpose; see §6
  for revocation.
- localStorage remains a synchronous cache + offline fallback. A persisted
  "unpushed changes" marker plus a task-level merge guarantee that completions
  made offline (or seconds before a concurrent write from another device)
  survive: histories are unioned per task, the newer side wins scalar fields.
  The one accepted edge: an undo racing a concurrent remote write within the
  ~300ms push window can resurface the undone completion.
- A full reset (rare) needs more than deleting the `tasks` row: every device
  still holds a local copy it would merge or re-push. To truly start over,
  delete the row AND clear site data on each device.
- Personal data stored remotely: staff first names + completion timestamps
  (EU region if you chose Frankfurt).
