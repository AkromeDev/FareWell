import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { SeparatorComponent } from 'src/components/atoms/separator/separator.component';
import { TitleComponent } from 'src/components/atoms/title/title.component';

export type StatsScrollColor = 'gold' | 'sage' | 'emerald' | 'violet' | 'sky' | 'mint';

export interface StatsScrollItem {
  /** Kurzer Kennwert im Kreis, z. B. "4,9 von 5". */
  value: string;
  /** Satz-Fortsetzung unter dem Kennwert. */
  caption: string;
  color: StatsScrollColor;
}

interface GridCell {
  row: number;
  col: number;
  opacity: number;
}

/** Anteil der Timeline, den ein einzelner Kreis belegt. */
const ITEM_DURATION = 0.9;
/** Versatz zwischen den Kreisen — 70 % Überlappung mit dem Vorgänger. */
const ITEM_STEP = ITEM_DURATION * 0.3;
/** Zeitkonstante der Scroll-Glättung: der Fortschritt läuft dem echten
 *  Scrollwert weich hinterher statt hart zu springen. 0.1/ln2 entspricht
 *  einem expo.out-Tween von 1s (GSAP scrub: 1). */
const SCRUB_TAU = 0.1 / Math.LN2;

/** Kantenlänge der Hover-Rasterzellen in CSS-Pixeln. */
const CELL_SIZE = 80;
/** Startdeckkraft einer aufleuchtenden Zelle (0–255). */
const CELL_MAX_OPACITY = 120;
/** Wahrscheinlichkeit, mit der eine Nachbarzelle mit aufleuchtet. */
const NEIGHBOR_PROBABILITY = 0.9;
/** Deckkraftverlust pro Sekunde (entspricht 1/Frame bei 60 fps). */
const FADE_PER_SECOND = 60;
/** Globale Abschwächung, damit die Linien dezent bleiben. */
const BASE_INTENSITY = 0.6;

/**
 * Gepinnte Statistik-Sektion: Während der Nutzer scrollt, bleibt die Sektion
 * am Viewport haften und die Kreise steigen nacheinander mit einer
 * Farbschweif-Spur von unten auf. Unter dem Mauszeiger (oder Finger) leuchtet
 * zusätzlich ein dezentes Gitterraster auf und verblasst wieder.
 *
 * SSR-safe: Auf dem Server, ohne JS und bei `prefers-reduced-motion` wird der
 * Endzustand als normaler, ungepinnter Block gerendert. Auf kleinen Screens
 * bleibt ebenfalls der statische Aufbau (die Kreise stapeln sich vertikal).
 */
@Component({
  selector: 'app-stats-scroll',
  standalone: true,
  imports: [CommonModule, TitleComponent, SeparatorComponent],
  templateUrl: './stats-scroll.component.html',
  styleUrls: ['./stats-scroll.component.scss'],
})
export class StatsScrollComponent implements AfterViewInit, OnDestroy {
  /** Optionaler Titel im FareWell-Stil; ohne Titel wird stattdessen der
   *  projizierte Inhalt (`[statsScrollHead]`) gerendert. */
  @Input() title = '';
  @Input() items: StatsScrollItem[] = [];
  /** 'light' = Ivory-Sektion (Salon), 'dark' = transparent auf dunklem Grund. */
  @Input() theme: 'light' | 'dark' = 'light';
  /** Farbverlauf des Hover-Rasters, gleichmäßig von links nach rechts verteilt. */
  @Input() gridColors: string[] = ['#b8924a', '#6e7e5a', '#3e5a47', '#b8924a'];

  @ViewChild('section') private sectionRef?: ElementRef<HTMLElement>;
  @ViewChild('sticky') private stickyRef?: ElementRef<HTMLElement>;
  @ViewChild('gridCanvas') private canvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChildren('circle') private circleRefs?: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('trail') private trailRefs?: QueryList<ElementRef<HTMLElement>>;

  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly cleanup: Array<() => void> = [];
  private circles: HTMLElement[] = [];
  private trails: HTMLElement[] = [];

  private rafId = 0;
  private running = false;
  private lastFrame = 0;

  /** Aktive Animationsachse: 'y' = Kreise steigen auf (breite Screens),
   *  'x' = Kreise kommen von links (schmale Screens), null = statisch. */
  private mode: 'x' | 'y' | null = null;
  private deltas: number[] = [];
  private trailSizes: number[] = [];
  private progress = 0;
  private appliedProgress = -1;

