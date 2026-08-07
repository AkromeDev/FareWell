import { Component, Input, inject } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { GuideNoteComponent, GuideSectionComponent } from 'src/components/molecules/guide';
import { LanguageService } from 'src/services/language.service';
import {
  GRID_END,
  GRID_START,
  KarriereRole,
  LANE_ORDER,
  ROLE_LANE,
  ZEIT_WOCHE,
  ZeitBand,
  ZeitLane,
  ZeitTag,
  bandHeight,
  bandTop,
  formatTime,
} from './karriere-zeiten.model';

interface RenderedBand {
  band: ZeitBand;
  top: number;
  height: number;
  left: number;
  width: number;
  own: boolean;
  label: string;
}

interface RenderedDay {
  key: string;
  head: string;
  full: string;
  bands: RenderedBand[];
}

/**
 * „Zeiten und Raumbelegung“: Wochenraster plus die Regeln dahinter.
 *
 * Das Raster zeigt drei Spuren nebeneinander — Behandlungen, Massage, Kurse —
 * und färbt die Spur der lesenden Rolle grün. Bewusst zeigt es *Möglichkeit*,
 * nicht Belegung: Massage- und Kursfenster überlappen sich, und wer zuerst
 * bucht, bekommt den Platz.
 *
 *   <app-karriere-zeiten role="kurs" index="03" />
 */
@Component({
  selector: 'app-karriere-zeiten',
  standalone: true,
  imports: [GuideSectionComponent, GuideNoteComponent, RevealOnScrollDirective],
  template: `
    <app-guide-section [index]="index" [heading]="heading" [sectionId]="sectionId">
      <p class="gd-lead-p gd-read" appReveal>{{ lead }}</p>

      <div class="kz" appReveal>
        <div class="kz__scroll">
          <div class="kz__board" role="img" [attr.aria-label]="ariaLabel">
            <div class="kz__corner" aria-hidden="true"></div>
            @for (day of days; track day.key) {
              <div class="kz__head" [attr.title]="day.full">{{ day.head }}</div>
            }

            <div class="kz__gutter" aria-hidden="true">
              @for (hour of hours; track hour) {
                <span class="kz__hour" [style.top.%]="hourTop(hour)">{{ hourLabel(hour) }}</span>
              }
            </div>

            @for (day of days; track day.key) {
              <div class="kz__col">
                @for (hour of hours; track hour) {
                  <div class="kz__rule" [style.top.%]="hourTop(hour)" aria-hidden="true"></div>
                }
                @for (item of day.bands; track $index) {
                  <div
                    class="kz__band"
                    [class]="'kz__band--' + item.band.lane"
                    [class.is-own]="item.own"
                    [class.is-reserved]="item.band.reserved"
                    [style.top.%]="item.top"
                    [style.height.%]="item.height"
                    [style.left.%]="item.left"
                    [style.width.%]="item.width"
                    [attr.title]="item.label"
                  ></div>
                }
              </div>
            }
          </div>
        </div>

        <ul class="kz__legend">
          @for (lane of lanes; track lane) {
            <li>
              <span
                class="kz__chip"
                [class]="'kz__band--' + lane"
                [class.is-own]="lane === ownLane"
                aria-hidden="true"
              ></span>
              {{ laneLabel(lane) }}
            </li>
          }
          <li>
            <span class="kz__chip kz__band--kurs is-reserved" aria-hidden="true"></span>
            {{ t('letzter Dienstag im Monat: Yoga', 'last Tuesday of the month: yoga') }}
          </li>
        </ul>
      </div>

      <div class="gd-read">
        <p>{{ rhythmText }}</p>
        <p>{{ ownText }}</p>
        <p>{{ rulesText }}</p>

        <app-guide-note variant="win" [label]="t('Aktuell reserviert', 'Currently reserved')">
          {{ reservedText }}
        </app-guide-note>
      </div>
    </app-guide-section>
  `,
  styles: [
    `
      .kz {
        margin-top: 1.4rem;
      }

      /* Auf schmalen Schirmen scrollt das Raster seitwärts, statt die Spalten
         unlesbar schmal zu quetschen. */
      .kz__scroll {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        border: 1px solid var(--gd-line);
        border-radius: 12px;
        background: var(--gd-surface);
        box-shadow: var(--gd-shadow);
        padding: 0.9rem 1rem 1rem;
      }

      .kz__board {
        --kz-body: 460px;
        display: grid;
        grid-template-columns: 2.9rem repeat(7, minmax(74px, 1fr));
        grid-template-rows: auto var(--kz-body);
        gap: 0 4px;
        min-width: 640px;
      }

      .kz__corner {
        grid-row: 1;
      }

      .kz__head {
        grid-row: 1;
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--gd-faint);
        padding-bottom: 0.45rem;
      }

      .kz__gutter,
      .kz__col {
        grid-row: 2;
        position: relative;
      }

      .kz__hour {
        position: absolute;
        right: 0.35rem;
        transform: translateY(-50%);
        font-size: 10px;
        font-variant-numeric: tabular-nums;
        color: var(--gd-faint);
      }

      .kz__col {
        border-radius: 8px;
        background: var(--gd-surface-2);
        overflow: hidden;
      }

      .kz__rule {
        position: absolute;
        left: 0;
        right: 0;
        height: 1px;
        background: var(--gd-line);
        opacity: 0.65;
      }

      /* Der Zwischenraum zwischen den Spuren steckt in den gebundenen
         left/width-Werten (LANE_GAP), nicht in margin: Bei absolut
         positionierten Bändern würde eine Inline-Margin sie verschieben,
         statt sie schmaler zu machen. */
      .kz__band {
        position: absolute;
        border-radius: 5px;
        border: 1px solid;
        box-sizing: border-box;
      }

      /* Kosmetik und ästhetische Medizin: das blasse Rosa des Studiobetriebs. */
      .kz__band--behandlung {
        background: #f3dee1;
        border-color: #dcb6bc;
      }

      .kz__band--massage {
        background: var(--gd-sand);
        border-color: var(--gd-line-strong);
      }

      .kz__band--kurs {
        background: #dfe7d6;
        border-color: #b9c9ab;
      }

      /* Die Spur der lesenden Rolle: das grüne „hier ist Platz für dich“. */
      .kz__band.is-own {
        background: #bcd9b6;
        border-color: var(--gd-ok);
        box-shadow: inset 0 0 0 1px rgba(74, 122, 78, 0.25);
      }

      /* Fest belegtes Fenster: schraffiert statt flächig. */
      .kz__band.is-reserved {
        background-image: repeating-linear-gradient(
          -45deg,
          rgba(31, 40, 28, 0.22) 0,
          rgba(31, 40, 28, 0.22) 2px,
          transparent 2px,
          transparent 6px
        );
      }

      .kz__legend {
        list-style: none;
        margin: 0.9rem 0 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem 1.3rem;
        font-size: 13px;
        color: var(--gd-muted);
      }

      .kz__legend li {
        display: flex;
        align-items: center;
        gap: 0.45rem;
      }

      .kz__chip {
        width: 15px;
        height: 15px;
        flex: none;
        border-radius: 4px;
        border: 1px solid;
      }

      @media (max-width: 600px) {
        .kz__scroll {
          padding: 0.75rem 0.75rem 0.85rem;
        }

        .kz__board {
          --kz-body: 400px;
        }
      }
    `,
  ],
})
export class KarriereZeitenComponent {
  @Input() role: KarriereRole = 'kurs';
  @Input() index = '03';
  @Input() sectionId = 'zeiten';

