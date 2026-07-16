import { Component, Input, inject } from '@angular/core';
import { LanguageService } from 'src/services/language.service';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

@Component({
  selector: 'app-booking-cta',
  standalone: true,
  templateUrl: './booking-cta.html',
  styleUrls: ['./booking-cta.scss']
})
export class BookingCtaComponent {
  private readonly lang = inject(LanguageService);

  /** Optional; ohne Angabe wird der zweisprachige Standard verwendet. */
  @Input() label?: string;
  @Input() location: string = 'unknown';

  get displayLabel(): string {
    return this.label ?? this.lang.t('Termin buchen', 'Book now');
  }

  readonly bookingUrl = 'https://salonkee.de/salon/farewell?lang=de';

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
      event_label: `Termin Buchen ${this.location}`,
      link_text: this.displayLabel,
      location: this.location,
      destination: 'salonkee',
      event_callback: openBooking
    });

    setTimeout(openBooking, 800);
  }
}