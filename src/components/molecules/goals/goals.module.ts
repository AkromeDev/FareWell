import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoalsRoutingModule } from './goals-routing.module';
import { StatisticComponent } from '../../../app/standaloneComp/statistic/statistic.component';
import { DividerComponent } from '../../../app/standaloneComp/divider/divider.component';
import { ModalComponent } from '../../../app/standaloneComp/modal/modal.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    GoalsRoutingModule,
    StatisticComponent,
    DividerComponent,
    ModalComponent,
  ]
})
export class GoalsModule { }
