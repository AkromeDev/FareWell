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
        loadComponent: () =>
          import('../components/pages/massage/massage')
            .then(m => m.MassageComponent),
        data: {
          title: 'Massage Nürnberg | FareWell',
          description: 'Entspannende Massagen in Nürnberg – Wohlbefinden, Entspannung und Regeneration für Körper und Geist.'
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
    loadChildren: () =>
      import('../components/pages/price/price.module').then(m => m.PriceModule),
    data: {
      title: 'Preise | FareWell Nürnberg',
      description: 'Alle Preise für unsere Behandlungen bei FareWell Nürnberg – transparente Kosten für Elektrolyse, Laser, Microneedling und mehr.'
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
    loadChildren: () =>
      import('../components/pages/promotions/laser-promotion/laser-promotion.module')
        .then(m => m.LaserPromotionModule),
    data: {
      title: 'Laser Haarentfernung Aktion Nürnberg | FareWell',
      description: 'Aktuelle Aktion für Laser Haarentfernung in Nürnberg bei FareWell.'
    }
  },
  {
    path: 'ipl-dauerhafte-haarentfernung-aktion-nuernberg',
    loadChildren: () =>
      import('../components/pages/promotions/ipl-promotion/ipl-promotion.module')
        .then(m => m.IplPromotionModule),
    data: {
      title: 'IPL Haarentfernung Aktion Nürnberg | FareWell',
      description: 'Sonderangebot für IPL dauerhafte Haarentfernung in Nürnberg.'
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