import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BcComponent } from "src/components/timeProjection/bc/bc.component";

@Component({
    selector: 'app-zeit',
    standalone: true,
    imports: [CommonModule, BcComponent],
    templateUrl: './zeit.component.html',
    styleUrls: ['./zeit.component.scss']
})
export class ZeitComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
