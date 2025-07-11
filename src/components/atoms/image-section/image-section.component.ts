import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-image-section',
    imports: [CommonModule],
    templateUrl: './image-section.component.html',
    styleUrls: ['./image-section.component.scss']
})
export class ImageSectionComponent implements OnInit {
  @Input() backgroundImage = '';
  @Input() shadow: 'light-shadow' | 'dark-shadow' | '' = '';
  @Input() paragraphText: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
