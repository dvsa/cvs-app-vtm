import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectVehicleTypeComponent } from './select-vehicle-type.component';

describe('SelectVehicleTypeComponent', () => {
  let component: SelectVehicleTypeComponent;
  let fixture: ComponentFixture<SelectVehicleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectVehicleTypeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectVehicleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
