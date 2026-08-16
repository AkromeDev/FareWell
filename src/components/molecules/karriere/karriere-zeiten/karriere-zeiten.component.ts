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

/** Eine Zeile der Screenreader-Tabelle: ein Wochentag, eine Zelle pro Spur. */
interface ZeitTableRow {
  key: string;
  day: string;
  cells: string[];
}

/**
 * „Zeiten und Raumbelegung“: Wochenraster plus die Regeln dahinter.
 *
 * Das Raster zeigt drei Spuren nebeneinander — Behandlungen, Massage, Kurse —
 * und färbt die Spur der lesenden Rolle grün. Bewusst zeigt es *Möglichkeit*,
 * nicht Belegung: Massage- und Kursfenster überlappen sich, und wer zuerst
 * bucht, bekommt den Platz.
 *
 *   <app-karriere-zeiten [role]="'kurs'" index="03" />
 *
 * Immer als Property binden: als statisches Attribut geschrieben landet `role`
 * zusätzlich im DOM und ist dort eine ungültige ARIA-Rolle.
 */
@Component({
  selector: 'app-karriere-zeiten',
  standalone: true,
  imports: [GuideSectionComponent, GuideNoteComponent, RevealOnScrollDirective],
  template: `
    <app-guide-section [index]="index" [heading]="heading" [sectionId]="sectionId">
      <p class="gd-lead-p gd-read" appReveal>{{ lead }}</p>

      <div class="kz" appReveal>
        <!-- Bleibt fokussierbar, damit das Raster per Tastatur seitwärts
             gescrollt werden kann (WCAG 2.1.1). Der Name sagt ausdrücklich,
             dass der Inhalt grafisch ist und die Daten als Tabelle folgen —
             sonst landet man in einer benannten, aber scheinbar leeren
             Gruppe, weil das Raster aria-hidden ist. -->
        <div class="kz__scroll" tabindex="0" role="group" [attr.aria-label]="scrollLabel">
          <div class="kz__board" aria-hidden="true">
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

        <!-- Dieselben Daten als echte Tabelle, nur für Screenreader. Das Raster
             oben ist ein Bild aus absolut positionierten Kästen; hier kann man
             Tag für Tag und Spur für Spur navigieren, statt sich einen langen
             Fließtext am Stück anzuhören. -->
        <div class="kz__sr-only">
          <table>
            <caption>
              {{ tableCaption }}
            </caption>
            <thead>
              <tr>
                <th scope="col">{{ t('Tag', 'Day') }}</th>
                @for (lane of lanes; track lane) {
                  <th scope="col">{{ laneLabel(lane) }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of tableRows; track row.key) {
                <tr>
                  <th scope="row">{{ row.day }}</th>
                  @for (cell of row.cells; track $index) {
                    <td>{{ cell }}</td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>

        <p class="kz__legend-title">{{ t('Geöffnet für', 'Open for') }}</p>
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
            {{
              t(
                'bereits belegt: letzter Dienstagabend im Monat (Yoga)',
                'already taken: last Tuesday evening of the month (yoga)'
              )
            }}
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

      /* Nur für Screenreader: dieselbe Technik wie .gd-visually-hidden, aber
         lokal, damit die Tabelle nicht am .gd-Scope hängt. Nimmt keinen Platz
         im Layout ein und darf deshalb NICHT in .kz__board stehen — das ist
         ein Grid, dort würde sie eine achte Spalte erzeugen.

         Das <div> ist Absicht: auf einem <table> greifen width/height nicht,
         weil das automatische Tabellenlayout mindestens die Inhaltsbreite
         belegt (gemessen: 555x64px statt 1x1). Ein Blockcontainer schrumpft
         korrekt auf 1x1. */
      .kz__sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        border: 0;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
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

      .kz__legend-title {
        margin: 0.9rem 0 0.35rem;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--gd-faint);
      }

      .kz__legend {
        list-style: none;
        margin: 0;
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

  /** Name des grafischen Rasters; verweist auf die Tabelle mit denselben Daten. */
  get scrollLabel(): string {
    return this.t(
      'Wochenraster als Grafik. Dieselben Angaben stehen darunter als Tabelle.',
      'Weekly grid, graphical. The same information follows below as a table.'
    );
  }

  /** Bildunterschrift der Screenreader-Tabelle. */
  get tableCaption(): string {
    return this.t(
      'Geöffnete Zeitfenster pro Wochentag und Spur',
      'Open time windows by weekday and lane'
    );
  }

  private tableRowsCache: { key: string; rows: ZeitTableRow[] } | null = null;

  /**
   * Dieselben Daten wie das Raster, aber als Zeilen und Spalten: ein Tag pro
   * Zeile, eine Spur pro Spalte. Erst dadurch kann jemand mit Screenreader
   * gezielt „Donnerstag, Massage" abfragen, statt einen 110-Wörter-Satz am
   * Stück zu hören. Nebenbei bekommen zwei Dinge einen Textwert, die im Bild
   * nur Farbe sind: die eigene Spur (grün) und das belegte Fenster.
   */
  get tableRows(): ZeitTableRow[] {
    const key = `${this.language.lang()}|${this.role}`;
    if (this.tableRowsCache?.key !== key) {
      this.tableRowsCache = { key, rows: this.buildTableRows() };
    }
    return this.tableRowsCache.rows;
  }

  private buildTableRows(): ZeitTableRow[] {
    const isEn = this.language.lang() === 'en';
    const closed = this.t('geschlossen', 'closed');
    const reserved = this.t(
      '(letzter Dienstag im Monat belegt: Yoga)',
      '(last Tuesday of the month taken: yoga)'
    );
    const yours = this.t('— deine Spur', '— your lane');

    return ZEIT_WOCHE.map((day) => ({
      key: day.key,
      day: isEn ? day.en : day.de,
      cells: LANE_ORDER.map((lane) => {
        const bands = day.bands
          .filter((band) => band.lane === lane)
          .map(
            (band) =>
              `${formatTime(band.start)}–${formatTime(band.end)}` +
              (band.reserved ? ` ${reserved}` : '')
          );
        if (!bands.length) {
          return closed;
        }
        return bands.join(', ') + (lane === this.ownLane ? ` ${yours}` : '');
      }),
    }));
  }

  get heading(): string {
    return this.t('Zeiten und freie Fenster', 'Hours and open slots');
  }

  get lead(): string {
    if (this.role === 'uebersicht') {
      return this.t(
        'Welche Fenster wir geöffnet haben: drei Spuren, die sich die Woche teilen. Frei sind sie derzeit fast alle.',
        'Which windows we have opened: three lanes sharing the week. Almost all of them are free at the moment.'
      );
    }
    return this.t(
      'Welche Fenster wir geöffnet haben, und wo deins liegt. Grün ist deine Spur, und die ist im Moment fast komplett frei.',
      'Which windows we have opened, and where yours sits. Green is your lane, and right now it is almost entirely free.'
    );
  }

  /**
   * Der Rahmen des Hauses — für alle Rollen derselbe Absatz. Formuliert
   * bewusst als „geöffnet“, nicht als „läuft“: Es sind Fenster, keine Schichten.
   */
  get rhythmText(): string {
    return this.t(
      'Das Raster zeigt geöffnete Zeitfenster, keine Belegung. Kosmetik und ästhetische Medizin sind montags bis freitags von 10:00 bis 20:00 Uhr und samstags von 08:00 bis 17:00 Uhr geöffnet. Für Massagen steht der Raum darüber hinaus von 08:00 bis 22:00 Uhr offen, weil er nicht an die Öffnungszeiten der Kosmetik gebunden ist. Yoga und Tanz brauchen Musik, Bewegung und Platz und liegen deshalb außerhalb des Behandlungsbetriebs: montags bis freitags von 07:00 bis 09:00 Uhr und ab 19:30 Uhr, samstags ab 18:00 Uhr und sonntags zu jeder Zeit.',
      'The grid shows open time windows, not bookings. Cosmetics and aesthetic medicine are open Monday to Friday from 10:00 to 20:00 and on Saturdays from 08:00 to 17:00. Beyond that, the room is open for massages from 08:00 to 22:00, because it is not tied to the cosmetics opening hours. Yoga and dance need music, movement and space, so they sit outside treatment hours: Monday to Friday from 07:00 to 09:00 and from 19:30, on Saturdays from 18:00 and on Sundays at any time.'
    );
  }

  /** Was der Takt konkret für die lesende Rolle bedeutet. */
  get ownText(): string {
    switch (this.role) {
      case 'kosmetik':
        return this.t(
          'Dein Fenster ist das größte: montags bis freitags von 10:00 bis 20:00 Uhr, samstags von 08:00 bis 17:00 Uhr. Darin suchst du dir deine festen Tage selbst aus, und eine Anwesenheitspflicht ohne gebuchte Termine gibt es nicht. Kurse mit Musik liegen bewusst außerhalb dieser Zeiten, du arbeitest also nie gegen eine Tanzstunde an.',
          'Yours is the largest window: Monday to Friday from 10:00 to 20:00, Saturdays from 08:00 to 17:00. Within it you pick your own fixed days, and there is no obligation to be present without booked appointments. Classes with music deliberately sit outside those hours, so you never work against a dance lesson.'
        );
      case 'botox':
        return this.t(
          'Dein Fenster liegt im Behandlungsbetrieb: montags bis freitags von 10:00 bis 20:00 Uhr, samstags von 08:00 bis 17:00 Uhr. Weil viele neben Praxis oder Klinik arbeiten, reicht in der Regel ein fester Nachmittag oder früher Abend pro Woche, und den suchst du dir aus. Kurse mit Musik liegen bewusst außerhalb dieser Zeiten: Injektionsbehandlungen brauchen Ruhe, und die haben Vorrang.',
          'Your window sits inside the treatment hours: Monday to Friday from 10:00 to 20:00, Saturdays from 08:00 to 17:00. Since many work alongside a practice or clinic, one fixed afternoon or early evening a week is usually enough, and you pick which one. Classes with music deliberately sit outside those hours: injection treatments need quiet, and quiet takes precedence.'
        );
      case 'massage':
        return this.t(
          'Dein Fenster ist das längste im Haus: montags bis samstags von 08:00 bis 22:00 Uhr. Du bist damit nicht an die Öffnungszeiten der Kosmetik gebunden und kannst früh morgens oder spät abends arbeiten. Der Raum ist in diesen Zeiten derzeit weitgehend frei; du suchst dir deine festen wöchentlichen Zeitfenster aus, und wir stimmen sie mit den anderen Masseur:innen ab.',
          'Yours is the longest window in the house: Monday to Saturday from 08:00 to 22:00. That means you are not tied to the cosmetics opening hours and can work early in the morning or late in the evening. The room is largely free during those hours at the moment; you pick your fixed weekly slots and we align them with the other therapists.'
        );
      case 'kurs':
        return this.t(
          'Dein Fenster liegt vor und nach dem Behandlungsbetrieb: montags bis freitags von 07:00 bis 09:00 Uhr und ab 19:30 Uhr, samstags ab 18:00 Uhr und sonntags zu jeder Zeit. Samstagmorgen fällt weg, weil die Kosmetik dort schon um 08:00 Uhr startet. Innerhalb dieser Fenster suchst du dir deine festen Zeiten selbst aus, und eine Anwesenheitspflicht ohne gebuchte Stunden gibt es nicht.',
          'Your window sits before and after the treatment hours: Monday to Friday from 07:00 to 09:00 and from 19:30, on Saturdays from 18:00 and on Sundays at any time. Saturday morning drops out because cosmetics already start at 08:00. Within these windows you pick your own fixed times, and there is no obligation to be present without booked classes.'
        );
      case 'uebersicht':
        return this.t(
          'Jede Spur hat ihr eigenes Fenster, und keine Spur besitzt den Tag. Die Kosmetik hält den Kern, die Massage reicht morgens und abends darüber hinaus, Kurse nutzen die Ränder und den Sonntag. Welche Zeiten für deine Position gelten, steht auf der jeweiligen Stellenseite.',
          'Every lane has its own window, and no lane owns the day. Cosmetics hold the core, massage reaches beyond it morning and evening, courses use the edges and Sundays. Which hours apply to your position is spelled out on the individual role page.'
        );
    }
  }

  /**
   * Die Regel, die den Kalender benutzbar macht. Der erste Satz ist der
   * wichtigste: Die Bänder sind geöffnete Fenster, keine belegten Schichten.
   */
  get rulesText(): string {
    const shared = this.t(
      'Wichtig zu verstehen: Das sind Fenster, die wir öffnen, keine Zeiten, in denen schon jemand arbeitet. Bis auf eine einzige Ausnahme sind sie im Moment alle frei. Wer sich ein Fenster nimmt, hat es: first come, first served. Genauso kann ein Platz von einem anderen Kurs oder einer anderen selbständigen Person belegt werden. ',
      'Worth understanding: these are windows we open, not hours in which somebody is already working. With a single exception they are all free at the moment. Whoever claims a window has it: first come, first served. And just as easily, a slot can be claimed by another course or another freelancer. '
    );

    const noise =
      this.role === 'kurs'
        ? this.t(
            'Eine Einschränkung gibt es: Sobald in deinem Fenster tatsächlich eine Massage oder eine Injektionsbehandlung gebucht ist, kann zeitgleich kein Kurs mit Musik laufen. Weil derzeit kaum etwas belegt ist, ist das eher die Ausnahme als die Regel. Sonntags stellt sich die Frage ohnehin nicht, dann ist gar kein Behandlungsbetrieb im Haus.',
            'One restriction applies: as soon as a massage or an injection treatment is actually booked in your window, no class with music can run at the same time. Since almost nothing is booked at the moment, that is the exception rather than the rule. On Sundays the question does not arise at all, as there are no treatments in the house.'
          )
        : this.t(
            'Eine Regel gilt zugunsten der Ruhe: Sobald bei dir eine Massage oder eine Injektionsbehandlung gebucht ist, kann zeitgleich kein Yoga- oder Tanzkurs stattfinden. Behandlungen gehen dem Lärm vor, nicht umgekehrt.',
            'One rule applies in favour of quiet: as soon as a massage or an injection treatment is booked with you, no yoga or dance class can take place at the same time. Treatments come before noise, not the other way round.'
          );

    return shared + noise;
  }

  get reservedText(): string {
    return this.t(
      'Belegt ist im Moment genau ein einziges Fenster im ganzen Raster: Der letzte Dienstagabend im Monat gehört dem Yoga. Alles andere ist frei und wartet auf jemanden, der es sich nimmt.',
      'Exactly one single window in the whole grid is taken at the moment: the last Tuesday evening of the month belongs to yoga. Everything else is free and waiting for someone to claim it.'
    );
  }
}
