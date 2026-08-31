import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from 'src/services/language.service';
import {
  SignInFailureKind,
  SupabaseSessionService,
} from '../../services/supabase-session.service';

/**
 * Once-per-device unlock screen shown while shared (Supabase) persistence is
 * enabled but this device holds no session yet. The team enters the shared
 * passphrase a single time; supabase-js persists the session afterwards.
 */
@Component({
  selector: 'app-task-auth-gate',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './task-auth-gate.component.html',
  styleUrls: ['./task-auth-gate.component.scss'],
})
export class TaskAuthGateComponent implements AfterViewInit {
  readonly lang = inject(LanguageService);
  readonly session = inject(SupabaseSessionService);

  @ViewChild('passInput') passInput?: ElementRef<HTMLInputElement>;

  passphrase = '';
  readonly busy = signal(false);
  readonly error = signal<{ kind: SignInFailureKind; text: string } | null>(null);

  ngAfterViewInit(): void {
    this.passInput?.nativeElement.focus();
  }

  t(de: string, en: string): string {
    return this.lang.t(de, en);
  }

  /** Spinner state: restoring the session OR waiting for the first sync. */
  get waiting(): boolean {
    const s = this.session.status();
    return s === 'initializing' || (s === 'signed-in' && !this.session.firstSyncDone());
  }

  async submit(): Promise<void> {
    const value = this.passphrase.trim();
    if (!value || this.busy()) return;
    this.busy.set(true);
    this.error.set(null);
    const failure = await this.session.signIn(value);
    this.busy.set(false);
    if (!failure) return;

    // Supabase's messages are technical English; phrase the two cases apart.
    // Blaming the passphrase for an outage sends staff hunting for a secret
    // that is already correct.
    if (failure.kind === 'unreachable') {
      this.error.set({
        kind: 'unreachable',
        text: this.t(
          'Der Putzplan-Server ist gerade nicht erreichbar. Das liegt nicht an der Passphrase. Bitte später noch einmal versuchen.',
          'The task server cannot be reached right now. This is not your passphrase. Please try again later.',
        ),
      });
      return;
    }

    this.error.set({
      kind: 'credentials',
      text: this.t(
        'Das hat nicht geklappt. Bitte Passphrase prüfen und erneut versuchen.',
        'That did not work. Please check the passphrase and try again.',
      ),
    });
    this.passInput?.nativeElement.select();
  }
}
