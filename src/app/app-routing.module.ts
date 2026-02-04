import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../components/pages/home/home.component').then(m => m.HomeComponent)
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
            .then(m => m.NadelepilationComponent)
      },
      {
        path: 'diodenlaser-4-wellen',
        loadComponent: () =>
          import('../components/pages/diodenlaser/diodenlaser')
            .then(m => m.Diodenlaser)
      },
      {
        path: 'microneedling-radiofrequenz',
        loadComponent: () =>
          import('../components/pages/microneedling/microneedling')
            .then(m => m.MicroneedlingComponent)
      },
      {
        path: 'kavitation',
        loadComponent: () =>
          import('../components/pages/kavitation/kavitation')
            .then(m => m.KavitationComponent)
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
      import('../components/pages/price/price.module').then(m => m.PriceModule)
  },
  {
    path: 'zeit',
    loadChildren: () =>
      import('../components/pages/zeit/zeit.module').then(m => m.ZeitModule)
  },
  {
    path: 'historie',
    loadChildren: () =>
      import('../components/pages/historie/historie.module').then(m => m.HistorieModule)
  },

  {
    path: 'impressum',
    loadComponent: () =>
      import('../components/pages/legal/impressum/impressum.component')
        .then(m => m.ImpressumComponent)
  },
  {
    path: 'datenschutz',
    loadComponent: () =>
      import('../components/pages/legal/datenschutz/datenschutz.component')
        .then(m => m.DatenschutzComponent)
  },
  {
    path: 'agb',
    loadComponent: () =>
      import('../components/pages/legal/agb/agb.component')
        .then(m => m.AgbComponent)
  },

  {
    path: 'laser-haarentfernung-aktion-nuernberg',
    loadChildren: () =>
      import('../components/pages/promotions/laser-promotion/laser-promotion.module')
        .then(m => m.LaserPromotionModule)
  },
  {
    path: 'ipl-dauerhafte-haarentfernung-aktion-nuernberg',
    loadChildren: () =>
      import('../components/pages/promotions/ipl-promotion/ipl-promotion.module')
        .then(m => m.IplPromotionModule),
  },
  {
    path: 'elektrolyse-permanente-haarentfernung-aktion-nuernberg',
    loadChildren: () =>
      import('../components/pages/promotions/electrolysis-promotion/electrolysis-promotion.module')
        .then(m => m.ElectrolysisPromotionModule),
  },
  {
    path: 'microneedling-aktion-nuernberg',
    loadChildren: () =>
      import('../components/pages/promotions/microneedling-promotion/microneedling-promotion.module')
        .then(m => m.MicroneedlingPromotionModule),
  },
  {
    path: 'nadelepilation-angebot-nuernberg',
    loadChildren: () =>
      import('../components/pages/promotions/nadelepilation-promotion/nadelepilation-promotion.module')
        .then(m => m.NadelepilationPromotionModule),
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
      useHash: true,
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
