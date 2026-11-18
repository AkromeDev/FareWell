/*
 * Das einzige eigene Skript der eigenständigen Anzeigenseiten
 * (src/app/domain/ad-pages.json, tools/standalone-ad-pages.mjs).
 *
 * Diese Seiten werden ohne das Skript der Website ausgeliefert: Angular läuft
 * dort nicht. Übrig bleiben zwei Dinge, die ein Klick auslösen muss, und nur
 * die stehen hier:
 *
 * 1. Der Cookie-Banner. Sein Markup schreibt das Prerendering versteckt in die
 *    Datei (CookieBannerComponent, staticMarkup). Den Stand hält wie überall
 *    window.fwConsent aus src/index.html.
 * 2. Die Klicks auf Buchen, Telefon und WhatsApp als Analytics-Ereignisse,
 *    mit denselben Namen und Feldern wie
 *    src/components/pages/promotions/ad-tracking.ts.
 *
 * Kein Wirkstoff- oder Markenname in dieser Datei, auch nicht im Kommentar:
 * der Build prüft sie.
 */
(function () {
  'use strict';

  // --- 1. Cookie-Banner ----------------------------------------------------
  var api = window.fwConsent;
  var sheet = document.querySelector('[data-ad-consent]');

  if (api && sheet) {
    var details = sheet.querySelector('[data-consent-details]');
    var toggle = sheet.querySelector('[data-consent="toggle"]');
    var analytics = sheet.querySelector('[data-consent-box="an"]');
    var ads = sheet.querySelector('[data-consent-box="ad"]');

    var showDetails = function (open) {
      if (!details) { return; }
      details.hidden = !open;
      if (toggle) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = toggle.getAttribute(open ? 'data-label-close' : 'data-label-open');
      }
    };

    // Wer über den Footer zurückkommt, sieht seine bisherige Wahl und landet
    // gleich auf Ebene 2. Beim ersten Besuch stehen beide Schalter auf aus.
    var openSheet = function () {
      var stored = api.state();
      if (analytics) { analytics.checked = !!(stored && stored.an); }
      if (ads) { ads.checked = !!(stored && stored.ad); }
      showDetails(stored !== null);
      sheet.hidden = false;
    };

    var choose = function (wantsAnalytics, wantsAds) {
      api.set(wantsAnalytics, wantsAds);
      sheet.hidden = true;
    };

    sheet.addEventListener('click', function (event) {
      var button = event.target.closest('[data-consent]');
      if (!button) { return; }
      var action = button.getAttribute('data-consent');
      if (action === 'accept') {
        choose(true, true);
      } else if (action === 'reject') {
        choose(false, false);
      } else if (action === 'save') {
        choose(!!(analytics && analytics.checked), !!(ads && ads.checked));
      } else if (action === 'toggle') {
        showDetails(!!details && details.hidden);
      }
    });

    document.addEventListener('click', function (event) {
      if (event.target.closest('[data-consent="open"]')) { openSheet(); }
    });

    if (api.needsBanner()) { openSheet(); }
  }

  // --- 2. Klicks auf Buchen, Telefon, WhatsApp ------------------------------
  document.addEventListener('click', function (event) {
    var link = event.target.closest('[data-ad-click]');
    if (!link || typeof window.gtag !== 'function') { return; }

    var kind = link.getAttribute('data-ad-click');
    var page = location.pathname.replace(/^\/en(?=\/)/, '').replace(/\/$/, '');
    var where = link.getAttribute('data-ad-location') || '';

    if (kind === 'booking') {
      window.gtag('event', 'generate_lead', {
        event_category: 'engagement',
        event_label: 'Anzeigenseite ' + page,
        destination: 'salonkee',
        site: 'farewell.salon',
        page: page,
        location: where
      });
    } else if (kind === 'phone' || kind === 'whatsapp') {
      window.gtag('event', kind + '_click', { site: 'farewell.salon', page: page, location: where });
    }
  });
})();
