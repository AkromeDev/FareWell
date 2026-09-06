import { Component, Input, inject } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { LanguageService } from 'src/services/language.service';
import {
  GuideChecklistComponent,
  GuideNoteComponent,
  GuidePanelComponent,
} from 'src/components/molecules/guide';

/** Welcher Kassen-Leitfaden die Liste zeigt. */
export type UnterlagenTrack = 'trans' | 'hormonell';

/**
 * Die vollständige Liste der Angaben, die FareWell für einen Kostenvoranschlag
 * an die Krankenkasse benötigt.
 *
 * Bewusst eine eigene Komponente statt zweimal derselbe Markup-Block: Beide
 * Kassen-Leitfäden (trans Personen und hormonell bedingter Haarwuchs) zeigen
 * denselben Abschnitt. Fehlt eine Angabe, bleibt der Vorgang im Alltag liegen,
 * deshalb steht hier alles, nicht die halbe Liste.
 *
 * Identisch bleiben auf beiden Seiten die Daten für das Dokument selbst, der
 * nachgereichte Bescheid und der Hinweis, warum wir nach der Gesundheit fragen.
 * `track` unterscheidet nur die drei Stellen, an denen die Leitfäden fachlich
 * auseinandergehen:
 *
 *   - der Einstieg: der Trans-Leitfaden führt über eine einzige erste Mail,
 *     der hormonelle über den Beratungstermin;
 *   - der ärztliche Nachweis: F64.0 wird ausdrücklich nur auf der Trans-Seite
 *     genannt, damit beide Seiten nicht um dieselben Suchbegriffe konkurrieren
 *     (siehe Kommentar in krankenkasse-hormonell.component.ts);
 *   - Haut und Fotos: auf der Trans-Seite steht dabei, wozu wir sie brauchen.
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
  /**
   * Pflichtangabe: Ein stiller Standardwert würde einer Seite die falsche
   * Diagnose unterschieben, und das fällt in der Übersetzung niemandem auf.
   */
  @Input({ required: true }) track!: UnterlagenTrack;

  private readonly language = inject(LanguageService);

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }
}
