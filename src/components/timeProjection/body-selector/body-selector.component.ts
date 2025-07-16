import { Component, EventEmitter, Output } from '@angular/core';
import { BodyPart } from './body-part.model';

@Component({
  selector: 'app-body-selector',
  imports: [],
  templateUrl: './body-selector.component.html',
  styleUrl: './body-selector.component.scss'
})
export class BodySelectorComponent {
  selectedPart: string | null = 'armpits';

  selectPart(part: string) {
    this.selectedPart = part;
    // Future: trigger right panel or popup
    console.log('Selected body part:', part);
  }
}
