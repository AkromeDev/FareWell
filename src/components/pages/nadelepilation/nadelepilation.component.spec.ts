import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NadelepilationComponent } from './nadelepilation.component';

describe('NadelepilationComponent', () => {
  let component: NadelepilationComponent;
  let fixture: ComponentFixture<NadelepilationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NadelepilationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NadelepilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
