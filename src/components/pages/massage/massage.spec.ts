import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MassageComponent } from './massage';

describe('MassageComponent', () => {
  let component: MassageComponent;
  let fixture: ComponentFixture<MassageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MassageComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(MassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});