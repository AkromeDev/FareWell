import { InjectionToken, inject } from '@angular/core';
import { Route, Routes } from '@angular/router';

/**
 * Wörterbücher der Overlay-Sprachen an ihren Routen (/uk/, /tr/). Diese Datei
 * liegt im Hauptbundle (die Routen brauchen sie) und bleibt deshalb klein:
 * Lader (loader.ts), Lade-Tabellen, Katalog und Wörterbücher sind eigene
 * Chunks, die nur Seiten der jeweiligen Sprache laden.
 */

/** Sprachen, die als Overlay über dem deutschen Text liegen, in der Reihenfolge des Menüs. */
export const OVERLAY_LANGS = ['uk', 'tr'] as const;
export type OverlayLang = (typeof OVERLAY_LANGS)[number];

export function isOverlayLang(lang: string): lang is OverlayLang {
  return (OVERLAY_LANGS as readonly string[]).includes(lang);
}

/**
 * Seiten mit englischer, aber ohne Overlay-Fassung (Pfade ohne führenden
 * Slash), für alle Overlay-Sprachen gleich. Die Blinden-Karriereseite ist
 * bewusst sequenziell Deutsch-dann-Englisch für Sprachausgaben gebaut, die
 * Ästhetische Medizin und die Botox-Seiten tragen HWG-geprüfte
 * Formulierungen, die Partnerseiten und die Promotionen sind Vorschauen oder
 * Tests.
 */
export const OVERLAY_EXCLUDED_PATHS: readonly string[] = [
  'behandlungen/aesthetische-medizin',
  'behandlungen/massage-ruslana-ivanova',
  'behandlungen/level-44',
  'promotionen',
  'promotionen/feld',
  'promotionen/drehbuehne',
  'behandlungen/botox-nuernberg',
  'promotionen/aesthetische-medizin-nuernberg',
  'promotionen/lippen-nuernberg',
  'karriere/masseur-bademeister-blind-nuernberg',
  'party4friends',
];

/**
 * Lädt die Wörterbücher einer Route in den Katalog des laufenden
 * Seitenaufrufs. Der LanguageService stellt ihn bereit (provideLanguage);
 * ein Token statt des Dienstes selbst, weil der Dienst diese Datei importiert.
 */
export interface OverlayRouteDicts {
  loadRouteDicts(path: string): Promise<void>;
}

export const OVERLAY_ROUTE_DICTS = new InjectionToken<OverlayRouteDicts>('OVERLAY_ROUTE_DICTS');

/**
 * Hängt an jede Route eines Overlay-Baums einen Resolver, der ihre
 * Wörterbücher lädt, bevor die Seite rendert. Ein Resolver und kein Umbau des
 * Ladens der Komponente: Resolver laufen bei jedem Betreten der Route, auch
 * wenn der Router die Komponente schon zwischengespeichert hat (beim
 * Prerendern teilen sich viele Seiten dieselben Routen-Objekte, aber jede hat
 * ihren eigenen Katalog). Damit Wörterbuch und Komponenten-Chunk trotzdem
 * parallel laden, stößt der Resolver das Laden der Komponente gleich mit an;
 * der Router bekommt denselben Chunk danach aus dem Modul-Cache.
 */
export function withOverlayDictionaries(routes: Routes, parent = ''): Routes {
  return routes
    .filter((route) => !OVERLAY_EXCLUDED_PATHS.includes(parent + (route.path ?? '')))
    .map((route) => {
      const path = parent + (route.path ?? '');
      const copy: Route = { ...route };
      if (!copy.redirectTo) {
        copy.resolve = { ...route.resolve, overlayDicts: overlayDictsResolver(path, route) };
      }
      if (copy.children) {
        copy.children = withOverlayDictionaries(copy.children, path ? `${path}/` : '');
      }
      return copy;
    });
}

function overlayDictsResolver(path: string, route: Route): () => Promise<null> {
  return () => {
    const dicts = inject(OVERLAY_ROUTE_DICTS, { optional: true });
    // Die Lader dieser App sind dynamische import(): mehrfach aufrufen ist billig.
    void Promise.resolve(route.loadComponent?.() ?? route.loadChildren?.()).catch(() => undefined);
    return (dicts?.loadRouteDicts(path) ?? Promise.resolve()).then(() => null);
  };
}
