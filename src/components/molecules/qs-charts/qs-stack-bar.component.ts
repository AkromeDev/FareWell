import { Component, computed, input } from '@angular/core';
import { ChartPart, TONE_FILL } from './tones';

/**
 * Ein Preis als liegender Balken, geteilt nach Empfänger (Groupon, du,
 * FareWell). Breiten nach Betrag, Beträge als Text daneben.
 */
@Component({
  selector: 'app-qs-stack-bar',
  template: `
    <figure class="stack">
      <figcaption class="stack-head">
        <span class="title">{{ title() }}</span>
        <strong class="stack-total">{{ total() }}</strong>
      </figcaption>
      <div class="stack-bar" aria-hidden="true">
        @for (seg of segments(); track $index) {
          <span class="stack-seg" [style.flex-grow]="seg.value" [style.background]="seg.color"></span>
        }
      </div>
      <ul class="legend legend--row">
        @for (part of parts(); track $index) {
          <li>
            <span class="swatch" [style.background]="fill(part)"></span>
            <span class="legend-label">{{ part.label }}</span>
            <strong class="legend-value">{{ part.display }}</strong>
          </li>
        }
      </ul>
      @if (note()) {
        <p class="stack-note">{{ note() }}</p>
      }
    </figure>
  `,
  styleUrl: './qs-charts.scss',
})
export class QsStackBarComponent {
  readonly title = input.required<string>();
  readonly total = input.required<string>();
  readonly parts = input.required<ChartPart[]>();
  readonly note = input('');

  protected readonly segments = computed(() =>
    this.parts().map((p) => ({ value: Math.max(p.value, 0), color: TONE_FILL[p.tone] })),
  );

  protected fill(part: ChartPart): string {
    return TONE_FILL[part.tone];
  }
}
