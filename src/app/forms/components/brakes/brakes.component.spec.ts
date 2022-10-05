import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrakesComponent } from './brakes.component';

describe('BrakesComponent', () => {
  let component: BrakesComponent;
  let fixture: ComponentFixture<BrakesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrakesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrakesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
