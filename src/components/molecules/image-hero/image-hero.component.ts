import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSectionComponent } from 'src/components/atoms/image-section/image-section.component';
import { SeparatorComponent } from 'src/components/atoms/separator/separator.component';
import { TitleComponent } from 'src/components/atoms/title/title.component';
import { ParagraphComponent } from "../../atoms/paragraph/paragraph.component";
import { ButtonListComponent } from "../button-list/button-list.component";
import { ButtonItem } from 'src/app/models/ButtonItem';


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
  @Input() titleType: 'blur' | 'cornered' | 'simple' = 'cornered';

  @Input() backgroundImage: string = '';
  @Input() shadow: '' | 'light' | 'dark' = 'dark';

  @Input() paragraphText: string = '';
  @Input() paragraphSize: 'small' | 'medium' | 'large' = 'medium';
  @Input() paragraphAlign: 'left' | 'center' | 'right'| 'justify' = 'center';
  @Input() paragraphWeight: 'normal' | 'bold' = 'normal';
  @Input() paragraphColor: 'light' | 'dark' = 'light';
  @Input() paragraphMaxWidth: 'narrow' | 'wide' | 'full' = 'wide';
  @Input() paragraphType: 'normal' | 'blur' = 'normal';

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
