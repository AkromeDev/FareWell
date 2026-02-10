import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from '../components/pages/home/home.component';
import { HeaderComponent } from 'src/components/atoms/header/header.component';
import { FooterComponent } from 'src/components/molecules/footer/footer.component';

@NgModule({
  declarations: [
    // ⚠️ leer lassen, Standalone Components benutzt
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    // Standalone Components
    HomeComponent,
    HeaderComponent,
    FooterComponent,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
