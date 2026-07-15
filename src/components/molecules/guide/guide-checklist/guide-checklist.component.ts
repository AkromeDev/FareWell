import { Component } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

/**
 * Checkliste mit Kästchen, die beim Hover abhaken. Punkte werden als `<li>`
 * projiziert:
 *
 *   <app-guide-checklist>
 *     <li>Diagnose und Verordnung mitbringen</li>
 *   </app-guide-checklist>
 */
@Component({
  selector: 'app-guide-checklist',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <ul class="gd-checklist" appReveal>
      <ng-content />
    </ul>
  `,
})
export class GuideChecklistComponent {}
