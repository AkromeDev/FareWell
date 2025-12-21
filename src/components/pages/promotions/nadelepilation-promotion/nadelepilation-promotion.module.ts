import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./nadelepilation-promotion.component').then(
        m => m.NadelepilationPromotionComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class NadelepilationPromotionModule {}
  