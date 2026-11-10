#!/usr/bin/env node
/**
 * Makes the responsive WebP variants of the site's large images.
 *
 *   node tools/responsive-images.mjs
 *
 * Run by hand after adding or replacing one of the images in SOURCES; the
 * variants are committed, so the build needs no image tool. Needs `cwebp`
 * (brew install webp) and macOS `sips`. For every source it writes
 * `<name>-<width>w.webp` next to it for each width in WIDTHS that is not
 * larger than the source, plus the source width itself when that is smaller
 * than the largest step, and records them with the source's size in
 * src/assets/images/responsive.json, which src/services/responsive-images.ts
 * reads to build `srcset`, `width` and `height`. The same file lists the size
 * of every other image in src/assets/images: run the script again after
 * adding an image, so it gets its width and height.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';

const ROOT = join(import.meta.dirname, '..', 'src');
const WIDTHS = [480, 960, 1600];
const QUALITY = '78';

/** Paths as the templates use them (relative to src/). */
const SOURCES = [
  // Home page: hero and treatment cards.
  'assets/images/farewell/studio.webp',
  'assets/images/treatment/nadelepilation.jpg',
  'assets/images/treatment/diodenlaser.webp',
  'assets/images/treatment/microneedling.webp',
  'assets/images/treatment/microneedling4.webp',
  'assets/images/treatment/kavitation.webp',
  'assets/images/partner/level44-breathwork-gastgeberin.webp',
  'assets/images/team/dr-andrea-leo.webp',
  // Cards of the promotions hub.
  'assets/images/treatment/laser2.webp',
  'assets/images/treatment/nadel.jpg',
];

function size(file) {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  return {
    width: Number(/pixelWidth: (\d+)/.exec(out)[1]),
    height: Number(/pixelHeight: (\d+)/.exec(out)[1]),
  };
}

const manifest = {};
for (const src of SOURCES) {
  const file = join(ROOT, src);
  if (!existsSync(file)) throw new Error(`missing ${src}`);
  const { width, height } = size(file);
  const steps = WIDTHS.filter((w) => w < width);
  if (width <= WIDTHS[WIDTHS.length - 1]) steps.push(width);
  else steps.push(WIDTHS[WIDTHS.length - 1]);
  const variants = [];
  for (const w of [...new Set(steps)].sort((a, b) => a - b)) {
    const out = join(dirname(file), `${src.split('/').pop().replace(extname(src), '')}-${w}w.webp`);
    execFileSync('cwebp', ['-quiet', '-q', QUALITY, '-resize', String(w), '0', '-metadata', 'none', file, '-o', out]);
    variants.push({ src: relative(ROOT, out), width: w });
  }
  manifest[src] = { width, height, variants };
  console.log(`${src}: ${width}x${height} -> ${variants.map((v) => v.width).join(', ')}`);
}

// The intrinsic size of every other raster image, for width/height.
const sizes = {};
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(jpe?g|png|webp|gif)$/i.test(e.name) && !/-\d+w\.webp$/.test(e.name)) {
      const rel = relative(ROOT, p);
      if (!manifest[rel]) sizes[rel] = size(p);
    }
  }
};
walk(join(ROOT, 'assets', 'images'));

writeFileSync(
  join(ROOT, 'assets', 'images', 'responsive.json'),
  JSON.stringify({ responsive: manifest, sizes }, null, 1) + '\n',
);
