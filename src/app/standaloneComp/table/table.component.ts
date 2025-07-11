import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-table',
    imports: [CommonModule],
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() data: any = [];
  @Input() headers: any = [];
  @Input() cssClass = '';
  
  constructor() { }

  ngOnInit(): void {
  }

}
