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
      loadComponent: () =>
        import('../components/pages/ratgeber/ratgeber-hub/ratgeber-hub.component')
          .then(m => m.RatgeberHubComponent),
      data: d(
        {
          title: 'Ratgeber: Haarentfernung, Körper & Kostenübernahme | FareWell Nürnberg',
          description: 'Alle Ratgeber von FareWell Nürnberg an einem Ort: Elektrolyse oder Laser, Körperbehandlungen mit Ultraschall, Kostenübernahme durch die Krankenkasse, Steuer und Mehrwertsteuerbefreiung für US-Streitkräfte.'
        },
        {
          title: 'Guides: Hair Removal, Body & Coverage | FareWell Nuremberg',
          description: "FareWell Nuremberg's guides in one place: electrolysis or laser, ultrasound body treatments, insurance coverage, tax deductions and VAT exemption for US Forces."
        }
      )
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
      path: 'epilation-krankenkasse-hormonell',
      loadComponent: () =>
        import('../components/pages/ratgeber/krankenkasse-hormonell/krankenkasse-hormonell.component')
          .then(m => m.KrankenkasseHormonellComponent),
      data: d(
        {
          title: 'Hirsutismus & PCOS: Haarentfernung auf Kasse? | FareWell Nürnberg',
          description: 'Hirsutismus durch PCOS, AGS oder die Wechseljahre: welche Abklärung nötig ist, was ins ärztliche Attest gehört und wie ein Antrag bei der Kasse abläuft.'
        },
        {
          title: 'Hirsutism & PCOS: Hair Removal on Insurance? | FareWell Nuremberg',
          description: 'Hirsutism from PCOS, CAH or the menopause: which work-up is needed, what belongs in the medical certificate and how an application to a German insurer works.'
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
    {
      path: 'elektrolyse-oder-laser',
      loadComponent: () =>
        import('../components/pages/ratgeber/elektrolyse-laser/elektrolyse-laser.component')
          .then(m => m.ElektrolyseLaserComponent),
      data: d(
        {
          title: 'Elektrolyse oder Laser? Der ehrliche Vergleich zur Haarentfernung | FareWell Nürnberg',
          description: 'Elektrolyse (Nadelepilation) oder Diodenlaser? Permanent vs. dauerhaft, Haut- und Haartypen, Zonen, Sitzungen und Kosten, ehrlich verglichen, mit einer klaren Empfehlung für deine Situation.'
        },
        {
          title: 'Electrolysis or Laser? An Honest Hair-Removal Comparison | FareWell Nuremberg',
          description: 'Electrolysis (Nadelepilation) or the diode laser? Permanent vs. long-lasting, skin and hair types, areas, sessions and cost, compared honestly, with a clear recommendation for your situation.'
        }
      )
    },
    {
      path: 'kavitation-ultraschall-fettreduktion',
      loadComponent: () =>
        import('../components/pages/ratgeber/koerperbehandlungen/koerperbehandlungen.component')
          .then(m => m.KoerperbehandlungenComponent),
      data: d(
        {
          title: 'Kavitation, Ultraschall-Fettreduktion & Cellulite: der Ratgeber | FareWell Nürnberg',
          description: 'Kavitation, Ultraschall-Fettreduktion und Cellulite-Behandlung in Nürnberg: wie sie wirken, der Rhythmus als Kur (alle 2–4 Tage), Vorbereitung, Nachsorge und für wen sie nicht geeignet sind.'
        },
        {
          title: 'Cavitation, Ultrasound Fat Reduction & Cellulite: the Guide | FareWell Nuremberg',
          description: 'Cavitation, ultrasound fat reduction and cellulite treatment in Nuremberg: how they work, the course rhythm (every 2–4 days), preparation, aftercare and who they are not suitable for.'
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
          title: 'FareWell – Kosmetikstudio & dauerhafte Haarentfernung | Nürnberg',
          description: 'FareWell Nürnberg: spezialisiert auf Elektrolyse (permanente Haarentfernung), Laserbehandlungen, Microneedling und weitere Beauty Behandlungen.'
        },
        {
          title: 'FareWell – Kosmetikstudio & dauerhafte Haarentfernung | Nürnberg',
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
              title: 'Radiofrequenz Microneedling Nürnberg: Hautverjüngung | FareWell',
              description: 'Microneedling mit Radiofrequenz in Nürnberg: Hautverjüngung für Gesicht, Hals, Dekolleté und Brust, ab 180 €. Beratung kostenlos.'
            },
            {
              title: 'RF Microneedling Nuremberg: Skin Rejuvenation | FareWell',
              description: 'Radiofrequency microneedling in Nuremberg: skin rejuvenation for face, neck, décolleté and chest, from €180. Book online, free consultation in English.'
            }
          )
        },
        {
          path: 'narbenbehandlung',
          loadComponent: () =>
            import('../components/pages/narbenbehandlung/narbenbehandlung.component')
              .then(m => m.NarbenbehandlungComponent),
          data: d(
            {
              title: 'Narbenbehandlung Nürnberg: Aknenarben & Dehnungsstreifen | FareWell',
              description: 'Narbenbehandlung mit Radiofrequenz Microneedling in Nürnberg: Aknenarben, Narben nach OP und Verletzungen, Dehnungsstreifen. 250 € pro Sitzung, Beratung kostenlos.'
            },
            {
              title: 'Scar Treatment Nuremberg: Acne Scars & Stretch Marks | FareWell',
              description: 'Scar treatment with RF microneedling in Nuremberg: acne scars, scars after surgery or injury, stretch marks. €250 per session, free consultation, English spoken.'
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
              title: 'Body Forming Nürnberg: Ultraschall Kavitation & Cellulite | FareWell',
              description: 'Kosmetisches Body Forming in Nürnberg mit Ultraschall Kavitation und Radiofrequenz: Cellulite Behandlung und lokale Zonen, ab 80 €. Keine Abnehmbehandlung.'
            },
            {
              title: 'Body Forming Nuremberg: Ultrasound Cavitation & Cellulite | FareWell',
              description: 'Cosmetic body forming in Nuremberg with ultrasound cavitation and radio frequency: cellulite treatment and local areas, from €80. Not a weight-loss treatment.'
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
          title: 'Preise Nürnberg: Laser, Nadelepilation, Microneedling & Massage | FareWell',
          description: 'Alle Preise bei FareWell Nürnberg: Laser ab 30 €, Nadelepilation ab 40 €, Microneedling ab 180 €, Body Forming ab 80 €, Massage ab 45 €. Beratung kostenlos.'
        },
        {
          title: 'Prices Nuremberg: Laser, Electrolysis, Microneedling & Massage | FareWell',
          description: 'All prices at FareWell Nuremberg: laser from €30, electrolysis from €40, RF microneedling from €180, body forming from €80, massage from €45. Free consultation.'
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
          title: 'FAQ: Häufige Fragen zu Haarentfernung & Behandlungen | FareWell Nürnberg',
          description: 'Antworten auf die häufigsten Fragen an FareWell Nürnberg: Elektrolyse vs. Diodenlaser, Termine & Preise, Kostenübernahme durch die Krankenkasse, Steuer und US-Forces-Mehrwertsteuerbefreiung.'
        },
        {
          title: 'FAQ: Hair Removal & Treatments in Nuremberg | FareWell',
          description: 'Answers to the most common questions at FareWell Nuremberg: electrolysis vs. diode laser, appointments and prices, insurance coverage, tax, and US Forces VAT exemption.'
        }
      )
    },
    {
      path: 'ratgeber',
      children: ratgeberChildren
    },

    {
      path: 'mojoclipboard-support',
      loadComponent: () =>
        import('../components/pages/mojoclipboard-support/mojoclipboard-support.component')
          .then(m => m.MojoClipboardSupportComponent),
      data: d(
        {
          title: 'MojoClipboard: Support & Anleitung | Zwischenablage-Verlauf für den Mac',
          description: 'Support für MojoClipboard, die kostenlose macOS-Menüleisten-App für den Zwischenablage-Verlauf (macOS 14+). ⌃⌘V öffnet den Verlauf. Datenschutz-first: keine Daten, nichts verlässt dein Gerät.'
        },
        {
          title: 'MojoClipboard: Support & Guide | Clipboard History for Mac',
          description: 'Support for MojoClipboard, the free macOS menu-bar clipboard-history app (macOS 14+). Press ⌃⌘V to open your history. Privacy-first: no data collected, nothing leaves your device.'
        }
      )
    },

    {
      path: 'karriere/masseur-nuernberg/onboarding',
      loadComponent: () =>
        import('../components/pages/karriere/masseur-onboarding/masseur-onboarding.component')
          .then(m => m.MasseurOnboardingComponent),
      data: d(
        {
          title: 'Onboarding Massage: so arbeiten wir zusammen | FareWell Nürnberg',
          description: 'Der Onboarding-Leitfaden für selbständige Masseur:innen bei FareWell Nürnberg: Probe-Session, Leistungen, 70/30-Abrechnung, Kundengewinnung und der geteilte Raum. Auf Deutsch und Englisch.'
        },
        {
          title: 'Massage Onboarding: How We Work Together | FareWell Nuremberg',
          description: 'The onboarding guide for freelance massage therapists at FareWell Nuremberg: trial session, services, the 70/30 split, winning clients and the shared space. In German and English.'
        }
      )
    },
    {
      path: 'karriere/masseur-bademeister-blind-nuernberg',
      loadComponent: () =>
        import('../components/pages/karriere/masseur-bademeister-karriere/masseur-bademeister-karriere.component')
          .then(m => m.MasseurBademeisterKarriereComponent),
      data: d(
        {
          title: 'Masseur:in und medizinische:r Bademeister:in (m/w/d) in Nürnberg: für blinde und sehbehinderte Bewerber:innen | FareWell',
          description: 'FareWell Nürnberg sucht eine:n Masseur:in und medizinische:n Bademeister:in, blind oder sehbehindert: Festanstellung oder selbständige Tätigkeit, eingerichteter Arbeitsplatz, stufenfreier Weg von der U-Bahn, Blindenführhund willkommen.'
        },
        {
          title: 'Massage Therapist (m/f/d) in Nuremberg: a Role for Blind and Visually Impaired Applicants | FareWell',
          description: 'FareWell Nuremberg is hiring a blind or visually impaired massage therapist (Masseur und medizinischer Bademeister): permanent employment or freelance work, an adapted workplace, a step-free route from the U-Bahn and a welcome for guide dogs.'
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
          title: 'Masseur:in (m/w/d) in Nürnberg: freiberuflich | Karriere bei FareWell',
          description: 'FareWell Nürnberg sucht Masseur:in zur freiberuflichen Zusammenarbeit: moderner Salon im Zentrum, flexible Arbeitszeiten, Online-Buchungssystem und eigener Kundenstamm.'
        },
        {
          title: 'Massage Therapist (m/f/d) in Nuremberg: Freelance | Careers at FareWell',
          description: 'FareWell Nuremberg is looking for a freelance massage therapist: modern central salon, flexible hours, an online booking system and your own client base.'
        }
      )
    },
    {
      path: 'karriere/physiotherapeut-nuernberg',
      loadComponent: () =>
        import('../components/pages/karriere/physio-karriere/physio-karriere.component')
          .then(m => m.PhysioKarriereComponent),
      data: d(
        {
          title: 'Physiotherapeut:in (m/w/d) in Nürnberg: freiberuflich auf Privatbasis | Karriere bei FareWell',
          description: 'FareWell Nürnberg sucht Physiotherapeut:innen zur freiberuflichen Zusammenarbeit auf Privatbasis: Massage und Körperarbeit ohne Kassenrezepte, moderner Salon im Zentrum, flexible Zeiten und ein eigener Kundenstamm.'
        },
        {
          title: 'Physiotherapist (m/f/d) in Nuremberg: Freelance, Private Practice | Careers at FareWell',
          description: 'FareWell Nuremberg is looking for freelance physiotherapists working privately: massage and bodywork without health-insurance prescriptions, a modern central salon, flexible hours and your own client base.'
        }
      )
    },
    {
      path: 'karriere/kosmetik-nuernberg',
      loadComponent: () =>
        import('../components/pages/karriere/kosmetik-karriere/kosmetik-karriere.component')
          .then(m => m.KosmetikKarriereComponent),
      data: d(
        {
          title: 'Kosmetiker:in (m/w/d) in Nürnberg: freiberuflich | Karriere bei FareWell',
          description: 'FareWell Nürnberg sucht selbständige Kosmetiker:innen mit eigenem Konzept: voll ausgestatteter Raum im Zentrum, Online-Buchung, flexible Zeiten, keine feste Miete und Hilfe beim eigenen Google-Business-Profil.'
        },
        {
          title: 'Beautician (m/f/d) in Nuremberg: Freelance | Careers at FareWell',
          description: 'FareWell Nuremberg is looking for freelance beauticians with a concept of their own: a fully equipped room in the city centre, online booking, flexible hours, no fixed rent and help setting up your own Google Business profile.'
        }
      )
    },
    {
      path: 'karriere/yoga-nuernberg',
      loadComponent: () =>
        import('../components/pages/karriere/yoga-karriere/yoga-karriere.component')
          .then(m => m.YogaKarriereComponent),
      data: d(
        {
          title: 'Yoga-Lehrer:in (m/w/d) in Nürnberg: freiberuflich | Karriere bei FareWell',
          description: 'FareWell Nürnberg sucht selbständige Yoga-Lehrer:innen, die ein eigenes Kursangebot aufbauen wollen: ruhiger Raum im Zentrum, Online-Buchung, flexible Zeiten, keine feste Miete und Hilfe beim eigenen Google-Business-Profil.'
        },
        {
          title: 'Yoga Teacher (m/f/d) in Nuremberg: Freelance | Careers at FareWell',
          description: 'FareWell Nuremberg is looking for freelance yoga teachers who want to build their own class offering: a quiet room in the city centre, online booking, flexible hours, no fixed rent and help setting up your own Google Business profile.'
        }
      )
    },
    {
      path: 'karriere/tanzlehrer-nuernberg',
      loadComponent: () =>
        import('../components/pages/karriere/tanz-karriere/tanz-karriere.component')
          .then(m => m.TanzKarriereComponent),
      data: d(
        {
          title: 'Tanzlehrer:in (m/w/d) in Nürnberg: freiberuflich | Karriere bei FareWell',
          description: 'FareWell Nürnberg sucht selbständige Tanzlehrer:innen mit eigenem Konzept: flexibler Raum im Zentrum für Einzelunterricht, Paare und kleine Gruppen, Online-Buchung, flexible Zeiten und keine feste Miete.'
        },
        {
          title: 'Dance Teacher (m/f/d) in Nuremberg: Freelance | Careers at FareWell',
          description: 'FareWell Nuremberg is looking for freelance dance teachers with a concept of their own: a flexible room in the city centre for one-to-one lessons, couples and small groups, online booking, flexible hours and no fixed rent.'
        }
      )
    },
    {
      path: 'karriere/botox-nuernberg',
      loadComponent: () =>
        import('../components/pages/karriere/botox-karriere/botox-karriere.component')
          .then(m => m.BotoxKarriereComponent),
      data: d(
        {
          title: 'Ärztin / Arzt (m/w/d) für Botox & ästhetische Medizin in Nürnberg | Karriere bei FareWell',
          description: 'FareWell Nürnberg sucht approbierte Ärzt:innen mit Injektionserfahrung für ein eigenes Angebot mit Botulinumtoxin: Raum im Zentrum, Online-Buchung, flexible Zeiten, keine feste Miete, eingebettet in unser bestehendes Delegationsmodell.'
        },
        {
          title: 'Physician (m/f/d) for Botox & Aesthetic Medicine in Nuremberg | Careers at FareWell',
          description: 'FareWell Nuremberg is looking for licensed physicians with injection experience to build their own botulinum toxin offering: a room in the city centre, online booking, flexible hours, no fixed rent, embedded in our existing medical delegation model.'
        }
      )
    },
    {
      path: 'karriere',
      loadComponent: () =>
        import('../components/pages/karriere/karriere-hub/karriere-hub.component')
          .then(m => m.KarriereHubComponent),
      data: d(
        {
          title: 'Karriere bei FareWell Nürnberg: freiberuflich arbeiten im Studio',
          description: 'Offene Positionen bei FareWell Nürnberg für Selbständige: Kosmetik, Massage, Yoga, Tanz und ästhetische Medizin. Voll ausgestatteter Raum im Zentrum, keine feste Miete, flexible Zeiten und Hilfe beim eigenen Google-Business-Profil.'
        },
        {
          title: 'Careers at FareWell Nuremberg: Work Freelance in Our Studio',
          description: 'Open positions at FareWell Nuremberg for freelancers: cosmetics, massage, yoga, dance and aesthetic medicine. A fully equipped room in the city centre, no fixed rent, flexible hours and help setting up your own Google Business profile.'
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
          title: 'Laser-Haarentfernung in Nürnberg: 50% Rabatt auf die erste Behandlung | FareWell',
          description: 'Dauerhafte Haarentfernung mit dem 4-Wellen-Diodenlaser in Nürnberg. 50% Rabatt auf deine erste Behandlung mit dem Code ERSTEBEHANDLUNG. Dauerhaft bis zu 30% Rabatt, je mehr Zonen du buchst.'
        },
        {
          title: 'Laser Hair Removal in Nuremberg: 50% Off Your First Treatment | FareWell',
          description: 'Long-lasting hair removal with the 4-wavelength diode laser in Nuremberg. 50% off your first treatment with the code ERSTEBEHANDLUNG. Up to 30% ongoing discount, the more areas you book.'
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
          description: 'Statt IPL: dauerhafte Haarentfernung mit dem präziseren 4-Wellen-Diodenlaser in Nürnberg. 50% Rabatt auf deine erste Behandlung mit dem Code ERSTEBEHANDLUNG. Dauerhaft bis zu 30% Rabatt, je mehr Zonen du buchst.'
        },
        {
          title: 'IPL Hair Removal in Nuremberg? The More Modern Alternative | FareWell',
          description: 'Instead of IPL: long-lasting hair removal with the more precise 4-wavelength diode laser in Nuremberg. 50% off your first treatment with the code ERSTEBEHANDLUNG. Up to 30% ongoing discount, the more areas you book.'
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
      description: 'Impressum von FareWell, Beauty Studio in Nürnberg.'
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
      scrollPositionRestoration: 'enabled',
      // Fragment-Deeplinks (…#datenschutz) sollen zur Sektion springen statt
      // an den Seitenanfang. Offset entspricht dem festen Header (vgl.
      // scroll-padding-top/-margin-top im CSS).
      anchorScrolling: 'enabled',
      scrollOffset: [0, 96]
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
