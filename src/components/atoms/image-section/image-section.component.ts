import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignTokens, ShadowOptions } from 'src/models';

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
  @Input() height: DesignTokens.Height = '85';

  constructor() {}

  ngOnInit(): void {}
}
