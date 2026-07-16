import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { LanguageService } from 'src/services/language.service';
import { TaskRecord, TaskUser } from '../../models';
import { RecurrenceService } from '../../services/recurrence.service';
import { UrgencyBadgeComponent } from '../urgency-badge/urgency-badge.component';
import { formatDate, formatDateTime, relativeTime } from '../../utils/date.util';
import { taskName, taskNotes } from '../../utils/task-labels';

/**
 * A single task: name, urgency, recurrence, who/when last completed, next due,
 * and completion / event-trigger actions. Purely presentational — it emits
 * intent and the dashboard performs the mutation.
 */
@Component({
  selector: 'app-task-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UrgencyBadgeComponent],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent {
  @Input({ required: true }) record!: TaskRecord;
  @Input({ required: true }) user!: TaskUser;
  @Input({ required: true }) now!: Date;
  /** Whether this route may complete this task type. */
  @Input() canComplete = true;
  /** Edit mode (Mojo): shows the pencil that opens the edit dialog. */
  @Input() editable = false;

  @Output() requestComplete = new EventEmitter<TaskRecord>();
  @Output() requestTrigger = new EventEmitter<TaskRecord>();
  @Output() requestEdit = new EventEmitter<TaskRecord>();

  private readonly recurrence = inject(RecurrenceService);
  readonly lang = inject(LanguageService);

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  name(): string {
    return taskName(this.record.def, this.lang.lang());
  }

  notes(): string | undefined {
    return taskNotes(this.record.def, this.lang.lang());
  }

  recurrenceText(): string {
    return this.recurrence.describeRecurrence(this.record.def, this.lang.lang());
  }

  get isEventTask(): boolean {
    const k = this.record.def.recurrence.kind;
    return k === 'eventTriggered' || k === 'eventWithFollowUp';
  }

  get isSeasonalInactive(): boolean {
    return this.record.computed.state === 'seasonalInactive';
  }

  lastCompletedText(): string {
    const st = this.record.state;
    if (!st.lastCompletedAt || !st.lastCompletedByName) {
      return this.t('Noch nie erledigt', 'Not completed yet');
    }
    const rel = relativeTime(st.lastCompletedAt, this.now, this.lang.lang());
    return this.t(
      `Zuletzt von ${st.lastCompletedByName} ${rel}`,
      `Last completed by ${st.lastCompletedByName} ${rel}`,
    );
  }

  lastCompletedExact(): string {
    const iso = this.record.state.lastCompletedAt;
    return iso ? formatDateTime(iso, this.lang.lang()) : '';
  }

  nextDueText(): string | null {
    const iso = this.record.computed.nextDueAt;
    if (!iso) return null;
    return this.t(
      `Nächste Fälligkeit: ${formatDate(iso, 'de')}`,
      `Next due: ${formatDate(iso, 'en')}`,
    );
  }

  ownerName(): string | null {
    return this.record.def.primaryOwner
      ? this.record.def.primaryOwner.charAt(0).toUpperCase() + this.record.def.primaryOwner.slice(1)
      : null;
  }

  completeAriaLabel(): string {
    return this.t(
      `${this.record.def.nameDe} als erledigt markieren`,
      `Mark ${this.record.def.nameEn} as completed`,
    );
  }
}
