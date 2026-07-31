import { Component, Input } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

/**
 * Hinweiskasten mit Uppercase-Label. Varianten:
 *   tip  – sandfarben, neutraler Hinweis
 *   win  – grün, positives Argument
 *   warn – orange, Einordnung/Erwartungsmanagement (was realistisch ist)
 *   rule – rot, echte Warnung: Kontraindikationen, wann wir nicht behandeln
 */
@Component({
  selector: 'app-guide-note',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <aside
      class="gd-note"
      [class.gd-note--tip]="variant === 'tip'"
      [class.gd-note--win]="variant === 'win'"
      [class.gd-note--warn]="variant === 'warn'"
      [class.gd-note--rule]="variant === 'rule'"
      appReveal
    >
      <span class="gd-note__label">{{ label }}</span>
      <p><ng-content /></p>
    </aside>
  `,
})
export class GuideNoteComponent {
  @Input() variant: 'tip' | 'win' | 'warn' | 'rule' = 'tip';
  @Input({ required: true }) label!: string;
}
