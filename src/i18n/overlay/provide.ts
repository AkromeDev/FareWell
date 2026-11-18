import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { LanguageService } from 'src/services/language.service';
import { OVERLAY_ROUTE_DICTS } from './dictionaries';

/**
 * Browser und Server: vor dem ersten Rendern Katalog und gemeinsames
 * Wörterbuch der Overlay-Sprache laden (nur auf /uk/- und /tr/-Seiten, sonst
 * sofort fertig), und den Routen-Resolvern den Katalog dieses Seitenaufrufs
 * geben.
 */
export function provideLanguage(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => inject(LanguageService).init()),
    { provide: OVERLAY_ROUTE_DICTS, useExisting: LanguageService },
  ]);
}
