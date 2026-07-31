import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  private readonly bookingUrl = 'https://salonkee.de/salon/farewell?lang=de';

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