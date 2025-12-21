import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./laser-promotion.component').then(
        m => m.LaserPromotionComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class LaserPromotionModule {}
