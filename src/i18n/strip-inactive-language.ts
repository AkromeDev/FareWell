/**
 * Prerender, just before a page is serialized: removes every element that
 * the language CSS hides on this page, so the HTML file holds only the
 * page's own language (SEO audit #1). Crawlers that read the raw file,
 * without applying styles, then see one language instead of two.
 *
 * The selectors are exactly the critical rule in src/index.html (and in
 * styles.scss and _guide.scss): only what is display:none anyway goes. This is
 * safe because the browser does not hydrate the prerendered DOM: it renders
 * the app again from the templates, with both languages, so switching the
 * language and the /uk overlay work as before. On /uk pages it runs after
 * finalizeUkDocument, which marks the translated and fallback blocks.
 */
const HIDDEN_BY_LANGUAGE_CSS = [
  "[data-lang='de'] .lang.en",
  "[data-lang='en'] .lang.de",
  "[data-lang='uk'] .lang.de:not([data-i18n='uk'])",
  "[data-lang='uk'] .lang.en:not([data-i18n='fallback'])",
].join(', ');

export function stripInactiveLanguage(doc: Document): number {
  const hidden = Array.from(doc.querySelectorAll(HIDDEN_BY_LANGUAGE_CSS));
  for (const el of hidden) el.parentNode?.removeChild(el);
  return hidden.length;
}
