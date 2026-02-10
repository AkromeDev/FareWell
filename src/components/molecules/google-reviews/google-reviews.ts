import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, map, of, startWith } from 'rxjs';

import {
  GoogleReviewsService,
  GoogleReview,
} from '../../../../backend/src/google-reviews.service';

type Vm = {
  state: 'loading' | 'ready' | 'error';
  placeName: string;
  rating: number | null;
  userRatingCount: number | null;
  reviews: GoogleReview[];
  source: 'google' | 'cache' | null;
};

@Component({
  selector: 'fw-google-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-reviews.html',
  styleUrls: ['./google-reviews.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleReviewsComponent {
  /** how many reviews to display in the carousel */
  @Input() maxItems = 8;

  activeIndex = 0;

  private touchStartX: number | null = null;

  /** matches SCSS breakpoints: <720 = 1, >=720 = 2, >=1024 = 3 */
  private perView = 1;

  /** expanded state per review (stable key) */
  private expanded = new Set<string>();

  readonly vm$ = this.reviewsService.getReviews().pipe(
    map((res): Vm => {
      const reviews = (res.data.reviews ?? []).slice(0, this.maxItems);

      // keep index valid after data changes / resize
      this.activeIndex = Math.min(this.activeIndex, this.maxStartIndex(reviews.length));

      return {
        state: 'ready',
        placeName: res.data.displayName?.text ?? 'Google Bewertungen',
        rating: res.data.rating ?? null,
        userRatingCount: res.data.userRatingCount ?? null,
        reviews,
        source: res.source,
      };
    }),
    startWith({
      state: 'loading',
      placeName: 'Google Bewertungen',
      rating: null,
      userRatingCount: null,
      reviews: [],
      source: null,
    } satisfies Vm),
    catchError(() =>
      of({
        state: 'error',
        placeName: 'Google Bewertungen',
        rating: null,
        userRatingCount: null,
        reviews: [],
        source: null,
      } satisfies Vm)
    )
  );

  constructor(private readonly reviewsService: GoogleReviewsService) {
    this.updatePerView();
  }

  @HostListener('window:resize')
  onResize(): void {
    const before = this.perView;
    this.updatePerView();
    if (before !== this.perView) {
      // clamp so we don't slide into empty space
      // (vm$ also clamps on next emission, but resize should be immediate)
      // note: we don't know total here; safest is keep current and clamp in navigation ops
      this.activeIndex = Math.max(0, this.activeIndex);
    }
  }

  private updatePerView(): void {
    const w = window.innerWidth;
    this.perView = w >= 1024 ? 3 : w >= 720 ? 2 : 1;
  }

  trackByName(i: number, r: GoogleReview): string {
    return r.name ?? `${i}`;
  }

  private keyOf(r: GoogleReview): string {
    return r.name ?? r.authorAttribution?.displayName ?? JSON.stringify(r).slice(0, 40);
  }

  stars(rating: number | null): number[] {
    const safe = Math.max(0, Math.min(5, Math.round(rating ?? 0)));
    return Array.from({ length: 5 }, (_, i) => (i < safe ? 1 : 0));
  }

  /** number of possible "pages" (start positions) */
  pageCount(total: number): number {
    return this.maxStartIndex(total) + 1;
  }

  /** for template *ngFor */
  pages(total: number): number[] {
    return Array.from({ length: this.pageCount(total) }, (_, i) => i);
  }

  private maxStartIndex(total: number): number {
    return Math.max(0, total - this.perView);
  }

  prev(total: number): void {
    const max = this.maxStartIndex(total);
    if (max <= 0) return;
    this.activeIndex = this.activeIndex <= 0 ? max : this.activeIndex - 1;
  }

  next(total: number): void {
    const max = this.maxStartIndex(total);
    if (max <= 0) return;
    this.activeIndex = this.activeIndex >= max ? 0 : this.activeIndex + 1;
  }

  goTo(i: number): void {
    this.activeIndex = Math.max(0, i);
  }

  onKeydown(event: KeyboardEvent, total: number): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prev(total);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next(total);
    }
  }

  onTouchStart(ev: TouchEvent): void {
    this.touchStartX = ev.touches?.[0]?.clientX ?? null;
  }

  onTouchEnd(ev: TouchEvent, total: number): void {
    const endX = ev.changedTouches?.[0]?.clientX ?? null;
    const startX = this.touchStartX;
    this.touchStartX = null;

    if (startX === null || endX === null) return;

    const dx = endX - startX;
    const threshold = 40;
    if (dx > threshold) this.prev(total);
    if (dx < -threshold) this.next(total);
  }

  translateX(activeIndex: number): string {
    // step = card width + gap (card width is a CSS var computed from per-view)
    return `translateX(calc(-${activeIndex} * (var(--card-w) + var(--gap))))`;
  }

  // -------------------------
  // Read more / less
  // -------------------------
  reviewText(r: GoogleReview): string {
    return (r.text?.text ?? r.originalText?.text ?? '').trim();
  }

  shouldShowReadMore(r: GoogleReview): boolean {
    // pragmatic approach (no DOM measurement): show if likely to exceed 5 lines
    const t = this.reviewText(r);
    return t.length > 240 || t.split('\n').length > 3;
  }

  isExpanded(r: GoogleReview): boolean {
    return this.expanded.has(this.keyOf(r));
  }

  toggleExpanded(r: GoogleReview): void {
    const k = this.keyOf(r);
    if (this.expanded.has(k)) this.expanded.delete(k);
    else this.expanded.add(k);
  }
}
