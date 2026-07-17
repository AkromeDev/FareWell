import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

type PageLang = 'de' | 'en';

interface PageMeta {
  title: string;
  description: string;
}

/**
 * Zweisprachige Seiten: identische Routenstruktur unter / (deutsch) und
 * unter /en/ (englisch). Welche Sprache rendert, entscheidet die URL
 * (LanguageService); die title/description hier dokumentieren die
 * Ziel-Metadaten je Sprache — gesetzt werden sie von den Komponenten über
 * den SeoService. Nicht übersetzte Seiten (Legal, die englische
 * US-Forces-Sonderseite) leben ausschließlich im deutschen Baum.
 */
function localizedRoutes(lang: PageLang): Routes {
  const d = (de: PageMeta, en: PageMeta): PageMeta => (lang === 'de' ? de : en);

  const ratgeberChildren: Routes = [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: lang === 'de' ? '/faq' : '/en/faq',
    },
    {
      path: 'epilation-krankenkasse',
      loadComponent: () =>
        import('../components/pages/ratgeber/krankenkasse-epilation/krankenkasse-epilation.component')
          .then(m => m.KrankenkasseEpilationComponent),
      data: d(
        {
          title: 'Epilation über die Krankenkasse: Leitfaden für trans Personen | FareWell Nürnberg',
          description: 'So bekommst du deine Haarentfernung im Gesicht als Kassenleistung: Ärztevorbehalt, ärztliche Delegation bei FareWell, Antrag in 5 Schritten, Fristen und Widerspruch.'
        },
        {
          title: 'Health Insurance Coverage for Hair Removal: a Guide for Trans People | FareWell Nuremberg',
          description: 'How facial hair removal becomes a covered benefit in Germany: the physician requirement, medical delegation at FareWell, the application in 5 steps, deadlines and objections.'
        }
      )
    },
    {
      path: 'haarentfernung-steuer-absetzen',
      loadComponent: () =>
        import('../components/pages/ratgeber/steuer-absetzen/steuer-absetzen.component')
          .then(m => m.SteuerAbsetzenComponent),
      data: d(
        {
          title: 'Haarentfernung von der Steuer absetzen: Leitfaden für trans Personen | FareWell Nürnberg',
          description: 'Laser und Nadelepilation als außergewöhnliche Belastung absetzen: welche Nachweise das Finanzamt verlangt, wie du vorgehst und was FareWell dir dafür ausstellt.'
        },
        {
          title: 'Deducting Hair Removal Costs from German Tax: a Guide | FareWell Nuremberg',
          description: 'How to deduct laser and electrolysis costs as an extraordinary burden on your German tax return: required proof, the step-by-step process, and the documents FareWell provides.'
        }
      )
    },
  ];

  // Der deutsche MwSt-Ratgeber und seine englische Sonderseite existieren nur
  // im deutschen Baum; das Sprachpaar bilden sie über hreflang und den
  // Umschalter (LanguageService), nicht über /en/.
  if (lang === 'de') {
    ratgeberChildren.push(
      {
        path: 'mehrwertsteuer-us-streitkraefte',
        loadComponent: () =>
          import('../components/pages/ratgeber/mwst-us-streitkraefte/mwst-us-streitkraefte.component')
            .then(m => m.MwstUsStreitkraefteComponent),
        data: {
          title: 'Mehrwertsteuerbefreiung für US-Streitkräfte (SOFA): so funktioniert\'s | FareWell Nürnberg',
          description: 'NF1-Formular oder Remonon-App: So kaufen Angehörige der US-Streitkräfte in Deutschland ohne die 19% Mehrwertsteuer ein. Schritt für Schritt, mit FareWell als Beispiel.'
        }
      },
      {
        path: 'us-forces-vat-relief',
        loadComponent: () =>
          import('../components/pages/ratgeber/us-forces-vat-relief/us-forces-vat-relief.component')
            .then(m => m.UsForcesVatReliefComponent),
        data: {
          title: 'US Forces VAT Relief in Germany: NF1 Forms & Remonon Explained | FareWell Nürnberg',
          description: 'How US Forces members stop paying the 19% German VAT: NF1 and NF2 forms, the Remonon app, the five rules to keep it valid, plus 20% off laser hair removal for life.',
          lang: 'en'
        }
      }
    );
  }

  return [
    {
      path: '',
      loadComponent: () =>
        import('../components/pages/home/home.component').then(m => m.HomeComponent),
      data: d(
        {
          title: 'FareWell Nürnberg | Permanente Haarentfernung & Beauty Studio',
          description: 'FareWell Nürnberg: spezialisiert auf Elektrolyse (permanente Haarentfernung), Laserbehandlungen, Microneedling und weitere Beauty Behandlungen.'
        },
        {
          title: 'FareWell Nuremberg | Permanent Hair Removal & Beauty Studio',
          description: 'FareWell in Nuremberg specialises in electrolysis (permanent hair removal), laser hair removal, RF microneedling and body treatments. Consultations in English, near the main station.'
        }
      )
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
          data: d(
            {
              title: 'Elektrolyse / Nadelepilation in Nürnberg | FareWell',
              description: 'Professionelle Elektrolyse (Nadelepilation) in Nürnberg: die einzige wirklich permanente Haarentfernungsmethode.'
            },
            {
              title: 'Electrolysis (Nadelepilation) in Nuremberg | FareWell',
              description: 'Professional electrolysis in Nuremberg: the only truly permanent hair removal method. Works on every hair colour and skin type. Free initial consultation in English.'
            }
          )
        },
        {
          path: 'diodenlaser-4-wellen',
          loadComponent: () =>
            import('../components/pages/diodenlaser/diodenlaser')
              .then(m => m.Diodenlaser),
          data: d(
            {
              title: 'Diodenlaser Haarentfernung Nürnberg | FareWell',
              description: 'Moderne Diodenlaser Haarentfernung in Nürnberg: effektive und schonende dauerhafte Haarreduktion.'
            },
            {
              title: 'Laser Hair Removal Nuremberg (4-Wavelength Diode Laser) | FareWell',
              description: 'Modern diode laser hair removal in Nuremberg: effective, gentle, long-lasting hair reduction for larger body areas. Free consultation, English spoken.'
            }
          )
        },
        {
          path: 'microneedling-radiofrequenz',
          loadComponent: () =>
            import('../components/pages/microneedling/microneedling')
              .then(m => m.MicroneedlingComponent),
          data: d(
            {
              title: 'Microneedling Radiofrequenz Nürnberg | FareWell',
              description: 'Microneedling mit Radiofrequenz in Nürnberg: moderne Hautverjüngung, Faltenreduktion und Hautstraffung.'
            },
            {
              title: 'RF Microneedling Nuremberg | FareWell',
              description: 'Radiofrequency microneedling in Nuremberg: skin rejuvenation, scar treatment and firmer skin. Book online, free initial consultation in English.'
            }
          )
        },
        {
          path: 'kavitation',
          loadComponent: () =>
            import('../components/pages/kavitation/kavitation')
              .then(m => m.KavitationComponent),
          data: d(
            {
              title: 'Kavitation Fettabbau Nürnberg | FareWell',
              description: 'Ultraschall Kavitation in Nürnberg: nicht invasive Fettreduktion für Körperformung und Hautstraffung.'
            },
            {
              title: 'Ultrasound Cavitation & Body Forming Nuremberg | FareWell',
              description: 'Non-invasive ultrasound cavitation in Nuremberg for body contouring and skin firming. Free consultation, English spoken.'
            }
          )
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
          data: d(
            {
              title: 'Wellness Massage Nürnberg | FareWell',
              description: 'Entspannende Wellness Massagen bei FareWell in Nürnberg: Rücken-Schulter-Nacken-Massage, Ganzkörpermassage mit Aromaölen und Teilkörpermassage.'
            },
            {
              title: 'Wellness Massage Nuremberg | FareWell',
              description: 'Relaxing wellness massages at FareWell in Nuremberg: back, shoulder and neck massage, full-body massage with aroma oils, and partial-body massage. English spoken.'
            }
          )
        },
        {
          path: 'therapeutische-massage',
          loadComponent: () =>
            import('../components/pages/therapeutische-massage/therapeutische-massage')
              .then(m => m.TherapeutischeMassageComponent),
          data: d(
            {
              title: 'Therapeutische Massage Nürnberg | FareWell',
              description: 'Gezielte therapeutische Massagen in Nürnberg: Ersttermin mit Anamnese, Sport- & Regenerationsmassage sowie medizinisch-funktionelle Massage bei FareWell.'
            },
            {
              title: 'Therapeutic Massage Nuremberg | FareWell',
              description: 'Targeted therapeutic massages in Nuremberg: initial appointment with assessment, sports and recovery massage, and medical functional massage at FareWell.'
            }
          )
        }
      ]
    },

    {
      path: 'price',
      loadComponent: () =>
        import('../components/pages/price/price.component').then(m => m.PriceComponent),
      data: d(
        {
          title: 'Preise Nürnberg: Laser-Haarentfernung, Nadelepilation & mehr | FareWell',
          description: 'Alle Preise bei FareWell Nürnberg: Laser-Haarentfernung ab 30 €, Nadelepilation ab 40 €, Microneedling ab 180 €, Massage ab 45 €. Erstberatung kostenlos.'
        },
        {
          title: 'Prices Nuremberg: Laser Hair Removal, Electrolysis & More | FareWell',
          description: 'All prices at FareWell Nuremberg: laser hair removal from €30, electrolysis from €40, RF microneedling from €180, massage from €45. Free initial consultation.'
        }
      )
    },
    {
      path: 'zeit',
      loadChildren: () =>
        import('../components/pages/zeit/zeit.module').then(m => m.ZeitModule),
      data: d(
        {
          title: 'Behandlungsdauer | FareWell Nürnberg',
          description: 'Informationen zur Dauer unserer Beauty Behandlungen bei FareWell Nürnberg.'
        },
        {
          title: 'Electrolysis Treatment Time Calculator | FareWell Nuremberg',
          description: 'How long does permanent hair removal take? Calculate your personal electrolysis treatment time per body area at FareWell Nuremberg.'
        }
      )
    },
    {
      path: 'historie',
      loadChildren: () =>
        import('../components/pages/historie/historie.module').then(m => m.HistorieModule),
      data: d(
        {
          title: 'Die Geschichte der Elektrolyse | FareWell Nürnberg',
          description: 'Die Elektrolyse entfernt Haare seit über einem Jahrhundert permanent. Entdecke die Geschichte der einzigen wirklich permanenten Haarentfernungsmethode.'
        },
        {
          title: 'The History of Electrolysis | FareWell Nuremberg',
          description: 'Electrolysis has been removing hair permanently for over a century. Discover the history of the only truly permanent hair removal method.'
        }
      )
    },

    {
      path: 'faq',
      loadComponent: () =>
        import('../components/pages/faq/faq.component').then(m => m.FaqComponent),
      data: d(
        {
          title: 'FAQ – Häufige Fragen zu Haarentfernung & Behandlungen | FareWell Nürnberg',
          description: 'Antworten auf die häufigsten Fragen an FareWell Nürnberg: Elektrolyse vs. Diodenlaser, Termine & Preise, Kostenübernahme durch die Krankenkasse, Steuer und US-Forces-Mehrwertsteuerbefreiung.'
        },
        {
          title: 'FAQ – Hair Removal & Treatments in Nuremberg | FareWell',
          description: 'Answers to the most common questions at FareWell Nuremberg: electrolysis vs. diode laser, appointments and prices, insurance coverage, tax, and US Forces VAT exemption.'
        }
      )
    },
    {
      path: 'ratgeber',
      children: ratgeberChildren
    },

    {
      path: 'karriere/masseur-nuernberg/onboarding',
      loadComponent: () =>
        import('../components/pages/karriere/masseur-onboarding/masseur-onboarding.component')
          .then(m => m.MasseurOnboardingComponent),
      data: d(
        {
          title: 'Onboarding Massage – so arbeiten wir zusammen | FareWell Nürnberg',
          description: 'Der Onboarding-Leitfaden für selbständige Masseur:innen bei FareWell Nürnberg: Probe-Session, Leistungen, 70/30-Abrechnung, Kundengewinnung und der geteilte Raum. Auf Deutsch und Englisch.'
        },
        {
          title: 'Massage Onboarding – How We Work Together | FareWell Nuremberg',
          description: 'The onboarding guide for freelance massage therapists at FareWell Nuremberg: trial session, services, the 70/30 split, winning clients and the shared space. In German and English.'
        }
      )
    },
    {
      path: 'karriere/masseur-nuernberg',
      loadComponent: () =>
        import('../components/pages/karriere/masseur-karriere/masseur-karriere.component')
          .then(m => m.MasseurKarriereComponent),
      data: d(
        {
          title: 'Masseur:in (m/w/d) in Nürnberg – freiberuflich | Karriere bei FareWell',
          description: 'FareWell Nürnberg sucht Masseur:in zur freiberuflichen Zusammenarbeit: moderner Salon im Zentrum, flexible Arbeitszeiten, Online-Buchungssystem und eigener Kundenstamm.'
        },
        {
          title: 'Massage Therapist (m/f/d) in Nuremberg – Freelance | Careers at FareWell',
          description: 'FareWell Nuremberg is looking for a freelance massage therapist: modern central salon, flexible hours, an online booking system and your own client base.'
        }
      )
    },

    {
      path: 'laser-haarentfernung-aktion-nuernberg',
      loadComponent: () =>
        import('../components/pages/promotions/laser-promotion/laser-promotion.component')
          .then(m => m.LaserPromotionComponent),
      data: d(
        {
          title: 'Laser-Haarentfernung in Nürnberg: 75% Rabatt für Neukunden | FareWell',
          description: 'Dauerhafte Haarentfernung mit dem 4-Wellen-Diodenlaser in Nürnberg. 75% Rabatt auf die erste Laser-Behandlung (max. 2 Zonen) mit dem Code FIRSTLASER, gültig bis 15.08.'
        },
        {
          title: 'Laser Hair Removal in Nuremberg: 75% Off for New Clients | FareWell',
          description: 'Long-lasting hair removal with the 4-wavelength diode laser in Nuremberg. 75% off your first laser treatment (max. 2 areas) with the code FIRSTLASER, valid until 15 Aug.'
        }
      )
    },
    {
      path: 'ipl-dauerhafte-haarentfernung-aktion-nuernberg',
      loadComponent: () =>
        import('../components/pages/promotions/ipl-promotion/ipl-promotion.component')
          .then(m => m.IplPromotionComponent),
      data: d(
        {
          title: 'IPL-Haarentfernung in Nürnberg? Die modernere Alternative | FareWell',
          description: 'Statt IPL: dauerhafte Haarentfernung mit dem präziseren 4-Wellen-Diodenlaser in Nürnberg. 75% Rabatt auf die erste Behandlung (max. 2 Zonen) mit dem Code ERSTEBEHANDLUNG, gültig bis 15.08.'
        },
        {
          title: 'IPL Hair Removal in Nuremberg? The More Modern Alternative | FareWell',
          description: 'Instead of IPL: long-lasting hair removal with the more precise 4-wavelength diode laser in Nuremberg. 75% off your first treatment (max. 2 areas) with the code ERSTEBEHANDLUNG, valid until 15 Aug.'
        }
      )
    },
    {
      path: 'elektrolyse-permanente-haarentfernung-aktion-nuernberg',
      loadChildren: () =>
        import('../components/pages/promotions/electrolysis-promotion/electrolysis-promotion.module')
          .then(m => m.ElectrolysisPromotionModule),
      data: d(
        {
          title: 'Elektrolyse Aktion Nürnberg | Permanente Haarentfernung',
          description: 'Sonderangebot für Elektrolyse (permanente Haarentfernung) in Nürnberg bei FareWell.'
        },
        {
          title: 'Electrolysis Offer Nuremberg | Permanent Hair Removal | FareWell',
          description: 'Special offer for electrolysis (permanent hair removal) in Nuremberg at FareWell: 50% off your first treatment.'
        }
      )
    },
    {
      path: 'microneedling-aktion-nuernberg',
      loadChildren: () =>
        import('../components/pages/promotions/microneedling-promotion/microneedling-promotion.module')
          .then(m => m.MicroneedlingPromotionModule),
      data: d(
        {
          title: 'Microneedling Aktion Nürnberg | FareWell',
          description: 'Microneedling Sonderangebot in Nürnberg: Hautverjüngung und Hautverbesserung.'
        },
        {
          title: 'RF Microneedling Offer Nuremberg | FareWell',
          description: 'RF microneedling special offer in Nuremberg: skin rejuvenation and a better complexion. 50% off your first treatment.'
        }
      )
    },
    {
      path: 'nadelepilation-angebot-nuernberg',
      loadChildren: () =>
        import('../components/pages/promotions/nadelepilation-promotion/nadelepilation-promotion.module')
          .then(m => m.NadelepilationPromotionModule),
      data: d(
        {
          title: 'Nadelepilation Angebot Nürnberg | FareWell',
          description: 'Sonderangebot für Nadelepilation / Elektrolyse in Nürnberg.'
        },
        {
          title: 'Electrolysis (Nadelepilation) Offer Nuremberg | FareWell',
          description: 'Special offer for electrolysis (Nadelepilation) in Nuremberg: 50% off your first treatment for new clients.'
        }
      )
    },
  ];
}

