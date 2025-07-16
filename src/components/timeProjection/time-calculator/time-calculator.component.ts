import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { BodyPart, BODY_PARTS, BodyPartKey, BodyParts } from '../body-selector/body-part.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from 'src/components/dropdown/dropdown.component';

@Component({
  selector: 'app-time-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownComponent],
  templateUrl: './time-calculator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './time-calculator.component.scss'
})
export class TimeCalculatorComponent implements OnChanges {
  @Input() selectedPart!: BodyPart;

    bodyPartOptions = BODY_PARTS.map(part => ({
    label: part.label,
    value: part.key
  }));

  selectedPartKey: BodyPartKey = 'armpits'; // default

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPart'] && this.selectedPart) {
      this.selectedPartKey = this.selectedPart.key;
      this.generateSpeedOptions();
      this.calculateTime();
    }
  }

  onPartChange(key: BodyPartKey): void {
    this.selectedPart = BodyParts[key];
    this.generateSpeedOptions();
    this.calculateTime();
  }

  userSizeCm = 170;
  density: 'low' | 'medium' | 'high' = 'medium';
  speedMultiplier: number = 1;

  speedOptions: { label: string; value: number }[] = [];

  sessionDates: Date[] = [];
  hoursPerSession: number = 0;
  totalHours: number = 0;

  generateSpeedOptions(): void {
    const max = this.selectedPart?.maxMultiplier || 1;

    this.speedOptions = Array.from({ length: max }, (_, i) => i + 1).map(n => ({
      label: `x${n} (${n === 1 ? 'Einzeln' : `${n} gleichzeitig`})`,
      value: n
    }));

    if (this.speedMultiplier > max) {
      this.speedMultiplier = 1; // reset if out of range
    }
  }

  calculateTime(): void {
    if (!this.selectedPart) return;

    const anagenPercentage = this.selectedPart.anagenPercentage || 33;
    const baseTime = this.selectedPart.baseTime || 1;

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
