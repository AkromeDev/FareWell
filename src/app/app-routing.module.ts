import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../components/pages/home/home.component').then(m => m.HomeComponent),
    data: {
      title: 'FareWell Nürnberg | Permanente Haarentfernung & Beauty Studio',
      description: 'FareWell Nürnberg – Spezialisiert auf Elektrolyse (permanente Haarentfernung), Laserbehandlungen, Microneedling und weitere Beauty Behandlungen.'
    }
  },

  {
    path: 'behandlungen',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'nadelepilation'
      },
      {
        path: 'nadelepilation',
        loadComponent: () =>
          import('../components/pages/nadelepilation/nadelepilation.component')
            .then(m => m.NadelepilationComponent),
        data: {
          title: 'Elektrolyse / Nadelepilation in Nürnberg | FareWell',
          description: 'Professionelle Elektrolyse (Nadelepilation) in Nürnberg – die einzige wirklich permanente Haarentfernungsmethode.'
        }
      },
      {
        path: 'diodenlaser-4-wellen',
        loadComponent: () =>
          import('../components/pages/diodenlaser/diodenlaser')
            .then(m => m.Diodenlaser),
        data: {
          title: 'Diodenlaser Haarentfernung Nürnberg | FareWell',
          description: 'Moderne Diodenlaser Haarentfernung in Nürnberg – effektive und schonende dauerhaft reduzierte Haarentfernung.'
        }
      },
      {
        path: 'microneedling-radiofrequenz',
        loadComponent: () =>
          import('../components/pages/microneedling/microneedling')
            .then(m => m.MicroneedlingComponent),
        data: {
          title: 'Microneedling Radiofrequenz Nürnberg | FareWell',
          description: 'Microneedling mit Radiofrequenz in Nürnberg – moderne Hautverjüngung, Faltenreduktion und Hautstraffung.'
        }
      },
      {
        path: 'kavitation',
        loadComponent: () =>
          import('../components/pages/kavitation/kavitation')
            .then(m => m.KavitationComponent),
        data: {
          title: 'Kavitation Fettabbau Nürnberg | FareWell',
          description: 'Ultraschall Kavitation in Nürnberg – nicht invasive Fettreduktion für Körperformung und Hautstraffung.'
        }
      },
      {
        path: 'massage',
        redirectTo: 'wellness-massage',
        pathMatch: 'full'
      },
      {
        path: 'wellness-massage',
        loadComponent: () =>
          import('../components/pages/massage/massage')
            .then(m => m.MassageComponent),
        data: {
          title: 'Wellness Massage Nürnberg | FareWell',
          description: 'Entspannende Wellness Massagen bei FareWell in Nürnberg: Rücken-Schulter-Nacken-Massage, Ganzkörpermassage mit Aromaölen und Teilkörpermassage.'
        }
      },
      {
        path: 'therapeutische-massage',
        loadComponent: () =>
          import('../components/pages/therapeutische-massage/therapeutische-massage')
            .then(m => m.TherapeutischeMassageComponent),
        data: {
          title: 'Therapeutische Massage Nürnberg | FareWell',
          description: 'Gezielte therapeutische Massagen in Nürnberg: Ersttermin mit Anamnese, Sport- & Regenerationsmassage sowie medizinisch-funktionelle Massage bei FareWell.'
        }
      }
    ]
  },

  {
    path: 'behandlung',
    redirectTo: 'behandlungen/nadelepilation',
    pathMatch: 'full'
  },

  {
    path: 'price',
    loadComponent: () =>
      import('../components/pages/price/price.component').then(m => m.PriceComponent),
    data: {
      title: 'Preise Nürnberg: Laser-Haarentfernung, Nadelepilation & mehr | FareWell',
      description: 'Alle Preise bei FareWell Nürnberg: Laser-Haarentfernung ab 30 €, Nadelepilation ab 40 €, Microneedling ab 180 €, Massage ab 45 €. Erstberatung kostenlos.'
    }
  },
  {
    path: 'zeit',
    loadChildren: () =>
      import('../components/pages/zeit/zeit.module').then(m => m.ZeitModule),
    data: {
      title: 'Behandlungsdauer | FareWell Nürnberg',
      description: 'Informationen zur Dauer unserer Beauty Behandlungen bei FareWell Nürnberg.'
    }
  },
  {
    path: 'historie',
    loadChildren: () =>
      import('../components/pages/historie/historie.module').then(m => m.HistorieModule),
    data: {
      title: 'Über FareWell | Beauty Studio Nürnberg',
      description: 'Erfahren Sie mehr über FareWell in Nürnberg und unsere Philosophie für moderne Beauty Behandlungen.'
    }
  },

  {
    path: 'faq',
    loadComponent: () =>
      import('../components/pages/faq/faq.component').then(m => m.FaqComponent),
    data: {
      title: 'FAQ – Häufige Fragen zu Haarentfernung & Behandlungen | FareWell Nürnberg',
      description: 'Antworten auf die häufigsten Fragen an FareWell Nürnberg: Elektrolyse vs. Diodenlaser, Termine & Preise, Kostenübernahme durch die Krankenkasse, Steuer und US-Forces-Mehrwertsteuerbefreiung.'
    }
  },
  {
    path: 'ratgeber',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/faq'
      },
      {
        path: 'epilation-krankenkasse',
        loadComponent: () =>
          import('../components/pages/ratgeber/krankenkasse-epilation/krankenkasse-epilation.component')
            .then(m => m.KrankenkasseEpilationComponent),
        data: {
          title: 'Epilation über die Krankenkasse – Leitfaden für trans Personen | FareWell Nürnberg',
          description: 'So bekommst du deine Haarentfernung im Gesicht als Kassenleistung: Ärztevorbehalt, ärztliche Delegation bei FareWell, Antrag in 5 Schritten, Fristen und Widerspruch.'
        }
      },
      {
        path: 'haarentfernung-steuer-absetzen',
        loadComponent: () =>
          import('../components/pages/ratgeber/steuer-absetzen/steuer-absetzen.component')
            .then(m => m.SteuerAbsetzenComponent),
        data: {
          title: 'Haarentfernung von der Steuer absetzen – Leitfaden für trans Personen | FareWell Nürnberg',
          description: 'Laser und Nadelepilation als außergewöhnliche Belastung absetzen: welche Nachweise das Finanzamt verlangt, wie du vorgehst und was FareWell dir dafür ausstellt.'
        }
      },
      {
        path: 'mehrwertsteuer-us-streitkraefte',
        loadComponent: () =>
          import('../components/pages/ratgeber/mwst-us-streitkraefte/mwst-us-streitkraefte.component')
            .then(m => m.MwstUsStreitkraefteComponent),
        data: {
          title: 'Mehrwertsteuerbefreiung für US-Streitkräfte (SOFA) – so funktioniert\'s | FareWell Nürnberg',
          description: 'NF1-Formular oder Remonon-App: So kaufen Angehörige der US-Streitkräfte in Deutschland ohne die 19% Mehrwertsteuer ein – Schritt für Schritt, mit FareWell als Beispiel.'
        }
      },
      {
        path: 'us-forces-vat-relief',
        loadComponent: () =>
          import('../components/pages/ratgeber/us-forces-vat-relief/us-forces-vat-relief.component')
            .then(m => m.UsForcesVatReliefComponent),
        data: {
          title: 'US Forces VAT Relief in Germany – NF1 Forms & Remonon Explained | FareWell Nürnberg',
          description: 'How US Forces members stop paying the 19% German VAT: NF1 and NF2 forms, the Remonon app, the five rules to keep it valid – plus 20% off laser hair removal for life.',
          lang: 'en'
        }
      }
    ]
  },

  {
    path: 'karriere/masseur-nuernberg/onboarding',
    loadComponent: () =>
      import('../components/pages/karriere/masseur-onboarding/masseur-onboarding.component')
        .then(m => m.MasseurOnboardingComponent),
    data: {
      title: 'Onboarding Massage – so arbeiten wir zusammen | FareWell Nürnberg',
      description: 'Der Onboarding-Leitfaden für selbständige Masseur:innen bei FareWell Nürnberg: Probe-Session, Leistungen, 70/30-Abrechnung, Kundengewinnung und der geteilte Raum – auf Deutsch und Englisch.'
    }
  },
  {
    path: 'karriere/masseur-nuernberg',
    loadComponent: () =>
      import('../components/pages/karriere/masseur-karriere/masseur-karriere.component')
        .then(m => m.MasseurKarriereComponent),
    data: {
      title: 'Masseur:in (m/w/d) in Nürnberg – freiberuflich | Karriere bei FareWell',
      description: 'FareWell Nürnberg sucht Masseur:in zur freiberuflichen Zusammenarbeit: moderner Salon im Zentrum, flexible Arbeitszeiten, Online-Buchungssystem und eigener Kundenstamm.'
    }
  },

  {
    path: 'impressum',
    loadComponent: () =>
      import('../components/pages/legal/impressum/impressum.component')
        .then(m => m.ImpressumComponent),
    data: {
      title: 'Impressum | FareWell Nürnberg',
      description: 'Impressum von FareWell – Beauty Studio in Nürnberg.'
    }
  },
  {
    path: 'datenschutz',
    loadComponent: () =>
      import('../components/pages/legal/datenschutz/datenschutz.component')
        .then(m => m.DatenschutzComponent),
    data: {
      title: 'Datenschutzerklärung | FareWell Nürnberg',
      description: 'Datenschutzerklärung von FareWell Nürnberg.'
    }
  },
  {
    path: 'agb',
    loadComponent: () =>
      import('../components/pages/legal/agb/agb.component')
        .then(m => m.AgbComponent),
    data: {
      title: 'AGB | FareWell Nürnberg',
      description: 'Allgemeine Geschäftsbedingungen von FareWell Nürnberg.'
    }
  },

  {
    path: 'laser-haarentfernung-aktion-nuernberg',
    loadComponent: () =>
      import('../components/pages/promotions/laser-promotion/laser-promotion.component')
        .then(m => m.LaserPromotionComponent),
    data: {
      title: 'Laser-Haarentfernung in Nürnberg: 50% Rabatt für Neukunden | FareWell',
      description: 'Dauerhafte Haarentfernung mit dem 4-Wellen-Diodenlaser in Nürnberg. 50% Rabatt auf die erste Laser-Behandlung mit dem Code FIRSTLASER.'
    }
  },
  {
    path: 'ipl-dauerhafte-haarentfernung-aktion-nuernberg',
    loadComponent: () =>
      import('../components/pages/promotions/ipl-promotion/ipl-promotion.component')
        .then(m => m.IplPromotionComponent),
    data: {
      title: 'IPL-Haarentfernung in Nürnberg? Die modernere Alternative | FareWell',
      description: 'Statt IPL: dauerhafte Haarentfernung mit dem präziseren 4-Wellen-Diodenlaser in Nürnberg. 50% Rabatt auf die erste Behandlung mit dem Code ERSTEBEHANDLUNG.'
    }
  },
  {
    path: 'elektrolyse-permanente-haarentfernung-aktion-nuernberg',
    loadChildren: () =>
      import('../components/pages/promotions/electrolysis-promotion/electrolysis-promotion.module')
        .then(m => m.ElectrolysisPromotionModule),
    data: {
      title: 'Elektrolyse Aktion Nürnberg | Permanente Haarentfernung',
      description: 'Sonderangebot für Elektrolyse (permanente Haarentfernung) in Nürnberg bei FareWell.'
    }
  },
  {
    path: 'microneedling-aktion-nuernberg',
    loadChildren: () =>
      import('../components/pages/promotions/microneedling-promotion/microneedling-promotion.module')
        .then(m => m.MicroneedlingPromotionModule),
    data: {
      title: 'Microneedling Aktion Nürnberg | FareWell',
      description: 'Microneedling Sonderangebot in Nürnberg – Hautverjüngung und Hautverbesserung.'
    }
  },
  {
    path: 'nadelepilation-angebot-nuernberg',
    loadChildren: () =>
      import('../components/pages/promotions/nadelepilation-promotion/nadelepilation-promotion.module')
        .then(m => m.NadelepilationPromotionModule),
    data: {
      title: 'Nadelepilation Angebot Nürnberg | FareWell',
      description: 'Sonderangebot für Nadelepilation / Elektrolyse in Nürnberg.'
    }
  },

  {
    path: 'not-found',
    loadComponent: () =>
      import('../components/pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }