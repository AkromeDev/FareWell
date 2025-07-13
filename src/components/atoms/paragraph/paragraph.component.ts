import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paragraph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss']
})
export class ParagraphComponent implements OnInit {
  @Input() text: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() align: 'left' | 'center' | 'right' | 'justify' = 'left';
  @Input() weight: 'normal' | 'bold' = 'normal';
  @Input() color: 'light' | 'dark' = 'dark';
  @Input() maxWidth: 'narrow' | 'wide' | 'full' = 'full';
  @Input() type: 'normal' | 'blur' = 'normal';

  constructor() {}

  ngOnInit(): void {}
}
