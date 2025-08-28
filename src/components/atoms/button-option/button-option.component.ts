import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type OptionGender = 'woman' | 'man';
type Theme = 'light' | 'dark';

export interface OptionItem<T extends string = string> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-button-option',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-option.component.html',
  styleUrl: './button-option.component.scss',
  host: {
    '[class.disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled',
    role: 'radiogroup'
  }
})
export class ButtonOptionComponent {
  @Input({ required: false }) options: [OptionItem<OptionGender>, OptionItem<OptionGender>] = [
    { label: 'Damen',  value: 'woman' },
    { label: 'Herren', value: 'man' }
  ];

  @Input() set selected(value: OptionGender | null) {
    if (value !== null && value !== undefined) this._selected.set(value);
  }
  get selected() { return this._selected(); }

  @Input() theme: Theme = 'light';
  @Input() disabled = false;

  @Output() selectionChange = new EventEmitter<OptionGender>();

  private _selected = signal<OptionGender>(this.options[0].value);

  onClick(value: OptionGender) {
    if (this.disabled || value === this._selected()) return;
    this._selected.set(value);
    this.selectionChange.emit(value);
  }

  onKeydown(event: KeyboardEvent) {
    if (this.disabled) return;
    const values: OptionGender[] = [this.options[0].value, this.options[1].value];
    const idx = values.indexOf(this._selected());
    let nextIdx = idx;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':   nextIdx = idx === 0 ? 1 : 0; break;
      case 'ArrowRight':
      case 'ArrowDown': nextIdx = idx === 1 ? 0 : 1; break;
      case 'Home':      nextIdx = 0; break;
      case 'End':       nextIdx = 1; break;
      default: return;
    }
    event.preventDefault();
    this.onClick(values[nextIdx]);
  }

  /** ARIA helpers (typed) */
  isActive(value: OptionGender) { return this._selected() === value; }
  ariaChecked(value: OptionGender) { return this.isActive(value) ? 'true' : 'false'; }
  tabIndexFor(value: OptionGender) { return this.isActive(value) ? 0 : -1; }
}
