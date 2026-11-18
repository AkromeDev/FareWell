/**
 * Overlay-Sprachen (Ukrainisch, Türkisch) über dem DE/EN-System.
 *
 * Deutsch und Englisch liegen weiter als Paare im Code (t('de', 'en') und
 * <span class="lang de">…</span><span class="lang en">…</span>). Eine
 * Overlay-Sprache steht NICHT daneben, sondern in eigenen Wörterbüchern
 * (src/i18n/<sprache>/dict/*.json), deren Schlüssel der deutsche Text ist.
 * Geladen werden sie nur auf den Seiten dieser Sprache (/uk/, /tr/): deutsche
 * und englische Seiten werden dadurch kein Byte schwerer.
 *
 * Jeder Seitenaufruf (im Browser) und jedes Rendern einer Seite (beim
 * Prerendern laufen viele Seiten im selben Prozess) hat seinen eigenen
 * OverlayCatalog, den der LanguageService hält. Kein Zustand liegt im Modul:
 * eine türkische Seite sieht nie ein ukrainisches Wörterbuch, und keine Seite
 * erbt Einträge einer vorher gerenderten. Geteilt werden nur die einmal
 * aufbereiteten, unveränderlichen Wörterbücher.
 *
 * Zwei Wege führen ins Wörterbuch:
 *   1. t(de, en) schlägt in einer Overlay-Sprache `de` nach (lookup).
 *   2. .lang.de-Elemente werden im DOM übersetzt (translateTree): beim
 *      Prerendern vor dem Serialisieren, im Browser per MutationObserver.
 *      Kindelemente (Links, <strong> …) bleiben dieselben Knoten und behalten
 *      ihre Angular-Bindungen; im Schlüssel stehen sie als <0>…</0>.
 *
 * Fehlt ein Eintrag, zeigt die Seite den englischen Text (lang="en"), und
 * der Fehlschlag wird gemeldet (tools/i18n-overlay.mjs <sprache> check). Ändert sich ein
 * deutscher Text, fällt seine Übersetzung so automatisch auf, statt veraltet
 * stehen zu bleiben.
 */

export type OverlayDict = Readonly<Record<string, string>>;

/** Ein aufbereitetes Wörterbuch: exakte Einträge und solche mit Platzhaltern. */
interface Compiled {
  /** Exakte Einträge, Schlüssel normalisiert. */
  readonly exact: ReadonlyMap<string, string>;
  /** Einträge mit Platzhaltern ({0}, {1}) für Texte mit eingesetzten Werten. */
  readonly patterns: readonly { re: RegExp; text: string }[];
}

/**
 * Aufbereitete Wörterbücher je "<sprache>/<name>". Unveränderlich, darum
 * gefahrlos über Seiten hinweg geteilt (beim Prerendern spart das das
 * Aufbereiten je Seite).
 */
const compiledCache = new Map<string, Compiled>();

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

function compile(dict: OverlayDict): Compiled {
  const exact = new Map<string, string>();
  const patterns: { re: RegExp; text: string }[] = [];
  for (const [de, text] of Object.entries(dict)) {
    if (!text) continue;
    const key = normalizeKey(de);
    if (/\{\d+\}/.test(key)) {
      const source = key
        .split(PLACEHOLDER)
        .map((part, i) => (i % 2 ? '([\\s\\S]+?)' : escapeRegExp(part)))
        .join('');
      patterns.push({ re: new RegExp(`^${source}$`), text });
    } else {
      exact.set(key, text);
    }
  }
  return { exact, patterns };
}

/**
 * Die Wörterbücher einer Overlay-Sprache für einen Seitenaufruf.
 *
 * Reihenfolge beim Nachschlagen: die Wörterbücher der aktuellen Seite (wie in
 * route-dicts.ts aufgeführt), dann `common`, dann alle übrigen schon
 * geladenen (die der vorigen Seite, solange sie noch abgebaut wird). Steht
 * derselbe deutsche Text in mehreren Wörterbüchern, entscheidet so die Seite
 * und nicht die Ladereihenfolge.
 */
export class OverlayCatalog {
  private readonly dicts = new Map<string, Compiled>();
  private order: Compiled[] = [];
  private readonly misses = new Set<string>();

  constructor(private readonly lang: string) {}

