import { Component, Input, inject } from '@angular/core';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import {
  GuideNoteComponent,
  GuidePillComponent,
  GuideSectionComponent,
} from 'src/components/molecules/guide';
import { LanguageService } from 'src/services/language.service';
import { type KarriereRole } from '../karriere-zeiten/karriere-zeiten.model';
import {
  GROUPON_BEISPIELE,
  GROUPON_BEISPIEL_PREIS,
  type GrouponBeispiel,
  type KanalRow,
  hasPlattformen,
  hasUrbanSports,
  kanaeleHeading,
  kanaeleLead,
  kanaeleRows,
} from './karriere-kanaele.model';

/**
 * „Kund:innen gewinnen“ — die Kanal-Tabelle mit Tempo, Kosten und dem Anteil,
 * den FareWell davon nimmt, plus die Groupon-Zahlen im Klartext.
 *
 *   <app-karriere-kanaele role="kurs" index="05" />
 *
 * Inhalte und Rollenlogik stehen in karriere-kanaele.model.ts, damit die
 * Tabelle auf allen Karriere-Seiten dieselbe Aussage trifft. Die wichtigste
 * steht in der vierten Spalte: Auf Groupon- und Urban-Sports-Umsätzen nimmt
 * FareWell 0%.
 */
@Component({
  selector: 'app-karriere-kanaele',
  standalone: true,
  imports: [
    GuideSectionComponent,
    GuideNoteComponent,
    GuidePillComponent,
    RevealOnScrollDirective,
  ],
  template: `
    <app-guide-section [index]="index" [heading]="heading" [sectionId]="sectionId">
      <p class="gd-lead-p gd-read" appReveal>{{ lead }}</p>

      <div
        class="gd-table-wrap kk-kanaele"
        appReveal
        tabindex="0"
        role="region"
        [attr.aria-label]="t('Vergleich der Kanäle', 'Channel comparison')"
      >
        <table>
          <thead>
            <tr>
              <th>{{ t('Weg', 'Channel') }}</th>
              <th>{{ t('Tempo', 'Speed') }}</th>
              <th>{{ t('Kosten für dich', 'Cost to you') }}</th>
              <th>{{ t('FareWell-Anteil', 'FareWell’s share') }}</th>
              <th>{{ t('Gut für', 'Best for') }}</th>
            </tr>
          </thead>
          <tbody>
            @for (row of rows; track row.name) {
              <tr>
                <td>
                  <strong>{{ row.name }}</strong><br />
                  <span class="gd-fine">{{ row.sub }}</span>
                </td>
                <td><app-guide-pill [variant]="row.tempo.variant" [label]="row.tempo.label" /></td>
                <td>
                  <app-guide-pill [variant]="row.kosten.variant" [label]="row.kosten.label" />
                </td>
                <td>
                  <app-guide-pill [variant]="row.anteil.variant" [label]="row.anteil.label" />
                </td>
                <td>{{ row.text }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="gd-read">
        @if (plattformen) {
          <app-guide-note
            variant="win"
            [label]="t('Plattform-Umsätze: 100% für dich', 'Platform revenue: 100% yours')"
          >
            {{ nullAnteilText }}
          </app-guide-note>

          <h3 appReveal>{{ t('Groupon in Zahlen', 'Groupon in numbers') }}</h3>
          <p appReveal style="color: var(--gd-muted)">{{ grouponIntro }}</p>

          <div
            class="gd-table-wrap"
            appReveal
            tabindex="0"
            role="region"
            [attr.aria-label]="t('Groupon-Rechenbeispiele', 'Groupon examples table')"
          >
            <table>
              <thead>
                <tr>
                  <th>{{ t('Rabatt', 'Discount') }}</th>
                  <th class="num">{{ payerLabel }}</th>
                  <th class="num">{{ t('Du bekommst', 'You get') }}</th>
                  <th class="num">{{ t('Groupon behält', 'Groupon keeps') }}</th>
                </tr>
              </thead>
              <tbody>
                @for (row of beispiele; track row.rabatt) {
                  <tr>
                    <td><strong>{{ row.rabatt }}</strong></td>
                    <td class="num">{{ row.zahlt }}</td>
                    <td
                      class="num"
                      [style.color]="row.gut ? 'var(--gd-ok)' : 'var(--gd-danger)'"
                    >
                      {{ row.bekommst }}
                    </td>
                    <td class="num">{{ row.behaelt }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <p class="gd-fine">{{ grouponFine }}</p>

          <app-guide-note variant="rule" [label]="t('Faustregel', 'Rule of thumb')">
            {{ faustregelText }}
          </app-guide-note>
        } @else {
          <app-guide-note
            variant="warn"
            [label]="
              t('Warum hier keine Rabattplattform steht', 'Why no discount platform is listed here')
            "
          >
            {{ keinePlattformText }}
          </app-guide-note>
        }
      </div>
    </app-guide-section>
  `,
  styles: [
    `
      /* Fünf Spalten, davon eine mit Fließtext: Unter ~640px zerfällt der Satz
         sonst in Einzelwörter. Der Wrapper scrollt seitwärts (vgl. das
         Wochenraster in app-karriere-zeiten). */
      .kk-kanaele table {
        min-width: 640px;
      }
    `,
  ],
})
export class KarriereKanaeleComponent {
  @Input() role: KarriereRole = 'uebersicht';
  @Input() index = '05';
  @Input() sectionId = 'kanaele';

  readonly beispiele: GrouponBeispiel[] = GROUPON_BEISPIELE;

