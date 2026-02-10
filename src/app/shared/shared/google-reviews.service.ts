import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';

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
  private readonly baseUrl = environment.backendBaseUrl;

  private readonly reviews$: Observable<GooglePlaceReviewsResponse>;

  constructor(private readonly http: HttpClient) {
    this.reviews$ = this.http
      .get<GooglePlaceReviewsResponse>(`${this.baseUrl}/reviews`)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  getReviews(): Observable<GooglePlaceReviewsResponse> {
    return this.reviews$;
  }
}
