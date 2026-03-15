import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollToDirective } from 'src/directives/scroll-to.directive';

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
  trackBookingClick() {
    window.gtag?.('event', 'generate_lead', {
      event_category: 'engagement',
      event_label: 'Termin Buchen Footer',
      link_text: 'TERMIN BUCHEN',
      location: 'footer',
      destination: 'salonkee'
    });
  }
}