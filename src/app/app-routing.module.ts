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
    path: 'about-us',
    loadChildren: () =>
      import('../components/pages/about-us/about-us.module').then(m => m.AboutUsModule)
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('../components/pages/contact/contact.module').then(m => m.ContactModule)
  },
  {
    path: 'team',
    loadChildren: () =>
      import('../components/pages/team/team.module').then(m => m.TeamModule)
  },
  {
    path: 'values',
    loadChildren: () =>
      import('../components/pages/values/values.module').then(m => m.ValuesModule)
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
