import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { LanguageService } from 'src/services/language.service';
import { TaskRecord } from '../../models';
import { CalendarCell, CalendarDay } from '../../utils/calendar';
import { CALENDAR_KIND_LABELS, STATE_LABELS } from '../../utils/task-labels';
import { formatDate, formatDayHeader } from '../../utils/date.util';

/** A single day column in the weekly calendar. */
@Component({
  selector: 'app-calendar-day',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.scss'],
})
export class CalendarDayComponent {
  @Input({ required: true }) day!: CalendarDay;
  @Input() headingLevel: 'h3' | 'h4' = 'h3';

  @Output() selectTask = new EventEmitter<TaskRecord>();

  readonly lang = inject(LanguageService);

  header(): { weekday: string; day: string } {
    return formatDayHeader(this.day.date, this.lang.lang());
  }

  kindLabel(cell: CalendarCell): string {
    const l = CALENDAR_KIND_LABELS[cell.kind];
    return this.lang.t(l.de, l.en);
  }

  chipAriaLabel(cell: CalendarCell): string {
    const state = STATE_LABELS[cell.record.computed.state];
    const dateStr = formatDate(this.day.iso, this.lang.lang());
    return this.lang.t(
      `${cell.record.def.name}, ${dateStr}, ${state.de}`,
      `${cell.record.def.name}, ${dateStr}, ${state.en}`,
    );
  }

  isActionable(cell: CalendarCell): boolean {
    return cell.kind !== 'completed' && cell.record.computed.actionable;
  }
}
