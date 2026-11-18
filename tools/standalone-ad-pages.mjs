#!/usr/bin/env node
/**
 * Makes the ad landing pages standalone, and refuses the build when one of
 * them could get an ad blocked again.
 *
 * Google blocks an ad whose destination names a prescription drug
 * ("Restricted drug terms"). On 18.11.2026 the campaign for Dr. Leo was still
 * blocked although the text of its landing page was clean: the word only
 * stood in the site's shared script (titles and descriptions of other
 * routes), which every prerendered page loads. So a page listed under
 * "standalone" in src/app/domain/ad-pages.json is shipped as a plain file:
 *
 * 1. Angular's scripts and their preloads are taken out of its HTML, and the
 *    structured data of the site with them (the page is noindex). What it
 *    still needs on a click is src/assets/ad/ad-page.js.
 * 2. Then the page is checked, in German and in English. It fails when
 *    - a script of the app is still referenced,
 *    - the HTML, or a script, stylesheet or manifest of this site that it
 *      loads, contains a restricted term,
 *    - it links to a page of this site other than itself, its other language
 *      and the pages under "linkedFromStandalone",
 *    - the HTML of one of those linked pages contains a restricted term
 *      (their footer leaves the one link with such a term out).
 *
 * Runs after flatten-prerender.mjs (npm run prerender). Running it twice
 * changes nothing the second time.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const base = join(import.meta.dirname, '..');
const root = join(base, 'dist', 'farewell', 'browser');
const pages = JSON.parse(readFileSync(join(base, 'src', 'app', 'domain', 'ad-pages.json'), 'utf8'));

const AD_SCRIPT = '/assets/ad/ad-page.js';
const LANG_PREFIXES = ['', '/en'];

/** Names of prescription drugs and of their brands; the same list as the page's spec, plus further brands. */
const RESTRICTED =
  /botox|botulinum|\bprp\b|sculptra|radiesse|profhilo|azzalure|vistabel|bocouture|dysport|xeomin|letybo|alluzience|nuceiva|relfydess/i;

const errors = [];
const fail = (page, message) => errors.push(`${page}: ${message}`);

const fileOf = (path) => join(root, `${path.replace(/^\//, '')}.html`);

function around(text, match) {
  const start = Math.max(0, match.index - 40);
  return text.slice(start, match.index + match[0].length + 40).replace(/\s+/g, ' ');
}

function checkTerms(page, what, text) {
  const match = RESTRICTED.exec(text);
  if (match) fail(page, `${what} contains "${match[0]}": …${around(text, match)}…`);
}

/** Attribute value of a tag, or null. */
function attr(tag, name) {
  const match = new RegExp(`\\s${name}="([^"]*)"`, 'i').exec(tag);
  return match ? match[1] : null;
}

const isExternal = (url) => /^(https?:)?\/\//i.test(url) || /^(mailto|tel|data|blob):/i.test(url);
const isAppBundle = (src) => /^\/?(main|polyfills|chunk|scripts)-[A-Za-z0-9_]+\.js$/.test(src);

function makeStandalone(html) {
  let out = html
    // Angular's own scripts.
    .replace(/<script\b[^>]*><\/script>/gi, (tag) => (isAppBundle(attr(tag, 'src') ?? '') ? '' : tag))
    // Their preloads.
    .replace(/<link\b[^>]*>/gi, (tag) => (/\srel="modulepreload"/i.test(tag) ? '' : tag))
    // State handed to the app, and the site's structured data.
    .replace(/<script\b[^>]*\bid="ng-state"[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<script\b[^>]*\btype="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');
  if (!out.includes(`src="${AD_SCRIPT}"`)) {
    if (!out.includes('</body>')) return null;
    out = out.replace('</body>', `<script src="${AD_SCRIPT}" defer></script></body>`);
  }
  return out;
}

function checkPage(page, html, allowedLinks) {
  for (const tag of html.match(/<script\b[^>]*>/gi) ?? []) {
    const src = attr(tag, 'src');
    if (src && !isExternal(src) && src !== AD_SCRIPT) fail(page, `still loads the script ${src}`);
  }
  if (/\srel="modulepreload"/i.test(html)) fail(page, 'still preloads a script of the app');

  checkTerms(page, 'the HTML', html);

  // Text files of this site that the page loads.
  const resources = new Set([AD_SCRIPT]);
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const href = attr(tag, 'href');
    if (href && !isExternal(href) && /\.(css|js|json|webmanifest|svg|txt)(\?|$)/i.test(href)) resources.add(href);
  }
  for (const resource of resources) {
    // <base href="/">: every address without a host starts at the root.
    const file = join(root, resource.split(/[?#]/)[0].replace(/^\//, ''));
    if (!existsSync(file)) {
      fail(page, `loads ${resource}, which is not in the build`);
      continue;
    }
    checkTerms(page, `the file ${resource}`, readFileSync(file, 'utf8'));
  }

  // Links into this site.
  for (const tag of html.match(/<a\b[^>]*>/gi) ?? []) {
    const href = attr(tag, 'href');
    if (href === null || isExternal(href)) continue;
    const target = `/${href.split(/[?#]/)[0].replace(/^\//, '')}`.replace(/(.)\/$/, '$1');
    if (!allowedLinks.has(target)) fail(page, `links to ${target}, which is not on its list`);
  }
}

for (const path of pages.standalone) {
  const twins = LANG_PREFIXES.map((prefix) => `${prefix}${path}`);
  const allowedLinks = new Set([...twins, ...pages.linkedFromStandalone]);
  for (const page of twins) {
    const file = fileOf(page);
    if (!existsSync(file)) {
      fail(page, `no prerendered file at ${file}`);
      continue;
    }
    const standalone = makeStandalone(readFileSync(file, 'utf8'));
    if (standalone === null) {
      fail(page, 'the HTML has no </body>');
      continue;
    }
    writeFileSync(file, standalone);
    checkPage(page, standalone, allowedLinks);
  }
}

for (const path of pages.linkedFromStandalone) {
  const file = fileOf(path);
  if (!existsSync(file)) {
    fail(path, `no prerendered file at ${file}`);
    continue;
  }
  checkTerms(path, 'the HTML', readFileSync(file, 'utf8'));
}

if (errors.length) {
  console.error('standalone-ad-pages: refused.');
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}
console.log(
  `standalone-ad-pages: ${pages.standalone.length * LANG_PREFIXES.length} standalone pages written and checked, ` +
    `${pages.linkedFromStandalone.length} linked pages checked`,
);
