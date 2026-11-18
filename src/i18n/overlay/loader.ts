import type { OverlayCatalog, OverlayDict } from './catalog';
import type { OverlayLang } from './dictionaries';
import { ROUTE_DICTS } from './route-dicts';
import type { DictName } from './route-dicts';

/**
 * Lädt die Wörterbücher einer Overlay-Sprache in den Katalog eines
 * Seitenaufrufs. Wird selbst erst auf Overlay-Seiten geladen (siehe
 * LanguageService.init); jede Sprache hat ihre eigene Lade-Tabelle als Chunk,
 * eine türkische Seite lädt also nie etwas Ukrainisches und umgekehrt.
 */
export type DictTable = Readonly<Record<DictName, () => Promise<{ default: OverlayDict }>>>;

const TABLES: Readonly<Record<OverlayLang, () => Promise<{ DICTS: DictTable }>>> = {
  uk: () => import('../uk/table'),
  tr: () => import('../tr/table'),
};

/** Lädt parallel und nimmt in der angegebenen Reihenfolge auf. */
export async function loadDicts(
  catalog: OverlayCatalog,
  lang: OverlayLang,
  names: readonly DictName[],
): Promise<void> {
  const open = names.filter((name) => !catalog.has(name));
  if (!open.length) return;
  const { DICTS } = await TABLES[lang]();
  const modules = await Promise.all(open.map((name) => DICTS[name]()));
  open.forEach((name, i) => catalog.register(name, modules[i].default));
}

/**
 * Wörterbücher einer Route (Pfad ohne Sprachpräfix, z. B. 'ratgeber/' für
 * den Hub) laden und beim Nachschlagen nach vorn stellen. Routen ohne eigenes
 * Wörterbuch (Eltern-Routen) ändern nichts.
 */
export async function loadDictsForRoute(
  catalog: OverlayCatalog,
  lang: OverlayLang,
  path: string,
): Promise<void> {
  const names = ROUTE_DICTS[path];
  if (!names) return;
  await loadDicts(catalog, lang, names);
  catalog.activate(names);
}
