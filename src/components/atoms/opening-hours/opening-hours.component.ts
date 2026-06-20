import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';

@Component({
  selector: 'app-opening-hours',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './opening-hours.component.html',
  styleUrl: './opening-hours.component.scss'
})
export class OpeningHoursComponent {
    openingHours = [
    { day: 'Montag',    hours: '10:00 – 20:00' },
    { day: 'Dienstag',  hours: '10:00 – 20:00' },
    { day: 'Mittwoch',  hours: '10:00 – 20:00' },
    { day: 'Donnerstag',hours: '10:00 – 20:00' },
    { day: 'Freitag',   hours: '10:00 – 20:00' },
    { day: 'Samstag',   hours: '08:00 – 17:00' },
    { day: 'Sonntag',   hours: 'Geschlossen' }
  ];
}
