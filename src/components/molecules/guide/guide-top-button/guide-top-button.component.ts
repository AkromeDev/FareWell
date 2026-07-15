import {
  AfterViewInit,
  Component,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Schwebender „Nach oben"-Button für lange Guide-Seiten; per CSS nur mobil
 * sichtbar (.gd-top-btn) und erst, nachdem die Seite ein Stück gescrollt ist.
 * Der Scroll-Listener läuft außerhalb der Zone (vgl. guide-stats).
 */
@Component({
  selector: 'app-guide-top-button',
  standalone: true,
  template: `
    <button
      type="button"
      class="gd-top-btn"
      [class.is-visible]="visible"
      [attr.aria-label]="label"
      (click)="toTop()"
    >
      ↑
    </button>
  `,
})
export class GuideTopButtonComponent implements AfterViewInit, OnDestroy {
  @Input() label = 'Nach oben';

  visible = false;

  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly onScroll = (): void => {
    const next = window.scrollY > 480;
    if (next !== this.visible) {
      this.zone.run(() => (this.visible = next));
    }
  };

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      // Initialzustand prüfen: nach einem Reload mitten auf der Seite stellt
      // der Browser die Scroll-Position ohne neues Scroll-Event wieder her.
      this.onScroll();
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.onScroll);
    }
  }

  toTop(): void {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
