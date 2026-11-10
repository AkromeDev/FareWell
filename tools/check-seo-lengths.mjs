#!/usr/bin/env node
/**
 * Checks title and meta description lengths in the prerendered output.
 *
 *   node tools/check-seo-lengths.mjs [dist/farewell/browser]
 *
 * Every indexable page (robots without "noindex") must have a title of at
 * most 60 characters and a description of 120 to 155 characters. Pages with
 * noindex and the prerenderer's redirect stubs are skipped. Exit code 1 if an indexable page fails.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? join(import.meta.dirname, '..', 'dist', 'farewell', 'browser');
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 155;

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html') && e.name !== 'index.csr.html') out.push(p);
  }
  return out;
}

const rows = [];
for (const file of walk(root).sort()) {
  const html = readFileSync(file, 'utf8');
  // Redirect stubs written by the prerenderer for `redirectTo` routes.
  if (/<title>Redirecting<\/title>/.test(html)) continue;
  const title = decode(/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '');
  const desc = decode(/<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '');
  const robots = /<meta name="robots" content="([^"]*)"/.exec(html)?.[1] ?? '';
  const noindex = robots.includes('noindex');
  const route = '/' + relative(root, file).replace(/\.html$/, '').replace(/^index$/, '');
  const tl = [...title].length;
  const dl = [...desc].length;
  const problems = [];
  if (tl > TITLE_MAX) problems.push(`title ${tl}`);
  if (dl < DESC_MIN || dl > DESC_MAX) problems.push(`description ${dl}`);
  rows.push({ route, noindex, tl, dl, problems, title, desc });
}

const indexable = rows.filter((r) => !r.noindex);
const failing = indexable.filter((r) => r.problems.length);
for (const r of failing) {
  console.log(`FAIL ${r.route}  ${r.problems.join(', ')}`);
  if (r.tl > TITLE_MAX) console.log(`     title: ${r.title}`);
  if (r.dl < DESC_MIN || r.dl > DESC_MAX) console.log(`     desc:  ${r.desc}`);
}
console.log(
  `\n${indexable.length} indexable pages checked (${rows.length - indexable.length} noindex skipped): ` +
    `${indexable.length - failing.length} pass, ${failing.length} fail ` +
    `(title <= ${TITLE_MAX}, description ${DESC_MIN}-${DESC_MAX} characters).`
);
process.exit(failing.length ? 1 : 0);
