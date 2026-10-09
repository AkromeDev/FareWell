import { ApplicationConfig, importProvidersFrom, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BEFORE_APP_SERIALIZED } from '@angular/platform-server';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { appendFileSync } from 'node:fs';

import { AppRoutingModule } from './app-routing.module';
import { serverRoutes } from './app.routes.server';
import { LanguageService } from 'src/services/language.service';
import { provideLanguage } from 'src/i18n/uk/provide';
import { finalizeUkDocument } from 'src/i18n/uk/server';

// Server/prerender bootstrap. Mirrors the browser providers from main.ts
// (router + HttpClient + language) so routes can be prerendered, plus server
// rendering and the Ukrainian finishing pass.
export const config: ApplicationConfig = {
  providers: [
    importProvidersFrom(AppRoutingModule),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideLanguage(),
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: BEFORE_APP_SERIALIZED,
      multi: true,
      useFactory: () => {
        const doc = inject(DOCUMENT);
        const language = inject(LanguageService);
        return () => {
          if (language.lang() !== 'uk') return;
          const misses = finalizeUkDocument(doc);
          // tools/i18n-uk.mjs check setzt die Variable und sammelt hier alle
          // Texte, für die noch keine Übersetzung existiert.
          const report = process.env['I18N_UK_REPORT'];
          if (report && misses.length) {
            appendFileSync(report, JSON.stringify({ url: doc.location.pathname, misses }) + '\n');
          }
        };
      },
    },
  ],
};
