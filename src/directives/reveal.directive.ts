import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  RendererStyleFlags2,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type RevealVariant = 'up' | 'fade' | 'left' | 'right' | 'scale' | 'zoom';

/**
 * Reveals the host element as it scrolls into view (fade + transform).
 *
 * SSR-safe: on the server, and for users without JS or with
 * `prefers-reduced-motion`, nothing is hidden — the content is always rendered.
 *
 * Usage:
 *   <section appReveal></section>
 *   <div appReveal="left" [revealDelay]="120"></div>
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  /** Animation flavour. Empty string defaults to 'up'. */
  @Input('appReveal') variant: RevealVariant | '' = 'up';

  /** Stagger delay in milliseconds. */
  @Input() revealDelay = 0;

  /** Fraction of the element visible before it triggers. */
  @Input() revealThreshold = 0.15;

  /** Reveal only once (default) or re-animate every time it re-enters. */
  @Input() revealOnce = true;

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    // Skip on the server and when IntersectionObserver is unavailable.
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const host = this.el.nativeElement;
    const variant = this.variant || 'up';

    this.renderer.addClass(host, 'reveal');
    this.renderer.addClass(host, `reveal--${variant}`);

    if (this.revealDelay > 0) {
      // DashCase-Flag ist Pflicht: ohne es kann Renderer2 keine CSS Custom
      // Property setzen (style['--x'] ist laut Spec ein No-op).
      this.renderer.setStyle(
        host,
        '--reveal-delay',
        `${this.revealDelay}ms`,
        RendererStyleFlags2.DashCase
      );
    }

    // Observe outside Angular — toggling a class needs no change detection.
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            // Reveal when in view, OR when it has already been scrolled past
            // (top above the viewport). The latter guards against fast scrolls,
            // where IntersectionObserver may coalesce the crossing and only
            // report the final "out of view above" state.
            const viewportBottom =
              entry.rootBounds?.bottom ?? this.el.nativeElement.ownerDocument.defaultView?.innerHeight ?? 0;
            const reachedOrPassed =
              entry.isIntersecting || entry.boundingClientRect.top < viewportBottom;

            if (reachedOrPassed) {
              this.renderer.addClass(host, 'is-visible');
              if (this.revealOnce) {
                this.observer?.disconnect();
              }
            } else if (!this.revealOnce) {
              this.renderer.removeClass(host, 'is-visible');
            }
          }
        },
        { threshold: this.revealThreshold, rootMargin: '0px 0px -8% 0px' }
      );

      this.observer.observe(host);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
