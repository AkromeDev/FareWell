import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./team.component').then(m => m.TeamComponent)
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class TeamModule {}
