import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./microneedling-promotion.component').then(
        m => m.MicroneedlingPromotionComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class MicroneedlingPromotionModule {}
