import { Component, Input, inject } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import {
  GuideNoteComponent,
  GuidePanelComponent,
  GuideSectionComponent,
} from 'src/components/molecules/guide';
import { LanguageService } from 'src/services/language.service';
import {
  KarriereDealItem,
  karriereWeExpect,
  karriereWeGive,
} from 'src/components/pages/karriere/shared/karriere-content';

/**
 * „Dein Deal bei FareWell“ — Philosophie und Konditionen der freiberuflichen
 * Zusammenarbeit. Der Deal ist für jeden Beruf identisch, deshalb steht dieser
 * Block genau einmal hier und wird von allen Detailseiten eingebunden:
 *
 *   <app-karriere-deal index="03" />
 *
 * Die Listen kommen aus karriere-content.ts, aus derselben Quelle wie die
 * „Wir bieten“-Abschnitte der JobPosting-Daten.
 */
@Component({
  selector: 'app-karriere-deal',
  standalone: true,
  imports: [
    GuideSectionComponent,
    GuidePanelComponent,
    GuideNoteComponent,
    RevealOnScrollDirective,
  ],
  template: `
    <app-guide-section [index]="index" [heading]="heading" [sectionId]="sectionId">
      <p class="gd-lead-p gd-read" appReveal>{{ lead }}</p>

      <div class="gd-split">
        <app-guide-panel [heading]="giveHeading" tone="forest">
          @for (item of give; track item.title) {
            <li><strong>{{ item.title }}</strong>: {{ item.text }}</li>
          }
        </app-guide-panel>

        <app-guide-panel
          [heading]="expectHeading"
          tone="sage"
          dots="sand"
          [revealDelay]="60"
        >
          @for (item of expect; track item.title) {
            <li><strong>{{ item.title }}</strong>: {{ item.text }}</li>
          }
        </app-guide-panel>
      </div>

      <div class="gd-read">
        <app-guide-note variant="win" [label]="t('Keine Miete, kein Fixum', 'No rent, no flat fee')">
          {{
            t(
              'Du zahlst keine Raummiete. Wir teilen uns einen Anteil an dem, was du tatsächlich umsetzt: Läuft ein Monat ruhig, zahlst du entsprechend weniger. Die genaue Aufteilung und den Rhythmus legen wir vor deinem Start gemeinsam und schriftlich fest.',
              'You pay no room rent. We share a percentage of what you actually take in, so if a month is quiet you pay correspondingly less. We agree the exact split and rhythm together, in writing, before you start.'
            )
          }}
        </app-guide-note>

        <app-guide-note variant="tip" [label]="t('Du bleibst selbständig', 'You stay independent')">
          {{
            t(
              'Eigene Kund:innen, eigene Preise, eigene Werkzeuge, eigenes Google-Profil. Das hält deinen freien Status sauber, Stichwort Scheinselbständigkeit, und sorgt dafür, dass du alles mitnimmst, was du dir aufgebaut hast.',
              'Your own clients, your own prices, your own tools, your own Google profile. That keeps your freelance status clean, the keyword in Germany being Scheinselbständigkeit, and it means you take everything you build with you.'
            )
          }}
        </app-guide-note>

        <app-guide-note variant="warn" [label]="t('Ehrlich gesagt', 'Honestly')">
          {{
            t(
              'Wir versprechen dir kein festes Einkommen und keine volle Auslastung ab Woche eins. Wir geben dir den Ort, die Werkzeuge und die Sichtbarkeit. Was daraus wird, entscheiden dein Konzept und deine Arbeit.',
              'We do not promise you a fixed income or a full calendar from week one. We give you the place, the tools and the visibility. What grows out of that is decided by your concept and your work.'
            )
          }}
        </app-guide-note>
      </div>
    </app-guide-section>
  `,
})
export class KarriereDealComponent {
  /** Ordnungsnummer des Abschnitts auf der jeweiligen Seite. */
  @Input() index = '03';
  @Input() sectionId = 'deal';

  private readonly language = inject(LanguageService);

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  get heading(): string {
    return this.t('Dein Deal bei FareWell', 'Your deal at FareWell');
  }

  get lead(): string {
    return this.t(
      'Der Deal ist bei uns für alle gleich, ob Kosmetik, Massage, Yoga, Tanz oder ästhetische Medizin: Wir stellen den Ort und alles drumherum, du bringst dein Handwerk und deine Idee.',
      'The deal is the same for everyone here, whether cosmetics, massage, yoga, dance or aesthetic medicine: we provide the place and everything around it, you bring your craft and your idea.'
    );
  }

  get giveHeading(): string {
    return this.t('Was wir geben', 'What we provide');
  }

  get expectHeading(): string {
    return this.t('Was wir erwarten', 'What we expect');
  }

  get give(): KarriereDealItem[] {
    return karriereWeGive((de, en) => this.t(de, en));
  }

  get expect(): KarriereDealItem[] {
    return karriereWeExpect((de, en) => this.t(de, en));
  }
}
