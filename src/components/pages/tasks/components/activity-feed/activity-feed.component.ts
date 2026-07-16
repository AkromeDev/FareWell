import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { LanguageService } from 'src/services/language.service';
import { ActivityEntry } from '../../models';
import { ACTION_LABELS } from '../../utils/task-labels';
import { categoryLabel } from '../../config/task-access.config';
import { formatDateTime, relativeTime } from '../../utils/date.util';

/**
 * Compact activity feed of recent completions and checks, filtered to the
 * current route's permissions and sorted newest first. Collapsible (compact by
 * default on mobile); updates whenever a task is completed from either view.
 */
@Component({
  selector: 'app-activity-feed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.scss'],
})
export class ActivityFeedComponent {
  @Input({ required: true }) entries: ActivityEntry[] = [];
  @Input({ required: true }) now!: Date;
  @Input() collapsed = true;

  @Output() toggle = new EventEmitter<void>();

  readonly lang = inject(LanguageService);

  actionText(entry: ActivityEntry): string {
    const a = ACTION_LABELS[entry.action];
    return this.lang.t(a.de, a.en);
  }

  categoryText(entry: ActivityEntry): string {
    return categoryLabel(entry.category, this.lang.lang());
  }

  relative(entry: ActivityEntry): string {
    return relativeTime(entry.at, this.now, this.lang.lang());
  }

  /** Note wrapped in the active language's quotation marks. */
  quotedNote(note: string): string {
    return this.lang.t(`„${note}“`, `“${note}”`);
  }

  exact(entry: ActivityEntry): string {
    return formatDateTime(entry.at, this.lang.lang());
  }
}
