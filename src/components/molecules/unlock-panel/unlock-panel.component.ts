import { Component, ElementRef, computed, input, output, viewChild } from '@angular/core';
import { QsIconComponent } from 'src/components/atoms/qs-icon/qs-icon.component';

export type UnlockLang = 'de' | 'uk';
export type UnlockError = '' | 'required' | 'wrong' | 'missing' | 'broken';

/**
 * Die Worte des Sperrbildschirms. Sie sind öffentlich (sie stehen vor dem
 * Passwort) und sagen deshalb nichts über den Inhalt. Ukrainisch steht unter
 * dem Deutschen, für Seiten, deren Leserin noch wenig Deutsch liest.
 */
interface LockWords {
  eyebrow: string;
  text: string;
  label: string;
  button: string;
  busy: string;
  required: string;
  wrong: string;
  missing: string;
  broken: string;
  note: string;
}

const WORDS: Record<UnlockLang, LockWords> = {
  de: {
    eyebrow: 'Intern · FareWell',
    text: 'Diese Seite ist verschlüsselt. Sie öffnet sich mit deinem Passwort, direkt in deinem Browser.',
    label: 'Passwort',
    button: 'Öffnen',
    busy: 'Öffnet …',
    required: 'Bitte zuerst das Passwort eingeben.',
    wrong: 'Dieses Passwort öffnet die Seite nicht.',
    missing: 'Diese Seite ist noch nicht freigegeben.',
    broken: 'Die Seite ließ sich nicht lesen. Bitte Joé Bescheid geben.',
    note: 'Nichts wird gespeichert oder gesendet. Neu laden schließt die Seite wieder.',
  },
  uk: {
    eyebrow: 'Внутрішня сторінка · FareWell',
    text: 'Ця сторінка зашифрована. Вона відкривається твоїм паролем, прямо у твоєму браузері.',
    label: 'Пароль',
    button: 'Відкрити',
    busy: 'Відкривається …',
    required: 'Спочатку введи пароль.',
    wrong: 'Цей пароль не відкриває сторінку.',
    missing: 'Ця сторінка ще не готова.',
    broken: 'Сторінку не вдалося прочитати. Будь ласка, напиши Жое.',
    note: 'Нічого не зберігається і не надсилається. Після перезавантаження сторінка знову закрита.',
  },
};

@Component({
  selector: 'app-unlock-panel',
  imports: [QsIconComponent],
  templateUrl: './unlock-panel.component.html',
  styleUrl: './unlock-panel.component.scss',
})
export class UnlockPanelComponent {
  readonly heading = input.required<string>();
  readonly langs = input<UnlockLang[]>(['de']);
  readonly error = input<UnlockError>('');
  readonly busy = input(false);
  readonly unlock = output<string>();

  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');

  protected readonly primary = computed(() => WORDS[this.langs()[0] ?? 'de']);
  protected readonly secondary = computed(() => (this.langs()[1] ? WORDS[this.langs()[1]] : null));

  protected submit(event: Event): void {
    event.preventDefault();
    this.unlock.emit(this.field().nativeElement.value);
  }

  /** Nach einem falschen Versuch: Feld leeren und Fokus zurück. */
  reset(): void {
    const input = this.field().nativeElement;
    input.value = '';
    input.focus();
  }
}