  private ctx: CanvasRenderingContext2D | null = null;
  private gradient: CanvasGradient | null = null;
  private canvasW = 0;
  private canvasH = 0;
  private gridRows = 0;
  private gridCols = 0;
  private readonly cells = new Map<string, GridCell>();
  private canvasDirty = false;
  private pointerInside = false;
  private pointerX = 0;
  private pointerY = 0;
  private activeRow = -2;
  private activeCol = -2;

  ngAfterViewInit(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.circles = (this.circleRefs?.toArray() ?? []).map((ref) => ref.nativeElement);
    this.trails = (this.trailRefs?.toArray() ?? []).map((ref) => ref.nativeElement);
    if (!this.sectionRef || !this.stickyRef || !this.circles.length) {
      return;
    }

    // Alles außerhalb von Angular: Scroll-/Pointer-Frames brauchen keine
    // Change Detection.
    this.zone.runOutsideAngular(() => this.init());
  }

  ngOnDestroy(): void {
    this.stopLoop();
    for (const fn of this.cleanup) {
      fn();
    }
    this.cleanup.length = 0;
  }

  /**
   * position: sticky pinnt nur, wenn kein Vorfahr einen Scroll-Kontext bildet.
   * overflow: clip erzeugt keinen, hidden/auto/scroll schon. In Browsern ohne
   * clip-Support fällt der Seiten-Wrapper auf hidden zurück – dann liefert
   * getComputedStyle hier 'hidden', und wir bleiben statisch. html/body werden
   * übersprungen, weil deren Overflow auf den Viewport übergeht.
   */
  private canPin(): boolean {
    const section = this.sectionRef!.nativeElement;
    const doc = section.ownerDocument;
    let node = section.parentElement;
    while (node && node !== doc.body && node !== doc.documentElement) {
      const style = getComputedStyle(node);
      if (
        !this.overflowAllowsSticky(style.overflowX) ||
        !this.overflowAllowsSticky(style.overflowY)
      ) {
        return false;
      }
      node = node.parentElement;
    }
    return true;
  }

  private overflowAllowsSticky(value: string): boolean {
    return value === 'visible' || value === 'clip';
  }

