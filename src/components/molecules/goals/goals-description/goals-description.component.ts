import { Component, OnInit } from '@angular/core';
import { DividerComponent } from 'src/components/standaloneComp/divider/divider.component';
import { ModalComponent } from 'src/components/standaloneComp/modal/modal.component';
import { StatisticComponent } from 'src/components/standaloneComp/statistic/statistic.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-goals-description',
    imports: [DividerComponent, StatisticComponent, ModalComponent, CommonModule],
    templateUrl: './goals-description.component.html',
    styleUrls: ['./goals-description.component.scss']
})
export class GoalsDescriptionComponent implements OnInit {
  
  stats = [
    { class: 'icon users', value: '1.000', label: 'People With Stable Electricity'},
    { class: 'icon smile', value: '3976', label: 'Happy Qs in the world'},
    { class: 'icon woman', value: '1%', label: 'of hiking Thérèses'},
  ];
  
  modalOpenFlag = false;
  
  protected openModal() {
    this.modalOpenFlag = !this.modalOpenFlag;
  }
  
  constructor() { 
  }
  
  ngOnInit(): void {
  }
  
}
