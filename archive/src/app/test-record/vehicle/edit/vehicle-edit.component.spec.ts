import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEditComponent } from './vehicle-edit.component';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TestResultModel } from '@app/models/test-result.model';
import { Preparer } from '@app/models/preparer';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import {
  EU_VEHICLE_CATEGORY_HGV,
  EU_VEHICLE_CATEGORY_TRL
} from '@app/test-record/test-record.enums';
import { Component, Input } from '@angular/core';
import { TEST_MODEL_UTILS } from '@app/utils/test-model.utils';

describe('VehicleEditComponent', () => {
  let component: VehicleEditComponent;
  let fixture: ComponentFixture<VehicleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleEditComponent, TestAutcompleteComponent],
      imports: [ReactiveFormsModule, MatDialogModule],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective()
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleEditComponent);
    component = fixture.componentInstance;
    component.testRecord = TEST_MODEL_UTILS.mockTestRecord({
      vehicleType: 'psv'
    } as TestResultModel);
    component.preparers = [{ preparerId: '123', preparerName: 'test' } as Preparer];
    component.preparersOptions = ['test'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should switch euVehicleCategories by vehicleType = hgv', () => {
    component.testRecord = TEST_MODEL_UTILS.mockTestRecord({
      vehicleType: 'hgv'
    } as TestResultModel);
    component.ngOnInit();
    expect(component.euVehicleCategories).toEqual(Object.values(EU_VEHICLE_CATEGORY_HGV));
  });

  it('should switch euVehicleCategories by vehicleType = trl', () => {
    component.testRecord = TEST_MODEL_UTILS.mockTestRecord({
      vehicleType: 'trl'
    } as TestResultModel);
    component.ngOnInit();
    expect(component.euVehicleCategories).toEqual(Object.values(EU_VEHICLE_CATEGORY_TRL));
  });

  it('should switch euVehicleCategories by vehicleType = empty string', () => {
    component.testRecord = TEST_MODEL_UTILS.mockTestRecord({
      vehicleType: ''
    } as TestResultModel);
    component.ngOnInit();
    expect(component.euVehicleCategories).toEqual(['']);
  });
});

@Component({
  selector: 'vtm-autocomplete',
  template: `
    <div>{{ autocompleteData }}</div>
  `
})
class TestAutcompleteComponent {
  @Input() autocompleteData;
  @Input('aria-describedby') ariaDescribedBy: string | null;
  @Input('value') _value = '';
  @Input() hasError: boolean;
}
