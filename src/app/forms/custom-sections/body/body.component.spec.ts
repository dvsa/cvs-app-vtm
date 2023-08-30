import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';

import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { BodyComponent } from './body.component';

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
    component.techRecord = {
      systemNumber: 'foo',
      createdTimestamp: 'bar',
      vin: 'testVin',
      techRecord_vehicleType: VehicleTypes.PSV,
      techRecord_brakes_dtpNumber: '000000',
      techRecord_bodyModel: 'model',
      techRecord_bodyType_description: 'type',
      techRecord_chassisMake: 'chassisType'
    } as unknown as TechRecordType<'psv'>;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('The DTpNumber value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      expect((component.techRecord as TechRecordType<'psv'>).techRecord_brakes_dtpNumber).toStrictEqual(
        component.form.value.techRecord_brakes_dtpNumber
      );
    });
  });
  describe('The bodyModel value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      expect((component.techRecord as TechRecordType<'psv'>).techRecord_bodyModel).toStrictEqual(component.form.value.techRecord_bodyModel);
    });
  });
  describe('The bodyType value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      expect((component.techRecord as TechRecordType<'psv'>).techRecord_bodyType_description).toStrictEqual(
        component.form.controls['techRecord_bodyType_description']?.value
      );
    });
  });
  describe('The chassisMake value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      expect((component.techRecord as TechRecordType<'psv'>).techRecord_chassisMake).toStrictEqual(
        component.form.controls['techRecord_chassisMake']?.value
      );
    });
  });
});
