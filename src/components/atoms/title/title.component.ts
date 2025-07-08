import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent {
  @Input() color: 'light' | 'dark' = 'light';
  @Input() align: 'center' | 'left' | 'right' | 'justify' = 'center';
  @Input() type: 'soft' | 'cornered' | 'simple' = 'soft';
  @Input() level: 'h1' | 'h2' | 'h3' = 'h1';
  @Input() title: string = '';

}
