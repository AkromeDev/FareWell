/**
 * Karriere-Baukasten: die Blöcke, die auf jeder Karriere-Seite identisch sind.
 * Der Deal, der FAQ-Block und die Bewerbungskarte leben genau einmal hier —
 * eine Änderung schlägt damit auf allen Berufsseiten gleichzeitig durch.
 *
 * Optisch bauen die Komponenten auf dem Guide-Baukasten auf (`.gd`-Scope in
 * src/styles/components/_guide.scss); Seiten wickeln ihren Inhalt daher wie
 * die Ratgeber in `<div class="gd">`.
 */
export { KarriereDealComponent } from './karriere-deal/karriere-deal.component';
export { KarriereFaqComponent } from './karriere-faq/karriere-faq.component';
export { KarriereApplyComponent } from './karriere-apply/karriere-apply.component';
export { KarriereStartComponent } from './karriere-start/karriere-start.component';
export { KarriereZeitenComponent } from './karriere-zeiten/karriere-zeiten.component';
export { KarriereKanaeleComponent } from './karriere-kanaele/karriere-kanaele.component';
export {
  type KarriereRole,
  type ZeitLane,
  formatTime,
} from './karriere-zeiten/karriere-zeiten.model';
export {
  GROUPON_BEISPIELE,
  type GrouponBeispiel,
  kanaeleHeading,
} from './karriere-kanaele/karriere-kanaele.model';

import { KarriereDealComponent } from './karriere-deal/karriere-deal.component';
import { KarriereFaqComponent } from './karriere-faq/karriere-faq.component';
import { KarriereApplyComponent } from './karriere-apply/karriere-apply.component';
import { KarriereStartComponent } from './karriere-start/karriere-start.component';
import { KarriereZeitenComponent } from './karriere-zeiten/karriere-zeiten.component';
import { KarriereKanaeleComponent } from './karriere-kanaele/karriere-kanaele.component';

/** Komplettes Set für `imports: [...KARRIERE_COMPONENTS]`. */
export const KARRIERE_COMPONENTS = [
  KarriereDealComponent,
  KarriereFaqComponent,
  KarriereApplyComponent,
  KarriereStartComponent,
  KarriereZeitenComponent,
  KarriereKanaeleComponent,
] as const;
