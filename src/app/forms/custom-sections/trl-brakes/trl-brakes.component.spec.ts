import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';

import { VehicleTypes } from '@models/vehicle-tech-record.model';
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
    component.vehicleTechRecord = {
      systemNumber: 'foo',
      createdTimestamp: 'bar',
      vin: 'testVin',
      techRecord_vehicleType: VehicleTypes.PSV,
      techRecord_brakes_loadSensingValve: '000000',
      techRecord_brakes_antilockBrakingSystem: 'brake2',
      techRecord_axles: [
        {
          axleNumber: 1,
          parkingBrakeMrk: true,
          brakes_brakeActuator: undefined,
          brakes_leverLength: undefined,
          brakes_springBrakeParking: undefined
        }
      ]
    };
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
  //TODO: remove the anys
  describe('The axle value on this.form', () => {
    it('should match the corresponding values on vehicleTechRecord', () => {
      expect((component.vehicleTechRecord as any).techRecord_axles).toStrictEqual(component.form.controls['techRecord_axles']?.value);
    });
  });
});
