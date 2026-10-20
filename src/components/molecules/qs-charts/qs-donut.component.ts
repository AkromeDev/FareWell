import { Component, computed, input } from '@angular/core';
import { ChartPart, TONE_FILL } from './tones';

const R = 62;
const C = 2 * Math.PI * R;

/**
 * Ein Ring, der einen Betrag aufteilt (wer bekommt wie viel), mit der
 * größten Zahl in der Mitte und einer Legende darunter. Die Legende trägt
 * dieselben Zahlen als Text; das SVG selbst ist für Screenreader verborgen.
 */
@Component({
  selector: 'app-qs-donut',
  template: `
    <figure class="donut">
      <div class="ring">
        <svg viewBox="0 0 160 160" aria-hidden="true" focusable="false">
          <circle cx="80" cy="80" [attr.r]="r" fill="none" stroke="#EFE7D8" stroke-width="22" />
          @for (seg of segments(); track $index) {
            <circle
              cx="80"
              cy="80"
              [attr.r]="r"
              fill="none"
              [attr.stroke]="seg.color"
              stroke-width="22"
              [attr.stroke-dasharray]="seg.dash"
              [attr.stroke-dashoffset]="seg.offset"
              transform="rotate(-90 80 80)"
            />
          }
        </svg>
        <div class="center">
          <span class="center-value">{{ centerValue() }}</span>
          <span class="center-label">{{ centerLabel() }}</span>
        </div>
      </div>
      <figcaption>
        <span class="title">{{ title() }}</span>
        @if (caption()) {
          <span class="caption">{{ caption() }}</span>
        }
        <ul class="legend">
          @for (part of parts(); track $index) {
            <li>
              <span class="swatch" [style.background]="fill(part)"></span>
              <span class="legend-label">{{ part.label }}</span>
              <strong class="legend-value">{{ part.display }}</strong>
            </li>
          }
        </ul>
      </figcaption>
    </figure>
  `,
  styleUrl: './qs-charts.scss',
})
export class QsDonutComponent {
  readonly title = input.required<string>();
  readonly caption = input('');
  readonly parts = input.required<ChartPart[]>();
  /** Welcher Teil groß in der Mitte steht; Vorgabe der erste. */
  readonly focus = input(0);

  protected readonly r = R;

  protected readonly segments = computed(() => {
    const parts = this.parts();
    const total = parts.reduce((sum, p) => sum + p.value, 0) || 1;
    let start = 0;
    return parts.map((p) => {
      const length = (p.value / total) * C;
      // Eine hauchdünne Fuge zwischen zwei Teilen, nicht bei einem vollen Ring.
      const gap = parts.length > 1 && p.value < total ? 1.5 : 0;
      const seg = { color: TONE_FILL[p.tone], dash: `${Math.max(length - gap, 0)} ${C}`, offset: -start };
      start += length;
      return seg;
    });
  });

  protected readonly centerValue = computed(() => this.parts()[this.focus()]?.display ?? '');
  protected readonly centerLabel = computed(() => this.parts()[this.focus()]?.label ?? '');

  protected fill(part: ChartPart): string {
    return TONE_FILL[part.tone];
  }
}
