import adPages from './ad-pages.json';

/**
 * Die Anzeigenseiten und was für sie gilt. Die eine Quelle ist ad-pages.json:
 * die App liest sie hier, der Build in tools/standalone-ad-pages.mjs.
 *
 * Google sperrt Anzeigen, deren Ziel einen verschreibungspflichtigen Wirkstoff
 * nennt („Restricted drug terms“). Am 18.11.2026 stand fest: es reicht nicht,
 * dass der Text der Zielseite sauber ist. Die Meldung kam auch, als der
 * Wirkstoffname nur noch im gemeinsamen Skript der Website stand (Titel und
 * Beschreibungen anderer Routen).
 *
 * - standalone: Seiten, die der Build als eigenständige Datei ausliefert, ohne
 *   das Skript der Website, ohne ihr Menü und ohne Links zu anderen Seiten
 *   außer denen aus linkedFromStandalone.
 * - adPages: alle Anzeigenseiten. Auf ihnen zeigt der Footer den Link zur
 *   Stellenanzeige für Ärzt:innen nicht.
 * - linkedFromStandalone: die Seiten, auf die eine eigenständige Seite
 *   verlinken darf. Auch ihr Footer zeigt diesen Link nicht, damit ihr HTML
 *   keinen Wirkstoffnamen trägt.
 */
const LANG_PREFIX = /^\/(en|uk|tr)(?=\/|$)/;

/** Pfad einer Adresse ohne Sprachpräfix, Query und Fragment. */
export function pagePath(url: string): string {
  const path = (url || '/').split(/[?#]/)[0].replace(LANG_PREFIX, '');
  return path.length > 1 ? path.replace(/\/$/, '') : path || '/';
}

/** Wird diese Seite als eigenständige Datei ausgeliefert? */
export function isStandaloneAdPage(url: string): boolean {
  return adPages.standalone.includes(pagePath(url));
}

/** Darf auf dieser Seite kein Link mit einem Wirkstoffnamen stehen? */
export function hidesDrugTermLinks(url: string): boolean {
  const path = pagePath(url);
  return adPages.adPages.includes(path) || adPages.linkedFromStandalone.includes(path);
}
