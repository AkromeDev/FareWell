import { Component, Input } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

/**
 * Vergleichs-Panel mit Uppercase-Kopfzeile und Punkte-Liste. Die Listenpunkte
 * werden als `<li>` projiziert; Panels werden vom Aufrufer paarweise in ein
 * `.gd-split`-Raster gelegt:
 *
 *   <div class="gd-split">
 *     <app-guide-panel heading="Gilt für"><li>…</li></app-guide-panel>
 *     <app-guide-panel heading="Gilt nicht" dots="sand"><li>…</li></app-guide-panel>
 *   </div>
 */
@Component({
  selector: 'app-guide-panel',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <div
      class="gd-panel"
      [class.gd-panel--sage]="tone === 'sage'"
      [class.gd-panel--forest]="tone === 'forest'"
      appReveal
      [revealDelay]="revealDelay"
    >
      <div class="gd-panel__head">{{ heading }}</div>
      @if (intro) {
        <p>{{ intro }}</p>
      }
      <ul class="gd-ticks" [class.gd-ticks--sand]="dots === 'sand'">
        <ng-content />
      </ul>
    </div>
  `,
})
export class GuidePanelComponent {
  @Input({ required: true }) heading!: string;
  /** Farbe des linken Akzentrahmens: none | sage | forest. */
  @Input() tone: 'none' | 'sage' | 'forest' = 'none';
  /** Punktfarbe der Liste: sage (gefüllt) oder sand (hell umrandet). */
  @Input() dots: 'sage' | 'sand' = 'sage';
  @Input() intro = '';
  @Input() revealDelay = 0;
}
