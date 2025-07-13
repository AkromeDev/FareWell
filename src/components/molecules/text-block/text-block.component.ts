import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParagraphComponent } from "../../atoms/paragraph/paragraph.component";
import { TitleComponent } from 'src/components/atoms/title/title.component';
import { SeparatorComponent } from "../../atoms/separator/separator.component";

export type BlockTheme = 'dark' | 'light';

export type ParagraphSize = 'small' | 'medium' | 'large';
export type ParagraphAlign = 'left' | 'center' | 'right' | 'justify';
export type ParagraphWeight = 'normal' | 'bold';
export type ParagraphColor = 'light' | 'dark';
export type ParagraphMaxWidth = 'narrow' | 'wide' | 'full';
export type TitleType = 'blur' | 'cornered' | 'simple';

@Component({
    selector: 'app-text-block',
    standalone: true,
    imports: [CommonModule, ParagraphComponent, TitleComponent, SeparatorComponent],
    templateUrl: './text-block.component.html',
    styleUrls: ['./text-block.component.scss']
})
export class TextBlockComponent implements OnInit {
  @Input() theme: BlockTheme = 'dark';
  @Input() title: string = '';
  @Input() titleType: TitleType = 'simple';

  @Input() paragraphSize: ParagraphSize = 'medium';
  @Input() paragraphAlign: ParagraphAlign = 'left';
  @Input() paragraphWeight: ParagraphWeight = 'normal';
  @Input() paragraphMaxWidth: ParagraphMaxWidth = 'wide';

  get inverseTextColor(): ParagraphColor {
    return this.theme === 'dark' ? 'light' : 'dark';
  }

  constructor() { }

  ngOnInit(): void {}
}

