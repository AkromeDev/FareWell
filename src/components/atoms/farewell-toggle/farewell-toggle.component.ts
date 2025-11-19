import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type FarewellToggleOption = {
  label: string;
  value: string;
};

@Component({
  selector: 'farewell-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './farewell-toggle.component.html',
  styleUrls: ['./farewell-toggle.component.scss'],
})
export class FarewellToggleComponent {
  @Input({ required: true }) options: FarewellToggleOption[] = [];
  @Input({ required: true }) selected!: string;

  @Input() backgroundTheme: 'light' | 'dark' | 'transparent' = 'transparent';

  @Input() theme: 'light' | 'dark' = 'light';

  @Output() selectedChange = new EventEmitter<string>();

  onSelect(value: string) {
    if (value !== this.selected) {
      this.selected = value;
      this.selectedChange.emit(value);
    }
  }

  isActive(value: string): boolean {
    return this.selected === value;
  }
}
