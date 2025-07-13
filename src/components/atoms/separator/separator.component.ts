import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignTokens } from 'src/models';

@Component({
  selector: 'app-separator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './separator.component.html',
  styleUrls: ['./separator.component.scss']
})
export class SeparatorComponent implements OnInit {
  @Input() color: DesignTokens.Color = 'light';
  @Input() align: DesignTokens.Align = 'center';

  constructor() {}

  ngOnInit(): void {}
}
