#!/usr/bin/env node
/**
 * Versiegelt die internen Seiten unter /intern/. Nachbau des Siegels von
 * themojo.solutions (MojoSolutions/website/scripts/seal.mjs), angepasst an
 * dieses Repository:
 *
 *   tools/intern-pages.json                 welche Seiten es gibt (öffentlich, committet)
 *   <QUELLE>/<source>                        der Klartext, liegt NUR auf Joés Rechner,
 *                                            im FareWell-Projektordner, nie in diesem Repo
 *   src/assets/intern/<slug>.sealed.json     der verschlüsselte Inhalt (committet, veröffentlicht)
 *
 * Dieses Repository ist öffentlich. Deshalb liegt der Klartext gar nicht erst
 * hier, sondern standardmäßig in
 *   ~/Claude/Projects/FareWell/domains/marketing/quick-start/
 * (anderer Ort: Umgebungsvariable INTERN_QUELLE).
 *
 * Aufruf:
 *   npm run seal                    versiegelt, was neu ist oder sich geändert hat
 *   npm run seal -- --check         öffnet jede versiegelte Seite und vergleicht mit dem Klartext
 *   npm run seal -- --unseal        schreibt den Klartext aus der versiegelten Fassung zurück
 *   node tools/seal-intern.mjs --release
 *                                   ohne Passwort: bricht ab, wenn eine Seite nur mit einem
 *                                   Testpasswort versiegelt ist (läuft vor jedem Prerender)
 *
 * Das Passwort jeder Seite steht im macOS-Schlüsselbund unter dem Dienst aus
 * intern-pages.json und wird nie ausgegeben. Einmal im Terminal ablegen (fragt zweimal):
 *   security add-generic-password -a "$USER" -s "farewell.salon intern quick-start-leo" -w
 * SEAL_PASSWORD ersetzt es für ein Testsiegel; ein solches Siegel trägt "test": true
 * und hält den Prerender (also jede Veröffentlichung) an.
 *
 * Die Verschlüsselung: PBKDF2 mit SHA-256 und 600.000 Runden macht aus Passwort und
 * einem zufälligen 16-Byte-Salt einen AES-256-GCM-Schlüssel; jedes Siegel bekommt einen
 * eigenen zufälligen 12-Byte-IV, und die Zusatzdaten nennen die Seite, damit sich ein
 * Siegel nicht unter einer anderen Adresse öffnen lässt. Der Browser öffnet es mit
 * src/services/intern-seal.service.ts.
 */
import { execFileSync } from 'node:child_process';
import { webcrypto } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY = join(ROOT, 'tools', 'intern-pages.json');
const OUT = join(ROOT, 'src', 'assets', 'intern');
const QUELLE = process.env.INTERN_QUELLE ?? join(homedir(), 'Claude', 'Projects', 'FareWell', 'domains', 'marketing');
const ITERATIONS = 600_000;

const args = new Set(process.argv.slice(2));
const CHECK = args.has('--check');
const UNSEAL = args.has('--unseal');
const RELEASE = args.has('--release');
const FORCE = args.has('--force');

const { subtle } = webcrypto;
const encoder = new TextEncoder();

/** Zusatzdaten, die ein Siegel an seine Seite binden. Derselbe Text im Browser. */
const context = (slug) => `farewell-intern:v1:${slug}`;
const toBase64 = (bytes) => Buffer.from(bytes).toString('base64');
const fromBase64 = (text) => new Uint8Array(Buffer.from(text, 'base64'));

function fail(message) {
  console.error(`  fehler   ${message}`);
  process.exit(1);
}

const pages = JSON.parse(readFileSync(REGISTRY, 'utf8')).pages;
const sealedFile = (page) => join(OUT, `${page.slug}.sealed.json`);
const plainFile = (page) => join(QUELLE, page.source);
const readSealed = (page) => (existsSync(sealedFile(page)) ? JSON.parse(readFileSync(sealedFile(page), 'utf8')) : null);

// Vor dem Prerender: kein Passwort nötig, nur der Blick auf die Siegel.
if (RELEASE) {
  const test = pages.filter((page) => readSealed(page)?.test);
  if (test.length) {
    fail(
      `${test.map((p) => p.slug).join(', ')} ist nur mit einem Testpasswort versiegelt. ` +
        `Mit dem echten Passwort neu versiegeln (npm run seal) oder die Datei nicht veröffentlichen.`,
    );
  }
  console.log(`  ok       ${pages.length} interne Seiten, keine mit Testsiegel.`);
  process.exit(0);
}

