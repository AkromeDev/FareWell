import { CommonModule } from '@angular/common';
import { Component, Input, Signal, WritableSignal, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PriceItem } from 'src/models/price-item';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

/**
 * Generische Preistabelle über eine JSON-Quelle. Aktuell nirgends eingebunden;
 * die Preisseite rendert ihre Tabellen direkt aus price-data.ts. Die frühere
 * Aufteilung nach Geschlecht gibt es nicht mehr: Der Katalog ist nach Methode
 * und Zone sortiert.
 */
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input({ required: true }) src!: string;

  readonly loading: WritableSignal<boolean> = signal(true);
  readonly error: WritableSignal<string | null> = signal(null);

  trackById = (_: number, row: PriceItem) => row.id;

  private _rowsAll = signal<PriceItem[]>([]);

  rows: Signal<PriceItem[]> = computed(() => this._rowsAll());

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
          method: r.method === 'Elektrolyse' ? 'Elektrolyse' : 'Laser',
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
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(n);
  }
}
