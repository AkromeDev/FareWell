import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeitComponent } from './zeit.component';

describe('ZeitComponent', () => {
  let component: ZeitComponent;
  let fixture: ComponentFixture<ZeitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ZeitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZeitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
