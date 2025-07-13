import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShadowOptions } from 'src/models';

@Component({
  selector: 'app-image-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-section.component.html',
  styleUrls: ['./image-section.component.scss']
})
export class ImageSectionComponent implements OnInit {
  @Input() backgroundImage: string = '';
  @Input() shadow: ShadowOptions.Type = '';
  @Input() paragraphText: string = '';

  constructor() {}

  ngOnInit(): void {}
}
