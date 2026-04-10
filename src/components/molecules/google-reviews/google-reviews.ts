import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostListener,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import googleReviewsJson from 'src/assets/data/google-reviews.json';

export interface GooglePlaceReviewsResponse {
  source: 'google' | 'cache';
  data: {
    id: string;
    displayName?: { text?: string; languageCode?: string };
    rating?: number;
    userRatingCount?: number;
    reviews?: GoogleReview[];
  };
  fetchedAt?: string;
}

export interface GoogleReview {
  name?: string;
  rating?: number;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  publishTime?: string;
  relativePublishTimeDescription?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
}

type Vm = {
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
export class GoogleReviewsComponent implements OnChanges {
  @Input() maxItems = 8;

  activeIndex = 0;

  private touchStartX: number | null = null;
  private perView = 1;
  private expanded = new Set<string>();

  private readonly data =
    googleReviewsJson as GooglePlaceReviewsResponse;

  vm: Vm = this.buildVm();

  constructor() {
    this.updatePerView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['maxItems']) {
      this.vm = this.buildVm();
      this.activeIndex = Math.min(
        this.activeIndex,
        this.maxStartIndex(this.vm.reviews.length)
      );
    }
  }

  private buildVm(): Vm {
    const reviews = (this.data.data.reviews ?? []).slice(0, this.maxItems);

    return {
      placeName: this.data.data.displayName?.text ?? 'Google Bewertungen',
      rating: this.data.data.rating ?? null,
      userRatingCount: this.data.data.userRatingCount ?? null,
      reviews,
      source: this.data.source ?? null,
    };
  }

  @HostListener('window:resize')
  onResize(): void {
    const before = this.perView;
    this.updatePerView();

    if (before !== this.perView) {
      this.activeIndex = Math.min(
        this.activeIndex,
        this.maxStartIndex(this.vm.reviews.length)
      );
    }
  }

  private updatePerView(): void {
    if (typeof window === 'undefined') {
      this.perView = 1;
      return;
    }

    const w = window.innerWidth;
    this.perView = w >= 1024 ? 3 : w >= 720 ? 2 : 1;
  }

  trackByName(i: number, r: GoogleReview): string {
    return r.name ?? `${i}`;
  }

  private keyOf(r: GoogleReview): string {
    return (
      r.name ??
      r.authorAttribution?.displayName ??
      JSON.stringify(r).slice(0, 40)
    );
  }

  stars(rating: number | null): number[] {
    const safe = Math.max(0, Math.min(5, Math.round(rating ?? 0)));
    return Array.from({ length: 5 }, (_, i) => (i < safe ? 1 : 0));
  }

  pageCount(total: number): number {
    return this.maxStartIndex(total) + 1;
  }

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
    return `translateX(calc(-${activeIndex} * (var(--card-w) + var(--gap))))`;
  }

  reviewText(r: GoogleReview): string {
    return (r.text?.text ?? r.originalText?.text ?? '').trim();
  }

  shouldShowReadMore(r: GoogleReview): boolean {
    const t = this.reviewText(r);
    return t.length > 240 || t.split('\n').length > 3;
  }

  isExpanded(r: GoogleReview): boolean {
    return this.expanded.has(this.keyOf(r));
  }

  toggleExpanded(r: GoogleReview): void {
    const k = this.keyOf(r);

    if (this.expanded.has(k)) {
      this.expanded.delete(k);
    } else {
      this.expanded.add(k);
    }
  }
}