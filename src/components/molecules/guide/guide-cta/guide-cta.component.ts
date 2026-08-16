import { Component, Input, inject } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { LanguageService } from 'src/services/language.service';

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
          [attr.aria-label]="bookingAria"
          >{{ bookingLabel }}</a
        >
        <a
          class="gd-btn gd-btn--ghost"
          [href]="instagramHref"
          target="_blank"
          rel="noopener noreferrer"
          [attr.aria-label]="instagramAria"
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

  private readonly language = inject(LanguageService);

  /**
   * Beide Buttons verlassen die Seite in einem neuen Tab. Ohne Ankündigung
   * merkt das jemand mit Screenreader erst, wenn der Zurück-Knopf nicht mehr
   * greift. Der sichtbare Text bleibt Präfix (WCAG 2.5.3).
   */
  get bookingAria(): string {
    return this.language.t(
      `${this.bookingLabel}: Online-Buchung bei Salonkee, öffnet in einem neuen Tab`,
      `${this.bookingLabel}: online booking at Salonkee, opens in a new tab`
    );
  }

  get instagramAria(): string {
    return this.language.t(
      `${this.instagramLabel}: FareWell auf Instagram, öffnet in einem neuen Tab`,
      `${this.instagramLabel}: FareWell on Instagram, opens in a new tab`
    );
  }
}
