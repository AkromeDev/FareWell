import { Component, inject } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { LanguageService } from 'src/services/language.service';
import {
  GuideChecklistComponent,
  GuideNoteComponent,
  GuidePanelComponent,
} from 'src/components/molecules/guide';

/**
 * „Was wir von dir brauchen“: die vollständige Liste der Angaben, die FareWell
 * für einen Kostenvoranschlag an die Krankenkasse benötigt.
 *
 * Bewusst eine eigene Komponente statt zweimal derselbe Markup-Block: Beide
 * Kassen-Leitfäden (trans Personen und hormonell bedingter Haarwuchs) zeigen
 * denselben Abschnitt, und er muss identisch bleiben. Fehlt eine Angabe,
 * bleibt der Vorgang im Alltag liegen, deshalb steht hier alles, nicht die
 * halbe Liste.
 *
 * Der Abschnittsrahmen (`app-guide-section` mit Nummer, Überschrift und
 * `sectionId="unterlagen"`) bleibt bei der jeweiligen Seite, damit die
 * Nummerierung des Leitfadens stimmt.
 */
@Component({
  selector: 'app-kostenvoranschlag-unterlagen',
  standalone: true,
  imports: [
    GuidePanelComponent,
    GuideChecklistComponent,
    GuideNoteComponent,
    RevealOnScrollDirective,
  ],
  templateUrl: './kostenvoranschlag-unterlagen.component.html',
})
export class KostenvoranschlagUnterlagenComponent {
  private readonly language = inject(LanguageService);

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }
}
