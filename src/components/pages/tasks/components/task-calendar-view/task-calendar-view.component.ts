import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { LanguageService } from 'src/services/language.service';
import { TaskRecord, TaskUser } from '../../models';
import { RecurrenceService } from '../../services/recurrence.service';
import { CalendarWeek, buildWeek } from '../../utils/calendar';
import { CalendarDayComponent } from '../calendar-day/calendar-day.component';
import { UrgencyBadgeComponent } from '../urgency-badge/urgency-badge.component';
import { addCalendarDays, formatDayHeader, sameLocalDay, startOfWeek, weekDates } from '../../utils/date.util';

interface PickerDay {
  index: number;
  weekday: string;
  day: string;
  count: number;
  isToday: boolean;
}

/**
 * Weekly calendar representation of the same shared task state. Provides
 * previous/next/this-week navigation, marks today, and adapts to a single-day
 * mobile layout. Overdue and event/optional tasks get dedicated lanes so
 * nothing is hidden.
 */
@Component({
  selector: 'app-task-calendar-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarDayComponent, UrgencyBadgeComponent],
  templateUrl: './task-calendar-view.component.html',
  styleUrls: ['./task-calendar-view.component.scss'],
})
export class TaskCalendarViewComponent implements OnInit, OnChanges {
  @Input({ required: true }) records: TaskRecord[] = [];
  @Input({ required: true }) user!: TaskUser;
  @Input({ required: true }) now!: Date;

  @Output() requestComplete = new EventEmitter<TaskRecord>();

  private readonly recurrence = inject(RecurrenceService);
  readonly lang = inject(LanguageService);

  weekStart!: Date;
  selectedIndex = 0;

  ngOnInit(): void {
    this.weekStart = startOfWeek(this.now);
    this.selectedIndex = this.todayIndex();
  }

  ngOnChanges(): void {
    if (!this.weekStart) this.weekStart = startOfWeek(this.now);
  }

  get week(): CalendarWeek {
    return buildWeek(this.records, this.weekStart, this.now, this.recurrence);
  }

  weekLabel(): string {
    const dates = weekDates(this.weekStart);
    const locale = this.lang.lang() === 'de' ? 'de-DE' : 'en-GB';
    const start = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(dates[0]);
    const end = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(dates[6]);
    return `${start} – ${end}`;
  }

  isCurrentWeek(): boolean {
    return sameLocalDay(this.weekStart, startOfWeek(this.now));
  }

  pickerDays(): PickerDay[] {
    return this.week.days.map((d, index) => {
      const h = formatDayHeader(d.date, this.lang.lang());
      return {
        index,
        weekday: h.weekday,
        day: h.day,
        count: d.items.length,
        isToday: d.isToday,
      };
    });
  }

  prevWeek(): void {
    this.weekStart = addCalendarDays(this.weekStart, -7);
  }

  nextWeek(): void {
    this.weekStart = addCalendarDays(this.weekStart, 7);
  }

  thisWeek(): void {
    this.weekStart = startOfWeek(this.now);
    this.selectedIndex = this.todayIndex();
  }

  selectDay(index: number): void {
    this.selectedIndex = index;
  }

  private todayIndex(): number {
    const dates = weekDates(this.weekStart);
    const idx = dates.findIndex((d) => sameLocalDay(d, this.now));
    return idx >= 0 ? idx : 0;
  }
}