  readonly lanes = LANE_ORDER;

  private readonly language = inject(LanguageService);

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  get ownLane(): ZeitLane | null {
    return ROLE_LANE[this.role];
  }

  /** Volle Stunden des Rasters, für Linien und Beschriftung. */
  get hours(): number[] {
    return Array.from({ length: GRID_END - GRID_START + 1 }, (_, i) => GRID_START + i);
  }

  hourTop(hour: number): number {
    return ((hour - GRID_START) / (GRID_END - GRID_START)) * 100;
  }

  hourLabel(hour: number): string {
    return String(hour).padStart(2, '0');
  }

  /**
   * Pro Sprache und Rolle gecacht: Der Header hört auf window:scroll, damit
   * läuft Change Detection bei jedem Scrollschritt. Ohne Cache würde das
   * Raster (7 Tage × bis zu 4 Bänder) dabei jedes Mal neu aufgebaut.
   */
  private daysCache: { key: string; days: RenderedDay[] } | null = null;

  get days(): RenderedDay[] {
    const key = `${this.language.lang()}|${this.role}`;
    if (this.daysCache?.key !== key) {
      this.daysCache = { key, days: this.buildDays() };
    }
    return this.daysCache.days;
  }

  private buildDays(): RenderedDay[] {
    const isEn = this.language.lang() === 'en';
    const laneWidth = 100 / LANE_ORDER.length;
    /** Luft zwischen zwei Spuren, in Prozent der Spaltenbreite. */
    const gap = 2;

    return ZEIT_WOCHE.map((day: ZeitTag) => ({
      key: day.key,
      head: isEn ? day.shortEn : day.shortDe,
      full: isEn ? day.en : day.de,
      bands: day.bands.map((band) => ({
        band,
        top: bandTop(band),
        height: bandHeight(band),
        left: LANE_ORDER.indexOf(band.lane) * laneWidth + gap / 2,
        width: laneWidth - gap,
        own: band.lane === this.ownLane,
        label: `${this.laneLabel(band.lane)}: ${formatTime(band.start)}–${formatTime(band.end)}`,
      })),
    }));
  }

