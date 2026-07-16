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
import { TaskDefinition, TaskRecord, TaskState, TaskUser, TaskViewMode } from '../models';
import { TaskService } from '../services/task.service';
import { UserContextService } from '../services/user-context.service';
import { ActivityService } from '../services/activity.service';
import { SupabaseSessionService } from '../services/supabase-session.service';
import { TaskAuthGateComponent } from '../components/task-auth-gate/task-auth-gate.component';
import {
  TaskEditDialogComponent,
  TaskEditResult,
} from '../components/task-edit-dialog/task-edit-dialog.component';
import { TaskListViewComponent } from '../components/task-list-view/task-list-view.component';
import { TaskCalendarViewComponent } from '../components/task-calendar-view/task-calendar-view.component';
import { ActivityFeedComponent } from '../components/activity-feed/activity-feed.component';
import {
  CompletionResult,
  TaskCompletionDialogComponent,
} from '../components/task-completion-dialog/task-completion-dialog.component';
import { sameLocalDay } from '../utils/date.util';

/** Quick status filter applied to the list view (session-only, not persisted). */
export type TaskStatusFilter = 'all' | 'today' | 'overdue' | 'done';

/** States counting as "due today" for the header stats and the quick filter. */
const TODAY_STATES: ReadonlySet<TaskState> = new Set(['dueToday', 'checkDue', 'eventActionable']);

/**
 * The single, configurable task dashboard behind all four routes
 * (/tasks/:user and /massage-tasks/:user). The active route determines the
 * user, and the access configuration determines visibility, permissions,
 * activity filtering and the massage-room schedule. Provides the list/calendar
 * toggle, header stats with quick filters, the activity feed, completion +
 * undo, and cross-tab sync — all driven by the shared TaskService state.
 */
