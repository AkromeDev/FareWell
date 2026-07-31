import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface ConsentState {
  /** Schema version of the stored cookie. */
  v: 1;
  /** Statistik: analytics_storage + functionality_storage */
  an: boolean;
  /** Marketing: ad_storage + ad_user_data + ad_personalization */
  ad: boolean;
  /** ISO timestamp of the choice, kept for the Nachweispflicht (Art. 7 DSGVO). */
  t: string;
}

interface FwConsentApi {
  state(): ConsentState | null;
  needsBanner(): boolean;
  set(analytics: boolean, ads: boolean): ConsentState;
  clear(): void;
}

declare global {
  interface Window {
    fwConsent?: FwConsentApi;
  }
}

/**
 * Thin wrapper around the window.fwConsent API defined in index.html.
 *
 * The consent defaults have to be set in <head> before gtag.js and gtm.js load,
 * which is far earlier than Angular bootstraps. So the state lives there and
 * this service only reads it and forwards the visitor's choice.
 */
@Injectable({ providedIn: 'root' })
export class ConsentService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** True while the visitor has made no choice yet. Drives the banner. */
  readonly bannerVisible = signal(false);

  /** Last known choice, null until the visitor decides. */
  readonly state = signal<ConsentState | null>(null);

  constructor() {
    if (!this.isBrowser) {
      return;
    }
    this.state.set(window.fwConsent?.state() ?? null);
    this.bannerVisible.set(window.fwConsent?.needsBanner() ?? false);
  }

  /** "Alle akzeptieren" */
  acceptAll(): void {
    this.apply(true, true);
  }

  /** "Alle ablehnen" — must be exactly as easy to reach as acceptAll. */
  rejectAll(): void {
    this.apply(false, false);
  }

  /** "Auswahl speichern" from the detail view. */
  save(analytics: boolean, ads: boolean): void {
    this.apply(analytics, ads);
  }

  /** Footer link "Cookie Einstellungen": lets the visitor change their mind. */
  reopen(): void {
    this.bannerVisible.set(true);
  }

  private apply(analytics: boolean, ads: boolean): void {
    if (!this.isBrowser || !window.fwConsent) {
      return;
    }
    this.state.set(window.fwConsent.set(analytics, ads));
    this.bannerVisible.set(false);
  }
}
