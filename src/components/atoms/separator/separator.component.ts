import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-separator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './separator.component.html',
  styleUrls: ['./separator.component.scss']
})
export class SeparatorComponent implements OnInit {
  @Input() color: "dark" | "light" = "light";
  @Input() align: "left" |"center" |"right" = "center";
  
  constructor() { }

  ngOnInit(): void {
  }

}
