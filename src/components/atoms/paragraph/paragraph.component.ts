import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ParagraphSize = 'small' | 'medium' | 'large';
export type ParagraphAlign = 'left' | 'center' | 'right' | 'justify';
export type ParagraphWeight = 'normal' | 'bold';
export type ParagraphColor = 'light' | 'dark';
export type ParagraphWidth = 'narrow' | 'wide' | 'full';

@Component({
    selector: 'app-paragraph',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './paragraph.component.html',
    styleUrls: ['./paragraph.component.scss']
})
export class ParagraphComponent implements OnInit {

  @Input() text: string = '';
  @Input() size: ParagraphSize = 'medium';
  @Input() align: ParagraphAlign = 'center';
  @Input() weight: ParagraphWeight = 'normal';
  @Input() color: ParagraphColor = 'dark';
  @Input() maxWidth: ParagraphWidth = 'wide';

  constructor() {}

  ngOnInit(): void {}
}
