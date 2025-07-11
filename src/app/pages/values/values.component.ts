import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../../components/atoms/header/header.component";

@Component({
    selector: 'app-values',
    imports: [CommonModule, HeaderComponent],
    templateUrl: './values.component.html',
    styleUrls: ['./values.component.scss']
})
export class ValuesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
