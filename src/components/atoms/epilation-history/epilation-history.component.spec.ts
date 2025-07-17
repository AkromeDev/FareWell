import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpilationHistoryComponent } from './epilation-history.component';

describe('EpilationHistoryComponent', () => {
  let component: EpilationHistoryComponent;
  let fixture: ComponentFixture<EpilationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpilationHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpilationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
