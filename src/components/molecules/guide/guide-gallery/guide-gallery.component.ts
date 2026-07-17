import { Component, Input } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

export interface GuideGalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Bildraster im Guide-Look für Ergebnis-/Impressionsgalerien. Passt die
 * Spaltenzahl automatisch an und rahmt jedes Bild einheitlich.
 *
 *   <app-guide-gallery [items]="galleryItems" />
 */
@Component({
  selector: 'app-guide-gallery',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <div class="gd-gallery" [style.--gd-gallery-min]="minWidth" appReveal>
      @for (item of items; track item.src) {
        <figure class="gd-gallery__item">
          <img
            [src]="item.src"
            [alt]="item.alt"
            loading="lazy"
            decoding="async"
          />
          @if (item.caption) {
            <figcaption>{{ item.caption }}</figcaption>
          }
        </figure>
      }
    </div>
  `,
})
export class GuideGalleryComponent {
  @Input({ required: true }) items: GuideGalleryItem[] = [];
  /** Mindestbreite pro Kachel (steuert die Spaltenzahl). */
  @Input() minWidth = '220px';
}
