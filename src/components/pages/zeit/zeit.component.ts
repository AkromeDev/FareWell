import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BodySelectorComponent } from "src/components/timeProjection/body-selector/body-selector.component";
import { BodyPart } from 'src/components/timeProjection/body-selector/body-part.model';

@Component({
    selector: 'app-zeit',
    standalone: true,
    imports: [CommonModule, BodySelectorComponent],
    templateUrl: './zeit.component.html',
    styleUrls: ['./zeit.component.scss']
})
export class ZeitComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onBodyPartChange(part: BodyPart) {
  console.log('Clicked:', part);
}

}
