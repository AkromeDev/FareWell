import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParagraphOptions } from 'src/models';

@Component({
  selector: 'app-paragraph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss']
})
export class ParagraphComponent implements OnInit {
  @Input() text: string = '';
  @Input() size: ParagraphOptions.Size = 'medium';
  @Input() align: ParagraphOptions.Align = 'left';
  @Input() weight: ParagraphOptions.Weight = 'normal';
  @Input() color: ParagraphOptions.Color = 'dark';
  @Input() maxWidth: ParagraphOptions.MaxWidth = 'full';
  @Input() type: ParagraphOptions.Type = 'normal';

  constructor() {}

  ngOnInit(): void {}
}
