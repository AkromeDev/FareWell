#!/usr/bin/env node
/**
 * Werkzeug für das ukrainische Overlay (src/i18n/uk, siehe README dort).
 *
 *   node tools/i18n-uk.mjs extract   Alle deutschen Texte einsammeln, die noch
 *                                    keine Übersetzung haben, nach Wörterbuch
 *                                    gruppiert → tmp/i18n-uk/todo/<dict>.json
 *   node tools/i18n-uk.mjs merge     Übersetzungen aus tmp/i18n-uk/done/<dict>.json
 *                                    ({ "<id>": "<uk>" }) prüfen und in
 *                                    src/i18n/uk/dict/<dict>.json eintragen
 *   node tools/i18n-uk.mjs check     Prerendern und melden, was auf /uk/-Seiten
 *                                    noch ohne Übersetzung gerendert wurde
 *   node tools/i18n-uk.mjs review    Durchsicht-Tabelle DE | EN | UK als CSV
 *                                    → tmp/i18n-uk/review.csv
 *   node tools/i18n-uk.mjs validate <batch.json> <done.json…>
 *                                    Übersetzungen eines Stapels vorab prüfen
 *
 * Schlüssel sind der deutsche Text in derselben Normalform wie zur Laufzeit
 * (normalizeKey in catalog.ts): Kindelemente als <0>…</0>, eingesetzte Werte
 * ({{ x }}, ${x}, 'a' + x) als {0}.
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseFragment } from 'parse5';
import ts from 'typescript';

const ROOT = join(import.meta.dirname, '..');
const SRC = join(ROOT, 'src');
const DICT_DIR = join(SRC, 'i18n', 'uk', 'dict');
const WORK = join(ROOT, 'tmp', 'i18n-uk');

/** Quelldatei → Wörterbuch. Erste passende Regel gewinnt; null = nicht übersetzen. */
const GROUP_RULES = [
  // Ohne ukrainische Fassung (vgl. UK_EXCLUDED_PATHS / NON_UK_PREFIXES).
  ['src/components/pages/tasks/', null],
  ['src/components/pages/legal/', null],
  ['src/components/pages/aesthetische-medizin/', null],
  ['src/components/pages/karriere/masseur-bademeister-karriere/', null],
  ['src/components/pages/ratgeber/mwst-us-streitkraefte/', null],
  ['src/components/pages/ratgeber/us-forces-vat-relief/', null],
  ['src/i18n/', null],

  ['src/components/pages/home/', 'home'],
  ['src/components/pages/nadelepilation/', 'nadelepilation'],
  ['src/components/pages/diodenlaser/', 'diodenlaser'],
  ['src/components/pages/microneedling/', 'microneedling'],
  ['src/components/pages/narbenbehandlung/', 'narbenbehandlung'],
  ['src/components/pages/kavitation/', 'kavitation'],
  ['src/components/pages/massage/', 'massage'],
  ['src/components/pages/therapeutische-massage/', 'therapeutische-massage'],
  ['src/components/pages/price/', 'price'],
  ['src/components/pages/zeit/', 'zeit'],
  ['src/components/timeProjection/', 'zeit'],
  ['src/components/pages/historie/', 'historie'],
  ['src/components/pages/faq/', 'faq'],
  ['src/components/pages/ratgeber/ratgeber-hub/', 'ratgeber-hub'],
  ['src/components/pages/ratgeber/elektrolyse-laser/', 'elektrolyse-laser'],
  ['src/components/pages/ratgeber/koerperbehandlungen/', 'koerperbehandlungen'],
  ['src/components/pages/ratgeber/krankenkasse-epilation/', 'krankenkasse-epilation'],
  ['src/components/pages/ratgeber/krankenkasse-hormonell/', 'krankenkasse-hormonell'],
  ['src/components/molecules/kostenvoranschlag-unterlagen/', 'kostenvoranschlag'],
  ['src/components/pages/ratgeber/steuer-absetzen/', 'steuer-absetzen'],
  ['src/components/pages/mojoclipboard-support/', 'mojoclipboard-support'],
  ['src/components/pages/karriere/karriere-hub/', 'karriere-hub'],
  ['src/components/pages/karriere/kosmetik-karriere/', 'kosmetik-karriere'],
  ['src/components/pages/karriere/masseur-karriere/', 'masseur-karriere'],
  ['src/components/pages/karriere/masseur-onboarding/', 'masseur-onboarding'],
  ['src/components/pages/karriere/physio-karriere/', 'physio-karriere'],
  ['src/components/pages/karriere/yoga-karriere/', 'yoga-karriere'],
  ['src/components/pages/karriere/tanz-karriere/', 'tanz-karriere'],
  ['src/components/pages/karriere/botox-karriere/', 'botox-karriere'],
  ['src/components/pages/karriere/freelancer-road/gastro-road', 'gastro-road'],
  ['src/components/pages/karriere/freelancer-road/freelancer-road', 'freelancer-road'],
  ['src/components/pages/karriere/freelancer-road/', 'road'],
  ['src/components/pages/karriere/shared/', 'karriere'],
  ['src/components/molecules/karriere/', 'karriere'],
  ['src/components/pages/promotions/laser-promotion/', 'laser-promotion'],
  ['src/components/pages/promotions/ipl-promotion/', 'ipl-promotion'],
  ['src/components/pages/promotions/electrolysis-promotion/', 'electrolysis-promotion'],
  ['src/components/pages/promotions/microneedling-promotion/', 'microneedling-promotion'],
  ['src/components/pages/promotions/nadelepilation-promotion/', 'nadelepilation-promotion'],
  ['src/', 'common'],
];

