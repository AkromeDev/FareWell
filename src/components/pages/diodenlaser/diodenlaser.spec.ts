import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Diodenlaser } from './diodenlaser';

describe('Diodenlaser', () => {
  let component: Diodenlaser;
  let fixture: ComponentFixture<Diodenlaser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Diodenlaser],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Diodenlaser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
