import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';

import { BodyComponent } from './body.component';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { VehicleTypes } from '@models/vehicle-tech-record.model';

describe('BodyComponent', () => {
  let component: BodyComponent;
  let fixture: ComponentFixture<BodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BodyComponent],
      imports: [DynamicFormsModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule],
      providers: [
        MultiOptionsService,
        provideMockStore({ initialState: initialAppState }),
        ReferenceDataService,
        { provide: UserService, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyComponent);
    component = fixture.componentInstance;
    component.techRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_vehicleType: VehicleTypes.PSV };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // TODO: V3 Brakes HGV?
  // describe('The DTpNumber value on this.form', () => {
  //   it('should match the corresponding values on vehicleTechRecord', () => {
  //     expect(component.techRecord.brakes!.dtpNumber).toStrictEqual(component.form.value.brakes.dtpNumber);
  //   });
  // });
  // describe('The bodyModel value on this.form', () => {
  //   it('should match the corresponding values on vehicleTechRecord', () => {
  //     expect(component.techRecord.bodyModel).toStrictEqual(component.form.value.bodyModel);
  //   });
  // });
  // describe('The bodyMake value on this.form', () => {
  //   it('should match the corresponding values on vehicleTechRecord', () => {
  //     expect(component.techRecord.bodyType).toStrictEqual(component.form.controls['bodyType'].value);
  //   });
  // });
  // describe('The bodyModel value on this.form', () => {
  //   it('should match the corresponding values on vehicleTechRecord', () => {
  //     expect(component.techRecord.bodyModel).toStrictEqual(component.form.controls['bodyModel'].value);
  //   });
  // });
});
