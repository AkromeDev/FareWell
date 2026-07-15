/**
 * Guide-Baukasten (Atomic Design) für Ratgeber- und FAQ-Seiten im Look der
 * Onboarding-Seite: Forest/Sage/Sand-Palette, Fraunces-Serifen, Reveal-Motion.
 * Das zugehörige CSS lebt zentral in src/styles/components/_guide.scss unter
 * dem `.gd`-Scope — Seiten wickeln ihren Inhalt daher in `<div class="gd">`.
 */
export { GuidePillComponent } from 'src/components/atoms/guide-pill/guide-pill.component';
export { GuideHeroComponent } from './guide-hero/guide-hero.component';
export { GuideStatsComponent, type GuideStat } from './guide-stats/guide-stats.component';
export { GuideSectionComponent } from './guide-section/guide-section.component';
export { GuideCardComponent } from './guide-card/guide-card.component';
export { GuidePanelComponent } from './guide-panel/guide-panel.component';
export { GuideNoteComponent } from './guide-note/guide-note.component';
export { GuideStepsComponent } from './guide-steps/guide-steps.component';
export { GuideChecklistComponent } from './guide-checklist/guide-checklist.component';
export { GuideOfferComponent } from './guide-offer/guide-offer.component';
export { GuideCtaComponent } from './guide-cta/guide-cta.component';
export { GuideTocComponent, type GuideTocItem } from './guide-toc/guide-toc.component';
export { FaqItemComponent } from './faq-item/faq-item.component';

import { GuidePillComponent } from 'src/components/atoms/guide-pill/guide-pill.component';
import { GuideHeroComponent } from './guide-hero/guide-hero.component';
import { GuideStatsComponent } from './guide-stats/guide-stats.component';
import { GuideSectionComponent } from './guide-section/guide-section.component';
import { GuideCardComponent } from './guide-card/guide-card.component';
import { GuidePanelComponent } from './guide-panel/guide-panel.component';
import { GuideNoteComponent } from './guide-note/guide-note.component';
import { GuideStepsComponent } from './guide-steps/guide-steps.component';
import { GuideChecklistComponent } from './guide-checklist/guide-checklist.component';
import { GuideOfferComponent } from './guide-offer/guide-offer.component';
import { GuideCtaComponent } from './guide-cta/guide-cta.component';
import { GuideTocComponent } from './guide-toc/guide-toc.component';
import { FaqItemComponent } from './faq-item/faq-item.component';

/** Komplettes Set für `imports: [...GUIDE_COMPONENTS]` auf Guide-Seiten. */
export const GUIDE_COMPONENTS = [
  GuidePillComponent,
  GuideHeroComponent,
  GuideStatsComponent,
  GuideSectionComponent,
  GuideCardComponent,
  GuidePanelComponent,
  GuideNoteComponent,
  GuideStepsComponent,
  GuideChecklistComponent,
  GuideOfferComponent,
  GuideCtaComponent,
  GuideTocComponent,
  FaqItemComponent,
] as const;
