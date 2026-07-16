import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from 'src/services/language.service';
import {
  MAX_INTERVAL_DAYS,
  MIN_INTERVAL_DAYS,
  TaskCategory,
  TaskRecord,
  TaskUserId,
} from '../../models';
import { TASK_USERS, categoryById } from '../../config/task-access.config';
import { clampInterval, currentIntervalDays, isIntervalEditable } from '../../utils/task-edits';

/** What the dialog hands back to the dashboard on save. */
export interface TaskEditResult {
  nameDe: string;
  /** null = note cleared. */
  notesDe: string | null;
  /** Only present when the rhythm is editable for this task. */
  intervalDays?: number;
  /** null = no responsible person. */
  primaryOwner: TaskUserId | null;
  /** Create mode only. */
  category?: string;
}

/**
 * Edit or create a task from the dashboard (Mojo only). German-only input:
 * the English toggle shows the edited German text for changed tasks. Editing
 * never touches the task id, so completion history is always preserved.
 */
@Component({
  selector: 'app-task-edit-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './task-edit-dialog.component.html',
  styleUrls: ['./task-edit-dialog.component.scss'],
})
export class TaskEditDialogComponent implements OnInit, AfterViewInit {
  /** Present in edit mode; absent in create mode. */
  @Input() record: TaskRecord | null = null;
  /** Categories offered in create mode. */
  @Input() categories: TaskCategory[] = [];
  /** Preselected category for create mode. */
  @Input() categoryId = '';

  @Output() save = new EventEmitter<TaskEditResult>();
  @Output() archive = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('nameInput') nameInput?: ElementRef<HTMLTextAreaElement>;

  readonly lang = inject(LanguageService);

  readonly minInterval = MIN_INTERVAL_DAYS;
  readonly maxInterval = MAX_INTERVAL_DAYS;

  name = '';
  notes = '';
  interval: number | null = 7;
  owner: '' | TaskUserId = '';
  category = '';

  get isCreate(): boolean {
    return this.record === null;
  }

  /** Whether the "every X days" field applies to this task. */
  get intervalEditable(): boolean {
    return this.isCreate || isIntervalEditable(this.record!.def.recurrence);
  }

  ngOnInit(): void {
    if (this.record) {
      const def = this.record.def;
      this.name = def.nameDe;
      this.notes = def.notesDe ?? '';
      this.interval = currentIntervalDays(def.recurrence);
      this.owner = def.primaryOwner ?? '';
      this.category = def.category;
    } else {
      this.category = this.categoryId || this.categories[0]?.id || '';
    }
  }

  ngAfterViewInit(): void {
    this.nameInput?.nativeElement.focus();
  }

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  /** People selectable as responsible for the current category's task type. */
  ownerOptions(): { id: TaskUserId; name: string }[] {
    const type = this.record?.def.type ?? categoryById(this.category)?.type ?? 'general';
    return TASK_USERS.filter((u) => u.visibleTypes.includes(type)).map((u) => ({
      id: u.id,
      name: u.name,
    }));
  }

  get valid(): boolean {
    if (!this.name.trim()) return false;
    if (this.isCreate && !this.category) return false;
    if (this.intervalEditable && clampInterval(this.interval) === null) return false;
    return true;
  }

  submit(): void {
    if (!this.valid) return;
    const interval = this.intervalEditable ? clampInterval(this.interval) : null;
    this.save.emit({
      nameDe: this.name.trim(),
      notesDe: this.notes.trim() ? this.notes.trim() : null,
      ...(interval !== null ? { intervalDays: interval } : {}),
      primaryOwner: this.owner || null,
      ...(this.isCreate ? { category: this.category } : {}),
    });
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    this.cancel.emit();
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cancel.emit();
  }
}
