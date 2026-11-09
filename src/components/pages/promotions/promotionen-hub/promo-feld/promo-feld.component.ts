import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from 'src/services/language.service';
import { PromoExperimentService } from '../../promo-experiment.service';
import { Bi } from '../../promotion-page.model';
import { BOOKING_URL, OfferId, PROMO_CODE, PROMO_OFFERS } from '../../promotion-offers';

/** Anteil gemähter Haare, ab dem der Code erscheint, und ab dem der Rest von selbst geht. */
const REVEAL_AT = 0.22;
const FINISH_AT = 0.5;
const TAU = Math.PI * 2;

interface Spark { x: number; y: number; vx: number; vy: number; l: number }
interface Fly {
  x: number; y: number; vx: number; vy: number;
  ph: number; wob: number; blink: number; age: number; life: number; s: number; k: number;
}
interface Group { c: string; w: number; ids: number[] }

/**
 * Variante A des A/B-Tests: „Das Feld". Ein Feld aus goldenen Haaren; der
 * Mauszeiger (am Telefon der Finger) ist ein Laserkopf mit vier Ringen, einer
 * je Wellenlänge. Wo er hinkommt, verglühen die Haare, Glühwürmchen steigen
 * auf, und darunter erscheinen die 50 %. Danach die Aktionen als Reihen.
 *
 * Das Feld läuft außerhalb von Angular (requestAnimationFrame), nur die
 * Zustandswechsel gehen über Signale. Bei „Bewegung reduzieren" gibt es kein
 * Feld, der Code steht sofort da.
 */
