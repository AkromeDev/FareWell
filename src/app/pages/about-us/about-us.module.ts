import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./about-us.component').then(m => m.AboutUsComponent)
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AboutUsModule {}