  private init(): void {
    this.setupCanvas();
    this.bindPointer();

    // Das Pinnen scheitert lautlos, wenn ein Vorfahr ein Scroll-Kontext ist
    // (z. B. overflow:hidden). Dann bleibt es beim statischen Layout, statt
    // eine 300vh-Sektion ohne Pin zu erzeugen (leeres Weiterscrollen).
    const canPin = this.canPin();

    // Der gepinnte Ablauf braucht Platz; zu niedrige Viewports behalten das
    // statische Layout (inkl. Hover-Raster). Die Mindesthöhen entsprechen dem
    // Platzbedarf von Kopf + Kreisen im jeweiligen Layout. Die 639.98px-Grenze
    // schließt die Bruchteil-Lücke zwischen den beiden CSS-Media-Queries.
    const wide = window.matchMedia('(min-width: 640px) and (min-height: 620px)');
    const narrow = window.matchMedia('(max-width: 639.98px) and (min-height: 660px)');
    const applyMode = () =>
      this.setMode(!canPin ? null : wide.matches ? 'y' : narrow.matches ? 'x' : null);
    applyMode();
    wide.addEventListener('change', applyMode);
    narrow.addEventListener('change', applyMode);
    this.cleanup.push(() => {
      wide.removeEventListener('change', applyMode);
      narrow.removeEventListener('change', applyMode);
    });

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[entries.length - 1]?.isIntersecting ?? false;
        if (visible) {
          this.startLoop();
        } else {
          this.stopLoop();
        }
      },
      { rootMargin: '160px 0px' }
    );
    io.observe(this.sectionRef!.nativeElement);
    this.cleanup.push(() => io.disconnect());

    const ro = new ResizeObserver(() => this.onResize());
    ro.observe(this.stickyRef!.nativeElement);
    this.cleanup.push(() => ro.disconnect());
  }

  private setMode(mode: 'x' | 'y' | null): void {
    if (this.mode === mode) {
      return;
    }
    this.mode = mode;
    this.sectionRef!.nativeElement.classList.toggle('is-animated', mode !== null);
    if (mode) {
      this.measure();
      this.progress = this.targetProgress();
      this.applyProgress(this.progress);
    } else {
      for (const el of [...this.circles, ...this.trails]) {
        el.style.transform = '';
        el.style.opacity = '';
      }
      this.appliedProgress = -1;
    }
  }

  /**
   * Startversatz pro Kreis: auf der y-Achse der Abstand von der Ruheposition
   * bis zur Unterkante der gesamten Sektion, auf der x-Achse bis knapp links
   * außerhalb des Viewports. Aus Layoutgrößen berechnet und dadurch
   * unabhängig davon, wo die Seite beim Messen gerade steht.
   */
  private measure(): void {
    const section = this.sectionRef!.nativeElement;
    const sticky = this.stickyRef!.nativeElement;
    for (const circle of this.circles) {
      circle.style.transform = '';
    }
    const stickyRect = sticky.getBoundingClientRect();
    if (this.mode === 'x') {
      this.deltas = this.circles.map(
        (circle) => -(circle.getBoundingClientRect().right - stickyRect.left)
      );
      this.trailSizes = this.trails.map((trail) => trail.offsetWidth);
    } else {
      const travel = Math.max(0, section.offsetHeight - sticky.offsetHeight);
      this.deltas = this.circles.map(
        (circle) => travel + (stickyRect.bottom - circle.getBoundingClientRect().bottom)
      );
      this.trailSizes = this.trails.map((trail) => trail.offsetHeight);
    }
    this.appliedProgress = -1;
  }

  private targetProgress(): number {
    const section = this.sectionRef!.nativeElement;
    const travel = section.offsetHeight - this.stickyRef!.nativeElement.offsetHeight;
    if (travel <= 0) {
      return 1;
    }
    const top = section.getBoundingClientRect().top;
    return Math.min(1, Math.max(0, -top / travel));
  }

  private startLoop(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    this.lastFrame = performance.now();
    const tick = (now: number) => {
      if (!this.running) {
        return;
      }
      const dt = Math.min(0.1, Math.max(0.001, (now - this.lastFrame) / 1000));
      this.lastFrame = now;
      this.stepScroll(dt);
      this.stepGrid(dt);
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private stopLoop(): void {
    if (!this.running) {
      return;
    }
    this.running = false;
    cancelAnimationFrame(this.rafId);
    // Beim Verlassen sofort auf den Zielwert setzen, damit beim Zurückscrollen
    // nichts mitten im Flug hängt.
    if (this.mode) {
      this.progress = this.targetProgress();
      this.applyProgress(this.progress);
    }
  }

  private stepScroll(dt: number): void {
    if (!this.mode) {
      return;
    }
    const target = this.targetProgress();
    const diff = target - this.progress;
    this.progress =
      Math.abs(diff) < 0.0005 ? target : this.progress + diff * (1 - Math.exp(-dt / SCRUB_TAU));
    this.applyProgress(this.progress);
  }

  private applyProgress(p: number): void {
    const axis = this.mode;
    if (!axis || p === this.appliedProgress) {
      return;
    }
    this.appliedProgress = p;
    const count = this.circles.length;
    const total = ITEM_DURATION + (count - 1) * ITEM_STEP;
    for (let i = 0; i < count; i++) {
      const local = Math.min(1, Math.max(0, (p * total - i * ITEM_STEP) / ITEM_DURATION));
      // power3.out: GSAPs power-Namen sind um 1 versetzt (power3 = Quart).
      const eased = 1 - Math.pow(1 - local, 4);
      const shift = (this.deltas[i] ?? 0) * (1 - eased);
      const circle = this.circles[i];
      circle.style.opacity = eased.toFixed(4);
      circle.style.transform =
        axis === 'y'
          ? `translate3d(0, ${shift.toFixed(2)}px, 0)`
          : `translate3d(${shift.toFixed(2)}px, 0, 0)`;
      const trail = this.trails[i];
      if (trail) {
        // Der Schweif bleibt an der Kugel: Seine sichtbare Kante folgt exakt
        // ihrer aktuellen Position, statt unabhängig vorzuwachsen.
        const size = this.trailSizes[i] || 1;
        const scale = Math.min(1, Math.max(0, 1 - Math.abs(shift) / size));
        trail.style.opacity = (0.31 * eased).toFixed(4);
        trail.style.transform =
          axis === 'y' ? `scaleY(${scale.toFixed(4)})` : `scaleX(${scale.toFixed(4)})`;
      }
    }
  }

  private setupCanvas(): void {
    this.ctx = this.canvasRef?.nativeElement.getContext('2d') ?? null;
    this.resizeCanvas();
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    const ctx = this.ctx;
    if (!canvas || !ctx) {
      return;
    }
    const sticky = this.stickyRef!.nativeElement;
    const width = sticky.clientWidth;
    const height = sticky.clientHeight;
    if (!width || !height) {
      return;
    }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 1;
    this.canvasW = width;
    this.canvasH = height;
    this.gridRows = Math.ceil(height / CELL_SIZE);
    this.gridCols = Math.ceil(width / CELL_SIZE);
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    const colors = this.gridColors.length ? this.gridColors : ['#b8924a'];
    const stops = colors.length > 1 ? colors : [colors[0], colors[0]];
    stops.forEach((color, i) => gradient.addColorStop(i / (stops.length - 1), color));
    this.gradient = gradient;
  }

  private stepGrid(dt: number): void {
    const ctx = this.ctx;
    if (!ctx) {
      return;
    }
    if (this.pointerInside) {
      const row = Math.floor(this.pointerY / CELL_SIZE);
      const col = Math.floor(this.pointerX / CELL_SIZE);
      if (row !== this.activeRow || col !== this.activeCol) {
        this.activeRow = row;
        this.activeCol = col;
        this.lightCell(row, col);
        for (let dRow = -1; dRow <= 1; dRow++) {
          for (let dCol = -1; dCol <= 1; dCol++) {
            if ((dRow || dCol) && Math.random() < NEIGHBOR_PROBABILITY) {
              this.lightCell(row + dRow, col + dCol);
            }
          }
        }
      }
    }

    if (!this.cells.size) {
      if (this.canvasDirty) {
        ctx.clearRect(0, 0, this.canvasW, this.canvasH);
        this.canvasDirty = false;
      }
      return;
    }

    ctx.clearRect(0, 0, this.canvasW, this.canvasH);
    this.canvasDirty = true;
    ctx.strokeStyle = this.gradient ?? this.gridColors[0] ?? '#b8924a';
    const fade = FADE_PER_SECOND * dt;
    for (const [key, cell] of this.cells) {
      cell.opacity -= fade;
      if (cell.opacity <= 0) {
        this.cells.delete(key);
        continue;
      }
      ctx.globalAlpha = (cell.opacity / 255) * BASE_INTENSITY;
      ctx.strokeRect(cell.col * CELL_SIZE + 0.5, cell.row * CELL_SIZE + 0.5, CELL_SIZE, CELL_SIZE);
    }
    ctx.globalAlpha = 1;
  }

  private lightCell(row: number, col: number): void {
    if (row < 0 || col < 0 || row >= this.gridRows || col >= this.gridCols) {
      return;
    }
    const key = `${row}:${col}`;
    const cell = this.cells.get(key);
    if (cell) {
      cell.opacity = Math.max(cell.opacity, CELL_MAX_OPACITY);
    } else {
      this.cells.set(key, { row, col, opacity: CELL_MAX_OPACITY });
    }
  }

  private bindPointer(): void {
    const sticky = this.stickyRef!.nativeElement;
    const track = (clientX: number, clientY: number) => {
      const rect = sticky.getBoundingClientRect();
      this.pointerX = Math.min(rect.width, Math.max(0, clientX - rect.left));
      this.pointerY = Math.min(rect.height, Math.max(0, clientY - rect.top));
      this.pointerInside = true;
    };
    const reset = () => {
      this.pointerInside = false;
      this.activeRow = -2;
      this.activeCol = -2;
    };
    const onMouseMove = (event: MouseEvent) => track(event.clientX, event.clientY);
    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        track(touch.clientX, touch.clientY);
      }
    };
    sticky.addEventListener('mousemove', onMouseMove, { passive: true });
    sticky.addEventListener('mouseleave', reset, { passive: true });
    sticky.addEventListener('touchstart', onTouch, { passive: true });
    sticky.addEventListener('touchmove', onTouch, { passive: true });
    sticky.addEventListener('touchend', reset, { passive: true });
    this.cleanup.push(() => {
      sticky.removeEventListener('mousemove', onMouseMove);
      sticky.removeEventListener('mouseleave', reset);
      sticky.removeEventListener('touchstart', onTouch);
      sticky.removeEventListener('touchmove', onTouch);
      sticky.removeEventListener('touchend', reset);
    });
  }

  private onResize(): void {
    this.resizeCanvas();
    if (this.mode) {
      // Nur neu vermessen und mit dem AKTUELLEN Fortschritt neu anwenden. Kein
      // Snap auf den Zielwert: 100dvh-Änderungen (mobile URL-Leiste) feuern den
      // ResizeObserver mitten im Tween – ein Snap würde die Glättung überspringen.
      this.measure();
      this.applyProgress(this.progress);
    }
  }
}