@Component({
  selector: 'app-promo-feld',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './promo-feld.component.html',
  styleUrls: ['./promo-feld.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoFeldComponent {
  private readonly language = inject(LanguageService);
  private readonly experiment = inject(PromoExperimentService);
  private readonly zone = inject(NgZone);

  readonly offers = PROMO_OFFERS;
  readonly code = PROMO_CODE;
  readonly bookingUrl = BOOKING_URL;

  readonly revealed = signal(false);
  readonly done = signal(false);
  readonly open = signal(0);
  readonly hover = signal<number | null>(null);
  readonly copied = signal<'ok' | 'fail' | null>(null);
  private readonly zones = signal<Partial<Record<OfferId, number>>>({ botox: 0, laser: 2 });
  readonly floatOn = computed(() => this.hover() !== null && this.hover() !== this.open());

  private readonly heroRef = viewChild.required<ElementRef<HTMLElement>>('hero');
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly copyRef = viewChild.required<ElementRef<HTMLElement>>('copyBox');
  private readonly digitRef = viewChild.required<ElementRef<HTMLElement>>('digit');
  private readonly progRef = viewChild.required<ElementRef<HTMLElement>>('prog');
  private readonly listRef = viewChild.required<ElementRef<HTMLElement>>('list');
  private readonly floatRef = viewChild.required<ElementRef<HTMLElement>>('float');
  private readonly ctaRef = viewChild.required<ElementRef<HTMLElement>>('cta');
  private readonly magnetRef = viewChild.required<ElementRef<HTMLElement>>('magnet');
  private readonly rootRef = viewChild.required<ElementRef<HTMLElement>>('root');

  // Feld
  private hero!: HTMLElement;
  private cv!: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private veil: HTMLCanvasElement | null = null;
  private vc: CanvasRenderingContext2D | null = null;
  private brush: HTMLCanvasElement | null = null;
  private flySprites: HTMLCanvasElement[] = [];
  private groups: Group[] = [];
  private N = 0;
  private fx = new Float32Array(0);
  private fy = new Float32Array(0);
  private fl = new Float32Array(0);
  private fp = new Float32Array(0);
  private fb = new Float32Array(0);
  private fh = new Float32Array(0);
  private fc = new Uint8Array(0);
  private W = 0;
  private H = 0;
  private top = 0;
  private dpr = 1;
  private Rc = 30;
  private Rp = 100;
  private bx = 0;
  private by = 0;
  private tx = 0;
  private ty = 0;
  private beamA = 0;
  private pointerIn = false;
  private overBar = false;
  private lastInput = -1e9;
  private finished = false;
  private flagRevealed = false;
  private sweep: { t0: number; dur: number; passes: number; rc: number } | null = null;
  private visible = true;
  private cost = 0;
  private frames = 0;
  private densityScale = 1;
  private raf = 0;
  private cutCount = 0;
  private sparks: Spark[] = [];
  private flies: Fly[] = [];
  private readonly pts: number[] = [];
  private reduced = false;
  private fine = false;
  private destroyed = false;
  /** Nur im Browser gesetzt; im Prerender gibt es nichts aufzuräumen. */
  private started = false;

  // Liste und Knopf
  private fxp = 0;
  private fyp = 0;
  private ftx = 0;
  private fty = 0;
  private floatRun = false;
  private fRaf = 0;
  private copyTimer = 0;
  private rowsTimer = 0;
  private readonly cleanup: Array<() => void> = [];

  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => this.start()));
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  bi(text: Bi): string {
    return this.language.t(text.de, text.en);
  }

  link(path: string): string {
    return this.language.localizePath(path);
  }

  fifty(): string {
    return this.t('50\u00A0%', '50%');
  }

  copyLabel(): string {
    const c = this.copied();
    if (c === 'ok') return this.t('Kopiert', 'Copied');
    if (c === 'fail') return this.t('Bitte abschreiben', 'Please copy by hand');
    return this.t('Code kopieren', 'Copy code');
  }

  bookLabel(): string {
    return this.t('Termin buchen', 'Book now');
  }

  bookAria(): string {
    return this.t(
      'Termin buchen: Online-Buchung bei Salonkee, öffnet in einem neuen Tab',
      'Book now: online booking at Salonkee, opens in a new tab',
    );
  }

  zoneIndex(id: OfferId): number {
    return this.zones()[id] ?? 0;
  }

  pickZone(id: OfferId, j: number): void {
    this.zones.update((z) => ({ ...z, [id]: j }));
    this.experiment.track('promo_zone_pick', { offer: id, zones: j + 1 });
  }

  toggle(i: number): void {
    const next = this.open() === i ? -1 : i;
    this.open.set(next);
    if (next >= 0) this.experiment.track('promo_offer_open', { offer: this.offers[i].id });
  }

  offerClick(id: OfferId): void {
    this.experiment.track('promo_offer_click', { offer: id });
  }

  book(event: MouseEvent, where: string): void {
    this.experiment.book(event, where, this.bookLabel());
  }

  copy(where: string): void {
    this.experiment.copyCode(where).then((r) => {
      this.copied.set(r);
      clearTimeout(this.copyTimer);
      this.copyTimer = window.setTimeout(() => this.copied.set(null), 2200);
    });
  }

  revealNow(): void {
    this.experiment.trackOnce('reveal', 'promo_field_reveal', { how: 'button' });
    this.markRevealed();
    this.startSweep();
  }

  replay(): void {
    this.experiment.track('promo_field_replay');
    this.finished = false;
    this.sweep = null;
    this.flagRevealed = false;
    this.lastInput = -1e9;
    this.revealed.set(false);
    this.done.set(false);
    this.zone.runOutsideAngular(() => {
      if (this.initField()) this.startLoop();
    });
  }

  // ---------------------------------------------------------------------------
  // Start und Ende

  private on(el: EventTarget, type: string, fn: (e: any) => void, opt?: AddEventListenerOptions): void {
    el.addEventListener(type, fn, opt);
    this.cleanup.push(() => el.removeEventListener(type, fn, opt));
  }

  private start(): void {
    this.started = true;
    this.hero = this.heroRef().nativeElement;
    this.cv = this.canvasRef().nativeElement;
    this.reduced = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    this.fine = !!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
    this.setupRows();
    this.setupFloat();
    this.setupMagnet();

    if (this.reduced || !this.cv.getContext || !this.initField()) {
      this.finished = true;
      this.flagRevealed = true;
      this.zone.run(() => {
        this.revealed.set(true);
        this.done.set(true);
      });
      return;
    }

    const hero = this.hero;
    this.on(hero, 'pointermove', (e: PointerEvent) => this.onPointer(e));
    this.on(hero, 'pointerdown', (e: PointerEvent) => this.onPointer(e));
    this.on(hero, 'pointerleave', () => (this.pointerIn = false));
    this.on(hero, 'pointercancel', () => (this.pointerIn = false));
    this.on(hero, 'pointerup', (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') this.pointerIn = false;
    });

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => (this.visible = es[es.length - 1].isIntersecting), { threshold: 0 });
      io.observe(hero);
      this.cleanup.push(() => io.disconnect());
    }
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => {
        const w = hero.clientWidth;
        const h = hero.clientHeight;
        if (Math.abs(w - this.W) < 2 && Math.abs(h - this.H) < 2) return;
        if (this.finished) {
          this.W = w;
          this.H = h;
          return;
        }
        this.initField();
      });
      ro.observe(hero);
      this.cleanup.push(() => ro.disconnect());
    }
    document.fonts?.ready.then(() => {
      if (!this.destroyed && !this.cutCount && !this.finished) this.initField();
    });
    this.startLoop();
  }

  private stop(): void {
    this.destroyed = true;
    if (!this.started) return;
    cancelAnimationFrame(this.raf);
    cancelAnimationFrame(this.fRaf);
    clearTimeout(this.copyTimer);
    clearTimeout(this.rowsTimer);
    this.cleanup.forEach((f) => f());
    this.cleanup.length = 0;
  }

  // ---------------------------------------------------------------------------
  // Das Feld

  private initField(): boolean {
    const hero = this.hero;
    const cv = this.cv;
    const W = hero.clientWidth;
    const H = hero.clientHeight;
    if (!W || !H) return false;
    const ctx = cv.getContext('2d');
    if (!ctx) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    this.ctx = ctx;
    this.dpr = dpr;
    this.W = W;
    this.H = H;

    // Die 50 % passen in den Platz zwischen Text und unterem Rand.
    const copy = this.copyRef().nativeElement;
    const copyBottom = copy.offsetTop + copy.offsetHeight;
    const digit = this.digitRef().nativeElement;
    const gap = parseFloat(getComputedStyle(digit).bottom) || 70;
    const size = Math.max(90, Math.min(470, W * 0.31, (H - gap - copyBottom - 28) / 1.05));
    digit.style.fontSize = size.toFixed(0) + 'px';
    const digitTop = H - gap - digit.offsetHeight;
    const top = Math.max(copyBottom + 6, Math.min(H * 0.36, digitTop - 24));
    this.top = top;
    const fieldH = H - top;

    this.Rc = Math.max(28, Math.min(48, W * 0.032));
    this.Rp = this.Rc * 3.4;

    // Der Schleier verdeckt die 50 %, bis der Strahl ihn wegnimmt.
    const vs = 0.5;
    const veil = this.veil ?? (this.veil = document.createElement('canvas'));
    veil.width = Math.ceil(W * vs);
    veil.height = Math.ceil(H * vs);
    const vc = veil.getContext('2d');
    if (!vc) return false;
    vc.setTransform(1, 0, 0, 1, 0, 0);
    vc.globalCompositeOperation = 'source-over';
    vc.clearRect(0, 0, veil.width, veil.height);
    vc.setTransform(vs, 0, 0, vs, 0, 0);
    const vg = vc.createLinearGradient(0, top, 0, top + 64);
    vg.addColorStop(0, 'rgba(15,29,21,0)');
    vg.addColorStop(1, 'rgba(15,29,21,1)');
    vc.fillStyle = vg;
    vc.fillRect(0, top, W, fieldH + 2);
    this.vc = vc;

    if (!this.brush) {
      const b = document.createElement('canvas');
      b.width = 128;
      b.height = 128;
      const bc = b.getContext('2d');
      if (bc) {
        const bg = bc.createRadialGradient(64, 64, 8, 64, 64, 64);
        bg.addColorStop(0, 'rgba(0,0,0,1)');
        bg.addColorStop(0.62, 'rgba(0,0,0,.9)');
        bg.addColorStop(1, 'rgba(0,0,0,0)');
        bc.fillStyle = bg;
        bc.fillRect(0, 0, 128, 128);
      }
      this.brush = b;
    }
    this.makeFlySprites();

    // Die Fäden, von hinten nach vorn in Farbgruppen, damit jede Gruppe ein Pfad bleibt.
    const N = Math.max(600, Math.min(7000, Math.round(W * fieldH * 0.0135 * this.densityScale)));
    const fx = new Float32Array(N);
    const fy = new Float32Array(N);
    const fl = new Float32Array(N);
    const fp = new Float32Array(N);
    const fh = new Float32Array(N);
    const groups: Group[] = [
      { c: 'rgba(143,160,122,.44)', w: 0.7, ids: [] },
      { c: 'rgba(175,168,118,.46)', w: 0.8, ids: [] },
      { c: 'rgba(201,165,92,.56)', w: 0.9, ids: [] },
      { c: 'rgba(216,183,110,.68)', w: 1.1, ids: [] },
      { c: 'rgba(232,206,150,.74)', w: 1.35, ids: [] },
    ];
    const accents: Group[] = groups.map((g) => ({ c: 'rgba(244,237,224,.5)', w: g.w, ids: [] }));
    for (let i = 0; i < N; i++) {
      const t = Math.pow(Math.random(), 0.85);
      fx[i] = -24 + Math.random() * (W + 48);
      fy[i] = top + 20 + t * (fieldH + 6);
      fl[i] = (26 + t * t * 172) * (0.7 + Math.random() * 0.5);
      fp[i] = Math.random() * TAU;
      fh[i] = 1;
      const band = Math.min(4, Math.floor(t * 5));
      (Math.random() < 0.12 ? accents : groups)[band].ids.push(i);
    }
    this.groups = [];
    for (let b = 0; b < 5; b++) this.groups.push(groups[b], accents[b]);
    this.N = N;
    this.fx = fx;
    this.fy = fy;
    this.fl = fl;
    this.fp = fp;
    this.fb = new Float32Array(N);
    this.fh = fh;
    this.fc = new Uint8Array(N);
    this.cutCount = 0;
    this.sparks = [];
    this.flies = [];
    this.bx = W * 0.5;
    this.by = top + fieldH * 0.55;
    this.tx = this.bx;
    this.ty = this.by;
    this.frames = 0;
    this.cost = 0;
    this.progRef().nativeElement.style.transform = 'scaleX(0)';
    return true;
  }

  private makeFlySprites(): void {
    if (this.flySprites.length) return;
    const mk = (core: string, mid: string): HTMLCanvasElement => {
      const c = document.createElement('canvas');
      c.width = 48;
      c.height = 48;
      const g = c.getContext('2d');
      if (g) {
        const gr = g.createRadialGradient(24, 24, 0, 24, 24, 24);
        gr.addColorStop(0, 'rgba(255,250,230,1)');
        gr.addColorStop(0.1, core);
        gr.addColorStop(0.34, mid);
        gr.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gr;
        g.fillRect(0, 0, 48, 48);
      }
      return c;
    };
    this.flySprites = [
      mk('rgba(240,214,150,.95)', 'rgba(216,183,110,.26)'),
      mk('rgba(228,238,166,.95)', 'rgba(196,214,124,.24)'),
    ];
  }

  private spawnFly(x: number, y: number, up: number): void {
    if (this.flies.length >= 320) return;
    this.flies.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(0.3 + Math.random() * 0.8) * up,
      ph: Math.random() * TAU,
      wob: 0.6 + Math.random() * 1.4,
      blink: 0.1 + Math.random() * 0.18,
      age: 0,
      life: 110 + Math.random() * 140,
      s: 5 + Math.random() * 9,
      k: Math.random() < 0.3 ? 1 : 0,
    });
  }

  private onPointer(e: PointerEvent): void {
    if (this.finished || !this.W) return;
    const r = this.hero.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const target = e.target as Element | null;
    this.overBar = !!target?.closest?.('.bar');
    if (!this.pointerIn) {
      this.bx = x;
      this.by = y;
    }
    // Der Wisch-Hinweis hat seinen Dienst getan, sobald ein Finger im Feld ist.
    if (e.pointerType !== 'mouse') this.hero.classList.add('is-touched');
    this.tx = x;
    this.ty = y;
    this.pointerIn = true;
    this.lastInput = performance.now();
  }

  private markRevealed(): void {
    if (this.flagRevealed) return;
    this.flagRevealed = true;
    this.zone.run(() => this.revealed.set(true));
  }

  private startSweep(): void {
    if (this.sweep || this.finished || !this.W) return;
    const fieldH = this.H - this.top;
    const passes = Math.max(3, Math.round(fieldH / 130));
    this.sweep = { t0: performance.now(), dur: 1650, passes, rc: (fieldH / passes) * 0.66 };
  }

  private finishField(): void {
    this.sweep = null;
    this.finished = true;
    // Der letzte Schwung lässt eine Wolke aufsteigen.
    for (let n = 0; n < 170; n++) {
      const i = (Math.random() * this.N) | 0;
      if (this.fc[i] || this.fh[i] <= 0) continue;
      this.spawnFly(this.fx[i], this.fy[i] - this.fl[i] * this.fh[i], 0.75);
    }
    this.fc.fill(1);
    if (this.veil && this.vc) {
      this.vc.setTransform(1, 0, 0, 1, 0, 0);
      this.vc.clearRect(0, 0, this.veil.width, this.veil.height);
    }
    this.flagRevealed = true;
    this.zone.run(() => {
      this.revealed.set(true);
      this.done.set(true);
    });
  }

  private startLoop(): void {
    cancelAnimationFrame(this.raf);
    const loop = (now: number) => {
      this.raf = requestAnimationFrame(loop);
      if (!this.visible || document.hidden) return;
      this.frame(now);
    };
    this.raf = requestAnimationFrame(loop);
  }

  private frame(now: number): void {
    const c0 = performance.now();
    const ctx = this.ctx;
    if (!ctx || !this.veil || !this.vc) return;
    const W = this.W;
    const H = this.H;
    const top = this.top;
    const fieldH = H - top;
    let nbx = this.bx;
    let nby = this.by;
    let targetA = 0;
    let hot = false;
    let Rc = this.Rc;

    if (this.sweep) {
      const s = this.sweep;
      const p = (now - s.t0) / s.dur;
      if (p >= 1) {
        this.finishField();
      } else {
        const rp = Math.max(0, p) * s.passes;
        const k = Math.floor(rp);
        const f = rp - k;
        nbx = (k % 2 ? 1 - f : f) * (W + 220) - 110;
        nby = top + ((k + 0.5) / s.passes) * fieldH;
        targetA = 1;
        hot = true;
        Rc = s.rc;
      }
    } else if (this.pointerIn && !this.finished) {
      nbx += (this.tx - nbx) * 0.42;
      nby += (this.ty - nby) * 0.42;
      hot = nby > top - 20 && !this.overBar;
      targetA = this.overBar ? 0 : 1;
    } else if (!this.finished && now - this.lastInput > 3500) {
      // Ohne Maus wandert der Strahl langsam allein, als Einladung.
      const gx = W * (0.5 + 0.38 * Math.sin(now * 0.00043));
      const gy = top + fieldH * (0.55 + 0.24 * Math.sin(now * 0.00097 + 1.1));
      nbx += (gx - nbx) * 0.04;
      nby += (gy - nby) * 0.04;
      targetA = 0.55;
    }
    this.beamA += (targetA - this.beamA) * 0.1;
    const bA = this.beamA;

    const pts = this.pts;
    pts.length = 0;
    if (hot && this.brush) {
      const dx = nbx - this.bx;
      const dy = nby - this.by;
      const dist = Math.hypot(dx, dy);
      const steps = Math.min(6, Math.max(1, Math.ceil(dist / (Rc * 0.7))));
      const vc = this.vc;
      const r = Rc * 1.7;
      vc.globalCompositeOperation = 'destination-out';
      for (let s = 1; s <= steps; s++) {
        const px = this.bx + (dx * s) / steps;
        const py = this.by + (dy * s) / steps;
        pts.push(px, py);
        vc.drawImage(this.brush, px - r, py - r, r * 2, r * 2);
      }
      vc.globalCompositeOperation = 'source-over';
    }
    this.bx = nbx;
    this.by = nby;

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(this.veil, 0, 0, W, H);
    ctx.lineCap = 'round';

    // Der Strahl von oben
    if (bA > 0.02) {
      const g = ctx.createLinearGradient(0, 0, 0, nby);
      g.addColorStop(0, 'rgba(216,183,110,0)');
      g.addColorStop(1, 'rgba(216,183,110,' + 0.55 * bA + ')');
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(nbx, 0);
      ctx.lineTo(nbx, nby);
      ctx.stroke();
      ctx.globalAlpha = 0.09;
      ctx.lineWidth = 18;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    // Die Fäden
    const fx = this.fx, fy = this.fy, fl = this.fl, fp = this.fp, fb = this.fb, fh = this.fh, fc = this.fc;
    const Rp2 = this.Rp * this.Rp;
    const push = 46;
    const np = pts.length;
    let alive = 0;
    for (const G of this.groups) {
      const ids = G.ids;
      if (!ids.length) continue;
      ctx.beginPath();
      for (let j = 0; j < ids.length; j++) {
        const i = ids[j];
        let h = fh[i];
        if (h <= 0) continue;
        const x = fx[i];
        const y = fy[i];
        const len = fl[i];
        const tipY = y - len * h;
        if (np && !fc[i]) {
          for (let k = 0; k < np; k += 2) {
            const px = pts[k];
            const py = pts[k + 1];
            if (Math.abs(px - x) < Rc && py > tipY - Rc * 0.5 && py < y + Rc * 0.5) {
              fc[i] = 1;
              this.cutCount++;
              if (this.sparks.length < 150 && Math.random() < 0.3) {
                this.sparks.push({ x, y: tipY, vx: (Math.random() - 0.5) * 1.6, vy: -0.6 - Math.random() * 1.8, l: 1 });
              }
              if (Math.random() < 0.3) this.spawnFly(x, tipY, 1);
              break;
            }
          }
        }
        if (fc[i]) {
          h -= 0.085;
          fh[i] = h;
          if (h <= 0) continue;
        }
        alive++;
        let tgt = 0;
        if (bA > 0.02) {
          const dx = x - nbx;
          const dy = y - len * 0.5 - nby;
          const d2 = dx * dx + dy * dy * 0.6;
          if (d2 < Rp2) {
            const q = 1 - d2 / Rp2;
            tgt = (dx < 0 ? -1 : 1) * q * q * push * (len / 110) * bA;
          }
        }
        fb[i] += (tgt - fb[i]) * 0.13;
        const wave =
          (Math.sin(x * 0.0062 + now * 0.00105 + fp[i] * 0.4) + 0.55 * Math.sin(x * 0.0171 - now * 0.0016 + y * 0.012)) *
          (3 + len * 0.085);
        const bend = (wave + fb[i]) * h;
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + bend * 0.25, y - len * 0.62 * h, x + bend, y - len * h);
      }
      ctx.strokeStyle = G.c;
      ctx.lineWidth = G.w;
      ctx.stroke();
    }

    // Funken
    const S = this.sparks;
    if (S.length) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = '#E9CD8B';
      for (let i = S.length - 1; i >= 0; i--) {
        const p = S[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.012;
        p.l -= 0.028;
        if (p.l <= 0) {
          S.splice(i, 1);
          continue;
        }
        const r = 0.6 + p.l * 1.1;
        ctx.globalAlpha = p.l;
        ctx.fillRect(p.x - r / 2, p.y - r / 2, r, r);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    // Glühwürmchen: steigen aus dem verbrannten Gras auf, blinken und verlöschen.
    const F = this.flies;
    if (F.length) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = F.length - 1; i >= 0; i--) {
        const f = F[i];
        f.age++;
        if (f.age >= f.life) {
          F.splice(i, 1);
          continue;
        }
        const t = f.age / f.life;
        f.vy -= 0.0028;
        f.x += f.vx + Math.sin(f.age * 0.045 * f.wob + f.ph) * 0.5;
        f.y += f.vy;
        const env = Math.min(1, t / 0.12) * (1 - t * t);
        const pulse = 0.5 + 0.5 * Math.sin(f.age * f.blink + f.ph);
        const a = env * (0.22 + 0.78 * pulse * pulse);
        if (a < 0.02) continue;
        const sz = f.s * (0.8 + 0.35 * pulse);
        ctx.globalAlpha = a;
        ctx.drawImage(this.flySprites[f.k], f.x - sz, f.y - sz, sz * 2, sz * 2);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    // Vier Ringe: die vier Wellenlängen
    if (bA > 0.02) {
      const R0 = this.Rc;
      ctx.globalCompositeOperation = 'lighter';
      const glow = ctx.createRadialGradient(nbx, nby, 0, nbx, nby, R0 * 1.6);
      glow.addColorStop(0, 'rgba(233,205,139,' + 0.3 * bA + ')');
      glow.addColorStop(1, 'rgba(233,205,139,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(nbx - R0 * 1.6, nby - R0 * 1.6, R0 * 3.2, R0 * 3.2);
      const rings = [0.38, 0.62, 0.84, 1];
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const rr = R0 * rings[i] * (1 + 0.035 * Math.sin(now * 0.004 + i * 1.7));
        ctx.beginPath();
        ctx.arc(nbx, nby, rr, 0, TAU);
        ctx.strokeStyle = 'rgba(216,183,110,' + (1.15 - rings[i]) * 0.8 * bA + ')';
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.arc(nbx, nby, 2.2, 0, TAU);
      ctx.fillStyle = 'rgba(244,237,224,' + bA + ')';
      ctx.fill();
    }

    // Fortschritt und Schwellen
    if (!this.finished) {
      const frac = this.N ? this.cutCount / this.N : 0;
      this.progRef().nativeElement.style.transform = 'scaleX(' + Math.min(1, frac / REVEAL_AT) + ')';
      if (frac >= REVEAL_AT && !this.flagRevealed) {
        this.experiment.trackOnce('reveal', 'promo_field_reveal', { how: 'play' });
        this.markRevealed();
      }
      if (frac >= FINISH_AT) this.startSweep();
    } else if (alive === 0 && S.length === 0 && F.length === 0 && this.beamA < 0.02) {
      ctx.clearRect(0, 0, W, H);
      cancelAnimationFrame(this.raf);
      return;
    }

    // Langsame Geräte bekommen ein lichteres Feld.
    this.cost = this.cost * 0.9 + (performance.now() - c0) * 0.1;
    this.frames++;
    if (this.frames === 50 && this.cost > 13 && this.densityScale > 0.45 && this.cutCount === 0) {
      this.densityScale *= 0.6;
      this.initField();
    }
  }

  // ---------------------------------------------------------------------------
  // Die Liste: Reihen gleiten herein, ein Bild folgt der Maus

  private setupRows(): void {
    const root = this.rootRef().nativeElement;
    if (this.reduced) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>('.row'));
    const mark = (el: Element) => el.setAttribute('data-in', '');
    root.setAttribute('data-anim', '');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (es) =>
          es.forEach((x) => {
            if (x.isIntersecting) {
              mark(x.target);
              io.unobserve(x.target);
            }
          }),
        { threshold: 0.1 },
      );
      rows.forEach((r) => io.observe(r));
      this.cleanup.push(() => io.disconnect());
    } else {
      rows.forEach(mark);
    }
    this.rowsTimer = window.setTimeout(() => rows.forEach(mark), 3000);
  }

  private setupFloat(): void {
    if (!this.fine || this.reduced) return;
    const wrap = this.listRef().nativeElement;
    const fl = this.floatRef().nativeElement;
    this.on(wrap, 'pointermove', (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const r = wrap.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const w = fl.offsetWidth;
      const h = fl.offsetHeight;
      this.ftx = Math.min(wrap.clientWidth - w, Math.max(wrap.clientWidth * 0.5, mx + 48));
      this.fty = Math.min(Math.max(0, wrap.clientHeight - h), Math.max(0, my - h * 0.5));
      if (!this.floatRun) {
        if (this.hover() === null) {
          this.fxp = this.ftx;
          this.fyp = this.fty;
        }
        this.floatRun = true;
        this.floatTick();
      }
    });
    this.on(wrap, 'pointerleave', () => this.zone.run(() => this.hover.set(null)));
  }

  private floatTick(): void {
    const fl = this.floatRef().nativeElement;
    const dx = this.ftx - this.fxp;
    const dy = this.fty - this.fyp;
    this.fxp += dx * 0.13;
    this.fyp += dy * 0.13;
    const rot = Math.max(-7, Math.min(7, dx * 0.035));
    fl.style.transform = `translate3d(${this.fxp}px,${this.fyp}px,0) rotate(${rot}deg)`;
    if (Math.abs(dx) + Math.abs(dy) > 0.3) {
      this.fRaf = requestAnimationFrame(() => this.floatTick());
    } else {
      this.floatRun = false;
    }
  }

  private setupMagnet(): void {
    if (!this.fine || this.reduced) return;
    const zone = this.ctaRef().nativeElement;
    const mag = this.magnetRef().nativeElement;
    this.on(zone, 'pointermove', (e: PointerEvent) => {
      const r = mag.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      mag.style.transform = Math.hypot(dx, dy) < 240 ? `translate(${dx * 0.24}px,${dy * 0.24}px)` : '';
    });
    this.on(zone, 'pointerleave', () => (mag.style.transform = ''));
  }
}