function readPassword(page) {
  if (process.env.SEAL_PASSWORD) {
    // Eine kleinere Rundenzahl macht Testsiegel schnell; gilt nur für Testsiegel.
    const iterations = Number(process.env.SEAL_ITERATIONS ?? ITERATIONS);
    return { value: process.env.SEAL_PASSWORD, test: true, iterations };
  }
  try {
    const value = execFileSync('security', ['find-generic-password', '-s', page.keychain, '-w'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).replace(/\n$/, '');
    if (!value) throw new Error('leer');
    return { value, test: false, iterations: ITERATIONS };
  } catch {
    return fail(
      `kein Passwort für ${page.slug} im Schlüsselbund. Einmal im Terminal ablegen (fragt zweimal):\n` +
        `             security add-generic-password -a "$USER" -s "${page.keychain}" -w`,
    );
  }
}

async function deriveKey(password, salt, iterations) {
  const base = await subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  return subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/** Der Klartext, oder null, wenn das Passwort das Siegel nicht öffnet. */
async function open(envelope, password, slug) {
  const key = await deriveKey(password, fromBase64(envelope.salt), envelope.iterations);
  try {
    const plain = await subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(envelope.iv), additionalData: encoder.encode(context(slug)) },
      key,
      fromBase64(envelope.data),
    );
    return new TextDecoder().decode(plain);
  } catch {
    return null;
  }
}

async function seal(text, password, slug) {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password.value, salt, password.iterations);
  const data = await subtle.encrypt({ name: 'AES-GCM', iv, additionalData: encoder.encode(context(slug)) }, key, encoder.encode(text));
  return {
    v: 1,
    slug,
    kdf: 'PBKDF2-SHA256',
    iterations: password.iterations,
    salt: toBase64(salt),
    iv: toBase64(iv),
    data: toBase64(new Uint8Array(data)),
    test: password.test,
  };
}

let changed = 0;
mkdirSync(OUT, { recursive: true });

for (const page of pages) {
  const name = page.slug;
  const sealed = readSealed(page);
  const password = readPassword(page);

  if (UNSEAL) {
    if (!sealed) {
      console.log(`  skip     ${name}: noch nichts versiegelt.`);
      continue;
    }
    const text = await open(sealed, password.value, page.slug);
    if (text === null) fail(`${name}: dieses Passwort öffnet das Siegel nicht.`);
    if (existsSync(plainFile(page)) && !FORCE) {
      console.log(`  skip     ${plainFile(page)} existiert. Mit --force überschreiben.`);
      continue;
    }
    mkdirSync(dirname(plainFile(page)), { recursive: true });
    writeFileSync(plainFile(page), text);
    console.log(`  geöffnet ${name} → ${plainFile(page)}`);
    changed++;
    continue;
  }

  if (!existsSync(plainFile(page))) {
    if (CHECK && sealed) fail(`${name}: Siegel vorhanden, Klartext fehlt (${plainFile(page)}). npm run seal -- --unseal`);
    console.log(`  skip     ${name}: kein Klartext unter ${plainFile(page)}.`);
    continue;
  }
  const text = readFileSync(plainFile(page), 'utf8');
  try {
    JSON.parse(text);
  } catch (error) {
    fail(`${name}: ${plainFile(page)} ist kein gültiges JSON (${error.message}).`);
  }

  const current = sealed ? await open(sealed, password.value, page.slug) : null;
  if (CHECK) {
    if (!sealed) fail(`${name}: noch nicht versiegelt.`);
    if (current === null) fail(`${name}: dieses Passwort öffnet das Siegel nicht.`);
    if (current !== text) fail(`${name}: das Siegel ist älter als der Klartext. npm run seal`);
    console.log(`  ok       ${name}${sealed.test ? ' (Testsiegel)' : ''}`);
    continue;
  }
  // Unverändert und mit derselben Art Passwort versiegelt: nichts tun, damit git still bleibt.
  if (!FORCE && current === text && Boolean(sealed.test) === password.test) {
    console.log(`  aktuell  ${name}`);
    continue;
  }
  // Ein Testsiegel darf das echte Passwort ohne --force ersetzen, ein echtes nicht.
  if (sealed && current === null && !FORCE && !sealed.test) {
    fail(`${name}: das vorhandene Siegel öffnet sich mit diesem Passwort nicht. Mit --force neu versiegeln.`);
  }
  writeFileSync(sealedFile(page), `${JSON.stringify(await seal(text, password, page.slug), null, 2)}\n`);
  console.log(`  versiegelt ${name} → ${relative(ROOT, sealedFile(page))}${password.test ? ' (Testsiegel)' : ''}`);
  changed++;
}

if (!CHECK) console.log(`  ${changed} geändert.`);
