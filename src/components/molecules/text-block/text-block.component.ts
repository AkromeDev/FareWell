import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParagraphComponent } from '../../atoms/paragraph/paragraph.component';
import { TitleComponent } from 'src/components/atoms/title/title.component';
import { SeparatorComponent } from '../../atoms/separator/separator.component';

import {
  DesignTokens,
  ParagraphOptions,
  TitleOptions
} from 'src/models';

@Component({
  selector: 'app-text-block',
  standalone: true,
  imports: [CommonModule, ParagraphComponent, TitleComponent, SeparatorComponent],
  templateUrl: './text-block.component.html',
  styleUrls: ['./text-block.component.scss']
})
export class TextBlockComponent implements OnInit {
  @Input() theme: DesignTokens.Theme = 'dark';
  @Input() title: string = '';
  @Input() titleType: TitleOptions.Type = 'simple';

  @Input() paragraphSize: ParagraphOptions.Size = 'medium';
  @Input() paragraphAlign: ParagraphOptions.Align = 'left';
  @Input() paragraphWeight: ParagraphOptions.Weight = 'normal';
  @Input() paragraphMaxWidth: ParagraphOptions.MaxWidth = 'wide';

  get inverseTextColor(): ParagraphOptions.Color {
    return this.theme === 'dark' ? 'light' : 'dark';
  }

  constructor() {}

  ngOnInit(): void {}
}
