import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { serverRoutes } from './app.routes.server';

// Server/prerender bootstrap. Mirrors the browser providers from main.ts
// (router + HttpClient) so routes can be prerendered, plus server rendering.
export const config: ApplicationConfig = {
  providers: [
    importProvidersFrom(AppRoutingModule),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideServerRendering(withRoutes(serverRoutes)),
  ],
};
