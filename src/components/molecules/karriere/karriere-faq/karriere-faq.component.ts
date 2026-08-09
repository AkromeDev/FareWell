import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaqItemComponent, GuideSectionComponent } from 'src/components/molecules/guide';
import { LanguageService } from 'src/services/language.service';
import { KarriereFaqEntry } from 'src/components/pages/karriere/shared/karriere-content';

/**
 * FAQ-Block der Karriere-Detailseiten: die Fragen, die Selbständige vor einer
 * Zusammenarbeit wirklich stellen. Die Einträge kommen als Klartext aus
 * karriere-content.ts und wandern von dort unverändert auch ins
 * FAQPage-Schema — sichtbare Antwort und Markup bleiben deckungsgleich.
 *
 *   <app-karriere-faq index="04" [entries]="faq" />
 */
@Component({
  selector: 'app-karriere-faq',
  standalone: true,
  imports: [GuideSectionComponent, FaqItemComponent, RouterLink],
  template: `
    <app-guide-section [index]="index" [heading]="heading" [sectionId]="sectionId">
      @for (entry of entries; track entry.question; let first = $first) {
        <app-faq-item [question]="entry.question" [open]="first">
          <p>{{ entry.answer }}</p>
          @if (entry.linkPath && entry.linkLabel) {
            <p>
              <a [routerLink]="p(entry.linkPath)" [fragment]="entry.linkFragment">{{
                entry.linkLabel
              }}</a>
            </p>
          }
        </app-faq-item>
      }
    </app-guide-section>
  `,
})
export class KarriereFaqComponent {
  @Input({ required: true }) entries: KarriereFaqEntry[] = [];
  @Input() index = '04';
  @Input() sectionId = 'faq';
  /** Überschrift überschreiben; sonst „Häufige Fragen“ / „Frequently asked questions“. */
  @Input() headingOverride = '';

  private readonly language = inject(LanguageService);

  get heading(): string {
    return (
      this.headingOverride ||
      this.language.t('Häufige Fragen', 'Frequently asked questions')
    );
  }

  p(path: string): string {
    return this.language.localizePath(path);
  }
}
