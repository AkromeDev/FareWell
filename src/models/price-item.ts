export interface PriceItem {
  id: string;
  method: 'Laser' | 'Elektrolyse';
  zone: string;
  durationMinutes: number;
  price: number;
  currency: 'EUR';
  notes?: string;
}
