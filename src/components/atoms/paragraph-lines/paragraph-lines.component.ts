import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type Align = 'left' | 'center' | 'right'| 'justify';
export type Color = 'light' | 'dark';

@Component({
    selector: 'app-paragraph-lines',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './paragraph-lines.component.html',
    styleUrls: ['./paragraph-lines.component.scss']
})
export class ParagraphLinesComponent implements OnInit {
  @Input() color: Color = "dark";
  @Input() align: Align = "left"

  constructor() { }

  ngOnInit(): void {
  }

}
