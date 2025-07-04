import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {
  @Input() text: string = '';
  @Input() level: 'h1' | 'h2' | 'h3' = 'h1';
  @Input() color: 'light' | 'dark' = 'light';
  @Input() align: 'center' | 'left' | 'right' = 'center';

  constructor() { }

  ngOnInit(): void {
  }

}
