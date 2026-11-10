import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

declare let gtag: (...args: unknown[]) => void;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Pfad, unter dem Google Analytics die offene Seite führt, statt ihrer
   * Adresse. Nur der A/B-Test auf /promotionen setzt ihn: dieselbe Adresse,
   * zwei Seiten, in GA als /promotionen/feld und /promotionen/drehbuehne.
   */
  private virtualPath: string | null = null;

  constructor(private router: Router) {
    // gtag only exists in the browser, and only after the Google Analytics
    // script has loaded. Skip during SSR/prerender and when it is absent so we
    // never throw a ReferenceError on navigation.
    if (!this.isBrowser) {
      return;
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && typeof gtag === 'function') {
        const url = event.urlAfterRedirects;
        const cut = url.search(/[?#]/);
        const path = this.virtualPath ? this.virtualPath + (cut < 0 ? '' : url.slice(cut)) : url;
        // page_location every time: gtag keeps a value given to config for
        // the events that follow, so a virtual one must never linger. It
        // carries the query (gclid, utm_*), which GA reads from it.
        gtag('config', 'G-TQCJ2D64MQ', {
          page_path: path,
          page_location: window.location.origin + path
        });
      }
    });
  }

  /**
   * Die Seite, die gleich geöffnet wird, meldet sich unter diesem Pfad, bis
   * null kommt. Im Konstruktor der Seite setzen, also vor NavigationEnd, und
   * in ngOnDestroy zurücknehmen.
   */
  setVirtualPath(path: string | null): void {
    this.virtualPath = path;
  }

  /** Die Adresse der offenen Seite für GA, mit Suchparametern; null ohne eigenen Pfad. */
  virtualLocation(): string | null {
    if (!this.isBrowser || !this.virtualPath) return null;
    return window.location.origin + this.virtualPath + window.location.search;
  }
}
