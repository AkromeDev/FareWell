import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-divider',
    imports: [CommonModule],
    templateUrl: './divider.component.html',
    styleUrls: ['./divider.component.scss']
})
export class DividerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
