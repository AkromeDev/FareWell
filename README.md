# FareWell

Marketing website for **FareWell**, a beauty & wellness studio in Nürnberg
(permanent hair removal / electrolysis, diode laser, microneedling, cavitation
and massage). Built with **Angular 20** (standalone components) with SSR /
prerendering, deployed as a static site to [farewell.salon](https://farewell.salon).

## Architecture

[`ARCHITECTURE.md`](ARCHITECTURE.md) says how the code is cut today: what runs, where each layer
sits, the groups the folders show, every outside thing the site reaches, and where the code does
not follow the layers yet.

## Install

Run `npm ci`: it installs exactly what `package-lock.json` holds. `.npmrc` keeps
install scripts off (`ignore-scripts=true`) and saves versions exactly
(`save-exact=true`); the build, the prerender and the tests need no install script.

`npm run age` asks the npm registry when each locked version was published and refuses
one younger than seven days. Run it before a changed lockfile is committed.

## Development server

Run `npm start` (`ng serve`) for a dev server and open `http://localhost:4200/`.
The app reloads automatically on source changes.

## Build

- `npm run build` – production build into `dist/farewell`.
- `npm run prerender` – static prerender for deployment; afterwards
  `tools/flatten-prerender.mjs` rewrites `route/index.html` → `route.html`.
- `npm run watch` – development build that rebuilds on change.

## English pages (/en/)

Every translated page has an English twin under `/en/` (same slug), rendered by
the same component; the URL decides the language (`LanguageService`). The
header toggle navigates between counterpart URLs. Special pair: the German VAT
guide (`/ratgeber/mehrwertsteuer-us-streitkraefte`) and the English one
(`/ratgeber/us-forces-vat-relief`) are hreflang counterparts on their own URLs.
Legal pages stay German-only.

**The `/en/` pages are indexable and are meant to stay that way.** They carry
`index,follow`, they are listed in the sitemap, and hreflang pairs
(de / en / x-default) are emitted on every bilingual page by
`SeoService.setPageSeo`. Do not reintroduce a `noindex` switch for the `/en/`
prefix — only individually private pages (404, staff task pages) opt out, via
the per-page `noindex` flag on `PageSeo`.

The sitemap is generated at build time by `tools/generate-sitemap.mjs` (part of
`npm run prerender`): every prerendered page with `index,follow` and a canonical
on itself is listed. `tools/sitemap-meta.json` holds `lastmod` and `priority`
per address; update a page's `lastmod` there when its content changes.

## URL canonicalization (SEO)

The canonical URL for every page is `https://farewell.salon/<route>` – no www,
no trailing slash. Two things keep that true:

1. **Flat prerender output.** Cloudflare Pages derives redirects from the asset
   shape: `route/index.html` is forced to `/route/`, `route.html` to `/route`.
   The flatten step in `npm run prerender` therefore must always run before a
   deploy (make sure the Cloudflare Pages build command is `npm run prerender`).
2. **www → apex redirect.** Configured in the Cloudflare dashboard (not in this
   repo): `www.farewell.salon/*` must 301 to `https://farewell.salon/$1`, never
   the other way around – the on-page canonical tags point at the apex domain.

## Internal pages (/intern/)

Encrypted pages for single people (today: the Quick Start pages for Dr. Leo and
Ruslana), built like the sealed team page of themojo.solutions. The route
prerenders only a lock screen with `noindex`; the content ships as
`src/assets/intern/<slug>.sealed.json` (PBKDF2-SHA256, AES-256-GCM) and is
decrypted in the browser with that page's password. Nothing is stored.

- **This repository is public, so the plain text never lives here.** It sits in
  the FareWell project folder (`~/Claude/Projects/FareWell/domains/marketing/`,
  override with `INTERN_QUELLE`), as listed in `tools/intern-pages.json`.
- Each page has its own password in the macOS Keychain (service names in
  `tools/intern-pages.json`). `npm run seal` seals what changed;
  `npm run seal -- --check` compares every seal with its plain text.
- A test seal (`SEAL_PASSWORD=...`) is marked `"test": true`, and
  `npm run prerender` refuses to build while one is present.
- On `/intern/` the header language switch does not navigate (that would close
  the opened page); the page follows it instead.

## Running unit tests

Run `npm test` (`ng test`) to execute the unit tests via
[Karma](https://karma-runner.github.io).

## Google reviews

The "Google Bewertungen" carousel is rendered from a static JSON file
(`src/assets/data/google-reviews.json`) that is bundled at build time — there is
no runtime backend or API key in the browser.

To refresh the reviews:

1. Copy `.env.example` to `.env` (gitignored) and set `GOOGLE_MAPS_API_KEY` to a
   key with access to the **Places API (New)**. `PLACE_ID` defaults to the
   FareWell listing.
2. Run `npm run update:google-reviews` — this fetches the latest reviews from the
   Google Places API and rewrites `src/assets/data/google-reviews.json`.
3. Run `npm run build` and deploy so the refreshed reviews ship with the site.

## Further help

See the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).

