import { Component, OnDestroy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { LanguageService } from 'src/services/language.service';
import { GuideLang } from '../guide-lang-toggle/guide-lang-toggle.component';

interface ZoneDef {
  key: string;
  de: string;
  en: string;
  /** Preis pro Sitzung in Euro (inkl. 19% MwSt.), Damen-Tarif aus dem Preiskatalog. */
  price: number;
}

interface ZoneGroupDef {
  de: string;
  en: string;
  zones: ZoneDef[];
}

/**
 * Zonen-Katalog des Rabatt-Rechners. Preise 1:1 aus dem Damen-Laserkatalog
 * (src/components/pages/price/price-data.ts). Eine kuratierte Auswahl der
 * gängigsten Zonen, bewusst nicht der komplette Katalog.
 */
const CATALOG: ZoneGroupDef[] = [
  {
    de: 'Gesicht',
    en: 'Face',
    zones: [
      { key: 'oberlippe', de: 'Oberlippe', en: 'Upper lip', price: 50 },
      { key: 'kinn', de: 'Kinn', en: 'Chin', price: 50 },
      { key: 'wangen', de: 'Wangen', en: 'Cheeks', price: 50 },
      { key: 'koteletten', de: 'Koteletten', en: 'Sideburns', price: 50 },
      { key: 'untergesicht', de: 'Unteres Gesicht komplett', en: 'Complete lower face', price: 180 },
      { key: 'nacken', de: 'Nacken', en: 'Nape of the neck', price: 50 },
    ],
  },
  {
    de: 'Körper',
    en: 'Body',
    zones: [
      { key: 'achseln', de: 'Achseln', en: 'Underarms', price: 60 },
      { key: 'schultern', de: 'Schultern', en: 'Shoulders', price: 50 },
      { key: 'oberarme', de: 'Oberarme', en: 'Upper arms', price: 70 },
      { key: 'unterarme', de: 'Unterarme', en: 'Forearms', price: 70 },
      { key: 'arme', de: 'Arme komplett', en: 'Complete arms', price: 120 },
      { key: 'bauch', de: 'Bauch', en: 'Stomach', price: 70 },
      { key: 'ruecken', de: 'Rücken', en: 'Back', price: 120 },
      { key: 'brust', de: 'Brust', en: 'Chest', price: 70 },
      { key: 'oberschenkel', de: 'Oberschenkel', en: 'Thighs', price: 90 },
      { key: 'unterschenkel', de: 'Unterschenkel', en: 'Lower legs', price: 80 },
      { key: 'knie', de: 'Knie', en: 'Knees', price: 30 },
      { key: 'fuesse', de: 'Füße', en: 'Feet', price: 30 },
      { key: 'beine', de: 'Beine komplett', en: 'Complete legs', price: 180 },
    ],
  },
  {
    de: 'Intimbereich',
    en: 'Intimate area',
    zones: [
      { key: 'bikini', de: 'Bikinilinie', en: 'Bikini line', price: 60 },
      { key: 'brazilian', de: 'Brazilian', en: 'Brazilian', price: 100 },
      { key: 'pofalte', de: 'Pofalte', en: 'Gluteal fold', price: 60 },
      { key: 'gesaess', de: 'Gesäß', en: 'Buttocks', price: 60 },
      { key: 'intim', de: 'Intim komplett', en: 'Complete intimate area', price: 200 },
    ],
  },
];

/**
 * Interaktiver Zonen-Rechner für die kombinierte Laser-Aktion. Zwei Spalten:
 * links stellt man seine Zonen zusammen (Chips + aufklappbarer Katalog),
 * rechts wird live gerechnet — 50% auf die erste Behandlung (Code
 * ERSTEBEHANDLUNG) und danach der dauerhafte Mengenrabatt (−10% ab 3, −20% ab
 * 4, −30% ab 5 Zonen). Optik und Farben stammen aus dem `.gd`-Designsystem;
 * das CSS lebt zentral in styles/components/_guide.scss unter `.gd-rechner`.
 */
@Component({
  selector: 'app-guide-zone-rechner',
  standalone: true,
  imports: [RevealOnScrollDirective],
  template: `
    @let vm = viewModel;
    <div class="gd-rechner" appReveal>
      <!-- Links: Zonen zusammenstellen -->
      <div class="gd-rechner__calc">
        <p class="gd-rechner__eyebrow">{{ t('Rabatt-Rechner', 'Discount calculator') }}</p>
        <p class="gd-rechner__title">
          {{ t('Stell deine Zonen zusammen.', 'Build your set of areas.') }}
        </p>
        <p class="gd-rechner__desc">
          {{
            t(
              'Ab 3 Zonen sparst du dauerhaft bei jeder Laserbehandlung — je mehr Zonen, desto mehr.',
              'From 3 areas you save on every laser treatment, ongoing — the more areas, the more you save.'
            )
          }}
        </p>

        <div class="gd-rechner__chips">
          @for (chip of vm.chips; track chip.key) {
            <span class="gd-rechner__chip">
              <span class="gd-rechner__chip-name">{{ chip.name }}</span>
              <span class="gd-rechner__chip-price">{{ chip.priceLabel }}</span>
              <button
                type="button"
                class="gd-rechner__chip-x"
                (click)="remove(chip.key)"
                [attr.aria-label]="t('Zone entfernen', 'Remove area') + ': ' + chip.name"
              >
                ✕
              </button>
            </span>
          }
          <button type="button" class="gd-rechner__toggle" (click)="togglePicker()">
            {{ vm.pickerLabel }}
          </button>
        </div>

        @if (pickerOpen) {
          <div class="gd-rechner__picker">
            @for (group of vm.groups; track group.name) {
              <div class="gd-rechner__group">
                <p class="gd-rechner__group-name">{{ group.name }}</p>
                <div class="gd-rechner__pills">
                  @for (zone of group.zones; track zone.key) {
                    <button
                      type="button"
                      class="gd-rechner__pill"
                      [class.is-on]="zone.on"
                      [attr.aria-pressed]="zone.on"
                      (click)="toggle(zone.key)"
                    >
                      <span class="gd-rechner__pill-mark" aria-hidden="true">{{ zone.mark }}</span>
                      <span>{{ zone.name }}</span>
                      <span class="gd-rechner__pill-price">{{ zone.priceLabel }}</span>
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        }

        <div class="gd-rechner__progress">
          <div class="gd-rechner__bar">
            <span class="gd-rechner__bar-fill" [style.width]="vm.barWidth"></span>
          </div>
          <span class="gd-rechner__tier">{{ vm.tierHint }}</span>
        </div>
      </div>

      <!-- Rechts: Live-Ergebnis -->
      <div class="gd-rechner__result">
        @if (vm.hasZones) {
          <div class="gd-rechner__result-head">
            <span class="gd-rechner__result-eyebrow">
              {{ t('Deine erste Behandlung', 'Your first treatment') }}
            </span>
            <span class="gd-rechner__badge gd-rechner__badge--first">−50%</span>
          </div>
          <div class="gd-rechner__price-row">
            <span class="gd-rechner__price">{{ vm.firstPriceLabel }}</span>
            <span class="gd-rechner__price-old">{{ vm.sumLabel }}</span>
          </div>
          <p class="gd-rechner__price-note">
            {{ vm.countLabel }} · {{ t('du sparst', 'you save') }}
            <strong>{{ vm.firstSaveLabel }}</strong>
            {{ t('beim ersten Termin', 'on your first appointment') }}
          </p>

          <button
            type="button"
            class="gd-rechner__code"
            [class.is-copied]="copied"
            [attr.aria-label]="t('Code kopieren', 'Copy code') + ': ERSTEBEHANDLUNG'"
            (click)="copyCode()"
          >
            <span class="gd-rechner__code-body">
              <span class="gd-rechner__code-label">{{ t('Promo-Code', 'Promo code') }}</span>
              <span class="gd-rechner__code-value">ERSTEBEHANDLUNG</span>
            </span>
            @if (copied) {
              <span class="gd-rechner__code-hint is-ok">{{ t('✓ Kopiert!', '✓ Copied!') }}</span>
            } @else {
              <span class="gd-rechner__code-hint">{{ t('Kopieren ⧉', 'Copy ⧉') }}</span>
            }
          </button>

          <div class="gd-rechner__after">
            <p class="gd-rechner__after-label">{{ t('Danach · dauerhaft', 'After that · ongoing') }}</p>
            <div class="gd-rechner__after-row">
              <span class="gd-rechner__after-price">{{ vm.zonePriceLabel }}</span>
              <span class="gd-rechner__badge gd-rechner__badge--tier">{{ vm.tierBadge }}</span>
              @if (vm.hasTier) {
                <span class="gd-rechner__after-save">
                  {{ t('spart', 'saves') }} {{ vm.saveLabel }} {{ t('pro Sitzung', 'per session') }}
                </span>
              }
            </div>
          </div>
        } @else {
          <p class="gd-rechner__empty">
            {{
              t(
                'Wähle links deine Zonen — wir rechnen live mit.',
                'Pick your areas on the left — we calculate live.'
              )
            }}
          </p>
        }
        <p class="gd-rechner__fineprint">
          {{
            t(
              'Rabatte nicht kombinierbar · Preise pro Sitzung inkl. 19% MwSt.',
              'Discounts not combinable · prices per session incl. 19% VAT.'
            )
          }}
        </p>
      </div>
    </div>
  `,
})
export class GuideZoneRechnerComponent implements OnDestroy {
  private readonly language = inject(LanguageService);
  private readonly doc = inject(DOCUMENT);
  private resetTimer: ReturnType<typeof setTimeout> | null = null;

  /** Vorauswahl (3 Zonen → gleich in der ersten Rabattstufe). */
  readonly selected = new Set<string>(['achseln', 'unterschenkel', 'bikini']);
  pickerOpen = false;
  copied = false;

  get lang(): GuideLang {
    return this.language.lang();
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  toggle(key: string): void {
    if (this.selected.has(key)) {
      this.selected.delete(key);
    } else {
      this.selected.add(key);
    }
  }

  remove(key: string): void {
    this.selected.delete(key);
  }

  togglePicker(): void {
    this.pickerOpen = !this.pickerOpen;
  }

  copyCode(): void {
    const code = 'ERSTEBEHANDLUNG';
    const clipboard = this.doc.defaultView?.navigator?.clipboard;
    if (clipboard?.writeText) {
      clipboard.writeText(code).then(
        () => this.flagCopied(),
        () => this.fallbackCopy(code),
      );
    } else {
      this.fallbackCopy(code);
    }
  }

  /** Fallback für ältere Browser / nicht sichere Kontexte. */
  private fallbackCopy(code: string): void {
    try {
      const textarea = this.doc.createElement('textarea');
      textarea.value = code;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      this.doc.body.appendChild(textarea);
      textarea.select();
      this.doc.execCommand('copy');
      this.doc.body.removeChild(textarea);
      this.flagCopied();
    } catch {
      // Kopieren nicht möglich – dann bleibt die Rückmeldung einfach aus.
    }
  }

  private flagCopied(): void {
    this.copied = true;
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    this.resetTimer = setTimeout(() => {
      this.copied = false;
      this.resetTimer = null;
    }, 2200);
  }

  /**
   * Kompaktes View-Model: einmal pro Change-Detection berechnet und im Template
   * über `@let vm = viewModel` gebunden. Liest die Sprache (Signal), damit es
   * beim DE/EN-Umschalten automatisch nachzieht.
   */
  get viewModel() {
    const isDe = this.lang === 'de';
    const eur = (n: number) =>
      isDe ? `${n.toLocaleString('de-DE')} €` : `€${n.toLocaleString('en-US')}`;

    const groups = CATALOG.map((g) => ({
      name: isDe ? g.de : g.en,
      zones: g.zones.map((z) => {
        const on = this.selected.has(z.key);
        return {
          key: z.key,
          name: isDe ? z.de : z.en,
          priceLabel: eur(z.price),
          on,
          mark: on ? '✓' : '+',
        };
      }),
    }));

    const picked = CATALOG.flatMap((g) => g.zones).filter((z) => this.selected.has(z.key));
    const n = picked.length;
    const sum = picked.reduce((acc, z) => acc + z.price, 0);
    const pct = n >= 5 ? 30 : n === 4 ? 20 : n === 3 ? 10 : 0;
    const zonePrice = Math.round(sum * (1 - pct / 100));
    const firstPrice = Math.round(sum * 0.5);

    return {
      groups,
      chips: picked.map((z) => ({
        key: z.key,
        name: isDe ? z.de : z.en,
        priceLabel: eur(z.price),
      })),
      pickerLabel: this.pickerOpen
        ? this.t('− Fertig', '− Done')
        : this.t('+ Zonen wählen', '+ Choose areas'),
      hasZones: n > 0,
      hasTier: pct > 0,
      sumLabel: eur(sum),
      zonePriceLabel: eur(zonePrice),
      saveLabel: eur(sum - zonePrice),
      firstPriceLabel: eur(firstPrice),
      firstSaveLabel: eur(sum - firstPrice),
      tierBadge:
        pct > 0
          ? this.t(`−${pct}% Zonen-Rabatt`, `−${pct}% area discount`)
          : this.t('ab 3 Zonen', 'from 3 areas'),
      countLabel: isDe
        ? `${n} ${n === 1 ? 'Zone' : 'Zonen'}`
        : `${n} ${n === 1 ? 'area' : 'areas'}`,
      tierHint: this.tierHint(n, pct),
      barWidth: `${Math.min(100, (pct / 30) * 100)}%`,
    };
  }

  private tierHint(n: number, pct: number): string {
    if (pct === 30) {
      return this.t('Maximum erreicht: −30%', 'Maximum reached: −30%');
    }
    if (pct > 0) {
      return this.t(`−${pct}% · nächste Stufe: +1 Zone`, `−${pct}% · next tier: +1 area`);
    }
    if (n === 2) {
      return this.t('Noch 1 Zone bis −10%', '1 more area for −10%');
    }
    return this.t('Ab 3 Zonen: −10% dauerhaft', 'From 3 areas: −10% ongoing');
  }

  ngOnDestroy(): void {
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
  }
}
