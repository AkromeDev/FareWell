import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgbComponent } from './agb.component';

const routes: Routes = [
  { path: '', component: AgbComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgbModule {}
