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
import { CompletionAction, TaskRecord } from '../../models';

export interface CompletionResult {
  action: CompletionAction;
  note?: string;
}

/**
 * Accessible confirmation dialog for completing a task. Check tasks can record
 * whether the item was fine ("checked, all ok") or needed corrective work.
 * Provides the confirm-before-completion step; the dashboard additionally shows
 * an undo snackbar afterwards.
 */
@Component({
  selector: 'app-task-completion-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './task-completion-dialog.component.html',
  styleUrls: ['./task-completion-dialog.component.scss'],
})
export class TaskCompletionDialogComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) record!: TaskRecord;
  @Input({ required: true }) userName!: string;

  @Output() confirm = new EventEmitter<CompletionResult>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('confirmBtn') confirmBtn?: ElementRef<HTMLButtonElement>;

  readonly lang = inject(LanguageService);

  action: CompletionAction = 'completed';
  note = '';

  ngAfterViewInit(): void {
    this.confirmBtn?.nativeElement.focus();
  }

  get isCheck(): boolean {
    const k = this.record.def.recurrence.kind;
    return k === 'checkInterval' || k === 'eventWithFollowUp';
  }

  ngOnInit(): void {
    this.action = this.isCheck ? 'checked-ok' : 'completed';
  }

  submit(): void {
    this.confirm.emit({ action: this.action, note: this.note.trim() || undefined });
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    this.cancel.emit();
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cancel.emit();
  }
}
