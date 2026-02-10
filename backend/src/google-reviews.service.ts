import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

export interface GooglePlaceReviewsResponse {
  source: 'google' | 'cache';
  data: {
    id: string;
    displayName?: { text?: string };
    rating?: number;
    userRatingCount?: number;
    reviews?: GoogleReview[];
  };
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
   * ✅ local dev (later replace with your deployed backend URL)
   * Best practice: keep Google API key ONLY in backend.
   */
  private readonly baseUrl = 'http://localhost:5050';

  private readonly reviews$: Observable<GooglePlaceReviewsResponse>;

  constructor(private readonly http: HttpClient) {
    // ✅ initialize after DI is ready (fixes "used before initialization")
    this.reviews$ = this.http
      .get<GooglePlaceReviewsResponse>(`${this.baseUrl}/reviews`)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  getReviews(): Observable<GooglePlaceReviewsResponse> {
    return this.reviews$;
  }
}
