import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { LanguageService } from 'src/services/language.service';
import { TaskState, UrgencyLevel } from '../../models';
import { STATE_GLYPH, STATE_LABELS } from '../../utils/task-labels';

/**
 * Small status badge. Communicates urgency through a glyph AND a text label,
 * never colour alone, and exposes an accessible status to assistive tech.
 */
@Component({
  selector: 'app-urgency-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="badge"
      [attr.data-urgency]="urgency"
      role="status"
      [attr.aria-label]="label()"
    >
      <span class="glyph" aria-hidden="true">{{ glyph() }}</span>
      <span class="label">{{ label() }}</span>
    </span>
  `,
  styleUrls: ['./urgency-badge.component.scss'],
})
export class UrgencyBadgeComponent {
  @Input({ required: true }) state!: TaskState;
  @Input({ required: true }) urgency!: UrgencyLevel;

  private readonly lang = inject(LanguageService);

  label(): string {
    const l = STATE_LABELS[this.state];
    return this.lang.t(l.de, l.en);
  }

  glyph(): string {
    return STATE_GLYPH[this.state];
  }
}
