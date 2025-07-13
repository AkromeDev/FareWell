import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleOptions } from 'src/models';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent {
  @Input() color: TitleOptions.Color = 'light';
  @Input() align: TitleOptions.Align = 'center';
  @Input() type: TitleOptions.Type = 'blur';
  @Input() level: TitleOptions.Level = 'h1';
  @Input() title: string = '';
}
