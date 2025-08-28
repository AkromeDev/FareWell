export interface PriceItem {
  id: string;
  method: 'IPL' | 'Elektrolyse';
  gender: 'Damen' | 'Herren';
  zone: string;
  durationMinutes: number;
  price: number;
  currency: 'EUR';
  notes?: string;
}
