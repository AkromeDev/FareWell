import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSectionComponent } from 'src/components/atoms/image-section/image-section.component';
import { SeparatorComponent } from 'src/components/atoms/separator/separator.component';
import { TitleComponent } from 'src/components/atoms/title/title.component';
import { ParagraphComponent } from "../../atoms/paragraph/paragraph.component";
import { ButtonListComponent } from "../button-list/button-list.component";
import { ButtonItem } from 'src/app/models/ButtonItem';

export type ParagraphSize = 'small' | 'medium' | 'large';
export type ParagraphAlign = 'left' | 'center' | 'right'| 'justify';
export type ParagraphWeight = 'normal' | 'bold';
export type ParagraphColor = 'light' | 'dark';
export type ParagraphMaxWidth = 'narrow' | 'wide' | 'full';

@Component({
    selector: 'app-image-hero',
    standalone: true,
    imports: [TitleComponent, CommonModule, ImageSectionComponent, SeparatorComponent, ParagraphComponent, ButtonListComponent],
    templateUrl: './image-hero.component.html',
    styleUrls: ['./image-hero.component.scss']
})
export class ImageHeroComponent implements OnInit {
  @Input() title: string = '';
  @Input() titleLevel: 'h1' | 'h2' | 'h3' = 'h1';
  @Input() titleColor: 'light' | 'dark' = 'light';
  @Input() titleAlign: 'center' | 'left' | 'right' = 'center';
  @Input() backgroundImage: string = '';
  @Input() shadow: '' | 'light' | 'dark' = 'dark';

  @Input() paragraphText: string = '';
  @Input() paragraphSize: ParagraphSize = 'medium';
  @Input() paragraphAlign: ParagraphAlign = 'center';
  @Input() paragraphWeight: ParagraphWeight = 'normal';
  @Input() paragraphColor: ParagraphColor = 'light';
  @Input() paragraphMaxWidth: ParagraphMaxWidth = 'wide';

  @Input() buttonList: ButtonItem[] = [];


get computedShadow(): '' | 'light-shadow' | 'dark-shadow' {
  if (this.shadow === 'dark') return 'dark-shadow';
  if (this.shadow === 'light') return 'light-shadow';
  return '';
}

  constructor() { }

  ngOnInit(): void {
  }

}
