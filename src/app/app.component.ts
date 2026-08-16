import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from 'src/components/atoms/header/header.component';
import { FooterComponent } from 'src/components/molecules/footer/footer.component';
import { CookieBannerComponent } from 'src/components/molecules/cookie-banner/cookie-banner.component';
import { AnalyticsService } from 'src/services/analytics.service';
import { LanguageService } from 'src/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CookieBannerComponent
  ]
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly language = inject(LanguageService);

  /**
   * Der Skip-Link ist das Erste, was eine Sprachausgabe auf jeder Seite
   * vorliest. Er wird deshalb nur in der aktiven Sprache gerendert statt als
   * DE/EN-Paar: Greift das CSS einmal nicht, hörte man sonst als allerersten
   * Satz „Zum Inhalt springen Skip to content".
   */
  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  /**
   * Ziel des Skip-Links, immer mit vollem Pfad. Ein blosses "#main-content"
   * würde wegen <base href="/"> zur Startseite führen, wenn es geklickt wird,
   * bevor Angular läuft.
   */
  skipHref = '#main-content';

  constructor(private analytics: AnalyticsService) {
    this.skipHref = this.buildSkipHref(this.router.url);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.skipHref = this.buildSkipHref(e.urlAfterRedirects);

        const canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (canonical) {
          canonical.href = `https://farewell.salon${e.urlAfterRedirects}`;
        }
      });
  }

  private buildSkipHref(url: string): string {
    const path = (url || '/').split('#')[0];
    return `${path}#main-content`;
  }

  /**
   * Skip-Link. Ein einfaches href="#main-content" würde wegen <base href="/">
   * gegen "/" aufgelöst und die aktuelle Route verlassen. routerLink+fragment
   * scheidet ebenfalls aus: das löst ein NavigationEnd aus, und der
   * Canonical-Updater oben würde "#main-content" in die Canonical-URL schreiben.
   */
  skipToContent(event: Event): void {
    event.preventDefault();

    const target = this.document.getElementById('main-content');
    if (!target) return;

    target.focus({ preventScroll: true });

    const reduceMotion =
      this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }
}
