import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./contact.component').then(m => m.ContactComponent)
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ContactModule {}
