import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';

import { PsvBrakesComponent } from './psv-brakes.component';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { VehicleTypes, V3TechRecordModel } from '@models/vehicle-tech-record.model';

describe('PsvBrakesComponent', () => {
  let component: PsvBrakesComponent;
  let fixture: ComponentFixture<PsvBrakesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PsvBrakesComponent],
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
    fixture = TestBed.createComponent(PsvBrakesComponent);
    component = fixture.componentInstance;
    //V3 TODO cast this as a V3record
    component.vehicleTechRecord = {
      systemNumber: 'foo',
      createdTimestamp: 'bar',
      vin: 'testVin',
      techRecord_vehicleType: VehicleTypes.PSV,
      techRecord_brakes_brakeCode: '000000',
      techRecord_brakes_dataTrBrakeOne: 'brake1',
      techRecord_axles: [{ axleNumber: 1, parkingBrakeMrk: true }],
      techRecord_brakes_brakeCodeOriginal: 'original'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('The brake code value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      expect(component.vehicleTechRecord.techRecord_brakes_brakeCode).toStrictEqual(component.form.value.techRecord_brakes_brakeCode);
    });
  });
  describe('The dataTrBrakeOne value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      console.log(component.form.value);
      expect(component.vehicleTechRecord.techRecord_brakes_dataTrBrakeOne).toStrictEqual(component.form.value.techRecord_brakes_dataTrBrakeOne);
    });
  });
  describe('The brakeCodeOriginal value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      expect(component.vehicleTechRecord.techRecord_brakes_brakeCodeOriginal).toStrictEqual(
        component.form.controls['techRecord_brakes_brakeCodeOriginal']?.value
      );
    });
  });
  describe('The axle value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      expect((component.vehicleTechRecord as any).techRecord_axles).toStrictEqual(component.form.controls['techRecord_axles']?.value);
    });
  });
});
