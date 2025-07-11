import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-values',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './values.component.html',
    styleUrls: ['./values.component.scss']
})
export class ValuesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
