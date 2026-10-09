import { EnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { LanguageService } from 'src/services/language.service';

/**
 * Browser und Server: vor dem ersten Rendern Katalog und gemeinsames
 * ukrainisches Wörterbuch laden (nur auf /uk/-Seiten, sonst sofort fertig).
 */
export function provideLanguage(): EnvironmentProviders {
  return provideAppInitializer(() => inject(LanguageService).init());
}
