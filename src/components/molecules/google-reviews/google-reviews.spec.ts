import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

export interface GooglePlaceReviewsResponse {
  source: 'google' | 'cache'; // kept for compatibility (file will be "cache")
  data: {
    id: string;
    displayName?: { text?: string };
    rating?: number;
    userRatingCount?: number;
    reviews?: GoogleReview[];
  };
  fetchedAt?: string; // optional metadata from build step
}

export interface GoogleReview {
  name?: string;
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  publishTime?: string;
  relativePublishTimeDescription?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class GoogleReviewsService {
  /**
   * ✅ Static file generated at deploy time by GitHub Actions.
   * No API key in browser, no localhost, no permission prompt.
   */
  private readonly url = 'assets/data/google-reviews.json';

  private readonly reviews$: Observable<GooglePlaceReviewsResponse>;

  constructor(private readonly http: HttpClient) {
    this.reviews$ = this.http
      .get<GooglePlaceReviewsResponse>(this.url)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  getReviews(): Observable<GooglePlaceReviewsResponse> {
    return this.reviews$;
  }
}
