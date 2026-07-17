import { Component, Input } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

/**
 * Einzelnes Schaubild im Guide-Look: gerahmtes Bild mit optionaler Bildunter-
 * schrift, zentriert und auf Lesebreite. Ideal für „So wirkt es"-Grafiken oder
 * ein hervorgehobenes Foto zwischen zwei Textabschnitten.
 *
 *   <app-guide-figure image="assets/…" imageAlt="…" caption="…" />
 */
@Component({
  selector: 'app-guide-figure',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <figure class="gd-figure" [class.gd-figure--wide]="wide" appReveal>
      <img
        [src]="image"
        [alt]="imageAlt"
        loading="lazy"
        decoding="async"
      />
      @if (caption) {
        <figcaption class="gd-figure__cap">{{ caption }}</figcaption>
      }
    </figure>
  `,
})
export class GuideFigureComponent {
  @Input({ required: true }) image!: string;
  @Input({ required: true }) imageAlt!: string;
  @Input() caption = '';
  /** Bild über die volle Inhaltsbreite statt nur Lesebreite. */
  @Input() wide = false;
}
