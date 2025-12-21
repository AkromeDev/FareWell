import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { AppRoutingModule } from './app/app-routing.module';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(AppRoutingModule),
    provideHttpClient(withFetch(), withInterceptorsFromDi()), provideClientHydration(withEventReplay())
  ]
}).catch(err => console.error(err));
