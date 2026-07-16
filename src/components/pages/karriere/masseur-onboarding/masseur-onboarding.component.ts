import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RevealOnScrollDirective } from 'src/directives/reveal.directive';
import { SeoService } from 'src/services/seo.service';
import { LanguageService } from 'src/services/language.service';
import {
  GUIDE_COMPONENTS,
  GuideLang,
  GuideStat,
  GuideTocItem,
} from 'src/components/molecules/guide';

const PAGE_PATH = '/karriere/masseur-nuernberg/onboarding';
const PAGE_TITLE = 'Onboarding Massage – so arbeiten wir zusammen | FareWell Nürnberg';
const PAGE_DESCRIPTION =
  'Der Onboarding-Leitfaden für selbständige Masseur:innen bei FareWell Nürnberg: Probe-Session, Leistungen, 70/30-Abrechnung, Kundengewinnung und der geteilte Raum – auf Deutsch und Englisch.';

/**
 * Zweisprachige Onboarding-Seite für Masseur:innen. Kurze Texte laufen über
 * t(de, en)-Bindings, längere projizierte Inhalte über
 * <span class="lang de|en">-Paare, die das data-lang-Attribut des Wrappers
 * per CSS umschaltet. Sprache kommt aus ?lang=…, sonst aus localStorage.
 */
@Component({
  standalone: true,
  selector: 'app-masseur-onboarding',
  imports: [...GUIDE_COMPONENTS, RevealOnScrollDirective],
  templateUrl: './masseur-onboarding.component.html',
})
export class MasseurOnboardingComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly language = inject(LanguageService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  get lang(): GuideLang {
    return this.language.lang();
  }

  ngOnInit(): void {
    this.seo.setPageSeo({
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      path: PAGE_PATH,
    });

    if (this.isBrowser) {
      const fromQuery = this.route.snapshot.queryParamMap.get('lang');
      if (fromQuery === 'de' || fromQuery === 'en') {
        this.language.setLang(fromQuery);
      }
    }
  }

  t(de: string, en: string): string {
    return this.language.t(de, en);
  }

  get stats(): GuideStat[] {
    return [
      { value: '70%', label: this.t('Dein Anteil', 'Your share') },
      { value: '3', label: this.t('Wege zu Kunden', 'Ways to win clients') },
      { value: '20%', label: this.t('Vorteil für Kunden', 'Lifelong client perk') },
      {
        value: this.t('selbständig', 'freelance'),
        label: this.t('Dein Status', 'Your status'),
      },
    ];
  }

  get toc(): GuideTocItem[] {
    return [
      { id: 's1', label: this.t('So arbeiten wir zusammen', 'How we work together') },
      { id: 's2', label: this.t('Deine Probe Session', 'Your trial session') },
      { id: 's3', label: this.t('Deine Leistungen festlegen', 'Define your services') },
      { id: 's4', label: this.t('Bezahlung und dein Anteil', 'Payment and your share') },
      { id: 's5', label: this.t('Kunden gewinnen', 'Getting clients') },
      { id: 's6', label: this.t('Dein eigenes Google Profil', 'Your own Google profile') },
      { id: 's7', label: this.t('Der 20% Vorteil', 'The 20% client perk') },
      { id: 's8', label: this.t('Das Salon Angebot kennen', 'Know the salon') },
      { id: 's9', label: this.t('Material, Wäsche und Raum', 'Supplies, laundry and room') },
      { id: 's10', label: this.t('Erste Schritte', 'First steps') },
      { id: 's11', label: this.t('Vorschläge und offene Punkte', 'Suggestions and open points') },
    ];
  }
}
