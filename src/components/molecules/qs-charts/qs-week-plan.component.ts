import { Component, computed, input } from '@angular/core';
import { ChartTone, TONE_FILL } from './tones';

export interface WeekLegend {
  key: string;
  label: string;
  tone: ChartTone;
}

export interface WeekDay {
  day: string;
  parts: { key: string; min: number }[];
}

/**
 * Eine Woche als sieben Balken zu je einer Stunde, jeder Balken nach
 * Tätigkeit geteilt. Die Minuten stehen als Text in jedem Teil, der breit
 * genug ist, und vollständig in der Tabelle für Screenreader.
 */
@Component({
  selector: 'app-qs-week-plan',
  template: `
    <figure class="week">
      <ul class="legend legend--row">
        @for (item of legend(); track item.key) {
          <li>
            <span class="swatch" [style.background]="fill(item.tone)"></span>
            <span class="legend-label">{{ item.label }}</span>
          </li>
        }
      </ul>
      <div class="week-rows" aria-hidden="true">
        @for (row of rows(); track $index) {
          <div class="week-row">
            <span class="week-day">{{ row.day }}</span>
            <span class="week-bar">
              @for (seg of row.segs; track $index) {
                <span class="week-seg" [style.flex-grow]="seg.min" [style.background]="seg.color" [class.dark]="seg.dark">
                  @if (seg.min >= 15) {
                    {{ seg.min }}
                  }
                </span>
              }
            </span>
            <span class="week-sum">{{ row.total }}&nbsp;{{ unit() }}</span>
          </div>
        }
      </div>
      <div class="sr-only">
        <table>
          <caption>{{ caption() }}</caption>
          <tbody>
            @for (row of rows(); track $index) {
              <tr>
                <th scope="row">{{ row.day }}</th>
                <td>{{ row.text }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </figure>
  `,
  styleUrl: './qs-charts.scss',
})
export class QsWeekPlanComponent {
  readonly caption = input.required<string>();
  readonly unit = input('Min.');
  readonly legend = input.required<WeekLegend[]>();
  readonly days = input.required<WeekDay[]>();

  protected readonly rows = computed(() => {
    const byKey = new Map(this.legend().map((l) => [l.key, l]));
    return this.days().map((d) => ({
      day: d.day,
      total: d.parts.reduce((sum, p) => sum + p.min, 0),
      text: d.parts.map((p) => `${p.min} ${this.unit()} ${byKey.get(p.key)?.label ?? p.key}`).join(', '),
      segs: d.parts.map((p) => {
        const tone = byKey.get(p.key)?.tone ?? 'muted';
        return { min: p.min, color: TONE_FILL[tone], dark: tone === 'muted' || tone === 'sage' || tone === 'gold' };
      }),
    }));
  });

  protected fill(tone: ChartTone): string {
    return TONE_FILL[tone];
  }
}
