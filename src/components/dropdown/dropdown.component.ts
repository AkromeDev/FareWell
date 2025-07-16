import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DropdownComponent,
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor {
  @Input() options: { label: string; value: any }[] = [];
  @Input() theme: 'light' | 'dark' = 'light';

  open = false;
  value: any;
  onChange = (_: any) => {};
  onTouched = () => {};

  get selectedLabel() {
    return this.options.find((o) => o.value === this.value)?.label;
  }

  toggle() {
    this.open = !this.open;
  }

  close() {
    this.open = false;
  }

  select(option: { label: string; value: any }) {
    this.value = option.value;
    this.onChange(this.value);
    this.onTouched();
    this.close();
  }

  writeValue(val: any): void {
    this.value = val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