const VOID = new Set(['br', 'wbr', 'img', 'hr', 'input', 'source']);
/** Rendern in Angular nicht als Element (Kommentar-Anker), also kein Platzhalter. */
const TRANSPARENT = new Set(['ng-container', 'ng-template']);

// ---------------------------------------------------------------------------
// Gemeinsame Helfer
// ---------------------------------------------------------------------------

/** Wie normalizeKey in src/i18n/uk/catalog.ts, bitte synchron halten. */
function normalizeKey(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/ ?(<\/?\d+\/?>) ?/g, '$1')
    .trim();
}

/** Locale-Codes wie de_DE / en_US sind Daten, kein Text. */
function isLocaleCode(key) {
  return /^[a-z]{2}[_-][A-Z]{2}$/.test(key);
}

function hasWords(key) {
  return /\p{L}{2}/u.test(key.replace(/<\/?\d+\/?>/g, '').replace(/\{\d+\}/g, ''));
}

function groupFor(file) {
  const rel = relative(ROOT, file);
  for (const [prefix, group] of GROUP_RULES) {
    if (rel.startsWith(prefix)) return group;
  }
  return 'common';
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function readJson(path, fallback) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback;
}

function placeholders(text) {
  return [...text.matchAll(/<\/?\d+\/?>|\{\d+\}/g)].map((m) => m[0]).sort();
}

// ---------------------------------------------------------------------------
// Ausdrücke: t('de', 'en'), 'a' + x, `…${x}…` → Schlüssel mit {n}
// ---------------------------------------------------------------------------

/**
 * Text eines String-Ausdrucks mit {n} für eingesetzte Werte; null wenn rein
 * dynamisch. `consts` löst Bezeichner auf String-Konstanten derselben Datei
 * auf (t(DE_TITLE, EN_TITLE)).
 */
