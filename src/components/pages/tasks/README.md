# FareWell — Task & Cleaning Plan (staff tool)

A responsive, frontend-only task-management system for the salon team, built into
the existing Angular 20 site. No custom backend is required in this version.

## Routes

Four routes share **one** configurable dashboard (`TaskDashboardComponent`):

| Route | User | Sees | Can complete |
|---|---|---|---|
| `/tasks/nicolita` | Nicolita | general tasks | general |
| `/tasks/mojo` | Mojo | **all** tasks + full activity | all |
| `/massage-tasks/nikkita` | Nikkita | massage tasks (shared) | massage |
| `/massage-tasks/annasun` | Annasun | massage tasks (shared) | massage |

Routes are defined as `tasks/:user` and `massage-tasks/:user` in
`src/app/app-routing.module.ts`. The `:user` segment resolves to a `TaskUser`
via the access configuration; an unknown segment renders a safe "unknown area"
state. These pages are **private**: `noindex`, excluded from `sitemap.xml`, and
`Disallow`ed in `robots.txt`. They are intentionally **not** mirrored under
`/en/` — the task UI is bilingual internally via the existing `LanguageService`
(the header DE/EN toggle switches it in place).

## Architecture

```
src/components/pages/tasks/
  models/            Strongly-typed models + discriminated recurrence union
  config/            Identity map, users/permissions, massage schedule, categories
  data/              Versioned seed data derived from the plan (+ duplicate-id guard)
  services/          Recurrence engine, storage, repository, sync, migration, state
  utils/             Date math, sorting, calendar building, i18n labels
  components/        Presentational components (card, category, list, calendar,
                     day, activity feed, urgency badge, completion dialog)
  task-dashboard/    The single routed page tying it together
```

**State flow:** `TaskService` (Angular signals) owns the single shared
`PersistedTaskState`. On startup it loads via `TASK_REPOSITORY`, normalises +
migrates (`TaskDataMigrationService`), and merges the seed by stable id.
`records` is a `computed()` deriving each task's live view state from the
deterministic `RecurrenceService` at the current `now`. Both the list and the
calendar render from the same `records()` signal, so a change in one appears in
the other immediately. Every mutation persists (`TASK_REPOSITORY.save`) and
broadcasts (`TaskSyncService`) for cross-tab sync.

**Dashboard UX:** the hero header shows live stats (overdue / due today / done
today) plus a daily progress bar; the stats double as quick filters for the
list view (session-only, not persisted). The list/calendar switch is a custom
segmented control. On desktop the task grid grows to three columns inside the
1560px container, and calendar mode takes the full width (the activity feed
drops below). Completions get a confetti burst + undo toast; all motion is
disabled under `prefers-reduced-motion`.

## Editing / adding tasks

Canonical task definitions live in `data/task-seed.data.ts`. Every task is
bilingual: `nameDe` (primary, German) + `nameEn` (from the plan's original
wording), same for `notesDe`/`notesEn`. To add or change a task, edit that file
and **bump `SEED_VERSION`**. Stored history is merged by the stable `id`, so:

- New tasks appear without touching existing history.
- Renaming a task's `nameDe`/`nameEn` keeps its history (the `id` is stable —
  never derive it from a name).
- Removing a task archives its history rather than deleting it.

Recurrence builders live in `models/recurrence.model.ts` (`rec.fixed`,
`rec.check`, `rec.event`, `rec.eventFollowUp`, `rec.weekdays`, `rec.seasonal`,
`rec.adHoc`, `rec.rotating`). Urgency is **derived**, never stored.

## Identity, permissions & schedule

All configurable in `config/task-access.config.ts`:

- `IDENTITY_MAP` — plan names → user ids (Nicole→nicolita, Anna→annasun,
  Nika→nikkita, Joé→mojo).
- `TASK_USERS` — per-user `visibleTypes` + `overview`.
- `MASSAGE_SCHEDULE` — use days (Annasun Mon+Wed, Nikkita Thu). `scheduledWeekdays`
  recurrences with `useDayGroup: 'all'` resolve their weekdays from here, so the
  schedule can change without touching components or seed.
- `TASK_CATEGORIES` — plan sections, with DE/EN labels.

Primary ownership (`primaryOwner`) is informational and never narrows the
broader route permissions.

## Persistence & synchronisation

- `localStorage` (key `fw_tasks_state_v1`) with an in-memory fallback if storage
  is unavailable; all access is SSR-safe (guarded by `isPlatformBrowser`).
- Cross-tab sync via `BroadcastChannel` (channel `fw_tasks_sync`) with a
  `storage`-event fallback.
- **Limitation:** synchronises only across tabs of the *same browser profile* —
  not across devices, browsers or profiles. The UI states this explicitly and
  does not claim multi-device real-time collaboration.

## Replacing the local store with a backend

The only seam is `TASK_REPOSITORY` (`services/task-repository.ts`) — an
`InjectionToken<TaskRepository>` with `load()/save()/clear()`. Components never
touch storage; only `TaskService` uses the repository. To move to Firebase /
Supabase / a custom API:

1. Implement `TaskRepository` against your backend.
2. Override the `TASK_REPOSITORY` provider (root, or in the route `providers`).
3. Optionally push real-time updates into `TaskSyncService.changes$`.

No task components change.

## Testing

Unit + integration specs (Jasmine/Karma) live beside the services:

- `recurrence.service.spec.ts` — every recurrence kind, decimals, seasonal,
  weekday, check, follow-up, ad-hoc, rotating, never-completed, overdue.
- `task-migration.service.spec.ts` — normalise/merge, invalid dates, duplicate
  ids (fail-fast in dev), seed integrity (89 tasks, types, eligibility).
- `activity.service.spec.ts` — route permission filtering.
- `task.service.spec.ts` — completion, undo, cross-route sharing, view
  persistence, rotating advance, event trigger.

Run with `npm test` (`ng test`).

## Files

**New:** everything under `src/components/pages/tasks/`.

**Modified:**
- `src/app/app-routing.module.ts` — added the four task routes.
- `src/robots.txt` — `Disallow` the private task routes.

## Accessibility

Semantic HTML, keyboard-operable controls, visible focus, ARIA disclosure
patterns for categories/activity, an accessible modal dialog (Escape/backdrop
close, focus on open), `aria-live` announcements after completion/undo, and
urgency conveyed by text + glyph in addition to colour.
