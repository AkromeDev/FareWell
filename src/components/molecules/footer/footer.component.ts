import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DR_LEO_SITE, LEVEL44_SITE } from 'src/app/domain/partner-sites';
import { ScrollToDirective } from 'src/directives/scroll-to.directive';
import { ConsentService } from 'src/services/consent.service';
import { LanguageService } from 'src/services/language.service';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, ScrollToDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {

  readonly lang = inject(LanguageService);

  private readonly consent = inject(ConsentService);

  private readonly router = inject(Router);

  /** Die wirkstofffreie Zielseite der Google Anzeigen, siehe aesthetik-promotion. */
  get isAdLandingPage(): boolean {
    return this.router.url.split(/[?#]/)[0].endsWith('/promotionen/aesthetische-medizin-nuernberg');
  }

  private readonly bookingUrl = 'https://salonkee.de/salon/farewell?lang=de';

  /** „Unter einem Dach“: wohin die beiden Partnernamen führen (partner-sites.ts). */
  readonly drLeoSite = DR_LEO_SITE;
  readonly level44Site = LEVEL44_SITE;

  /**
   * Ein Link zu einer der beiden Partner-Websites: das gemeinsame Ereignis
   * crosslink_click (AI-SEO-STRATEGY.md, „Shared analytics events“). Der Link
   * öffnet normal weiter.
   */
  trackCrosslink(toSite: string): void {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', 'crosslink_click', {
      from_site: 'farewell.salon',
      from_page: this.router.url.split(/[?#]/)[0],
      to_site: new URL(toSite).host,
      location: 'footer',
    });
  }

  /** Art. 7 Abs. 3 DSGVO: Widerruf muss so einfach sein wie die Erteilung. */
  openConsentSettings(): void {
    this.consent.reopen();
  }

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  /** Interner Link in der aktiven Sprache (auf /en/-Seiten mit /en-Präfix). */
  p(path: string): string {
    return this.lang.localizePath(path);
  }

  trackBookingClick(event: MouseEvent): void {
    event.preventDefault();

    if (!window.gtag) {
      window.open(this.bookingUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    let opened = false;

    const openBooking = () => {
      if (opened) return;
      opened = true;
      window.open(this.bookingUrl, '_blank', 'noopener,noreferrer');
    };

    window.gtag('event', 'generate_lead', {
      event_category: 'engagement',
      event_label: 'Termin Buchen Footer',
      link_text: 'TERMIN BUCHEN',
      location: 'footer',
      destination: 'salonkee',
      event_callback: openBooking
    });

    setTimeout(openBooking, 800);
  }
}