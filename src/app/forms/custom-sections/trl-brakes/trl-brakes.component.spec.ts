import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';

import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { TrlBrakesComponent } from './trl-brakes.component';

describe('BrakesComponent', () => {
  let component: TrlBrakesComponent;
  let fixture: ComponentFixture<TrlBrakesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrlBrakesComponent],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrlBrakesComponent);
    component = fixture.componentInstance;
    component.vehicleTechRecord = mockVehicleTechnicalRecord('trl') as TechRecordType<'trl'>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('The brake code value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      expect(component.vehicleTechRecord.techRecord_brakes_loadSensingValve).toStrictEqual(component.form.value.techRecord_brakes_loadSensingValve);
    });
  });
  describe('The dataTrBrakeOne value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      expect(component.vehicleTechRecord.techRecord_brakes_antilockBrakingSystem).toStrictEqual(
        component.form.value.techRecord_brakes_antilockBrakingSystem
      );
    });
  });

  describe('The axle value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      expect(component.vehicleTechRecord.techRecord_axles![0]).toEqual(
        expect.objectContaining(component.form.controls['techRecord_axles']?.value[0])
      );
    });
  });
});
