import { Component, OnInit } from '@angular/core';
import { BodySelectorComponent } from "../body-selector/body-selector.component";
import { TimeCalculatorComponent } from "../time-calculator/time-calculator.component";
import { BodyParts, BodyPart } from '../body-selector/body-part.model';

@Component({
  selector: 'app-bc',
  imports: [BodySelectorComponent, TimeCalculatorComponent],
  templateUrl: './bc.component.html',
  styleUrl: './bc.component.scss'
})
export class BcComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  selectedPart: BodyPart = BodyParts.armpits;

  onPartSelected(part: BodyPart) {
    this.selectedPart = part;
  }
}
