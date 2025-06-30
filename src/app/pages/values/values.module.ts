import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./values.component').then(m => m.ValuesComponent)
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ValuesModule {}
