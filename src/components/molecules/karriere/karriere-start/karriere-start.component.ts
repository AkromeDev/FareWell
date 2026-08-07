import { Component, Input, inject } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { GuideSectionComponent } from 'src/components/molecules/guide';
import { LanguageService } from 'src/services/language.service';

interface StartStep {
  tag: string;
  title: string;
  text: string;
}

/**
 * „So läuft der Start“ — die vier Etappen von der ersten Nachricht bis zum
 * Launch, als Phasen-Raster (.gd-phases). Eine Zeile pro Schritt.
 */
@Component({
  selector: 'app-karriere-start',
  standalone: true,
  imports: [GuideSectionComponent, RevealOnScrollDirective],
  template: `
    <app-guide-section [index]="index" [heading]="heading" [sectionId]="sectionId">
      <p class="gd-lead-p gd-read" appReveal>{{ lead }}</p>

      <div class="gd-phases">
        @for (step of steps; track step.title; let i = $index) {
          <div class="gd-phase" appReveal [revealDelay]="i * 60">
            <div class="gd-phase__n" aria-hidden="true">{{ i + 1 }}</div>
            <div class="gd-phase__tag">{{ step.tag }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
        }
      </div>
    </app-guide-section>
  `,
})
export class KarriereStartComponent {
  @Input() index = '02';
  @Input() sectionId = 'start';

  private readonly language = inject(LanguageService);

  private t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  get heading(): string {
    return this.t('So läuft der Start', 'How the start works');
  }

  get lead(): string {
    return this.t(
      'Vier Etappen von der ersten Nachricht bis zu deinem ersten gebuchten Termin.',
      'Four stages from your first message to your first booked appointment.'
    );
  }

  get steps(): StartStep[] {
    return [
      {
        tag: this.t('Kennenlernen', 'Meet'),
        title: this.t('Erstgespräch', 'First conversation'),
        text: this.t(
          'Wir hören uns deine Idee an und klären Zeiten, Raum und Aufteilung.',
          'We listen to your idea and settle hours, room and the revenue split.'
        ),
      },
      {
        tag: this.t('Ausprobieren', 'Try it'),
        title: this.t('Probetag', 'Trial day'),
        text: this.t(
          'Du arbeitest einen Tag bei uns, wir lernen dein Handwerk kennen.',
          'You work with us for a day and we get to know your craft.'
        ),
      },
      {
        tag: this.t('Festlegen', 'Define'),
        title: this.t('Konzept', 'Concept'),
        text: this.t(
          'Du legst Leistungen und Preise fest, wir bauen deine Seite und die Online-Buchung.',
          'You set your services and prices, we build your page and the online booking.'
        ),
      },
      {
        tag: this.t('Loslegen', 'Launch'),
        title: this.t('Launch mit Google-Business-Setup', 'Launch with Google Business setup'),
        text: this.t(
          'Start-Video, Instagram und dein eigenes Google-Business-Profil gehen live.',
          'Your launch video, Instagram and your own Google Business profile go live.'
        ),
      },
    ];
  }
}
