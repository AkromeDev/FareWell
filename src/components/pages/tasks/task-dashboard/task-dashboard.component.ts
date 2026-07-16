import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/services/language.service';
import { SeoService } from 'src/services/seo.service';
import { FarewellToggleComponent, FarewellToggleOption } from 'src/components/atoms/farewell-toggle/farewell-toggle.component';
import { TaskRecord, TaskUser, TaskViewMode } from '../models';
import { TaskService } from '../services/task.service';
import { UserContextService } from '../services/user-context.service';
import { ActivityService } from '../services/activity.service';
import { TaskListViewComponent } from '../components/task-list-view/task-list-view.component';
import { TaskCalendarViewComponent } from '../components/task-calendar-view/task-calendar-view.component';
import { ActivityFeedComponent } from '../components/activity-feed/activity-feed.component';
import {
  CompletionResult,
  TaskCompletionDialogComponent,
} from '../components/task-completion-dialog/task-completion-dialog.component';

/**
 * The single, configurable task dashboard behind all four routes
 * (/tasks/:user and /massage-tasks/:user). The active route determines the
 * user, and the access configuration determines visibility, permissions,
 * activity filtering and the massage-room schedule. Provides the list/calendar
 * toggle, the activity feed, completion + undo, and cross-tab sync — all driven
 * by the shared TaskService state.
 */
@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FarewellToggleComponent,
    TaskListViewComponent,
    TaskCalendarViewComponent,
    ActivityFeedComponent,
    TaskCompletionDialogComponent,
  ],
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./task-dashboard.component.scss'],
})
export class TaskDashboardComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  private readonly userCtx = inject(UserContextService);
  private readonly activityService = inject(ActivityService);
  private readonly seo = inject(SeoService);
  readonly lang = inject(LanguageService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly userSig = signal<TaskUser | null>(null);
  private readonly resolved = signal(false);
  private paramSub?: Subscription;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  readonly user = this.userSig.asReadonly();
  readonly now = this.taskService.now;
  readonly isPersistent = this.taskService.isPersistent;

  readonly records = computed<TaskRecord[]>(() => {
    const u = this.userSig();
    return u ? this.taskService.visibleRecords(u) : [];
  });

  readonly categories = computed(() => {
    const u = this.userSig();
    return u ? this.userCtx.visibleCategories(u) : [];
  });

  readonly viewMode = computed<TaskViewMode>(() => {
    const u = this.userSig();
    return u ? this.taskService.prefs(u.id).viewMode : 'list';
  });

  readonly collapsed = computed<Record<string, boolean>>(() => {
    const u = this.userSig();
    return u ? this.taskService.prefs(u.id).collapsedCategories : {};
  });

  readonly activityCollapsed = computed<boolean>(() => {
    const u = this.userSig();
    return u ? this.taskService.prefs(u.id).activityCollapsed : true;
  });

  readonly activity = computed(() => {
    const u = this.userSig();
    return u ? this.activityService.entriesForUser(this.records(), u) : [];
  });

  readonly dialogRecord = signal<TaskRecord | null>(null);
  readonly toast = signal<{ message: string; undoable: boolean } | null>(null);
  readonly announcement = signal<string>('');

  constructor() {
    // Keep the (private, noindex) page title in sync with user + language.
    effect(() => {
      const u = this.userSig();
      this.lang.lang(); // track language changes
      if (!u) return;
      const title = this.lang.t(
        `Aufgaben – ${u.name} | FareWell`,
        `Tasks – ${u.name} | FareWell`,
      );
      this.seo.setPageSeo({
        title,
        description: this.lang.t(
          'Interner Aufgaben- und Reinigungsplan für das FareWell-Team.',
          'Internal task and cleaning plan for the FareWell team.',
        ),
        path: this.currentPath(),
        noindex: true,
        alternates: false,
      });
    });
  }

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe((params) => {
      const segment = params.get('user');
      this.userSig.set(this.userCtx.resolve(segment));
      this.resolved.set(true);
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  isUnknownUser(): boolean {
    return this.resolved() && this.userSig() === null;
  }

  subtitle(u: TaskUser): string {
    if (u.overview) {
      return this.t('Gesamtübersicht – alle Bereiche', 'Full overview – all areas');
    }
    return u.visibleTypes.includes('massage')
      ? this.t('Massage-Aufgaben', 'Massage tasks')
      : this.t('Allgemeine Aufgaben', 'General tasks');
  }

  viewOptions(): FarewellToggleOption[] {
    return [
      { label: this.t('Liste', 'List'), value: 'list' },
      { label: this.t('Kalender', 'Calendar'), value: 'calendar' },
    ];
  }

  onViewChange(value: string, u: TaskUser): void {
    this.taskService.setViewMode(u.id, value === 'calendar' ? 'calendar' : 'list');
  }

  onToggleCategory(categoryId: string, u: TaskUser): void {
    this.taskService.toggleCategory(u.id, categoryId);
  }

  onToggleActivity(u: TaskUser): void {
    this.taskService.setActivityCollapsed(u.id, !this.activityCollapsed());
  }

  onRequestComplete(record: TaskRecord): void {
    this.dialogRecord.set(record);
  }

  onRequestTrigger(record: TaskRecord, u: TaskUser): void {
    this.taskService.triggerEvent(record.def.id, u);
    this.setAnnounce(
      this.t(`Ereignis eingetragen: ${record.def.name}`, `Event logged: ${record.def.name}`),
    );
  }

  onDialogConfirm(result: CompletionResult, u: TaskUser): void {
    const record = this.dialogRecord();
    if (record) {
      this.taskService.complete(record.def.id, u, result.action, result.note);
      const msg = this.t(`„${record.def.name}" erledigt`, `"${record.def.name}" completed`);
      this.showToast(msg, true);
      this.setAnnounce(msg);
    }
    this.dialogRecord.set(null);
  }

  onDialogCancel(): void {
    this.dialogRecord.set(null);
  }

  onUndo(): void {
    const undone = this.taskService.undoLast();
    if (undone) {
      this.setAnnounce(this.t(`Rückgängig: ${undone.taskName}`, `Undone: ${undone.taskName}`));
    }
    this.clearToast();
  }

  private showToast(message: string, undoable: boolean): void {
    this.toast.set({ message, undoable });
    if (this.toastTimer) clearTimeout(this.toastTimer);
    if (this.isBrowser) {
      this.toastTimer = setTimeout(() => this.toast.set(null), 7000);
    }
  }

  private clearToast(): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast.set(null);
  }

  private setAnnounce(message: string): void {
    // Reset first so identical consecutive messages are re-announced.
    this.announcement.set('');
    this.announcement.set(message);
  }

  private currentPath(): string {
    const u = this.userSig();
    if (!u) return '/tasks';
    return `/${u.routeArea}/${u.routeSegment}`;
  }
}
