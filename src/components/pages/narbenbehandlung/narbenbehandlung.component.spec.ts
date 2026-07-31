import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NarbenbehandlungComponent } from './narbenbehandlung.component';

describe('NarbenbehandlungComponent', () => {
  let component: NarbenbehandlungComponent;
  let fixture: ComponentFixture<NarbenbehandlungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NarbenbehandlungComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NarbenbehandlungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
