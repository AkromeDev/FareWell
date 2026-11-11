import { Component, Input } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { sizeOf } from 'src/services/responsive-images';

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
            [attr.width]="sizeOf(item.src).width"
            [attr.height]="sizeOf(item.src).height"
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
  /** Intrinsic image size for width/height (src/services/responsive-images.ts). */
  readonly sizeOf = sizeOf;

  @Input({ required: true }) items: GuideGalleryItem[] = [];
  /** Mindestbreite pro Kachel (steuert die Spaltenzahl). */
  @Input() minWidth = '220px';
}
