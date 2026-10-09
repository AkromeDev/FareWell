/**
 * Ukrainisch als Overlay über dem DE/EN-System.
 *
 * Deutsch und Englisch liegen weiter als Paare im Code (t('de', 'en') und
 * <span class="lang de">…</span><span class="lang en">…</span>). Ukrainisch
 * steht NICHT daneben, sondern in eigenen Wörterbüchern (dict/*.json), deren
 * Schlüssel der deutsche Text ist. Geladen werden sie nur auf /uk/-Seiten:
 * deutsche und englische Seiten werden dadurch kein Byte schwerer.
 *
 * Zwei Wege führen ins Wörterbuch:
 *   1. t(de, en) schlägt im ukrainischen Modus `de` nach (ukLookup).
 *   2. .lang.de-Elemente werden im DOM übersetzt (translateTree): beim
 *      Prerendern vor dem Serialisieren, im Browser per MutationObserver.
 *      Kindelemente (Links, <strong> …) bleiben dieselben Knoten und behalten
 *      ihre Angular-Bindungen; im Schlüssel stehen sie als <0>…</0>.
 *
 * Fehlt ein Eintrag, zeigt die Seite den englischen Text (lang="en"), und
 * der Fehlschlag wird gemeldet (tools/i18n-uk.mjs check). Ändert sich ein
 * deutscher Text, fällt seine Übersetzung so automatisch auf, statt veraltet
 * stehen zu bleiben.
 */

export type UkDict = Readonly<Record<string, string>>;

/** Exakte Einträge, Schlüssel normalisiert. */
const exact = new Map<string, string>();
/** Einträge mit Platzhaltern ({0}, {1}) für Texte mit eingesetzten Werten. */
const patterns: { re: RegExp; uk: string }[] = [];
const registered = new Set<string>();
const misses = new Set<string>();

const PLACEHOLDER = /\{(\d+)\}/g;
const VOID_TAGS = new Set(['BR', 'WBR', 'IMG', 'HR', 'INPUT', 'SOURCE']);

/**
 * Schlüssel-Normalform: Leerraum zusammengefasst, und um Element-Platzhalter
 * herum ganz entfernt. Angular verwirft reine Leerraum-Textknoten zwischen
 * Elementen, der Vorlagentext hat sie aber; so treffen beide Seiten denselben
 * Schlüssel. Die Übersetzung bringt ihre eigenen Leerzeichen mit.
 */
export function normalizeKey(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/ ?(<\/?\d+\/?>) ?/g, '$1')
    .trim();
}

/** Registriert ein Wörterbuch; mehrfaches Laden desselben Namens ist ein No-op. */
export function registerUkDict(name: string, dict: UkDict): void {
  if (registered.has(name)) return;
  registered.add(name);
  for (const [de, uk] of Object.entries(dict)) {
    if (!uk) continue;
    const key = normalizeKey(de);
    if (/\{\d+\}/.test(key)) {
      const source = key
        .split(PLACEHOLDER)
        .map((part, i) => (i % 2 ? '([\\s\\S]+?)' : escapeRegExp(part)))
        .join('');
      patterns.push({ re: new RegExp(`^${source}$`), uk });
    } else {
      exact.set(key, uk);
    }
  }
}

export function isUkDictRegistered(name: string): boolean {
  return registered.has(name);
}

/**
 * Ukrainische Fassung eines deutschen Texts, oder undefined. Führender und
 * abschließender Leerraum des Originals bleibt erhalten (t(' von ', …)).
 */
export function ukLookup(de: string): string | undefined {
  const key = normalizeKey(de);
  if (!key) return de;

  let uk = exact.get(key);
  if (uk === undefined) {
    for (const p of patterns) {
      const m = p.re.exec(key);
      if (m) {
        uk = p.uk.replace(PLACEHOLDER, (_, i) => {
          const value = m[Number(i) + 1] ?? '';
          return exact.get(value) ?? value;
        });
        break;
      }
    }
  }
  if (uk === undefined) {
    // Reine Zahlen, Preise, Namen: nichts zu übersetzen.
    if (!/\p{L}{2}/u.test(key.replace(/<\/?\d+\/?>/g, ''))) return de;
    misses.add(key);
    return undefined;
  }

  const lead = /^\s*/.exec(de)?.[0] ?? '';
  const trail = /\s*$/.exec(de)?.[0] ?? '';
  return lead + uk + trail;
}

/** Bisher fehlende Schlüssel (für die Prüfung beim Prerendern). */
export function ukMisses(): string[] {
  return [...misses];
}

export function clearUkMisses(): void {
  misses.clear();
}

/**
 * Übersetzt alle noch unbearbeiteten .lang.de-Elemente unterhalb von root.
 * Getroffene Elemente bekommen data-i18n="uk"; bei einem Fehlschlag wird
 * stattdessen das englische Geschwister als data-i18n="fallback" markiert.
 * Das globale CSS blendet im ukrainischen Modus alles andere aus.
 */
