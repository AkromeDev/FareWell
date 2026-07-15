import { Component, Input } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

/**
 * Info-Karte mit optionalem Emoji-Icon und Überschrift; der Fließtext wird
 * projiziert. Karten werden vom Aufrufer in ein `.gd-cards`-Raster gelegt:
 *
 *   <div class="gd-cards gd-cards--2">
 *     <app-guide-card icon="🎬" heading="…">Text…</app-guide-card>
 *   </div>
 */
@Component({
  selector: 'app-guide-card',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <article class="gd-card" appReveal [revealDelay]="revealDelay">
      <h3>
        @if (icon) {
          <span class="gd-card__ico" aria-hidden="true">{{ icon }}</span>
        }
        {{ heading }}
      </h3>
      <p><ng-content /></p>
    </article>
  `,
})
export class GuideCardComponent {
  @Input() icon = '';
  @Input({ required: true }) heading!: string;
  @Input() revealDelay = 0;
}
