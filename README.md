# FareWell

Marketing website for **FareWell**, a beauty & wellness studio in Nürnberg
(permanent hair removal / electrolysis, diode laser, microneedling, cavitation
and massage). Built with **Angular 20** (standalone components) with SSR /
prerendering, deployed as a static site to [farewell.salon](https://farewell.salon).

## Development server

Run `npm start` (`ng serve`) for a dev server and open `http://localhost:4200/`.
The app reloads automatically on source changes.

## Build

- `npm run build` – production build into `dist/farewell`.
- `npm run prerender` – static prerender for deployment; afterwards
  `tools/flatten-prerender.mjs` rewrites `route/index.html` → `route.html`.
- `npm run watch` – development build that rebuilds on change.

## English pages (/en/) and the indexing switch

Every translated page has an English twin under `/en/` (same slug), rendered by
the same component; the URL decides the language (`LanguageService`). The
header toggle navigates between counterpart URLs. Special pair: the German VAT
guide (`/ratgeber/mehrwertsteuer-us-streitkraefte`) and the English one
(`/ratgeber/us-forces-vat-relief`) are hreflang counterparts on their own URLs.
Legal pages stay German-only.

The `/en/` pages currently carry `noindex,follow`. To launch English indexing:

1. Set `EN_PREFIX_INDEXABLE = true` in `src/services/seo.service.ts`.
2. Uncomment the prepared `/en/` block in `src/sitemap.xml` and refresh the
   `lastmod` dates.
3. Rebuild (`npm run prerender`), deploy, and resubmit the sitemap in Google
   Search Console.

hreflang link pairs (de / en / x-default) are already emitted on every
bilingual page by `SeoService.setPageSeo` and need no change at launch.

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

