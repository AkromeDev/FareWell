import type { OverlayCatalog } from './catalog';

/**
 * Server, unmittelbar vor dem Serialisieren einer Overlay-Seite (/uk/, /tr/):
 * alle .lang.de-Blöcke übersetzen und die ausgeblendeten Fassungen entfernen,
 * damit das ausgelieferte HTML nur die Sprache der Seite enthält (plus
 * englische Rückfälle für noch fehlende Einträge). Liefert die fehlenden
 * Schlüssel dieser Seite.
 */
export function finalizeOverlayDocument(doc: Document, catalog: OverlayCatalog): string[] {
  catalog.translateTree(doc.body);
  doc.body
    .querySelectorAll('.lang.en:not([data-i18n="fallback"]), .lang.de[data-i18n="miss"]')
    .forEach((el) => el.parentNode?.removeChild(el));
  return catalog.takeMisses();
}
