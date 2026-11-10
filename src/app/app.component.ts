import { Component, PLATFORM_ID, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet, Routes } from '@angular/router';
import { filter, take } from 'rxjs/operators';
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
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

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

        // Nur der Pfad: Query (gclid, utm_*) und Fragment gehören nicht in
        // die Canonical-URL, sonst zeigt jeder Anzeigenklick auf eine eigene.
        const canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (canonical) {
          const path = e.urlAfterRedirects.split(/[?#]/)[0] || '/';
          canonical.href = `https://farewell.salon${path}`;
        }
      });

    if (this.isBrowser) {
      this.router.events
        .pipe(
          filter((e): e is NavigationEnd => e instanceof NavigationEnd),
          take(1)
        )
        .subscribe(() => this.redirectLegacyHash());
    }
  }

  /**
   * Alte Hash-Links aus der Zeit vor dem Prerendering (…/#/price, …/#/zeit)
   * stehen noch in Google-Ads-Kampagnen. Der Server liefert dafür die
   * Startseite aus, der Hash erreicht ihn nie. Ist der Pfad hinter „#/" eine
   * Route dieser App, ersetzen wir die URL durch ihn (ohne neuen
   * History-Eintrag). Query-Parameter der aufgerufenen URL (gclid, utm_*)
   * bleiben erhalten. Unbekannte Pfade bleiben auf der Startseite.
   */
  private redirectLegacyHash(): void {
    const hash = this.document.location?.hash ?? '';
    if (!hash.startsWith('#/')) return;

    const target = this.router.parseUrl(hash.slice(1));
    const segments = target.root.children['primary']?.segments.map((s) => s.path) ?? [];
    if (!segments.length || !routeExists(this.router.config, segments)) return;

    const current = this.router.parseUrl(this.router.url);
    target.queryParams = { ...current.queryParams, ...target.queryParams };
    this.router.navigateByUrl(target, { replaceUrl: true });
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

/**
 * Gibt es zu diesen Pfadsegmenten eine Route? Statische Segmente müssen exakt
 * passen, `:param` passt auf alles. Lazy-Module (`loadChildren`) gelten als
 * Treffer, sobald ihr eigener Pfad passt; ihre Unterrouten kennt die
 * Konfiguration hier noch nicht. Die Wildcard (`**`) zählt nicht.
 */
function routeExists(routes: Routes, segments: string[]): boolean {
  return routes.some((route) => {
    if (route.path === undefined || route.path === '**' || route.matcher) return false;
    const own = route.path ? route.path.split('/') : [];
    if (own.length > segments.length) return false;
    if (!own.every((part, i) => part.startsWith(':') || part === segments[i])) return false;

    const rest = segments.slice(own.length);
    const routable = !!(route.component || route.loadComponent || route.redirectTo !== undefined);
    if (route.children) return routeExists(route.children, rest) || (!rest.length && routable);
    if (route.loadChildren) return true;
    return !rest.length && routable;
  });
}