const routes: Routes = [
  ...localizedRoutes('de'),

  // Englischer Spiegelbaum: gleiche Slugs unter /en/, gerendert auf Englisch.
  {
    path: 'en',
    children: localizedRoutes('en')
  },

  {
    path: 'behandlung',
    redirectTo: 'behandlungen/nadelepilation',
    pathMatch: 'full'
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

  // Interner Aufgaben- & Reinigungsplan (privat, nicht indexiert, nicht in der
  // Sitemap). Vier Routen teilen sich ein konfigurierbares Dashboard; der
  // :user-Parameter bestimmt über die Access-Konfiguration Nutzer, Sichtbarkeit
  // und Rechte. Bewusst NICHT unter /en/ gespiegelt (die Task-UI schaltet die
  // Sprache intern über den bestehenden Umschalter).
  {
    path: 'tasks/:user',
    loadComponent: () =>
      import('../components/pages/tasks/task-dashboard/task-dashboard.component')
        .then(m => m.TaskDashboardComponent),
    data: {
      title: 'Aufgaben | FareWell',
      description: 'Interner Aufgaben- und Reinigungsplan für das FareWell-Team.'
    }
  },
  {
    path: 'massage-tasks/:user',
    loadComponent: () =>
      import('../components/pages/tasks/task-dashboard/task-dashboard.component')
        .then(m => m.TaskDashboardComponent),
    data: {
      title: 'Massage-Aufgaben | FareWell',
      description: 'Interner Aufgabenplan für den Massageraum bei FareWell.'
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