  laneLabel(lane: ZeitLane): string {
    switch (lane) {
      case 'behandlung':
        return this.t('Kosmetik & ästhetische Medizin', 'Cosmetics & aesthetic medicine');
      case 'massage':
        return this.t('Massage', 'Massage');
      case 'kurs':
        return this.t('Yoga & Tanz', 'Yoga & dance');
    }
  }

  /** Textfassung des Rasters für Screenreader. */
  get ariaLabel(): string {
    const isEn = this.language.lang() === 'en';
    const week = ZEIT_WOCHE.map((day) => {
      const bands = day.bands
        .map((b) => `${this.laneLabel(b.lane)} ${formatTime(b.start)}–${formatTime(b.end)}`)
        .join(', ');
      return `${isEn ? day.en : day.de}: ${bands || (isEn ? 'closed' : 'geschlossen')}`;
    }).join('. ');

    return this.t(
      `Wochenraster der Raumbelegung. ${week}.`,
      `Weekly grid of room use. ${week}.`
    );
  }

  get heading(): string {
    return this.t('Zeiten und Raumbelegung', 'Hours and room use');
  }

  get lead(): string {
    if (this.role === 'uebersicht') {
      return this.t(
        'Wann im Studio was läuft: drei Spuren, die sich die Woche teilen.',
        'What runs when in the studio: three lanes sharing the week.'
      );
    }
    return this.t(
      'Wann im Studio was läuft, und wo dein Fenster liegt. Grün ist die Spur, die dir gehört.',
      'What runs when in the studio, and where your window sits. Green is the lane that belongs to you.'
    );
  }

  /** Der Grundtakt des Hauses — für alle Rollen derselbe Absatz. */
  get rhythmText(): string {
    return this.t(
      'Das Studio hat einen festen Grundtakt. Kosmetik und ästhetische Medizin laufen montags bis freitags von 10:00 bis 20:00 Uhr und samstags von 08:00 bis 17:00 Uhr. Massagen sind darüber hinaus von 08:00 bis 22:00 Uhr möglich, weil sie einen eigenen Raum haben. Yoga und Tanz brauchen Musik, Bewegung und Platz und passen deshalb nicht neben eine laufende Behandlung: Ihre Fenster liegen davor und danach, montags bis freitags von 07:00 bis 09:00 Uhr und ab 19:30 Uhr, samstags ab 18:00 Uhr und sonntags zu jeder Zeit.',
      'The studio runs to a fixed rhythm. Cosmetics and aesthetic medicine operate Monday to Friday from 10:00 to 20:00 and on Saturdays from 08:00 to 17:00. Massages are possible beyond that, from 08:00 to 22:00, because they have a room of their own. Yoga and dance need music, movement and space, so they do not sit next to a treatment in progress: their windows are before and after, Monday to Friday from 07:00 to 09:00 and from 19:30, on Saturdays from 18:00 and on Sundays at any time.'
    );
  }

