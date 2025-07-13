import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSectionComponent } from 'src/components/atoms/image-section/image-section.component';
import { SeparatorComponent } from 'src/components/atoms/separator/separator.component';
import { TitleComponent } from 'src/components/atoms/title/title.component';
import { ParagraphComponent } from '../../atoms/paragraph/paragraph.component';
import { ButtonListComponent } from '../button-list/button-list.component';

import {
  ButtonItem,
  TitleOptions,
  ParagraphOptions,
  ShadowOptions,
  DesignTokens
} from 'src/models';

@Component({
  selector: 'app-image-hero',
  standalone: true,
  imports: [
    TitleComponent,
    CommonModule,
    ImageSectionComponent,
    SeparatorComponent,
    ParagraphComponent,
    ButtonListComponent
  ],
  templateUrl: './image-hero.component.html',
  styleUrls: ['./image-hero.component.scss']
})
export class ImageHeroComponent implements OnInit {
  @Input() title: string = '';
  @Input() titleLevel: TitleOptions.Level = 'h1';
  @Input() titleColor: TitleOptions.Color = 'light';
  @Input() titleAlign: TitleOptions.Align = 'center';
  @Input() titleType: TitleOptions.Type = 'cornered';

  @Input() backgroundImage: string = '';
  @Input() shadow: ShadowOptions.Raw = 'dark';

  @Input() paragraphText: string = '';
  @Input() paragraphSize: ParagraphOptions.Size = 'medium';
  @Input() paragraphAlign: ParagraphOptions.Align = 'center';
  @Input() paragraphWeight: ParagraphOptions.Weight = 'normal';
  @Input() paragraphColor: ParagraphOptions.Color = 'light';
  @Input() paragraphMaxWidth: ParagraphOptions.MaxWidth = 'wide';
  @Input() paragraphType: ParagraphOptions.Type = 'normal';

  @Input() buttonList: ButtonItem[] = [];

  get computedShadow(): ShadowOptions.Type {
    if (this.shadow === 'dark') return 'dark-shadow';
    if (this.shadow === 'light') return 'light-shadow';
    return '';
  }

  constructor() {}

  ngOnInit(): void {}
}
