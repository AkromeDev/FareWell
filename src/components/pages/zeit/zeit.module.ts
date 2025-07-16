import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./zeit.component').then(m => m.ZeitComponent)
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ZeitModule {}
