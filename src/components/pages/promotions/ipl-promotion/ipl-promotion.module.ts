import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ipl-promotion.component').then(
        m => m.IplPromotionComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class IplPromotionModule {}
