import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

declare let gtag: (...args: unknown[]) => void;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private router: Router) {
    // gtag only exists in the browser, and only after the Google Analytics
    // script has loaded. Skip during SSR/prerender and when it is absent so we
    // never throw a ReferenceError on navigation.
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      return;
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && typeof gtag === 'function') {
        gtag('config', 'G-TQCJ2D64MQ', {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }
}
