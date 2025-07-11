import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeparatorComponent } from "../../atoms/separator/separator.component";
import { TitleComponent } from 'src/components/atoms/title/title.component';
import { ParagraphComponent } from 'src/components/atoms/paragraph/paragraph.component';

export type BlockTheme = 'dark' | 'light';

export type ParagraphSize = 'small' | 'medium' | 'large';
export type ParagraphAlign = 'left' | 'center' | 'right'| 'justify';
export type ParagraphWeight = 'normal' | 'bold';
export type ParagraphColor = 'light' | 'dark';
export type ParagraphMaxWidth = 'narrow' | 'wide' | 'full';
export type TitleType = 'soft' | 'cornered' | 'simple';

@Component({
    selector: 'app-small-block',
    imports: [CommonModule, SeparatorComponent, TitleComponent, ParagraphComponent],
    templateUrl: './small-block.component.html',
    styleUrls: ['./small-block.component.scss']
})
export class SmallBlockComponent implements OnInit {
  @Input() theme: BlockTheme = 'dark';
  @Input() title: string = '';
  @Input() titleType: TitleType = 'simple';
  @Input() separator: Boolean = false;

  @Input() paragraphSize: ParagraphSize = 'medium';
  @Input() paragraphAlign: ParagraphAlign = 'left';
  @Input() paragraphWeight: ParagraphWeight = 'normal';
  @Input() paragraphMaxWidth: ParagraphMaxWidth = 'wide';

  get inverseTextColor(): ParagraphColor {
    return this.theme === 'dark' ? 'light' : 'dark';
  }

  constructor() { }

  ngOnInit(): void {
  }

}
