import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-text-card',
    imports: [CommonModule],
    templateUrl: './text-card.component.html',
    styleUrls: ['./text-card.component.scss']
})
export class TextCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
