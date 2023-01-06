import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeVehicleTypeComponent } from './change-vehicle-type.component';

describe('ChangeVehicleTypeComponent', () => {
  let component: ChangeVehicleTypeComponent;
  let fixture: ComponentFixture<ChangeVehicleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeVehicleTypeComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeVehicleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
