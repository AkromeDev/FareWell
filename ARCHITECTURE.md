# Architecture

farewell.salon is the marketing website of FareWell, a beauty and laser salon in Nürnberg: Angular 20
with standalone components, prerendered to static files, served by Cloudflare Pages, with Supabase
behind a few internal staff pages.

Written on 2026-11-13 from `README.md`, `SECURITY.md`, `AI-SEO-STRATEGY.md`, `angular.json`,
`package.json`, the route table, every file in `src/services/`, a sample of page components and the
build tools. It describes what is built today. No code was moved for this note. The counts were made
on that day, without `node_modules/` and `dist/`. A "source file" is a non-spec `.ts` or `.html` file
under `src/`.

The target is Domain-Driven Design in four layers (domain, application, infrastructure, interface),
with the interface ordered by Atomic Design. A layer may use the ones before it in that list and never
one after. The code does not have that shape yet, and the last section says where. Nothing in this
note is scheduled: the code of a page moves into the layers when that page is next reworked, not before.

## What runs

- **The browser app.** `src/main.ts` starts `AppComponent` (skip link, header, router outlet, footer,
  cookie banner). The route table, `src/app/app-routing.module.ts` (946 lines), lazy-loads 51 distinct
  components or modules and mounts the same page tree at `/` in German, at `/en` and at `/uk`. No
  hydration is provided: the browser renders the page again over the prerendered HTML.
- **The prerender, at build time.** `npm run prerender` runs `tools/seal-intern.mjs --release`, then
  `ng run FareWell:prerender` (`outputMode: static`, entry `src/main.server.ts`), then the flatten and
  sitemap tools. Every route becomes an HTML file except the two staff task routes, which render in
  the browser only (`src/app/app.routes.server.ts`). Before a page is written, the markup of the other
  languages is removed and a `/uk` page is translated (`src/app/app.config.server.ts`).
- **The build tools**, in `tools/` unless the path says otherwise:
  - `seal-intern.mjs`: encrypts the internal pages; with `--release` it stops while a test seal exists.
  - `flatten-prerender.mjs`: moves `route/index.html` to `route.html`, copies not-found to `404.html`.
  - `generate-sitemap.mjs`: writes `sitemap.xml` from the prerendered pages that may be indexed.
  - `check-seo-lengths.mjs`: checks title and description lengths. No npm script calls it.
  - `i18n-uk.mjs`: extracts, merges, checks and lists the Ukrainian dictionaries.
  - `responsive-images.mjs`: makes the smaller image variants. Run by hand, the variants are committed.
  - `package-age.py`: refuses a locked package version younger than seven days (`npm run age`).
  - `supabase-keepalive.mjs`: one read request to the backend, for the workflow below.
  - `src/assets/scripts/update-google-reviews.mjs`: rewrites the reviews file (README, *Google reviews*)
- **One scheduled workflow.** `.github/workflows/supabase-keepalive.yml`, the only workflow, runs
  `tools/supabase-keepalive.mjs` once a day with read-only permissions and no install step.
- **The static host.** Cloudflare Pages serves the prerendered files (the tools write them to
  `dist/farewell/browser`). `src/_headers` holds the response headers and cache rules, `src/_redirects`
  the redirects and the rewrite of the two browser-only routes (README, *URL canonicalization*).

## The layers as they are today

The four layers are not folders here. The table says where each kind of code sits today. Paths that
start with `pages/`, `atoms/` or `molecules/` are under `src/components/`.