function exprToKey(node, consts = new Map()) {
  let n = 0;
  let literal = false;
  const visit = (e) => {
    if (ts.isParenthesizedExpression(e)) return visit(e.expression);
    if (ts.isIdentifier(e) && consts.has(e.text)) {
      literal = true;
      return consts.get(e.text);
    }
    if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) {
      literal = true;
      return e.text;
    }
    if (ts.isTemplateExpression(e)) {
      literal = true;
      let s = e.head.text;
      for (const span of e.templateSpans) s += `{${n++}}` + span.literal.text;
      return s;
    }
    if (ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      return visit(e.left) + visit(e.right);
    }
    return `{${n++}}`;
  };
  const key = visit(node);
  return literal ? key : null;
}

/** Aufruf, dessen erstes Argument ein Übersetzer (de, en) => t(de, en) ist. */
function isHelperWithTranslator(node) {
  if (!ts.isCallExpression(node) || node.arguments.length < 3) return false;
  const first = node.arguments[0];
  if (!ts.isArrowFunction(first) || first.parameters.length !== 2) return false;
  const names = first.parameters.map((p) => p.name.getText());
  const last = node.arguments.slice(-2);
  return (
    names[0] === 'de' &&
    names[1] === 'en' &&
    last.every((a) => ts.isStringLiteral(a) || ts.isNoSubstitutionTemplateLiteral(a))
  );
}

function isTCall(node) {
  if (!ts.isCallExpression(node) || node.arguments.length < 2) return false;
  const callee = node.expression;
  if (ts.isIdentifier(callee)) return callee.text === 't';
  if (ts.isPropertyAccessExpression(callee)) return callee.name.text === 't';
  return false;
}

/**
 * Englischer Partner eines deutschen Feld- oder Konstantennamens:
 * de/en, titleDe/titleEn, q_de/q_en, DE_TITLE/EN_TITLE, LABEL_DE/LABEL_EN.
 * Für `label` neben `labelEn` liefert pairedName('label', has) 'labelEn'.
 */
function englishName(name, has) {
  const candidates = [];
  if (name === 'de') candidates.push('en');
  if (/De$/.test(name)) candidates.push(name.replace(/De$/, 'En'));
  if (/_de$/.test(name)) candidates.push(name.replace(/_de$/, '_en'));
  if (/_DE$/.test(name)) candidates.push(name.replace(/_DE$/, '_EN'));
  if (/^DE_/.test(name)) candidates.push(name.replace(/^DE_/, 'EN_'));
  if (/_DE_/.test(name)) candidates.push(name.replace(/_DE_/, '_EN_'));
  candidates.push(`${name}En`, `${name}_en`);
  return candidates.find((c) => c !== name && has(c)) ?? null;
}

/** Sammelt t()-Aufrufe und deutsch/englische Paare aus einem TS-AST. */
function collectFromTs(sourceFile, file, add, lineOffset = 0) {
  const lineOf = (node) =>
    sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1 + lineOffset;

  // String-Konstanten der Datei, für t(DE_TITLE, EN_TITLE) und DE/EN-Paare.
  const consts = new Map();
  const constNodes = new Map();
  const collectConsts = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      const key = exprToKey(node.initializer);
      if (key !== null && !/\{\d+\}/.test(key)) {
        consts.set(node.name.text, key);
        constNodes.set(node.name.text, node);
      }
    }
    ts.forEachChild(node, collectConsts);
  };
  collectConsts(sourceFile);
  for (const [name, node] of constNodes) {
    const enName = englishName(name, (c) => consts.has(c));
    if (enName && name !== 'en' && !/(^|_)EN(_|$)|En$|_en$/.test(name)) {
      add({ de: consts.get(name), en: consts.get(enName), file, line: lineOf(node), kind: 'const' });
    }
  }

  const visit = (node) => {
    if (isTCall(node)) {
      const de = exprToKey(node.arguments[0], consts);
      const en = exprToKey(node.arguments[1], consts);
      if (de !== null) add({ de, en: en ?? '', file, line: lineOf(node), kind: 't' });
    } else if (isHelperWithTranslator(node)) {
      // zeitStat((de, en) => this.t(de, en), '08–22', 'Mo–Sa', 'Mon–Sat'):
      // die letzten beiden Argumente sind das Paar.
      const args = node.arguments;
      const de = exprToKey(args[args.length - 2], consts);
      const en = exprToKey(args[args.length - 1], consts);
      if (de !== null) add({ de, en: en ?? '', file, line: lineOf(node), kind: 't' });
    } else if (ts.isObjectLiteralExpression(node)) {
      const props = new Map();
      for (const p of node.properties) {
        if (ts.isPropertyAssignment(p) && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name))) {
          props.set(p.name.text, p.initializer);
        }
      }
      for (const [name, init] of props) {
        if (name === 'en' || /En$|_en$/.test(name)) continue;
        const enName = englishName(name, (c) => props.has(c));
        if (!enName) continue;
        const de = exprToKey(init, consts);
        const en = exprToKey(props.get(enName), consts);
        if (de !== null) add({ de, en: en ?? '', file, line: lineOf(init), kind: 'data' });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
}

