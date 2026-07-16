import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { LanguageService } from 'src/services/language.service';
import { TaskCategory, TaskRecord, TaskUser } from '../../models';
import { CategoryGroup, groupByCategory } from '../../utils/task-sort';
import { TaskCategoryComponent } from '../task-category/task-category.component';

/**
 * Category-list representation of the shared task state. Groups visible tasks
 * into labelled, collapsible categories, each ordered by urgency.
 */
@Component({
  selector: 'app-task-list-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskCategoryComponent],
  templateUrl: './task-list-view.component.html',
  styleUrls: ['./task-list-view.component.scss'],
})
export class TaskListViewComponent {
  @Input({ required: true }) records: TaskRecord[] = [];
  @Input({ required: true }) categories: TaskCategory[] = [];
  @Input({ required: true }) user!: TaskUser;
  @Input({ required: true }) now!: Date;
  @Input() collapsed: Record<string, boolean> = {};

  @Output() toggleCategory = new EventEmitter<string>();
  @Output() requestComplete = new EventEmitter<TaskRecord>();
  @Output() requestTrigger = new EventEmitter<TaskRecord>();

  readonly lang = inject(LanguageService);

  get groups(): CategoryGroup[] {
    return groupByCategory(this.records, this.categories);
  }

  isCollapsed(categoryId: string): boolean {
    return this.collapsed[categoryId] === true;
  }

  /** Staggered category entrance, capped so long lists don't crawl in. */
  groupDelay(index: number): number {
    return Math.min(index, 6) * 70;
  }
}
