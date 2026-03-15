import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from 'src/components/atoms/button/button.component';
import { ButtonItem } from 'src/models/ButtonItem';

@Component({
  selector: 'app-button-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
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