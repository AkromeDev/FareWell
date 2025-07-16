import { Component, EventEmitter, Output } from '@angular/core';
import { BodyPart, BodyParts } from './body-part.model';

@Component({
  selector: 'app-body-selector',
  imports: [],
  templateUrl: './body-selector.component.html',
  styleUrl: './body-selector.component.scss'
})
export class BodySelectorComponent {
  selectedPart: BodyPart | null = BodyParts.armpits;
  BodyParts = BodyParts;

  @Output() partSelected = new EventEmitter<BodyPart>();

  selectPart(part: BodyPart) {
    this.selectedPart = part;
    console.log('Selected body part:', part);
    this.partSelected.emit(part);
  }
}
