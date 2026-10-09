import { clearUkMisses, translateTree, ukMisses } from './catalog';

/**
 * Server, unmittelbar vor dem Serialisieren einer /uk/-Seite: alle .lang.de-
 * Blöcke übersetzen und die ausgeblendeten Fassungen entfernen, damit das
 * ausgelieferte HTML nur Ukrainisch enthält (plus englische Rückfälle für
 * noch fehlende Einträge). Liefert die fehlenden Schlüssel dieser Seite.
 */
export function finalizeUkDocument(doc: Document): string[] {
  translateTree(doc.body);
  doc.body
    .querySelectorAll('.lang.en:not([data-i18n="fallback"]), .lang.de[data-i18n="miss"]')
    .forEach((el) => el.parentNode?.removeChild(el));

  const misses = ukMisses();
  clearUkMisses();
  return misses;
}