  private readonly language = inject(LanguageService);

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  /**
   * Pro Sprache und Rolle gecacht: Der Header hört auf window:scroll, damit
   * läuft Change Detection bei jedem Scrollschritt (vgl. app-karriere-zeiten).
   */
  private rowsCache: { key: string; rows: KanalRow[] } | null = null;

  get rows(): KanalRow[] {
    const key = `${this.language.lang()}|${this.role}`;
    if (this.rowsCache?.key !== key) {
      this.rowsCache = { key, rows: kanaeleRows((de, en) => this.t(de, en), this.role) };
    }
    return this.rowsCache.rows;
  }

  get heading(): string {
    return kanaeleHeading((de, en) => this.t(de, en), this.role);
  }

  get lead(): string {
    return kanaeleLead((de, en) => this.t(de, en), this.role);
  }

  /** Ob Rabatt- und Mitgliedschaftsplattformen auf dieser Seite vorkommen. */
  get plattformen(): boolean {
    return hasPlattformen(this.role);
  }

  /** Wer bei Groupon bezahlt, heißt je nach Fach anders. */
  get payerLabel(): string {
    return this.role === 'kurs'
      ? this.t('Teilnehmer:in zahlt', 'Participant pays')
      : this.t('Kund:in zahlt', 'Client pays');
  }

  get nullAnteilText(): string {
    const plattformen = hasUrbanSports(this.role)
      ? this.t('Groupon oder Urban Sports Club', 'Groupon or Urban Sports Club')
      : 'Groupon';

    return this.t(
      `Was über ${plattformen} hereinkommt, behältst du vollständig. Auf diese Beträge nehmen wir keine Umsatzbeteiligung, auch nicht die sonst übliche: Die Plattform hat sich ihren Teil längst geholt, und was danach übrig bleibt, ist knapp genug. Sieh dieses Geld als Werbebudget in Arbeitsform. Verdient wird später, wenn jemand zum vollen Preis wiederkommt.`,
      `Whatever comes in through ${plattformen} stays with you in full. We take no revenue share on those amounts, not even the one that otherwise applies: the platform has long since taken its cut, and what is left is thin enough as it is. Treat that money as an advertising budget in the form of work. The earning happens later, when somebody comes back at the full price.`
    );
  }

  get grouponIntro(): string {
    return this.t(
      `Groupon kostet dich vorab nichts und nimmt sich dafür einen großen Teil. Zwei Beispiele aus dem Groupon-Rechner, gerechnet auf einen Preis von ${GROUPON_BEISPIEL_PREIS} €:`,
      `Groupon costs you nothing upfront and takes a large cut in return. Two examples from the Groupon calculator, based on a price of €${GROUPON_BEISPIEL_PREIS}:`
    );
  }

  get grouponFine(): string {
    /** Damit sich die 70-€-Beispiele auf den eigenen Preis übertragen lassen. */
    const uebertrag =
      this.role === 'kurs'
        ? this.t(
            'bei einem Kursplatz für 18 € also gut 9 €',
            'so a little over €9 on an €18 class spot'
          )
        : this.t('bei einer Behandlung für 90 € also rund 49 €', 'so about €49 on a €90 treatment');

    return this.t(
      `Das Verhältnis bleibt gleich, egal wie hoch dein Preis ist: Rund 55% von dem, was gezahlt wird, landen bei dir, ${uebertrag}. Schätzwerte, Rundungen möglich. „Du bekommst“ ist der Betrag nach Mehrwertsteuer, und er geht vollständig an dich; Groupons Anteil enthält Gebühren und Mehrwertsteuer.`,
      `The ratio stays the same whatever your price is: roughly 55% of what is paid ends up with you, ${uebertrag}. Estimates, rounding possible. “You get” is the amount after VAT and it goes to you in full; Groupon’s share includes fees and VAT.`
    );
  }

  get faustregelText(): string {
    const wen = this.t('Neukund:innen', 'new clients');
    const wenKurs = this.t('neue Teilnehmende', 'new participants');

    return this.t(
      `Geh nicht über 30% Rabatt. Bei 39% bekam Anna, unsere erste Masseurin, 100 Groupon-Tickets in weniger als einem Monat, weit mehr als sie bedienen konnte. Mit 30% oder weniger kommen immer noch genug, zu einem deutlich besseren Preis. Die Zahl der verkauften Tickets lässt sich außerdem deckeln: Sag uns einfach, wie viele ${
        this.role === 'kurs' ? wenKurs : wen
      } du im Monat bequem schaffst.`,
      `Do not go above 30% off. At 39%, Anna, our first massage therapist, received 100 Groupon tickets in under a month, far more than she could serve. At 30% or below you still attract plenty, at a much better rate. The number of tickets sold can also be capped: just tell us how many ${
        this.role === 'kurs' ? wenKurs : wen
      } you can comfortably take on per month.`
    );
  }

  get keinePlattformText(): string {
    return this.t(
      'Auf den anderen Karriere-Seiten steht hier Groupon, auf dieser bewusst nicht: Werbung für verschreibungspflichtige Präparate und ärztliche Behandlungen ist im Heilmittelwerbegesetz eng geregelt, und Rabattaktionen auf Injektionen gehören zu den Punkten, an denen es schnell heikel wird. Für dein Angebot setzen wir deshalb auf dein eigenes Google-Profil, Suchanzeigen im erlaubten Rahmen und Empfehlungen aus dem Haus.',
      'On the other career pages Groupon sits here; on this one it deliberately does not. Advertising for prescription-only preparations and medical treatments is tightly regulated by German law (Heilmittelwerbegesetz), and discount campaigns on injections are among the points where it quickly becomes delicate. For your offering we therefore rely on your own Google profile, search ads within the permitted frame and referrals from inside the house.'
    );
  }
}
