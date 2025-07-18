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