/** t()-Aufrufe in Angular-Template-Ausdrücken ({{ … }}, [attr]="…"). */
function collectTCallsFromTemplate(html, file, add, baseLine) {
  const re = /(?<![\w$])(?:[\w$]+\.)*t\(/g;
  let m;
  while ((m = re.exec(html))) {
    // Bis zur passenden schließenden Klammer, Strings respektierend.
    let depth = 0;
    let i = m.index + m[0].length - 1;
    let quote = null;
    for (; i < html.length; i++) {
      const c = html[i];
      if (quote) {
        if (c === '\\') i++;
        else if (c === quote) quote = null;
      } else if (c === "'" || c === '"' || c === '`') quote = c;
      else if (c === '(') depth++;
      else if (c === ')' && --depth === 0) break;
    }
    const expr = html.slice(m.index, i + 1).replace(/^(?:[\w$]+\.)*t\(/, 't(');
    const sf = ts.createSourceFile('x.ts', expr, ts.ScriptTarget.ES2022, true);
    const line = baseLine + html.slice(0, m.index).split('\n').length - 1;
    collectFromTs(sf, file, add, line - 1);
  }
}

// ---------------------------------------------------------------------------
// Templates: .lang.de-Elemente → Schlüssel mit <n>…</n>
// ---------------------------------------------------------------------------

function classes(el) {
  const attr = el.attrs?.find((a) => a.name === 'class');
  return attr ? attr.value.split(/\s+/) : [];
}

function serializeTemplate(el, state, warnings) {
  let out = '';
  for (const child of el.childNodes ?? []) {
    if (child.nodeName === '#text') {
      out += child.value.replace(/\{\{[\s\S]*?\}\}/g, () => `{${state.vars++}}`);
    } else if (child.nodeName === '#comment') {
      continue;
    } else if (child.tagName) {
      const tag = child.tagName.toLowerCase();
      if (TRANSPARENT.has(tag)) {
        warnings.push(`<${tag}> in .lang.de`);
        out += serializeTemplate(child.content ?? child, state, warnings);
        continue;
      }
      const i = state.elems++;
      out += VOID.has(tag) ? `<${i}/>` : `<${i}>${serializeTemplate(child, state, warnings)}</${i}>`;
    }
  }
  return out;
}

function collectFromTemplate(html, file, add, baseLine) {
  const doc = parseFragment(html, { sourceCodeLocationInfo: true });
  const visit = (node) => {
    for (const child of node.childNodes ?? []) {
      if (!child.tagName) continue;
      const cls = classes(child);
      if (cls.includes('lang') && cls.includes('de')) {
        const warnings = [];
        const key = normalizeKey(serializeTemplate(child, { elems: 0, vars: 0 }, warnings));
        // Englisches Gegenstück: nächstes Geschwister mit .lang.en.
        const siblings = node.childNodes.filter((n) => n.tagName);
        const idx = siblings.indexOf(child);
        const enEl = siblings.slice(idx + 1).find((n) => classes(n).includes('lang'));
        const en =
          enEl && classes(enEl).includes('en')
            ? normalizeKey(serializeTemplate(enEl, { elems: 0, vars: 0 }, []))
            : '';
        const line = baseLine + (child.sourceCodeLocation?.startLine ?? 1) - 1;
        if (/@(if|for|switch)\b/.test(key)) warnings.push('Kontrollfluss-Block im Text');
        add({ de: key, en, file, line, kind: 'span', warnings });
        continue;
      }
      visit(child.content ?? child);
    }
  };
  visit(doc);
}

// ---------------------------------------------------------------------------
// extract
// ---------------------------------------------------------------------------

function extractAll() {
  const items = [];
  const add = (item) => {
    item.de = normalizeKey(item.de);
    item.en = normalizeKey(item.en);
    if (!item.de || !hasWords(item.de) || isLocaleCode(item.de)) return;
    item.group = groupFor(item.file);
    if (item.group) items.push(item);
  };

  for (const file of walk(SRC)) {
    if (file.endsWith('.spec.ts')) continue;
    if (file.endsWith('.html') && !file.endsWith('index.html')) {
      const html = readFileSync(file, 'utf8');
      collectFromTemplate(html, file, add, 1);
      collectTCallsFromTemplate(html, file, add, 1);
    } else if (file.endsWith('.ts')) {
      const code = readFileSync(file, 'utf8');
      const sf = ts.createSourceFile(file, code, ts.ScriptTarget.ES2022, true);
      collectFromTs(sf, file, add);
      // Inline-Templates: template: `…`
      const visit = (node) => {
        if (
          ts.isPropertyAssignment(node) &&
          ts.isIdentifier(node.name) &&
          node.name.text === 'template' &&
          ts.isNoSubstitutionTemplateLiteral(node.initializer)
        ) {
          const line = sf.getLineAndCharacterOfPosition(node.initializer.getStart(sf)).line + 1;
          collectFromTemplate(node.initializer.text, file, add, line);
          collectTCallsFromTemplate(node.initializer.text, file, add, line);
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }
  }
  return items;
}

function loadDicts() {
  const dicts = {};
  for (const f of readdirSync(DICT_DIR)) {
    if (f.endsWith('.json')) dicts[f.replace(/\.json$/, '')] = readJson(join(DICT_DIR, f), {});
  }
  return dicts;
}

function cmdExtract() {
  const items = extractAll();
  const dicts = loadDicts();
  const common = new Set(Object.keys(dicts.common ?? {}).map(normalizeKey));
  const known = Object.fromEntries(
    Object.entries(dicts).map(([g, d]) => [g, new Set(Object.keys(d).map(normalizeKey))]),
  );

  // Ein Schlüssel pro Wörterbuch; was common schon hat, braucht keine Seite.
  const todo = {};
  const seen = new Set();
  let id = 0;
  const warnings = [];
  for (const item of items) {
    if (common.has(item.de) || known[item.group]?.has(item.de)) continue;
    const dedupe = `${item.group}\u0000${item.de}`;
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);
    (todo[item.group] ??= []).push({
      id: ++id,
      de: item.de,
      en: item.en,
      src: `${relative(ROOT, item.file)}:${item.line}`,
    });
    for (const w of item.warnings ?? []) warnings.push(`${relative(ROOT, item.file)}:${item.line} ${w}`);
  }

  mkdirSync(join(WORK, 'todo'), { recursive: true });
  let total = 0;
  let chars = 0;
  for (const [group, list] of Object.entries(todo).sort()) {
    writeFileSync(join(WORK, 'todo', `${group}.json`), JSON.stringify(list, null, 2) + '\n');
    const c = list.reduce((a, x) => a + x.de.length, 0);
    total += list.length;
    chars += c;
    console.log(`${group.padEnd(28)} ${String(list.length).padStart(5)} Einträge ${String(c).padStart(7)} Zeichen`);
  }
  for (const group of Object.keys(dicts)) {
    if (todo[group]) continue;
    // Leere Liste statt alter Datei, damit todo/ immer den aktuellen Stand zeigt.
    writeFileSync(join(WORK, 'todo', `${group}.json`), '[]\n');
    console.log(`${group.padEnd(28)}     0 (vollständig)`);
  }
  console.log(`\nGesamt: ${total} offene Einträge, ${chars} Zeichen → ${relative(ROOT, WORK)}/todo/`);
  if (warnings.length) console.log(`\nHinweise:\n  ${warnings.join('\n  ')}`);
}

// ---------------------------------------------------------------------------
// merge
// ---------------------------------------------------------------------------

function cmdMerge() {
  const doneDir = join(WORK, 'done');
  if (!existsSync(doneDir)) throw new Error(`${doneDir} fehlt`);

  // ids sind über alle todo-Dateien eines extract-Laufs eindeutig.
  const byId = new Map();
  for (const f of readdirSync(join(WORK, 'todo')).filter((x) => x.endsWith('.json'))) {
    const group = f.replace(/\.json$/, '');
    for (const item of readJson(join(WORK, 'todo', f), [])) byId.set(String(item.id), { ...item, group });
  }

  const dicts = loadDicts();
  const touched = new Set();
  let added = 0;
  const problems = [];

  for (const f of readdirSync(doneDir).filter((x) => x.endsWith('.json')).sort()) {
    for (const [id, value] of Object.entries(readJson(join(doneDir, f), {}))) {
      const item = byId.get(id);
      if (!item) {
        problems.push(`${f}#${id}: unbekannte id`);
        continue;
      }
      const uk = String(value).trim();
      const a = placeholders(item.de).join(' ');
      const b = placeholders(uk).join(' ');
      if (a !== b) {
        problems.push(`${f}#${id}: Platzhalter ${a || '–'} ≠ ${b || '–'} (${item.src})`);
        continue;
      }
      if (/\s[–—]\s/.test(uk) && !/\s[–—]\s/.test(item.de)) {
        problems.push(`${f}#${id}: Gedankenstrich als Satztrenner (${item.src})`);
      }
      const dict = (dicts[item.group] ??= {});
      if (dict[item.de] === undefined) added++;
      dict[item.de] = uk;
      touched.add(item.group);
    }
  }

  for (const group of touched) {
    writeFileSync(join(DICT_DIR, `${group}.json`), JSON.stringify(dicts[group], null, 2) + '\n');
  }
  console.log(`${added} neue Einträge in ${touched.size} Wörterbüchern.`);

  // Verarbeitete Dateien beiseitelegen (nicht löschen): die ids gelten nur
  // für diesen extract-Lauf und würden beim nächsten kollidieren.
  if (!problems.length) {
    const archive = join(WORK, 'merged', new Date().toISOString().replace(/[:.]/g, '-'));
    mkdirSync(archive, { recursive: true });
    for (const f of readdirSync(doneDir).filter((x) => x.endsWith('.json'))) {
      renameSync(join(doneDir, f), join(archive, f));
    }
    console.log(`Übersetzungsdateien → ${relative(ROOT, archive)}`);
  }
  if (problems.length) {
    console.log(`\n${problems.length} Probleme:\n  ${problems.join('\n  ')}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// check
// ---------------------------------------------------------------------------

function cmdCheck() {
  mkdirSync(WORK, { recursive: true });
  const report = join(WORK, 'misses.jsonl');
  writeFileSync(report, '');
  execSync('npm run prerender', {
    cwd: ROOT,
    stdio: ['ignore', 'ignore', 'inherit'],
    env: { ...process.env, I18N_UK_REPORT: report },
  });
  const byKey = new Map();
  for (const line of readFileSync(report, 'utf8').split('\n').filter(Boolean)) {
    const { url, misses } = JSON.parse(line);
    for (const key of misses) {
      if (!byKey.has(key)) byKey.set(key, new Set());
      byKey.get(key).add(url);
    }
  }
  if (!byKey.size) {
    console.log('Alle /uk/-Seiten vollständig übersetzt.');
    return;
  }
  console.log(`${byKey.size} Texte ohne Übersetzung:\n`);
  for (const [key, urls] of byKey) {
    console.log(`  ${key}\n      ${[...urls].slice(0, 3).join(', ')}${urls.size > 3 ? ' …' : ''}`);
  }
  process.exitCode = 1;
}

// ---------------------------------------------------------------------------
// review
// ---------------------------------------------------------------------------

function cmdReview() {
  const items = extractAll();
  const en = new Map();
  for (const item of items) if (!en.has(item.de)) en.set(item.de, item.en);
  const esc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
  const rows = [['Wörterbuch', 'Deutsch', 'English', 'Українська'].map(esc).join(',')];
  for (const [group, dict] of Object.entries(loadDicts()).sort()) {
    for (const [de, uk] of Object.entries(dict)) {
      rows.push([group, de, en.get(normalizeKey(de)) ?? '', uk].map(esc).join(','));
    }
  }
  mkdirSync(WORK, { recursive: true });
  writeFileSync(join(WORK, 'review.csv'), '﻿' + rows.join('\n') + '\n');
  console.log(`${rows.length - 1} Zeilen → ${relative(ROOT, WORK)}/review.csv`);
}

// ---------------------------------------------------------------------------
// validate <batch.json> <done.json…>: Übersetzungen eines Stapels vorab prüfen
// ---------------------------------------------------------------------------

function cmdValidate() {
  const [batchPath, ...donePaths] = process.argv.slice(3);
  if (!batchPath || !donePaths.length) {
    console.error('Aufruf: node tools/i18n-uk.mjs validate <batch.json> <done.json> [<done.json> …]');
    process.exit(2);
  }
  const batch = readJson(batchPath, []);
  const done = {};
  for (const path of donePaths) Object.assign(done, readJson(path, {}));
  const problems = [];
  const notes = [];
  for (const item of batch) {
    const uk = done[String(item.id)];
    if (typeof uk !== 'string' || !uk.trim()) {
      problems.push(`#${item.id}: fehlt`);
      continue;
    }
    const a = placeholders(item.de).join(' ');
    const b = placeholders(uk).join(' ');
    if (a !== b) problems.push(`#${item.id}: Platzhalter ${a || '–'} ≠ ${b || '–'}`);
    if (/\s[–—]\s/.test(uk) && !/\s[–—]\s/.test(item.de)) {
      problems.push(`#${item.id}: Gedankenstrich als Satztrenner`);
    }
    if (/ботокс/i.test(uk)) problems.push(`#${item.id}: „ботокс“ (ботулотоксин verwenden)`);
    if (/\p{Script=Latin}{4,}/u.test(item.de) && uk === item.de) {
      notes.push(`#${item.id}: unverändert übernommen (in Ordnung bei Namen, Codes, URLs)`);
    }
  }
  const extra = Object.keys(done).filter((id) => !batch.some((x) => String(x.id) === id));
  for (const id of extra) problems.push(`#${id}: gehört nicht zu diesem Stapel`);
  console.log(`${batch.length - problems.filter((p) => p.endsWith('fehlt')).length}/${batch.length} übersetzt.`);
  if (notes.length) console.log(`Hinweise:\n  ${notes.join('\n  ')}`);
  if (problems.length) {
    console.log(problems.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('Keine Probleme.');
  }
}

const commands = {
  extract: cmdExtract,
  merge: cmdMerge,
  check: cmdCheck,
  review: cmdReview,
  validate: cmdValidate,
};
const cmd = commands[process.argv[2]];
if (!cmd) {
  console.error('Aufruf: node tools/i18n-uk.mjs extract|merge|check|review|validate');
  process.exit(2);
}
cmd();