  /** Was der Takt konkret für die lesende Rolle bedeutet. */
  get ownText(): string {
    switch (this.role) {
      case 'kosmetik':
        return this.t(
          'Dein Fenster ist der Hauptbetrieb: montags bis freitags von 10:00 bis 20:00 Uhr, samstags von 08:00 bis 17:00 Uhr. Innerhalb dieser Zeiten legst du deine festen Tage selbst fest, und eine Anwesenheitspflicht ohne gebuchte Termine gibt es nicht. Kurse mit Musik können in deinen Behandlungszeiten nicht stattfinden, du arbeitest also nie gegen eine Tanzstunde an.',
          'Your window is the main operation: Monday to Friday from 10:00 to 20:00, Saturdays from 08:00 to 17:00. Within those hours you set your own fixed days, and there is no obligation to be present without booked appointments. Classes with music cannot take place during your treatment hours, so you never work against a dance lesson.'
        );
      case 'botox':
        return this.t(
          'Dein Fenster liegt im Behandlungsbetrieb: montags bis freitags von 10:00 bis 20:00 Uhr, samstags von 08:00 bis 17:00 Uhr. Weil viele neben Praxis oder Klinik arbeiten, reicht in der Regel ein fester Nachmittag oder früher Abend pro Woche. Kurse mit Musik können parallel nicht laufen: Injektionsbehandlungen brauchen Ruhe, und die haben Vorrang.',
          'Your window sits inside the treatment operation: Monday to Friday from 10:00 to 20:00, Saturdays from 08:00 to 17:00. Since many work alongside a practice or clinic, one fixed afternoon or early evening a week is usually enough. Classes with music cannot run in parallel: injection treatments need quiet, and quiet takes precedence.'
        );
      case 'massage':
        return this.t(
          'Dein Fenster ist das längste im Haus: montags bis samstags von 08:00 bis 22:00 Uhr. Du bist damit nicht an die Öffnungszeiten der Kosmetik gebunden und kannst früh morgens oder spät abends arbeiten. Weil sich mehrere Masseur:innen den Raum teilen, legen wir deine festen wöchentlichen Zeitfenster gemeinsam fest.',
          'Your window is the longest in the house: Monday to Saturday from 08:00 to 22:00. That means you are not tied to the cosmetics opening hours and can work early in the morning or late in the evening. Because several therapists share the room, we agree your fixed weekly time slots together.'
        );
      case 'kurs':
        return this.t(
          'Dein Fenster liegt vor und nach dem Behandlungsbetrieb: montags bis freitags von 07:00 bis 09:00 Uhr und ab 19:30 Uhr, samstags ab 18:00 Uhr und sonntags zu jeder Zeit. Samstagmorgen fällt weg, weil die Kosmetik dort schon um 08:00 Uhr startet. Innerhalb dieser Fenster legst du deine festen Zeiten selbst fest, und eine Anwesenheitspflicht ohne gebuchte Stunden gibt es nicht.',
          'Your window sits before and after the treatment operation: Monday to Friday from 07:00 to 09:00 and from 19:30, on Saturdays from 18:00 and on Sundays at any time. Saturday morning drops out because cosmetics already start at 08:00. Within these windows you set your own fixed times, and there is no obligation to be present without booked classes.'
        );
      case 'uebersicht':
        return this.t(
          'Jede Spur hat ihr eigenes Fenster, und keine Spur besitzt den Tag. Behandlungen halten den Kern, Massagen reichen morgens und abends darüber hinaus, Kurse nutzen die Ränder und den Sonntag. Welche Zeiten für deine Position gelten, steht auf der jeweiligen Stellenseite.',
          'Every lane has its own window, and no lane owns the day. Treatments hold the core, massages reach beyond it morning and evening, courses use the edges and Sundays. Which hours apply to your position is spelled out on the individual role page.'
        );
    }
  }

  /** Die Regel, die den Kalender überhaupt erst benutzbar macht. */
  get rulesText(): string {
    const shared = this.t(
      'Das Raster zeigt, was möglich ist, nicht was belegt ist. Innerhalb der Fenster gilt schlicht: first come, first served. Ein Platz gehört dem, der ihn zuerst belegt, und kann genauso gut von einem anderen Kurs oder einer anderen selbständigen Person genommen werden. ',
      'The grid shows what is possible, not what is taken. Within the windows the rule is simply first come, first served. A slot belongs to whoever claims it first, and it can just as easily be taken by another course or another freelancer. '
    );

    const noise =
      this.role === 'kurs'
        ? this.t(
            'Dazu kommt eine harte Regel: Wo eine Massage oder eine Injektionsbehandlung gebucht ist, kann parallel kein Kurs mit Musik laufen. Die Massagezeiten reichen bis 22:00 Uhr und überschneiden sich deshalb mit deinen Abendfenstern. Am ruhigsten und sichersten ist der Sonntag, weil dann kein Behandlungsbetrieb dagegensteht.',
            'On top of that there is a hard rule: where a massage or an injection treatment is booked, no class with music can run in parallel. Massage hours reach until 22:00 and therefore overlap your evening windows. Sundays are the calmest and safest, because no treatment operation stands against them.'
          )
        : this.t(
            'Dazu kommt eine harte Regel zugunsten der Ruhe: Wo eine Massage oder eine Injektionsbehandlung gebucht ist, kann parallel kein Yoga- oder Tanzkurs stattfinden. Behandlungen gehen dem Lärm vor, nicht umgekehrt.',
            'On top of that there is a hard rule in favour of quiet: where a massage or an injection treatment is booked, no yoga or dance class can take place alongside it. Treatments come before noise, not the other way round.'
          );

    return shared + noise;
  }

  get reservedText(): string {
    return this.t(
      'Fest vergeben ist im Moment genau ein Fenster im ganzen Kursraster: Der letzte Dienstagabend im Monat gehört dem Yoga. Alles andere ist offen und wartet auf jemanden, der es sich nimmt.',
      'Exactly one window in the whole course grid is currently taken: the last Tuesday evening of the month belongs to yoga. Everything else is open and waiting for someone to claim it.'
    );
  }
}
