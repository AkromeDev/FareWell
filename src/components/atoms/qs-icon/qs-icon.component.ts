import { Component, computed, input } from '@angular/core';

/**
 * Die Strichsymbole der internen Seiten (24er Raster, Strichstärke 1,75,
 * Farbe aus currentColor). Eigene Pfade, keine Symbolbibliothek: die Seite
 * lädt nichts von anderen Domains.
 */
const PATHS = {
  video: 'M3 7h12v10H3z M15 11l6-4v10l-6-4',
  tag: 'M3 12V4h8l10 10-8 8z M7 8a1 1 0 1 0 2 0a1 1 0 1 0-2 0',
  search: 'M4 11a7 7 0 1 0 14 0a7 7 0 1 0-14 0 M16.5 16.5L21 21',
  ticket: 'M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z M14 7v2 M14 11v2 M14 15v2',
  instagram: 'M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5z M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M17 6.5h.01',
  globe: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M3 12h18 M12 3a14 14 0 0 1 0 18 M12 3a14 14 0 0 0 0 18',
  calendar: 'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4',
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3l-5.5 2.9 1-6.2L3 9.6l6.2-.9z',
  repeat: 'M17 2l4 4-4 4 M3 11V9a3 3 0 0 1 3-3h15 M7 22l-4-4 4-4 M21 13v2a3 3 0 0 1-3 3H3',
  card: 'M2 6h20v12H2z M2 10h20 M6 15h4',
  invoice: 'M6 2h9l5 5v15H6z M14 2v6h6 M9 13h8 M9 17h6',
  sign: 'M3 4h18v10H3z M12 14v7 M8 21h8 M7 9h10',
  book: 'M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2z M22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z',
  chat: 'M4 4h16v12H9l-5 4z M8 9h8 M8 12h5',
  euro: 'M18 6a7 7 0 1 0 0 12 M4 10h10 M4 14h10',
  users: 'M5 8a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M1 21a8 8 0 0 1 16 0 M16 4a4 4 0 0 1 0 8 M19 14a6 6 0 0 1 4 7',
  gift: 'M3 8h18v4H3z M5 12h14v9H5z M12 8v13 M12 8C10 4 6 4 7 7 M12 8c2-4 6-4 5-1',
  heart: 'M12 20s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.5-8 11-8 11z',
  check: 'M4 12l5 5L20 6',
  clock: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M12 7v5l3 2',
  phone: 'M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M8.5 12l2.5 2.5 4.5-5',
  pin: 'M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z M9.5 10a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
  spark: 'M12 3v4 M12 17v4 M3 12h4 M17 12h4 M6 6l2.5 2.5 M15.5 15.5L18 18 M6 18l2.5-2.5 M15.5 8.5L18 6',
  lock: 'M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4',
  target: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M7 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0 M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0',
  alert: 'M12 3l10 18H2z M12 10v5 M12 18h.01',
  mail: 'M3 5h18v14H3z M3 6l9 7 9-7',
  hand: 'M7 11V5a1.5 1.5 0 0 1 3 0v5 M10 10V3.5a1.5 1.5 0 0 1 3 0V10 M13 10V4.5a1.5 1.5 0 0 1 3 0V11 M16 11V7.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a7 7 0 0 1-5.6-2.8L3 15a1.5 1.5 0 0 1 2.3-2L7 14',
  arrow: 'M4 12h16 M14 6l6 6-6 6',
  hotel: 'M4 21V4h11v17 M15 9h5v12 M2 21h20 M7.5 8h4 M7.5 12h4 M7.5 16h4 M17.5 13h.01 M17.5 17h.01',
} as const;

export type QsIconName = keyof typeof PATHS;

@Component({
  selector: 'app-qs-icon',
  template: `<svg
    viewBox="0 0 24 24"
    [attr.width]="size()"
    [attr.height]="size()"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path [attr.d]="d()" />
  </svg>`,
  styles: [':host { display: inline-flex; flex: none; line-height: 0; }'],
})
export class QsIconComponent {
  readonly name = input.required<QsIconName>();
  readonly size = input(24);
  protected readonly d = computed(() => PATHS[this.name()] ?? PATHS.spark);
}
