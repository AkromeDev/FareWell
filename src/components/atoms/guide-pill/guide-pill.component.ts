import { Component, Input } from '@angular/core';

/**
 * Kleines Status-Label im Guide-Design (z. B. „gratis", „schnell", „hohe Gebühr").
 * Varianten: sand (neutral), ok (grün), warn (bernstein), hot (rot).
 */
@Component({
  selector: 'app-guide-pill',
  standalone: true,
  template: `<span
    class="gd-pill"
    [class.gd-pill--ok]="variant === 'ok'"
    [class.gd-pill--warn]="variant === 'warn'"
    [class.gd-pill--hot]="variant === 'hot'"
    >{{ label }}</span
  >`,
})
export class GuidePillComponent {
  @Input() variant: 'sand' | 'ok' | 'warn' | 'hot' = 'sand';
  @Input({ required: true }) label!: string;
}
