import { Component } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

/**
 * Nummerierte Schrittfolge mit verbundenen Kreis-Nummern (CSS-Counter).
 * Die Schritte werden als `<li>` projiziert, typischerweise mit
 * `<strong>Titel.</strong> Beschreibung`:
 *
 *   <app-guide-steps>
 *     <li><strong>Diagnose holen.</strong> Lass dir …</li>
 *   </app-guide-steps>
 */
@Component({
  selector: 'app-guide-steps',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <ol class="gd-steps" appReveal>
      <ng-content />
    </ol>
  `,
})
export class GuideStepsComponent {}
