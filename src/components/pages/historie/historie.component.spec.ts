import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorieComponent } from './historie.component';

describe('ValuesComponent', () => {
  let component: HistorieComponent;
  let fixture: ComponentFixture<HistorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HistorieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
