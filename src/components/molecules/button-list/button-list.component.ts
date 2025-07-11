import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from 'src/components/atoms/button/button.component';
import { RouterModule } from '@angular/router';

interface ButtonItem {
  label: string;
  link: string;
  theme: 'light' | 'dark';
}

@Component({
    selector: 'app-button-list',
    standalone: true,
    imports: [CommonModule, ButtonComponent, RouterModule],
    templateUrl: './button-list.component.html',
    styleUrls: ['./button-list.component.scss']
})
export class ButtonListComponent implements OnInit {
  @Input() buttons: ButtonItem[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
