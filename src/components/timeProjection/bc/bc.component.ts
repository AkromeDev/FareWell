import { Component, OnInit, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BodyParts, BodyPart, BodyPartKey } from '../body-selector/body-part.model';
import { BodySelectorComponent } from '../body-selector/body-selector.component';
import { TimeCalculatorComponent } from '../time-calculator/time-calculator.component';

@Component({
  selector: 'app-bc',
  standalone: true,
  imports: [CommonModule, BodySelectorComponent, TimeCalculatorComponent],
  templateUrl: './bc.component.html',
  styleUrl: './bc.component.scss'
})
export class BcComponent implements OnInit {
  selectedPart: BodyPart = BodyParts.armpits;
  isMobile: boolean = false;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngOnInit(): void {
    if (!this.isBrowser) return;
    const savedKey = localStorage.getItem('selectedPartKey') as BodyPartKey;
    this.selectedPart = BodyParts[savedKey] || BodyParts.armpits;
    this.checkIfMobile();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkIfMobile();
  }

  checkIfMobile(): void {
    if (!this.isBrowser) return;
    this.isMobile = window.innerWidth < 768;
  }

  onPartSelected(part: BodyPart): void {
    this.selectedPart = part;
    if (this.isBrowser) {
      localStorage.setItem('selectedPartKey', part.key);
    }
  }
}
