import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, Signal, WritableSignal, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PriceItem } from '../../../../src/models/price-item';

type OptionGender = 'woman' | 'man';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input({ required: true }) src!: string;

  @Input() set selectedGender(value: OptionGender | null) {
    if (value) this._selectedGender.set(value);
  }

  readonly loading: WritableSignal<boolean> = signal(true);
  readonly error: WritableSignal<string | null> = signal(null);

  trackById = (_: number, row: PriceItem) => row.id;
  private _selectedGender = signal<OptionGender>('woman');
  private _rowsAll = signal<PriceItem[]>([]);

  rows: Signal<PriceItem[]> = computed(() => {
    const g = this._selectedGender();
    const wanted: PriceItem['gender'] = g === 'woman' ? 'Damen' : 'Herren';
    return this._rowsAll().filter(r => r.gender === wanted);
  });

  constructor(private http: HttpClient) {}

  ngOnChanges(): void {
    if (this.src) this.fetch();
  }

  private fetch() {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<unknown>(this.src).subscribe({
      next: (data) => {
        if (!Array.isArray(data)) {
          this.error.set('Unerwartetes Datenformat (Array erwartet).');
          this.loading.set(false);
          return;
        }
        const parsed: PriceItem[] = (data as any[]).map(r => ({
          id: String(r.id),
          method: r.method === 'Elektrolyse' ? 'Elektrolyse' : 'IPL',
          gender: r.gender === 'Herren' ? 'Herren' : 'Damen',
          zone: String(r.zone),
          durationMinutes: Number(r.durationMinutes ?? r.duration ?? 0),
          price: Number(String(r.price).replace('€','').replace(',','.')),
          currency: 'EUR',
          notes: r.notes ? String(r.notes) : undefined
        }));
        this._rowsAll.set(parsed);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Daten konnten nicht geladen werden.');
        this.loading.set(false);
      }
    });
  }

  minutesLabel(min: number) { return `${min} Min`; }
  euro(n: number) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  }
}
