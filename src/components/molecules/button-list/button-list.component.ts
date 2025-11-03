import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from 'src/components/atoms/button/button.component';

export interface ButtonItem {
  label: string;
  link: string;                
  theme: 'light' | 'dark';
  external?: boolean;
}

@Component({
  selector: 'app-button-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterModule],
  templateUrl: './button-list.component.html',
  styleUrls: ['./button-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonListComponent {
  @Input() buttons: ButtonItem[] = [];

  isExternal(link: string, explicit?: boolean): boolean {
    if (explicit !== undefined) return explicit;
    return /^https?:\/\//i.test(link);
  }

  trackByLabel = (_: number, b: ButtonItem) => b.label;
}
