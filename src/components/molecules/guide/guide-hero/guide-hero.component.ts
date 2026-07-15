import { Component, Input } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

/**
 * Vollflächiger Seiten-Hero der Guide-/FAQ-Seiten: Bild mit Ken-Burns-Zoom,
 * dunkler Verlauf, Kicker, Fraunces-Headline, kursive Tagline und Lead-Text.
 */
@Component({
  selector: 'app-guide-hero',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <header class="gd-hero">
      <img
        class="gd-hero__img"
        [src]="image"
        [alt]="imageAlt"
        fetchpriority="high"
        decoding="async"
      />
      <div class="gd-hero__inner">
        <p class="gd-hero__kicker" appReveal>{{ kicker }}</p>
        <h1 class="gd-hero__title" appReveal [revealDelay]="60">{{ heading }}</h1>
        @if (tagline) {
          <p class="gd-hero__tagline" appReveal [revealDelay]="120">{{ tagline }}</p>
        }
        @if (lead) {
          <p class="gd-hero__lead" appReveal [revealDelay]="120">{{ lead }}</p>
        }
      </div>
    </header>
  `,
})
export class GuideHeroComponent {
  @Input({ required: true }) kicker!: string;
  @Input({ required: true }) heading!: string;
  @Input() tagline = '';
  @Input() lead = '';
  @Input() image = 'assets/images/farewell/studio.webp';
  @Input() imageAlt = 'Der FareWell Salon in Nürnberg';
}
