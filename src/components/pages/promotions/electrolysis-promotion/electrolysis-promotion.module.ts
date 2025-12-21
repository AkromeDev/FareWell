import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./electrolysis-promotion.component')
        .then(m => m.ElectrolysisPromotionComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ElectrolysisPromotionModule {}
