import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { BodyPart } from '../body-selector/body-part.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-calculator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './time-calculator.component.scss'
})
export class TimeCalculatorComponent implements OnChanges {
  @Input() selectedPart!: BodyPart;

  userSizeCm = 170;
  density: 'low' | 'medium' | 'high' = 'medium';
  speedMultiplier: 1 | 2 | 3 | 4 = 1;

  sessionDates: Date[] = [];
  hoursPerSession: number = 0;
  totalHours: number = 0;

  ngOnChanges() {
    this.calculateTime();
  }

  calculateTime() {
    if (!this.selectedPart) return;

    const anagenPercentage = this.selectedPart.anagenPercentage || 33;
    const baseTime = this.selectedPart.baseTime || 1; // in hours

    const clampedSize = Math.min(Math.max(this.userSizeCm, 130), 220);
    const sizeFactor = clampedSize / 170;
    const densityFactor = { low: 0.8, medium: 1, high: 1.3 }[this.density];
    const speedFactor = 1 / this.speedMultiplier;

    const adjustedTime = baseTime * sizeFactor * densityFactor * speedFactor;

    this.hoursPerSession = +(adjustedTime / (anagenPercentage / 100)).toFixed(2);
    this.totalHours = +(this.hoursPerSession * 3).toFixed(2);

    this.sessionDates = this.getSessionDates();
  }

  getSessionDates(): Date[] {
    const start = this.getNextWednesday();
    return [
      start,
      new Date(start.getTime() + 10 * 7 * 24 * 60 * 60 * 1000),
      new Date(start.getTime() + 20 * 7 * 24 * 60 * 60 * 1000),
    ];
  }

  getNextWednesday(): Date {
    const today = new Date();
    const result = new Date(today);
    result.setDate(result.getDate() + ((3 + 7 - result.getDay()) % 7 || 7));
    return result;
  }

  setDensity(value: 'low' | 'medium' | 'high') {
    this.density = value;
    this.calculateTime();
  }
}
