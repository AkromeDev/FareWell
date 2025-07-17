import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-epilation-history',
  imports: [CommonModule],
  templateUrl: './epilation-history.component.html',
  styleUrl: './epilation-history.component.scss'
})
export class EpilationHistoryComponent {
  events = [
    {
      year: '1875',
      description: 'Charles Michel M.D. entfernt erstmals mit galvanischem Strom (Elektrolyse) eingewachsene Wimpern'
    },
    {
      year: '1887',
      description: 'Heinrich Hertz stellt mittels Oszillator hochfrequenten Strom (Thermolyse) her'
    },
    {
      year: '1916',
      description: 'Prof. Paul Klee entwickelt das "multiple needle Verfahren" (4 – 6 Sonden gleichzeitig)'
    },
    {
      year: '1920',
      description: 'Photoepilation mit weichen Röntgenstrahlen, später wegen Hautkrebsgefahr abgelehnt'
    },
    {
      year: '1923',
      description: 'Dr. Jules Bordier nutzt Thermolyse zur Epilation'
    },
    {
      year: '1938',
      description: 'Blendmethode wird durch Henri St. Pierre & Arthur Hinkel entwickelt'
    },
    {
      year: '1948',
      description: 'Blendmethode wird patentiert'
    },
    {
      year: '1968',
      description: 'Arthur Hinkel verfasst erstes maßgebliches Lehrbuch zur Epilation'
    },
    {
      year: '1970',
      description: 'Hochfrequenzpinzette wird für Epilation verwendet'
    },
    {
      year: '1989',
      description: '"Pinzettenteil", keine permanente oder dauerhafte Haarentfernung möglich'
    }
  ];
}
