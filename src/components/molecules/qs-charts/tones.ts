/**
 * Diagrammfarben der internen Seiten, alle aus der Idyllic-Field-Palette
 * (src/styles/themes/idyllic-field.scss). Jede Fläche trägt zusätzlich eine
 * Beschriftung mit Zahl: die Farbe ist nie der einzige Bedeutungsträger.
 */
export type ChartTone = 'emerald' | 'gold' | 'sage' | 'ink' | 'muted' | 'rose';

export const TONE_FILL: Record<ChartTone, string> = {
  emerald: '#3E5A47',
  gold: '#B8924A',
  sage: '#8FA07A',
  ink: '#2B3328',
  muted: '#D9CDB6',
  rose: '#A4493D',
};

/** Ein beschrifteter Teil eines Diagramms, Text schon in der Seitensprache. */
export interface ChartPart {
  label: string;
  value: number;
  tone: ChartTone;
  /** Fertig formatierter Wert für die Legende, z. B. „70 %“ oder „32,32 €“. */
  display: string;
}
