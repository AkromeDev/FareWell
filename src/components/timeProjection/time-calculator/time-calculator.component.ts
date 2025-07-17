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
  
    userSizeCm = 170;
    density: 'low' | 'medium' | 'high' = 'medium';
    speedMultiplier: number = 1;
  
    speedOptions: { label: string; value: number }[] = [];
  
    sessionDates: Date[] = [];
    recommendedSessions: number = 0;
    totalHours: number = 0;
  
    waveCount: number = 0;
    sessionPlan: { date: Date; hours: number; label?: string }[] = [];

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

  generateSpeedOptions(): void {
    const max = this.selectedPart?.maxMultiplier || 1;

    this.speedOptions = Array.from({ length: max }, (_, i) => i + 1).map(n => ({
      label: `x${n} (${n === 1 ? 'Einzeln' : `${n} gleichzeitig`})`,
      value: n
    }));

    if (this.speedMultiplier > max) {
      this.speedMultiplier = 1;
    }
  }

  getNumberOfWaves(anagenPercentage: number): number {
    if (anagenPercentage <= 0) return 0;

    return Math.ceil(100 / anagenPercentage);
  }

calculateTime(): void {
  if (!this.selectedPart) return;

  const anagenPercentage = this.selectedPart.anagenPercentage || 33;

  const clampedSize = Math.min(Math.max(this.userSizeCm, 130), 220);
  const heightDelta = clampedSize - 170;
  const heightFactor = 1 + heightDelta * 0.004;

  const densityFactor = { low: 0.8, medium: 1, high: 1.3 }[this.density];
  const speedFactor = 1 / this.speedMultiplier;

  // ✅ Use estimatedTotalHours only
  const baseEstimated = this.selectedPart.estimatedTotalHours || 1;
  const adjustedTime = baseEstimated * heightFactor * densityFactor * speedFactor;

  // 👇 Dynamic waves based on anagen %
  this.waveCount = this.getNumberOfWaves(anagenPercentage);

  const totalCoreTime = adjustedTime;
  const cleanupTime = totalCoreTime * 0.1;

  this.totalHours = +(totalCoreTime + cleanupTime).toFixed(2);
  this.recommendedSessions = Math.ceil(this.totalHours / 2);

  this.sessionPlan = this.getSessionPlan(this.waveCount, adjustedTime, anagenPercentage);


}


getSessionPlan(waveCount: number, adjustedTime: number, anagenPercentage: number): { date: Date; hours: number; label?: string }[] {
  const result: { date: Date; hours: number; label?: string }[] = [];
  const start = this.getNextWednesday();

  let remaining = 100;
  const wavePercents: number[] = [];

  for (let i = 0; i < waveCount; i++) {
    const percent = Math.min(anagenPercentage, remaining);
    wavePercents.push(percent);
    remaining -= percent;
  }

  for (let i = 0; i < wavePercents.length; i++) {
    const sessionDate = new Date(start.getTime() + i * 10 * 7 * 24 * 60 * 60 * 1000);
    const proportion = wavePercents[i] / 100;
    const sessionHours = adjustedTime * proportion;
    result.push({ date: sessionDate, hours: sessionHours });
  }

  // Add final cleanup session
  const lastWave = result[result.length - 1].date;
  const cleanupDate = new Date(lastWave.getTime() + 10 * 7 * 24 * 60 * 60 * 1000);
  const cleanupHours = adjustedTime * 0.1;

  result.push({ date: cleanupDate, hours: cleanupHours, label: 'Clean-up' });

  return result;
}


roundToQuarter(value: number): string {
  const rounded = Math.round(value * 4) / 4;
  return rounded.toFixed(2).replace('.', ',');
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
