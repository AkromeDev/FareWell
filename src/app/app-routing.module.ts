import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../components/pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'behandlung',
    loadChildren: () =>
      import('../components/pages/behandlung/behandlung.module').then(m => m.BehandlungModule)
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
    loadChildren: () =>
      import('../components/pages/legal/impressum/impressum.module').then(m => m.ImpressumModule)
  },
  {
    path: 'datenschutz',
    loadChildren: () =>
      import('../components/pages/legal/datenschutz/datenschutz.module').then(m => m.DatenschutzModule)
  },
  {
    path: 'agb',
    loadChildren: () =>
      import('../components/pages/legal/agb/agb.module').then(m => m.AgbModule)
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
