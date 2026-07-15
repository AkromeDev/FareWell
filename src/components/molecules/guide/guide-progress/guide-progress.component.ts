import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Schmaler Lese-Fortschrittsbalken am oberen Bildschirmrand (Sage→Sand-
 * Verlauf), wie auf der ursprünglichen Onboarding-Seite. Läuft komplett
 * außerhalb von Angular (direkte Style-Writes) und nur im Browser.
 */
@Component({
  selector: 'app-guide-progress',
  standalone: true,
  template: `
    <div class="gd-progress" aria-hidden="true">
      <div #bar class="gd-progress__bar"></div>
    </div>
  `,
})
export class GuideProgressComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bar') bar?: ElementRef<HTMLElement>;

  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly onScroll = (): void => {
    const el = this.bar?.nativeElement;
    if (!el) {
      return;
    }
    const doc = el.ownerDocument.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    el.style.width = max > 0 ? `${(doc.scrollTop / max) * 100}%` : '0%';
  };

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      document.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
      this.onScroll();
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) {
      return;
    }
    document.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
  }
}
