import { LEVEL44 } from './level44';

/**
 * The two sites that share a roof with farewell.salon (AI-SEO-STRATEGY.md,
 * "The three sites"). `public` says whether a visitor may be sent there: while
 * it is false, every link stays on farewell.salon's own page for that partner.
 * One value per site, so the day a site goes public is one edit.
 */
export interface PartnerSite {
  origin: string;
  public: boolean;
  /** This site's own page about the partner, in its German form. */
  ownPage: string;
}

/** Dr. med. Andrea Leo's site. Built, not published (noindex) on 13.11.2026. */
export const DR_LEO_SITE: PartnerSite = {
  origin: 'https://drleoaesthetic.de',
  public: false,
  ownPage: '/behandlungen/aesthetische-medizin',
};

/** Franziska Preusche's LEVEL 44 site. Origin and switch come from level44.json. */
export const LEVEL44_SITE: PartnerSite = {
  origin: LEVEL44.brandSite.origin,
  public: LEVEL44.brandSite.public,
  ownPage: '/behandlungen/level-44',
};