| Layer | Where in the code | What it holds |
|---|---|---|
| Domain | `src/app/domain/entities.ts`, the only file there (71 lines). Plain TypeScript inside page folders: `pages/price/price-data.ts`, `pages/promotions/promotion-offers.ts`, `pages/karriere/shared/karriere-content.ts`, the two `*-road.data.ts`, and `models/`, `data/`, `utils/` under `pages/tasks/`. | The shared ids of the structured data and two node builders. The price catalogue, the promotion offers, the career texts, the two checklists, the task plan and its recurrence types. 25 source files under `pages/` import nothing from Angular. |
| Application | No folder. `src/services/language.service.ts` and `seo.service.ts`. Under `pages/`: `task.service.ts`, `recurrence.service.ts`, `activity.service.ts`, `user-context.service.ts`, `task-migration.service.ts` in `tasks/services/`, `karriere/freelancer-road/road-state.service.ts`, `promotions/promo-experiment.service.ts`. | Which address carries which language and its counterpart. Title, meta tags, hreflang and JSON-LD of a page. The state and rules of the task plan. The progress of a checklist. The A/B test of the promotions page. |
| Infrastructure | `src/services/analytics.service.ts`, `consent.service.ts`, `intern-seal.service.ts`, `intern-ticks.service.ts`, `responsive-images.ts`. In `pages/tasks/`: `services/task-repository.ts`, `task-storage.service.ts`, `task-sync.service.ts`, `supabase-session.service.ts`, `supabase-task-repository.ts`, `config/supabase.config.ts`. The inline consent script in `src/index.html`. `tools/`. | Everything that reaches outside: see *The seam to the outside*. |
| Interface | `src/components/` (391 files): `atoms/` (14 components), `molecules/` (41), `pages/` (65), and beside them `dropdown/` (1) and `timeProjection/` (3). `src/directives/` (3), `src/styles/` (15 files), `src/models/` (types for the components), `src/app/app.component.*`. | The screens. There is no `organisms/` and no `templates/` folder. |

## The bounded contexts the code shows

No folder is named after a context. These are the groups that the folders and the imports show.

- **Treatments and prices.** One page folder per treatment under `pages/` (ten, from `nadelepilation`
  and `diodenlaser` to `level-44`), `pages/price` with the catalogue `price-data.ts`, `pages/faq`,
  `pages/historie`, and `pages/zeit` with the calculator in `timeProjection/`.
- **Promotions.** `pages/promotions`: 10 components, the offers file and the A/B test of the hub page.
- **Guides and careers.** `pages/ratgeber` (8 components) on the 20 components of `molecules/guide`.
  `pages/karriere` (14 components) with `molecules/karriere` (6), the shared texts in
  `karriere/shared/`, and two checklists whose progress stays in the visitor's browser.
- **Languages.** German and English are written side by side in the components (`t(de, en)` and paired
  `.lang` blocks), and the address decides which one shows (README, *English pages*). Ukrainian is an
  overlay keyed by the German text: `src/i18n/uk/`, 39 dictionaries, with a README of its own.
- **Legal pages.** `pages/legal`: three components, German only.
- **Search engine data.** `src/services/seo.service.ts`, `src/app/domain/entities.ts`, the JSON-LD block
  in `src/index.html`, `src/robots.txt`, `src/llms.txt`, the sitemap tool. Rules: `AI-SEO-STRATEGY.md`.
- **Internal staff pages.** Two kinds. The task plan in `pages/tasks`: 11 components, 8 services, a
  storage port, a `README.md` of its own. The sealed pages in `pages/intern/quick-start`, with
  `molecules/unlock-panel` and `molecules/qs-charts` (README, *Internal pages*).
- **Consent and analytics.** `src/index.html`, two services, `molecules/cookie-banner` (see the seam).
- **Reviews.** One static JSON file, read by `molecules/google-reviews` and the home page (README).
- **Booking** is not a context in the code: it is a link to the booking provider (see the seam).

## The seam to the outside

There is not one seam yet. This is every outside thing the code reaches, by the file that reaches it.

At build time, on the developer's machine and on a schedule:

- **The npm registry**: `npm ci` from the lockfile; `tools/package-age.py` asks it for publish dates.
- **A local folder and the macOS Keychain**: `tools/seal-intern.mjs` reads the plain text of the
  internal pages from outside the repository, and each page's password from the Keychain.
- **Google Places**: `src/assets/scripts/update-google-reviews.mjs`, by hand, key in an untracked file.
- **The backend, from GitHub Actions**: `tools/supabase-keepalive.mjs`, once a day.
- The prerender was not seen to call an outside service: analytics, consent and the backend session
  check `isPlatformBrowser` first, and the staff task routes are not prerendered.

In the visitor's browser:

- **Google tag and Google Tag Manager**: two script tags in `src/index.html`, run in Google's consent
  mode. The inline script above them sets the consent defaults first and replays a stored choice from
  a cookie of the site, so consent decides what the tags may store. `molecules/cookie-banner` passes
  the choice on through `consent.service.ts`. Besides `analytics.service.ts`, nine files call `gtag`
  themselves.
