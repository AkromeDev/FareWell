import { Routes } from '@angular/router';

/**
 * Ukrainische Wörterbücher an den /uk/-Routen. Diese Datei liegt im
 * Hauptbundle (die Routen brauchen sie) und bleibt deshalb klein: Lade-Tabelle
 * (table.ts), Katalog und Wörterbücher sind eigene Chunks, die nur
 * /uk/-Seiten laden.
 */

/**
 * Seiten mit englischer, aber ohne ukrainische Fassung (Pfade ohne
 * führenden Slash). Die Blinden-Karriereseite ist bewusst sequenziell
 * Deutsch-dann-Englisch für Sprachausgaben gebaut, die Ästhetische Medizin
 * ist eine versteckte Vorschau mit HWG-geprüften Formulierungen.
 */
export const UK_EXCLUDED_PATHS: readonly string[] = [
  'behandlungen/aesthetische-medizin',
  'karriere/masseur-bademeister-blind-nuernberg',
];

export function loadUkCommon(): Promise<void> {
  return import('./table').then((t) => t.loadUkDicts(['common']));
}

function loadUkForRoute(path: string): Promise<void> {
  return import('./table').then((t) => t.loadUkDictsForRoute(path));
}

/**
 * Hängt das Laden der Seitenwörterbücher an jede Route des /uk/-Baums:
 * Wörterbuch und Komponenten-Chunk laden parallel, und die Seite rendert
 * erst, wenn beide da sind.
 */
export function withUkDictionaries(routes: Routes, parent = ''): Routes {
  return routes
    .filter((route) => !UK_EXCLUDED_PATHS.includes(parent + (route.path ?? '')))
    .map((route) => {
      const path = parent + (route.path ?? '');
      const copy = { ...route };

      // Die Lader dieser App liefern immer Promises (dynamisches import()).
      if (copy.loadComponent) {
        const load = copy.loadComponent;
        copy.loadComponent = () =>
          Promise.all([loadUkForRoute(path), load() as Promise<unknown>]).then(
            ([, c]) => c,
          ) as ReturnType<typeof load>;
      }
      if (copy.loadChildren) {
        const load = copy.loadChildren;
        copy.loadChildren = () =>
          Promise.all([loadUkForRoute(path), load() as Promise<unknown>]).then(
            ([, c]) => c,
          ) as ReturnType<typeof load>;
      }
      if (copy.children) {
        copy.children = withUkDictionaries(copy.children, path ? `${path}/` : '');
      }
      return copy;
    });
}
