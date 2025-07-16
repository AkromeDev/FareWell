import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/pages/home/home.component';
import { NotFoundComponent } from '../components/pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'behandlung',
    loadChildren: () =>
      import('../components/pages/behandlung/behandlung.module').then(m => m.BehandlungModule)
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('../components/pages/contact/contact.module').then(m => m.ContactModule)
  },
  {
    path: 'zeit',
    loadChildren: () =>
      import('../components/pages/zeit/zeit.module').then(m => m.ZeitModule)
  },
  {
    path: 'values',
    loadChildren: () =>
      import('../components/pages/values/values.module').then(m => m.ValuesModule)
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
    component: NotFoundComponent
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
export class AppRoutingModule {}
