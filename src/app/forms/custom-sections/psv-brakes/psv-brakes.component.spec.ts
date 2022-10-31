import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsvBrakesComponent } from './psv-brakes.component';

describe('PsvBrakesComponent', () => {
  let component: PsvBrakesComponent;
  let fixture: ComponentFixture<PsvBrakesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsvBrakesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsvBrakesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
