/**
 * Klicks auf den Anzeigenseiten als Analytics-Ereignisse, damit die Kampagnen
 * auf Buchungen und Kontakte statt auf Seitenaufrufe optimiert werden können.
 * Buchen: dasselbe generate_lead wie die übrigen Buchungs-Buttons der Seite.
 * Telefon und WhatsApp: phone_click und whatsapp_click (AI-SEO-STRATEGY.md,
 * „Shared analytics events“). Ohne Einwilligung gibt es kein gtag, dann
 * passiert nichts; der Link öffnet in jedem Fall normal.
 */
export type AdClick = 'booking' | 'phone' | 'whatsapp';

export function trackAdClick(kind: AdClick, page: string, location: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  const common = { site: 'farewell.salon', page, location };
  if (kind === 'booking') {
    window.gtag('event', 'generate_lead', {
      event_category: 'engagement',
      event_label: `Anzeigenseite ${page}`,
      destination: 'salonkee',
      ...common,
    });
  } else {
    window.gtag('event', kind === 'phone' ? 'phone_click' : 'whatsapp_click', common);
  }
}
