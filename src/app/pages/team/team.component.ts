import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../../components/atoms/header/header.component";

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