- **The booking provider** (salonkee.de): links that open in a new tab. No booking interface is called.
- **Supabase**: only on staff pages, only in the browser. The task plan loads the SDK on first use and
  syncs after the unlock (`supabase-session.service.ts` and `supabase-task-repository.ts` in
  `pages/tasks/services/`). The sealed pages store ticks through two remote functions
  (`src/services/intern-ticks.service.ts`). Settings: `pages/tasks/config/supabase.config.ts`.
- **Embedded media**: one, the Wistia audio player on `pages/level-44`, created only after the
  visitor's click. **Maps**: none in `src/`. **Fonts**: the site's own files, no font service.
- **The browser's storage**: the language choice (`language.service.ts`), the task plan's local copy
  (`task-storage.service.ts`), the checklists (`road-state.service.ts`), the consent cookie, and the
  A/B variant, only when statistics were accepted (`promo-experiment.service.ts`).
- **The clock**: read directly (`new Date()`, `Date.now()`) in 13 source files. No clock service.
- Cloudflare Web Analytics: named in `src/_headers`, loaded by no file in `src/`. Not checked further.

## What runs with no interface

65 spec files, Jasmine run by Karma in Chrome (`karma.conf.js`), so every test needs a browser. All
176 cases were green on 2026-11-13. The split below was counted from the files, not from a new run.

- 55 spec files create a component (75 cases): 30 in `pages/`, 12 in `atoms/`, 8 in `molecules/`, 5 more.
- 10 spec files create no component (101 cases): six for the task plan in `pages/tasks/`, one for the
  checklist state, one for the A/B test, two for the sealed pages. Five use no Angular test bed.
- No spec file of their own: `entities.ts`, `price-data.ts`, `language.service.ts`, `seo.service.ts`.

## Where the code does not follow the layers yet

Structure only, as it stands on 2026-11-13.

1. **No domain layer for the salon.** `src/app/domain/` is one file, about the ids of the structured
   data. The salon's facts are written in components, templates and static files, several times each.
   The opening hours: `atoms/opening-hours/opening-hours.component.ts`, the JSON-LD block of
   `src/index.html`, `src/llms.txt`. The booking link: a literal in 35 source files. The street
   address: 41 source files. Prices: the catalogue is `pages/price/price-data.ts`, which two treatment
   pages import, and euro amounts are also written as text in 37 source files. The site's origin: a
   constant `ORIGIN` declared in 15 files. Page titles and descriptions: in the route table and again
   in the components (the table's own comment says so).
2. **Most of the code sits in `pages/`.** 246 of the 391 files under `src/components/`, 65 of its 124
   components, 43,279 lines of source files. A page component holds its texts in two languages, its
   structured data, its analytics calls and its layout at once: `pages/home/home.component.ts` (502
   lines) is one example. 36 page files build JSON-LD with `setJsonLd`.
3. **Application and infrastructure code lives inside the interface folder.** 10 of the 16 injectable
   services are under `pages/`, 6 in `src/services/`. `pages/tasks` is a small layered application of
   its own in a page folder, with a declared port for storage (`TASK_REPOSITORY`).
4. **Imports that run against the order.** `src/services/intern-ticks.service.ts` imports the backend
   settings from `pages/tasks/config/supabase.config.ts`. Four files in `molecules/karriere` import
   from `pages/karriere/shared/karriere-content.ts`. `atoms/header` imports a molecule.
5. **Atomic Design is partial.** `atoms/`, `molecules/` and `pages/` exist, `organisms/` and
   `templates/` do not, and `dropdown/` and `timeProjection/` sit beside them. `atoms/header` (284
   lines of TypeScript) and `molecules/footer` are page-wide blocks. No template uses `atoms/table`.
6. **The outside is reached from many places.** `gtag` is called in nine files besides
   `analytics.service.ts`, components among them, `localStorage` directly in a component
   (`timeProjection/bc`), the clock in 13 files. The consent state lives in the inline script of
   `index.html`, and `consent.service.ts` only wraps it.
7. **Two services mix layers.** `language.service.ts` (279 lines) holds the rule that maps an address
   to a language, and it also navigates, writes attributes on the document, watches the DOM for the
   Ukrainian overlay and writes to the browser's storage. `seo.service.ts` holds the hreflang and
   indexing rules and writes them into the document head.
8. **Files that nothing refers to.** `src/app/app.module.ts`, the three modules under `pages/legal/`
   and `pages/about-us/` (component and module) are named by neither `src/main.ts` nor the route
   table. `src/server.ts` is listed in `tsconfig.app.json` and not named in `angular.json`.
