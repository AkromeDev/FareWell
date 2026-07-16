import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { LanguageService } from 'src/services/language.service';

@Component({
  selector: 'app-opening-hours',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './opening-hours.component.html',
  styleUrl: './opening-hours.component.scss'
})
export class OpeningHoursComponent {
  private readonly lang = inject(LanguageService);

  get openingHours() {
    const t = (de: string, en: string) => this.lang.t(de, en);
    const closed = this.lang.t('Geschlossen', 'Closed');
    return [
      { day: t('Montag', 'Monday'),      hours: '10:00 – 20:00', closed: false },
      { day: t('Dienstag', 'Tuesday'),   hours: '10:00 – 20:00', closed: false },
      { day: t('Mittwoch', 'Wednesday'), hours: '10:00 – 20:00', closed: false },
      { day: t('Donnerstag', 'Thursday'),hours: '10:00 – 20:00', closed: false },
      { day: t('Freitag', 'Friday'),     hours: '10:00 – 20:00', closed: false },
      { day: t('Samstag', 'Saturday'),   hours: '08:00 – 17:00', closed: false },
      { day: t('Sonntag', 'Sunday'),     hours: closed,          closed: true }
    ];
  }
}
