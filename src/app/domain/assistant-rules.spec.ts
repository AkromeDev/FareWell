import rules from './assistant-rules.json';
import { LEVEL44 } from './level44';
import { DR_LEO_SITE, LEVEL44_SITE } from './partner-sites';

/**
 * The referral rules of the planned chat assistant (AI-SEO-STRATEGY.md, "Chat
 * assistant"). Nothing runs yet; the rules are data so that the three sites
 * refer to each other the same way from the first day.
 */
describe('assistant-rules.json', () => {
  const hosts = ['farewell.salon', new URL(DR_LEO_SITE.origin).host, new URL(LEVEL44.brandSite.origin).host];

  it('says that no assistant is built yet', () => {
    expect(rules.status).toBe('planned, not built');
    expect(rules.site).toBe('farewell.salon');
  });

  it('hands over to Salonkee, WhatsApp or the phone, and nowhere else', () => {
    expect(rules.handsOverTo.map((item) => item.name)).toEqual(['Salonkee', 'WhatsApp', 'Phone']);
    for (const item of rules.handsOverTo) {
      if (item.url === null) continue;
      const ok = item.url.startsWith('tel:+49') || new URL(item.url).host === 'salonkee.de';
      expect(ok).withContext(item.name).toBeTrue();
    }
  });

  it('refers only to the three sites', () => {
    for (const referral of rules.refersTo) {
      expect(hosts).withContext(referral.to).toContain(new URL(referral.url).host);
      if (referral.ownSite) expect(hosts).withContext(referral.to).toContain(new URL(referral.ownSite).host);
    }
    expect(rules.refersTo.some((r) => /doctor/.test(r.topic) && /Leo/.test(r.to))).toBeTrue();
    expect(rules.refersTo.some((r) => /Breathwork/.test(r.topic) && /LEVEL 44/.test(r.to))).toBeTrue();
  });

  it('sends a visitor to a partner site only once that site is public', () => {
    for (const referral of rules.refersTo) {
      if (!referral.ownSite) continue;
      const site = [DR_LEO_SITE, LEVEL44_SITE].find((s) => s.origin === referral.ownSite);
      expect(site).withContext(referral.to).toBeDefined();
      expect(referral.ownSitePublic).withContext(referral.to).toBe(site!.public);
      // Until then the visitor stays on this site.
      if (!referral.ownSitePublic) expect(new URL(referral.url).host).toBe('farewell.salon');
    }
  });

  it('never promises, judges or names competitors', () => {
    expect(rules.never).toEqual([
      'Promises of results',
      "A judgement on someone's skin or hair",
      'Anything about named competitors',
    ]);
  });

  it('keeps the four fixed answers with their exact numbers', () => {
    const byId = Object.fromEntries(rules.fixedAnswers.map((answer) => [answer.id, answer]));
    expect(Object.keys(byId)).toEqual(['complication', 'crisis', 'health-data', 'under-18']);
    expect(byId['complication'].numbers).toEqual(['116 117', '112']);
    expect(byId['complication'].says).toContain('116 117');
    expect(byId['complication'].says).toContain('112');
    expect(byId['crisis'].numbers).toEqual(['0800 111 0 111']);
    expect(byId['crisis'].says).toContain('0800 111 0 111');
    expect(byId['under-18'].says).toMatch(/No information on aesthetic treatments/);
  });
});
