#!/usr/bin/env node
/**
 * Flattens the Angular prerender output for Cloudflare Pages:
 * `route/index.html` → `route.html`.
 *
 * Cloudflare Pages derives the canonical URL shape from the asset shape:
 * directory indexes are served at `/route/` (308 from `/route`), flat HTML
 * files at `/route` (308 from `/route/`). Canonical tags, sitemap and
 * router links all use the slash-less form, so the deploy artifact must be
 * flat — otherwise every canonical tag points at a redirecting URL.
 *
 * The root `index.html` stays put; it serves `/` and the SPA fallback.
 */
import { existsSync, readdirSync, renameSync, rmdirSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..', 'dist', 'farewell', 'browser');

if (!existsSync(join(root, 'index.html'))) {
  console.error(`flatten-prerender: no prerender output found at ${root}`);
  process.exit(1);
}

let flattened = 0;

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const child = join(dir, entry.name);
    walk(child);
    const index = join(child, 'index.html');
    if (existsSync(index)) {
      renameSync(index, `${child}.html`);
      flattened++;
      if (readdirSync(child).length === 0) rmdirSync(child);
    }
  }
}

walk(root);
console.log(`flatten-prerender: flattened ${flattened} routes in ${root}`);
