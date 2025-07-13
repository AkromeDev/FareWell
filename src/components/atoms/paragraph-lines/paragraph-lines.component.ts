import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignTokens } from 'src/models';

@Component({
  selector: 'app-paragraph-lines',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paragraph-lines.component.html',
  styleUrls: ['./paragraph-lines.component.scss']
})
export class ParagraphLinesComponent implements OnInit {
  @Input() color: DesignTokens.Color = 'dark';
  @Input() align: DesignTokens.Align = 'left';

  constructor() {}

  ngOnInit(): void {}
}
