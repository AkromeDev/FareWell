import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() link?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
