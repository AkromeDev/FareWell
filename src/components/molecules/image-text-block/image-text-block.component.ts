import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from 'src/components/atoms/title/title.component';
import { ParagraphComponent } from 'src/components/atoms/paragraph/paragraph.component';
import { DesignTokens, ParagraphOptions, TitleOptions } from 'src/models';

@Component({
  selector: 'app-image-text-block',
  standalone: true,
  imports: [CommonModule, TitleComponent, ParagraphComponent],
  templateUrl: './image-text-block.component.html',
  styleUrls: ['./image-text-block.component.scss']
})
export class ImageTextBlockComponent implements OnInit {
  @Input() theme: DesignTokens.Theme = 'dark';
  @Input() title: string = '';
  @Input() backgroundImage: string = '';
  @Input() imagePosition: 'left' | 'right' = 'right';
  @Input() resize: boolean = false;


  get inverseTextColor(): ParagraphOptions.Color {
    return this.theme === 'dark' ? 'light' : 'dark';
  }

  constructor() {}

  ngOnInit(): void {}
}
