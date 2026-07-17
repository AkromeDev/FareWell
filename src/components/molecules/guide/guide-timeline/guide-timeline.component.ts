import { Component, Input } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

export interface GuideTimelineEvent {
  year: string;
  text: string;
}

/**
 * Vertikaler Zeitstrahl im Guide-Look: Jahr (Fraunces) plus Ereignistext,
 * verbunden durch eine Linie mit Punkten. Für Historie-/Meilenstein-Abschnitte.
 *
 *   <app-guide-timeline [events]="timelineEvents" />
 */
@Component({
  selector: 'app-guide-timeline',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    <ol class="gd-timeline" appReveal>
      @for (event of events; track event.year) {
        <li class="gd-timeline__item">
          <span class="gd-timeline__year">{{ event.year }}</span>
          <span class="gd-timeline__text">{{ event.text }}</span>
        </li>
      }
    </ol>
  `,
})
export class GuideTimelineComponent {
  @Input({ required: true }) events: GuideTimelineEvent[] = [];
}
