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
import { BOOKING_URL, PROMO_CODE, PROMO_OFFERS } from '../../promotion-offers';

const STEP = 360 / PROMO_OFFERS.length;

/**
 * Variante B des A/B-Tests: „Die Drehbühne". Die Aktionen stehen als Karten
 * auf einem Ring, den man mit Maus oder Finger dreht. Jede Karte hat eine
 * dunkle Rückseite mit einem Satz aus ihrer Aktionsseite; die vordere Karte
 * dreht sich auf Klick um. Darunter die Einzelheiten der vorderen Aktion.
 *
 * Drehen und Abdunkeln laufen außerhalb von Angular; nur der Wechsel der
 * vorderen Karte geht über ein Signal.
 */
@Component({
  selector: 'app-promo-buehne',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './promo-buehne.component.html',
  styleUrls: ['./promo-buehne.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoBuehneComponent {
  private readonly language = inject(LanguageService);
  private readonly experiment = inject(PromoExperimentService);
  private readonly zone = inject(NgZone);

  readonly offers = PROMO_OFFERS;
  readonly code = PROMO_CODE;
  readonly bookingUrl = BOOKING_URL;
  readonly step = STEP;

  readonly activeIndex = signal(0);
  readonly flipped = signal(-1);
  readonly dragging = signal(false);
  readonly copied = signal<'ok' | 'fail' | null>(null);
  readonly active = computed(() => this.offers[this.activeIndex()]);

  private readonly stageRef = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly ringRef = viewChild.required<ElementRef<HTMLElement>>('ring');
  private readonly ghostRef = viewChild.required<ElementRef<HTMLElement>>('ghost');
  private readonly detailRef = viewChild.required<ElementRef<HTMLElement>>('detail');

  private ring!: HTMLElement;
  private slots: HTMLElement[] = [];
  private A = 0;
  private vel = 0;
  private goal = 0;
  private mode: 'idle' | 'drag' | 'coast' | 'goal' = 'idle';
  private R = 330;
  private cw = 260;
  private down = false;
  private moved = false;
  private justDragged = false;
  private touched = false;
  private visible = true;
  private reduced = false;
  private running = false;
  private pid = -1;
  private x0 = 0;
  private A0 = 0;
  private lastX = 0;
  private lastT = 0;
  private raf = 0;
  /** Nur im Browser gesetzt; im Prerender gibt es nichts aufzuräumen. */
  private started = false;
  private timer = 0;
  private copyTimer = 0;
  private readonly cleanup: Array<() => void> = [];

  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => this.start()));
    inject(DestroyRef).onDestroy(() => {
      if (!this.started) return;
      cancelAnimationFrame(this.raf);
      clearInterval(this.timer);
      clearTimeout(this.copyTimer);
      this.cleanup.forEach((f) => f());
    });
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

  bookLabel(): string {
    return this.t('Termin buchen', 'Book now');
  }

  bookAria(): string {
    return this.t(
      'Termin buchen: Online-Buchung bei Salonkee, öffnet in einem neuen Tab',
      'Book now: online booking at Salonkee, opens in a new tab',
    );
  }

  copyLabel(): string {
    const c = this.copied();
    if (c === 'ok') return this.t('Kopiert', 'Copied');
    if (c === 'fail') return this.t('Bitte abschreiben', 'Please copy by hand');
    return this.t('Code kopieren', 'Copy code');
  }

  flipLabel(): string {
    return this.flipped() === this.activeIndex() ? this.t('Zurückdrehen', 'Turn back') : this.t('Karte umdrehen', 'Turn the card');
  }

  /** Die Preisliste der Botox-Karte, aus ihrem Zonenrechner abgeleitet. */
  prices(): { name: string; price: string }[] {
    const o = this.active();
    if (!o.zones || o.withCode) return [];
    const rows = [{ name: this.t('Einzelne Regionen', 'Single regions'), price: this.bi(o.value).replace(/ /g, ' ') }];
    o.zones.options.forEach((opt, i) =>
      rows.push({
        name: opt + ' ' + (opt === '1' ? this.t('Zone', 'zone') : this.t('Zonen', 'zones')),
        price: this.bi(o.zones!.results[i]),
      }),
    );
    return rows;
  }

  pick(i: number): void {
    if (this.justDragged) return;
    this.interact('card');
    if (i === this.activeIndex() && this.mode === 'idle') {
      this.toggleFlip();
    } else {
      this.zone.runOutsideAngular(() => this.goTo(i));
    }
  }

  prev(): void {
    this.interact('arrow');
    this.zone.runOutsideAngular(() => this.goTo(this.activeIndex() - 1));
  }

  next(): void {
    this.interact('arrow');
    this.zone.runOutsideAngular(() => this.goTo(this.activeIndex() + 1));
  }

  tab(i: number): void {
    this.interact('tab');
    this.zone.runOutsideAngular(() => this.goTo(i));
  }

  toggleFlip(): void {
    this.touched = true;
    const a = this.activeIndex();
    const turning = this.flipped() !== a;
    this.flipped.set(turning ? a : -1);
    if (turning) this.experiment.track('promo_card_flip', { offer: this.offers[a].id });
  }

  offerClick(): void {
    this.experiment.track('promo_offer_click', { offer: this.active().id });
  }

  book(event: MouseEvent, where: string): void {
    this.experiment.book(event, where, this.bookLabel());
  }

  copy(): void {
    this.experiment.copyCode('buehne').then((r) => {
      this.copied.set(r);
      clearTimeout(this.copyTimer);
      this.copyTimer = window.setTimeout(() => this.copied.set(null), 2200);
    });
  }

  // ---------------------------------------------------------------------------

  private interact(how: string): void {
    this.touched = true;
    this.experiment.trackOnce('stage', 'promo_stage_interact', { how });
  }

  private on(el: EventTarget, type: string, fn: (e: any) => void): void {
    el.addEventListener(type, fn);
    this.cleanup.push(() => el.removeEventListener(type, fn));
  }

  private start(): void {
    this.started = true;
    const stage = this.stageRef().nativeElement;
    this.ring = this.ringRef().nativeElement;
    this.slots = Array.from(this.ring.querySelectorAll<HTMLElement>('.slot'));
    this.reduced = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    this.measure();
    this.apply();

    this.on(stage, 'pointerdown', (e: PointerEvent) => {
      if (e.button !== 0) return;
      if ((e.target as Element | null)?.closest?.('.arrow, .turn')) return;
      this.down = true;
      this.moved = false;
      this.pid = e.pointerId;
      this.x0 = e.clientX;
      this.A0 = this.A;
      this.lastX = e.clientX;
      this.lastT = performance.now();
      this.vel = 0;
    });
    this.on(stage, 'pointermove', (e: PointerEvent) => {
      if (!this.down || e.pointerId !== this.pid) return;
      const dx = e.clientX - this.x0;
      if (!this.moved && Math.abs(dx) > 6) {
        this.moved = true;
        this.mode = 'drag';
        this.zone.run(() => {
          this.interact('drag');
          this.dragging.set(true);
        });
        try {
          stage.setPointerCapture(e.pointerId);
        } catch {
          // Zeiger schon weg
        }
        this.loop();
      }
      if (this.moved) {
        const k = STEP / (this.cw * 1.15);
        const now = performance.now();
        const dt = Math.max(1, now - this.lastT);
        this.vel = Math.max(-9, Math.min(9, ((this.lastX - e.clientX) * k * 16) / dt));
        this.lastX = e.clientX;
        this.lastT = now;
        this.A = this.A0 - dx * k;
      }
    });
    const end = (e: PointerEvent) => {
      if (!this.down || e.pointerId !== this.pid) return;
      this.down = false;
      if (!this.moved) return;
      this.zone.run(() => this.dragging.set(false));
      this.justDragged = true;
      setTimeout(() => (this.justDragged = false), 0);
      if (this.reduced) {
        this.goal = Math.round(this.A / STEP) * STEP;
        this.mode = 'goal';
      } else {
        this.mode = 'coast';
      }
      this.loop();
    };
    this.on(stage, 'pointerup', end);
    this.on(stage, 'pointercancel', end);
    this.on(stage, 'lostpointercapture', end);

    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => {
        this.measure();
        this.apply();
      });
      ro.observe(this.ring);
      this.cleanup.push(() => ro.disconnect());
    }
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => (this.visible = es[es.length - 1].isIntersecting), { threshold: 0.3 });
      io.observe(stage);
      this.cleanup.push(() => io.disconnect());
    }
    // Bis zur ersten Berührung dreht sich die Bühne alle paar Sekunden weiter.
    this.timer = window.setInterval(() => {
      if (this.touched || this.reduced || this.down || !this.visible || document.hidden) return;
      this.goTo(this.activeIndex() + 1);
    }, 4800);
  }

  private measure(): void {
    this.cw = this.ring.offsetWidth || 260;
    this.R = (this.cw / 2 / Math.tan(Math.PI / this.offers.length)) * 1.5;
    this.ring.style.setProperty('--r', this.R.toFixed(1) + 'px');
  }

  private goTo(i: number): void {
    const target = i * STEP;
    this.goal = target + 360 * Math.round((this.A - target) / 360);
    this.mode = 'goal';
    if (this.reduced) {
      this.A = this.goal;
      this.mode = 'idle';
      this.apply();
      return;
    }
    this.loop();
  }

  private loop(): void {
    if (this.running) return;
    this.running = true;
    const tick = () => {
      let done = false;
      if (this.mode === 'coast') {
        this.A += this.vel;
        this.vel *= 0.9;
        if (Math.abs(this.vel) < 0.35) {
          this.goal = Math.round(this.A / STEP) * STEP;
          this.mode = 'goal';
        }
      } else if (this.mode === 'goal') {
        const d = this.goal - this.A;
        this.A += d * 0.11;
        if (Math.abs(d) < 0.04) {
          this.A = this.goal;
          this.mode = 'idle';
          done = true;
        }
      } else if (this.mode !== 'drag') {
        done = true;
      }
      this.apply();
      if (done) {
        this.running = false;
        return;
      }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private apply(): void {
    if (!this.ring) return;
    this.ring.style.transform = `translateZ(${(-this.R).toFixed(1)}px) rotateX(-6deg) rotateY(${(-this.A).toFixed(2)}deg)`;
    const n = this.offers.length;
    for (let i = 0; i < this.slots.length; i++) {
      let rel = (i * STEP - this.A) % 360;
      if (rel > 180) rel -= 360;
      if (rel < -180) rel += 360;
      const c = Math.cos((rel * Math.PI) / 180);
      const cf = Math.max(0, c);
      this.slots[i].style.setProperty('--dimf', (0.68 * (1 - cf * cf)).toFixed(3));
      this.slots[i].style.setProperty('--dimb', (0.5 * (1 - c * c)).toFixed(3));
    }
    const idx = (((Math.round(this.A / STEP)) % n) + n) % n;
    if (idx !== this.activeIndex()) {
      this.zone.run(() => {
        this.activeIndex.set(idx);
        this.flipped.set(-1);
      });
      this.replayIn();
    }
  }

  /** Lässt Hintergrundziffer und Einzelheiten nach einem Wechsel neu einblenden. */
  private replayIn(): void {
    if (this.reduced) return;
    requestAnimationFrame(() => {
      [this.ghostRef().nativeElement, this.detailRef().nativeElement].forEach((el) => {
        el.classList.remove('is-in');
        void el.offsetWidth;
        el.classList.add('is-in');
      });
    });
  }
}