export function translateTree(root: ParentNode): void {
  const candidates: Element[] = [];
  // nodeType statt instanceof: auf dem Server (Domino) gibt es kein globales Element.
  if ((root as Node).nodeType === 1 && isUntranslatedDe(root as Element)) {
    candidates.push(root as Element);
  }
  root.querySelectorAll('.lang.de:not([data-i18n])').forEach((el) => candidates.push(el));

  for (const el of candidates) {
    // Verschachtelte .lang.de übersetzt das äußere Element mit.
    if (el.parentElement?.closest('.lang.de')) continue;
    translateElement(el);
  }
}

function isUntranslatedDe(el: Element): boolean {
  return el.classList.contains('lang') && el.classList.contains('de') && !el.hasAttribute('data-i18n');
}

function translateElement(el: Element): void {
  const elems: Element[] = [];
  const inner: string[] = [];
  const key = serialize(el, elems, inner);
  const uk = ukLookup(key);

  if (uk === undefined || uk === key) {
    if (uk === key) {
      el.setAttribute('data-i18n', 'uk');
      return;
    }
    el.setAttribute('data-i18n', 'miss');
    const en = nextLangSibling(el);
    if (en) {
      en.setAttribute('data-i18n', 'fallback');
      en.setAttribute('lang', 'en');
    }
    return;
  }

  const tree = parseRich(uk.trim());
  if (!tree) {
    el.setAttribute('data-i18n', 'miss');
    return;
  }

  const doc = el.ownerDocument;
  clearContent(el);
  build(el, tree, elems, inner, doc);
  el.setAttribute('data-i18n', 'uk');
}

function nextLangSibling(el: Element): Element | null {
  let next = el.nextElementSibling;
  while (next && !next.classList.contains('lang')) next = next.nextElementSibling;
  return next && next.classList.contains('en') ? next : null;
}

/** Text eines Elements mit nummerierten Platzhaltern für Kindelemente. */
function serialize(el: Element, elems: Element[], inner: string[]): string {
  let out = '';
  el.childNodes.forEach((node) => {
    if (node.nodeType === 3) {
      out += (node as Text).data;
    } else if (node.nodeType === 1) {
      const child = node as Element;
      const i = elems.length;
      elems.push(child);
      if (VOID_TAGS.has(child.tagName.toUpperCase())) {
        inner[i] = '';
        out += `<${i}/>`;
      } else {
        const content = serialize(child, elems, inner);
        inner[i] = normalizeKey(content);
        out += `<${i}>${content}</${i}>`;
      }
    }
  });
  return out;
}

type RichNode = string | { i: number; raw: string; children: RichNode[] };

/** Zerlegt "Text <0>Link</0> Text" in einen Baum; null bei kaputtem Markup. */
function parseRich(text: string): RichNode[] | null {
  const tokens = /<(\d+)\/>|<(\d+)>|<\/(\d+)>/g;
  const root: RichNode[] = [];
  const stack: { i: number; start: number; children: RichNode[] }[] = [];
  let current = root;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = tokens.exec(text))) {
    if (m.index > last) current.push(text.slice(last, m.index));
    last = tokens.lastIndex;

    if (m[1] !== undefined) {
      current.push({ i: Number(m[1]), raw: '', children: [] });
    } else if (m[2] !== undefined) {
      const frame = { i: Number(m[2]), start: tokens.lastIndex, children: [] as RichNode[] };
      stack.push(frame);
      current = frame.children;
    } else {
      const frame = stack.pop();
      if (!frame || frame.i !== Number(m[3])) return null;
      const node: RichNode = { i: frame.i, raw: text.slice(frame.start, m.index), children: frame.children };
      current = stack.length ? stack[stack.length - 1].children : root;
      current.push(node);
    }
  }
  if (stack.length) return null;
  if (last < text.length) current.push(text.slice(last));
  return root;
}

/** Entfernt Text- und Elementkinder; Kommentare (Angular-Anker) bleiben. */
function clearContent(el: Element): void {
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType !== 8) el.removeChild(node);
  }
}

function build(parent: Element, nodes: RichNode[], elems: Element[], inner: string[], doc: Document): void {
  for (const node of nodes) {
    if (typeof node === 'string') {
      parent.appendChild(doc.createTextNode(node));
      continue;
    }
    const el = elems[node.i];
    if (!el) continue;
    // Unveränderter Inhalt (Zahl, Name, gebundener Wert): Knoten samt
    // Angular-Bindungen unangetastet übernehmen.
    if (normalizeKey(node.raw) !== inner[node.i]) {
      clearContent(el);
      build(el, node.children, elems, inner, doc);
    }
    parent.appendChild(el);
  }
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
