import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { BodyPart, BodyParts } from './body-part.model';
import { LanguageService } from 'src/services/language.service';

@Component({
  selector: 'app-body-selector',
  imports: [],
  templateUrl: './body-selector.component.html',
  styleUrl: './body-selector.component.scss'
})
export class BodySelectorComponent {
  /**
   * Kommt von aussen (bc), damit die Figur denselben Stand zeigt wie das
   * Dropdown daneben — sonst meldet aria-pressed einen veralteten Zustand.
   */
  @Input() selectedPart: BodyPart | null = BodyParts.armpits;
  BodyParts = BodyParts;

  private readonly lang = inject(LanguageService);

  @Output() partSelected = new EventEmitter<BodyPart>();

  get groupLabel(): string {
    return this.lang.t('Körperzone wählen', 'Choose a body area');
  }

  /** Barrierefreier Name der Zone in der aktuellen UI-Sprache. */
  label(part: BodyPart): string {
    return this.lang.t(part.label, part.labelEn);
  }

  isSelected(part: BodyPart): boolean {
    return this.selectedPart?.key === part.key;
  }

  selectPart(part: BodyPart) {
    this.selectedPart = part;
    this.partSelected.emit(part);
  }
}
