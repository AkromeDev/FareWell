import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from 'src/services/language.service';

@Component({
  selector: 'app-epilation-history',
  imports: [CommonModule],
  templateUrl: './epilation-history.component.html',
  styleUrl: './epilation-history.component.scss'
})
export class EpilationHistoryComponent {
  private readonly lang = inject(LanguageService);

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  get events() {
    const t = (de: string, en: string) => this.lang.t(de, en);
    return [
      {
        year: '1875',
        description: t(
          'Charles Michel M.D. entfernt erstmals mit galvanischem Strom (Elektrolyse) eingewachsene Wimpern',
          'Charles Michel M.D. first removes ingrown eyelashes using galvanic current (electrolysis)'
        )
      },
      {
        year: '1887',
        description: t(
          'Heinrich Hertz stellt mittels Oszillator hochfrequenten Strom (Thermolyse) her',
          'Heinrich Hertz generates high-frequency current (thermolysis) with an oscillator'
        )
      },
      {
        year: '1916',
        description: t(
          'Prof. Paul Klee entwickelt das "multiple needle Verfahren" (4 – 6 Sonden gleichzeitig)',
          'Prof. Paul Klee develops the "multiple needle method" (4 to 6 probes at once)'
        )
      },
      {
        year: '1920',
        description: t(
          'Photoepilation mit weichen Röntgenstrahlen, später wegen Hautkrebsgefahr abgelehnt',
          'Photoepilation with soft X-rays, later rejected because of the risk of skin cancer'
        )
      },
      {
        year: '1923',
        description: t(
          'Dr. Jules Bordier nutzt Thermolyse zur Epilation',
          'Dr. Jules Bordier uses thermolysis for hair removal'
        )
      },
      {
        year: '1938',
        description: t(
          'Blendmethode wird durch Henri St. Pierre & Arthur Hinkel entwickelt',
          'The blend method is developed by Henri St. Pierre and Arthur Hinkel'
        )
      },
      {
        year: '1948',
        description: t('Blendmethode wird patentiert', 'The blend method is patented')
      },
      {
        year: '1968',
        description: t(
          'Arthur Hinkel verfasst erstes maßgebliches Lehrbuch zur Epilation',
          'Arthur Hinkel writes the first authoritative textbook on electrolysis'
        )
      },
      {
        year: '1970',
        description: t(
          'Hochfrequenzpinzette wird für Epilation verwendet',
          'High-frequency tweezers are used for hair removal'
        )
      },
      {
        year: '1989',
        description: t(
          '"Pinzettenteil", keine permanente oder dauerhafte Haarentfernung möglich',
          '"Tweezer devices" appear, offering no permanent or lasting hair removal'
        )
      }
    ];
  }
}