@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TaskAuthGateComponent,
    TaskEditDialogComponent,
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
  private readonly session = inject(SupabaseSessionService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly userSig = signal<TaskUser | null>(null);
  private readonly resolved = signal(false);
  private paramSub?: Subscription;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private celebrateTimer: ReturnType<typeof setTimeout> | null = null;

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

  /** Session-only quick filter for the list view. */
  readonly filter = signal<TaskStatusFilter>('all');

  /**
   * True while shared (Supabase) persistence needs the passphrase, or while
   * the first post-sign-in sync is still reconciling — the dashboard then
   * shows the unlock gate instead of any task data, so no mutation can race
   * the initial hydration.
   */
  readonly locked = computed(() => {
    const s = this.session.status();
    if (s === 'initializing' || s === 'signed-out') return true;
    return s === 'signed-in' && !this.session.firstSyncDone();
  });

  /** Whether cross-device sync is live (drives the aside hint copy). */
  readonly syncActive = computed(() => this.session.status() === 'signed-in');

  /** Header stats: what needs doing today and what the team already did. */
  readonly stats = computed(() => {
    const recs = this.records();
    const now = this.now();
    const overdue = recs.filter((r) => r.computed.state === 'overdue').length;
    const today = recs.filter((r) => TODAY_STATES.has(r.computed.state)).length;
    const done = recs.filter((r) => this.completedToday(r, now)).length;
    const denominator = overdue + today + done;
    return {
      overdue,
      today,
      done,
      /** 0..1 share of today's workload already completed, null when idle. */
      progress: denominator > 0 ? done / denominator : null,
    };
  });

  /** Records after the quick filter, feeding the list view. */
  readonly filteredRecords = computed<TaskRecord[]>(() => {
    const recs = this.records();
    const f = this.filter();
    const now = this.now();
    switch (f) {
      case 'today':
        return recs.filter((r) => TODAY_STATES.has(r.computed.state));
      case 'overdue':
        return recs.filter((r) => r.computed.state === 'overdue');
      case 'done':
        return recs.filter((r) => this.completedToday(r, now));
      default:
        return recs;
    }
  });

  /** Edit mode (Mojo only): pencils on cards, add buttons, archived list. */
  readonly editMode = signal(false);
  /** The open edit/create dialog, or null. */
  readonly editDialog = signal<
    { kind: 'edit'; record: TaskRecord } | { kind: 'create'; categoryId: string } | null
  >(null);
  /** User-archived tasks offered for restoring (edit mode). */
  readonly archivedTasks = computed<TaskDefinition[]>(() => {
    const u = this.userSig();
    return u?.canEditTasks ? this.taskService.userArchivedDefinitions(u) : [];
  });

  readonly dialogRecord = signal<TaskRecord | null>(null);
  readonly toast = signal<{ message: string; undoable: boolean } | null>(null);
  readonly announcement = signal<string>('');
  /** Briefly true after a completion, drives the confetti burst. */
  readonly celebrate = signal(false);

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
    if (this.celebrateTimer) clearTimeout(this.celebrateTimer);
  }

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  isUnknownUser(): boolean {
    return this.resolved() && this.userSig() === null;
  }

  /** Time-of-day greeting, e.g. "Guten Morgen, Nicolita". */
  greeting(): string {
    const hour = this.now().getHours();
    if (hour < 11) return this.t('Guten Morgen', 'Good morning');
    if (hour < 18) return this.t('Hallo', 'Hello');
    return this.t('Guten Abend', 'Good evening');
  }

  initial(u: TaskUser): string {
    return u.name.charAt(0).toUpperCase();
  }

  subtitle(u: TaskUser): string {
    if (u.overview) {
      return this.t('Gesamtübersicht über alle Bereiche', 'Full overview of all areas');
    }
    return u.visibleTypes.includes('massage')
      ? this.t('Massage-Aufgaben', 'Massage tasks')
      : this.t('Allgemeine Aufgaben', 'General tasks');
  }

  progressPercent(): number {
    const p = this.stats().progress;
    return p === null ? 0 : Math.round(p * 100);
  }

  /** Spoken value for the progressbar; matches the visible "Alles ruhig". */
  progressValueText(): string {
    return this.stats().progress === null
      ? this.t('Alles ruhig, nichts fällig', 'All quiet, nothing due')
      : `${this.progressPercent()} %`;
  }

  /**
   * Toggle a quick filter from the header stats. Selecting a stat while the
   * calendar is open switches back to the list, where the filter applies.
   */
  onStatFilter(f: TaskStatusFilter, u: TaskUser): void {
    this.filter.set(this.filter() === f ? 'all' : f);
    if (this.filter() !== 'all' && this.viewMode() !== 'list') {
      this.taskService.setViewMode(u.id, 'list');
    }
  }

  resetFilter(): void {
    this.filter.set('all');
  }

  onViewChange(value: TaskViewMode, u: TaskUser): void {
    // The quick filter only applies to the list; drop it when leaving so a
    // stat never claims an active filter the calendar ignores.
    if (value === 'calendar') this.filter.set('all');
    this.taskService.setViewMode(u.id, value);
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

  // ---- plan editing (Mojo only) --------------------------------------------

  toggleEditMode(u: TaskUser): void {
    if (!u.canEditTasks) return;
    this.editMode.set(!this.editMode());
    if (!this.editMode()) this.editDialog.set(null);
  }

  onRequestEdit(record: TaskRecord): void {
    this.editDialog.set({ kind: 'edit', record });
  }

  onRequestAdd(categoryId: string): void {
    this.editDialog.set({ kind: 'create', categoryId });
  }

  onEditSave(result: TaskEditResult, u: TaskUser): void {
    const dlg = this.editDialog();
    if (!dlg) return;
    if (dlg.kind === 'edit') {
      const ok = this.taskService.updateTaskDefinition(dlg.record.def.id, u, {
        nameDe: result.nameDe,
        notesDe: result.notesDe,
        intervalDays: result.intervalDays,
        primaryOwner: result.primaryOwner,
      });
      if (ok) {
        const msg = this.t('Aufgabe aktualisiert', 'Task updated');
        this.showToast(msg, false);
        this.setAnnounce(msg);
      }
    } else if (result.category) {
      const id = this.taskService.addCustomTask(u, {
        nameDe: result.nameDe,
        notesDe: result.notesDe ?? undefined,
        category: result.category,
        intervalDays: result.intervalDays ?? 7,
        primaryOwner: result.primaryOwner ?? undefined,
      });
      if (id) {
        const msg = this.t(`„${result.nameDe}“ hinzugefügt`, `“${result.nameDe}” added`);
        this.showToast(msg, false);
        this.setAnnounce(msg);
      }
    }
    this.editDialog.set(null);
  }

  onEditArchive(u: TaskUser): void {
    const dlg = this.editDialog();
    if (!dlg || dlg.kind !== 'edit') return;
    if (this.taskService.setTaskArchived(dlg.record.def.id, u, true)) {
      const msg = this.t(
        `„${dlg.record.def.nameDe}“ archiviert (Verlauf bleibt erhalten)`,
        `“${dlg.record.def.nameEn}” archived (history kept)`,
      );
      this.showToast(msg, false);
      this.setAnnounce(msg);
    }
    this.editDialog.set(null);
  }

  onRestore(def: TaskDefinition, u: TaskUser): void {
    if (this.taskService.setTaskArchived(def.id, u, false)) {
      this.setAnnounce(this.t(`Wiederhergestellt: ${def.nameDe}`, `Restored: ${def.nameEn}`));
    }
  }

  onEditCancel(): void {
    this.editDialog.set(null);
  }

  onRequestTrigger(record: TaskRecord, u: TaskUser): void {
    this.taskService.triggerEvent(record.def.id, u);
    this.setAnnounce(
      this.t(`Ereignis eingetragen: ${record.def.nameDe}`, `Event logged: ${record.def.nameEn}`),
    );
  }

  onDialogConfirm(result: CompletionResult, u: TaskUser): void {
    const record = this.dialogRecord();
    if (record) {
      this.taskService.complete(record.def.id, u, result.action, result.note);
      const msg = this.t(
        `„${record.def.nameDe}“ erledigt`,
        `“${record.def.nameEn}” completed`,
      );
      this.showToast(msg, true);
      this.setAnnounce(msg);
      this.startCelebration();
    }
    this.dialogRecord.set(null);
  }

  onDialogCancel(): void {
    this.dialogRecord.set(null);
  }

  onUndo(): void {
    const undone = this.taskService.undoLast();
    if (undone) {
      this.setAnnounce(
        this.t(`Rückgängig: ${undone.taskNameDe}`, `Undone: ${undone.taskNameEn}`),
      );
    }
    this.clearToast();
  }

  private completedToday(r: TaskRecord, now: Date): boolean {
    const iso = r.state.lastCompletedAt;
    return iso !== null && sameLocalDay(new Date(iso), now);
  }

  private startCelebration(): void {
    if (!this.isBrowser) return;
    // Restart cleanly so back-to-back completions burst again.
    this.celebrate.set(false);
    if (this.celebrateTimer) clearTimeout(this.celebrateTimer);
    requestAnimationFrame(() => this.celebrate.set(true));
    this.celebrateTimer = setTimeout(() => this.celebrate.set(false), 1400);
  }

  private showToast(message: string, undoable: boolean): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    if (!this.isBrowser) {
      this.toast.set({ message, undoable });
      return;
    }
    // Clear first so back-to-back toasts recreate the view — the entrance,
    // check-draw and countdown animations run once per DOM insertion and must
    // restart alongside the fresh 7s dismiss timer.
    this.toast.set(null);
    requestAnimationFrame(() => this.toast.set({ message, undoable }));
    this.toastTimer = setTimeout(() => this.toast.set(null), 7000);
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
