import { Component, Input } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

/**
 * Vollflächiger Seiten-Hero der Guide-/FAQ-Seiten: Bild mit Ken-Burns-Zoom,
 * dunkler Verlauf, Kicker, Fraunces-Headline, kursive Tagline und Lead-Text.
 * Ohne Bild (`image=""`) wird er zur schlichten Forest-Fläche, mit `icon`
 * steht ein Emoji auf dem hellen Plättchen statt des Logos.
 */
@Component({
  selector: 'app-guide-hero',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <header class="gd-hero" [class.gd-hero--plain]="!image">
      @if (image) {
        <img
          class="gd-hero__img"
          [class.gd-hero__img--crop-top]="mobileCrop === 'top'"
          [src]="image"
          [alt]="imageAlt"
          fetchpriority="high"
          decoding="async"
        />
      }
      <div class="gd-hero__inner">
        <p class="gd-hero__kicker" appReveal>{{ kicker }}</p>
        @if (icon) {
          <div class="gd-hero__brand" appReveal [revealDelay]="40">
            <span class="gd-hero__icon" aria-hidden="true">{{ icon }}</span>
          </div>
        } @else if (logo) {
          <div class="gd-hero__brand" appReveal [revealDelay]="40">
            <img [src]="logo" [alt]="logoAlt" decoding="async" />
          </div>
        }
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
  /** Optionales Logo (auf hellem Plättchen) zwischen Kicker und Titel. */
  @Input() logo = '';
  @Input() logoAlt = 'FareWell Logo';
  /** Optionales Emoji auf demselben Plättchen, ersetzt das Logo. Dekorativ:
   *  der Titel muss ohne das Emoji verständlich sein. */
  @Input() icon = '';
  /** 'top' schneidet das Bild auf Mobil/Tablet von oben an, sodass nur die
   *  untere Bildhälfte sichtbar bleibt (z. B. um Gesichter auszublenden). */
  @Input() mobileCrop: '' | 'top' = '';
}
