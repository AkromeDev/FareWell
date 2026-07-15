import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface GuideStat {
  /** Anzeigewert, z. B. '70%', '3' oder 'gratis'. Führende Zahlen zählen hoch. */
  value: string;
  label: string;
  /** false unterdrückt das Hochzählen (z. B. bei Bereichen wie '1–7%'). */
  animate?: boolean;
}

/**
 * Kennzahlen-Leiste, die den unteren Rand des Heros überlappt.
 * Numerische Werte zählen beim Einscrollen hoch (nur im Browser; beim
 * Prerendern und für reduced-motion steht sofort der Endwert da).
 */
@Component({
  selector: 'app-guide-stats',
  standalone: true,
  template: `
    <div class="gd-stats" [style.--gd-stats-cols]="stats.length">
      <div class="gd-stats__in">
        @for (stat of stats; track stat.label) {
          <div class="gd-stat">
            <div
              class="gd-stat__n"
              [class.gd-stat__n--text]="!isNumeric(stat.value)"
              [attr.data-value]="stat.animate === false ? null : stat.value"
            >
              {{ stat.value }}
            </div>
            <div class="gd-stat__l">{{ stat.label }}</div>
          </div>
        }
      </div>
    </div>
  `,
})
export class GuideStatsComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) stats: GuideStat[] = [];

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private observer?: IntersectionObserver;

  isNumeric(value: string): boolean {
    return /^\d/.test(value);
  }

  ngAfterViewInit(): void {
    if (
      !this.isBrowser ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.observer?.disconnect();
            this.countUp();
          }
        },
        { threshold: 0.5 }
      );
      this.observer.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private countUp(): void {
    const nodes = this.el.nativeElement.querySelectorAll<HTMLElement>('.gd-stat__n[data-value]');

    nodes.forEach((node) => {
      const raw = node.dataset['value'] ?? '';
      const match = /^(\d+)(.*)$/.exec(raw);
      if (!match) {
        return;
      }

      const target = Number(match[1]);
      const suffix = match[2];
      const duration = 1100;
      let start: number | null = null;

      const step = (timestamp: number): void => {
        start ??= timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = `${Math.round(eased * target)}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    });
  }
}
