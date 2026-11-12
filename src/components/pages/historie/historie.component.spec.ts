import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HistorieComponent } from './historie.component';

describe('HistorieComponent', () => {
  let component: HistorieComponent;
  let fixture: ComponentFixture<HistorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HistorieComponent ],
      providers: [provideRouter([])]
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
