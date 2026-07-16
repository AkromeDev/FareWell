import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { LanguageService } from 'src/services/language.service';
import { TaskRecord, TaskUser } from '../../models';
import { CategoryGroup } from '../../utils/task-sort';
import { TaskCardComponent } from '../task-card/task-card.component';

/**
 * A collapsible, labelled category of tasks. Expanded by default; tasks inside
 * are already ordered by urgency. Uses a native disclosure button for keyboard
 * and screen-reader support.
 */
@Component({
  selector: 'app-task-category',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskCardComponent],
  templateUrl: './task-category.component.html',
  styleUrls: ['./task-category.component.scss'],
})
export class TaskCategoryComponent {
  @Input({ required: true }) group!: CategoryGroup;
  @Input({ required: true }) user!: TaskUser;
  @Input({ required: true }) now!: Date;
  @Input() collapsed = false;
  @Input() canComplete = true;
  @Input() panelId = '';

  @Output() toggle = new EventEmitter<void>();
  @Output() requestComplete = new EventEmitter<TaskRecord>();
  @Output() requestTrigger = new EventEmitter<TaskRecord>();

  readonly lang = inject(LanguageService);

  title(): string {
    const c = this.group.category;
    return this.lang.t(c.labelDe, c.labelEn);
  }

  countLabel(): string {
    const n = this.group.records.length;
    return this.lang.t(`${n} Aufgaben`, `${n} tasks`);
  }

  /** Share of tasks NOT currently needing attention — the category "health". */
  healthPercent(): number {
    const total = this.group.records.length;
    if (total === 0) return 100;
    return Math.round(((total - this.group.urgentCount) / total) * 100);
  }

  /** Staggered card entrance, capped so long categories don't crawl in. */
  cardDelay(index: number): number {
    return Math.min(index, 8) * 40;
  }
}
