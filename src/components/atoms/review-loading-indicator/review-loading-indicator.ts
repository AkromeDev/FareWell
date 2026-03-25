import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fw-review-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-loading-indicator.html',
  styleUrls: ['./review-loading-indicator.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewLoadingIndicatorComponent {}