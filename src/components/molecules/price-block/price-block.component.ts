import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonOptionComponent, OptionGender } from 'src/components/atoms/button-option/button-option.component';
import { TableComponent } from 'src/components/atoms/table/table.component';
import { TitleComponent } from 'src/components/atoms/title/title.component';
import { DesignTokens, TitleOptions } from 'src/models';

@Component({
  selector: 'app-price-block',
  standalone: true,
  imports: [CommonModule, ButtonOptionComponent, TableComponent, TitleComponent],
  templateUrl: './price-block.component.html',
  styleUrls: ['./price-block.component.scss']
})
export class PriceBlockComponent {
  @Input() theme: DesignTokens.Theme = 'dark';
  @Input() title = 'IPL Preise';
  @Input() titleType: TitleOptions.Type = 'simple';
  @Input() src: string = 'assets/data/prices.json';
  @Input() initialGender: OptionGender = 'woman';

  gender = signal<OptionGender>(this.initialGender);

  onGenderChange(v: OptionGender) {
    this.gender.set(v);
  }

  get inverseTextColor(): 'light' | 'dark' {
    return this.theme === 'dark' ? 'light' : 'dark';
  }
}
