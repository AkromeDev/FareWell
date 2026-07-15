import { Component, Input } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

/**
 * Abschluss-CTA der Guide-Seiten: Überschrift, projizierter Text, Buttons zu
 * Salonkee und Instagram sowie die Marken-Tagline.
 */
@Component({
  selector: 'app-guide-cta',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <div class="gd-cta" appReveal>
      <h2>{{ heading }}</h2>
      <p><ng-content /></p>
      <div class="gd-cta__actions">
        <a
          class="gd-btn"
          [href]="bookingHref"
          target="_blank"
          rel="noopener noreferrer"
          >{{ bookingLabel }}</a
        >
        <a
          class="gd-btn gd-btn--ghost"
          [href]="instagramHref"
          target="_blank"
          rel="noopener noreferrer"
          >{{ instagramLabel }}</a
        >
      </div>
      @if (tagline) {
        <p class="gd-cta__tagline">{{ tagline }}</p>
      }
    </div>
  `,
})
export class GuideCtaComponent {
  @Input() heading = 'Bereit für deinen Termin?';
  @Input() bookingLabel = 'Termin buchen';
  @Input() bookingHref = 'https://salonkee.de/salon/farewell?lang=de';
  @Input() instagramLabel = 'Instagram';
  @Input() instagramHref = 'https://www.instagram.com/farewell.salon/';
  @Input() tagline = 'Für immer sanft.';
}