  has(name: string): boolean {
    return this.dicts.has(name);
  }

  /** Nimmt ein Wörterbuch auf; mehrfaches Laden desselben Namens ist ein No-op. */
  register(name: string, dict: OverlayDict): void {
    if (this.dicts.has(name)) return;
    const id = `${this.lang}/${name}`;
    let compiled = compiledCache.get(id);
    if (!compiled) {
      compiled = compile(dict);
      compiledCache.set(id, compiled);
    }
    this.dicts.set(name, compiled);
    this.order.push(compiled);
  }

  /** Macht die Wörterbücher einer Seite zu den ersten beim Nachschlagen. */
  activate(names: readonly string[]): void {
    const first = [...names, 'common']
      .map((name) => this.dicts.get(name))
      .filter((d): d is Compiled => !!d);
    const rest = [...this.dicts.values()].filter((d) => !first.includes(d));
    this.order = [...new Set(first), ...rest];
  }

  /**
   * Fassung eines deutschen Texts in der Overlay-Sprache, oder undefined.
   * Führender und abschließender Leerraum des Originals bleibt erhalten
   * (t(' von ', …)).
   */
  lookup(de: string): string | undefined {
    const key = normalizeKey(de);
    if (!key) return de;

    let text = this.exact(key);
    if (text === undefined) {
      outer: for (const dict of this.order) {
        for (const p of dict.patterns) {
          const m = p.re.exec(key);
          if (m) {
            text = p.text.replace(PLACEHOLDER, (_, i) => {
              const value = m[Number(i) + 1] ?? '';
              return this.exact(value) ?? value;
            });
            break outer;
          }
        }
      }
    }
    if (text === undefined) {
      // Reine Zahlen, Preise, Namen: nichts zu übersetzen.
      if (!/\p{L}{2}/u.test(key.replace(/<\/?\d+\/?>/g, ''))) return de;
      this.misses.add(key);
      return undefined;
    }

    const lead = /^\s*/.exec(de)?.[0] ?? '';
    const trail = /\s*$/.exec(de)?.[0] ?? '';
    return lead + text + trail;
  }

  /** Fehlende Schlüssel seit dem letzten Aufruf (für die Prüfung beim Prerendern). */
  takeMisses(): string[] {
    const list = [...this.misses];
    this.misses.clear();
    return list;
  }

  /**
   * Übersetzt alle noch unbearbeiteten .lang.de-Elemente unterhalb von root.
   * Getroffene Elemente bekommen data-i18n="ok"; bei einem Fehlschlag wird
   * stattdessen das englische Geschwister als data-i18n="fallback" markiert.
   * Das globale CSS blendet in einer Overlay-Sprache alles andere aus.
   */
  translateTree(root: ParentNode): void {
    const candidates: Element[] = [];
    // nodeType statt instanceof: auf dem Server (Domino) gibt es kein globales Element.
    if ((root as Node).nodeType === 1 && isUntranslatedDe(root as Element)) {
      candidates.push(root as Element);
    }
    root.querySelectorAll('.lang.de:not([data-i18n])').forEach((el) => candidates.push(el));

    for (const el of candidates) {
      // Verschachtelte .lang.de übersetzt das äußere Element mit.
      if (el.parentElement?.closest('.lang.de')) continue;
      translateElement(el, (key) => this.lookup(key));
    }
  }

  private exact(key: string): string | undefined {
    for (const dict of this.order) {
      const text = dict.exact.get(key);
      if (text !== undefined) return text;
    }
    return undefined;
  }
}

function isUntranslatedDe(el: Element): boolean {
  return el.classList.contains('lang') && el.classList.contains('de') && !el.hasAttribute('data-i18n');
}

function translateElement(el: Element, lookup: (key: string) => string | undefined): void {
  const elems: Element[] = [];
  const inner: string[] = [];
  const key = serialize(el, elems, inner);
  const text = lookup(key);

  if (text === undefined || text === key) {
    if (text === key) {
      el.setAttribute('data-i18n', 'ok');
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

  const tree = parseRich(text.trim());
  if (!tree) {
    el.setAttribute('data-i18n', 'miss');
    return;
  }

  const doc = el.ownerDocument;
  clearContent(el);
  build(el, tree, elems, inner, doc);
  el.setAttribute('data-i18n', 'ok');
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
