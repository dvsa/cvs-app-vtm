import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestTypesService } from '@api/test-types';
import { provideMockStore } from '@ngrx/store/testing';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/.';
import { VehicleHeaderComponent } from './vehicle-header.component';
import { TechRecordModel, VehicleTypes, VehicleConfigurations, V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { RouterTestingModule } from '@angular/router/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { of } from 'rxjs';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

const mockTechnicalRecordService = {
  get techRecord$() {
    return of({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' });
  }
};

describe('VehicleHeaderComponent', () => {
  let component: VehicleHeaderComponent;
  let fixture: ComponentFixture<VehicleHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleHeaderComponent],
      imports: [SharedModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        TestTypesService,
        provideMockStore({ initialState: initialAppState }),
        ResultOfTestService,
        { provide: TechnicalRecordService, useValue: mockTechnicalRecordService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should combine the odometer reading', () => {
    expect(component.combinedOdometerReading('1234', 'kilometres')).toEqual('1234 km');
  });

  it('should display the unit if the reading is undefined', () => {
    expect(component.combinedOdometerReading(undefined, 'kilometres')).toEqual(' km');
  });

  it('should display the reading if the unit is undefined', () => {
    expect(component.combinedOdometerReading('1234', undefined)).toEqual('1234 ');
  });

  it('should display the correct data based on vehicle type', () => {
    const mockTrl = mockVehicleTechnicalRecord('trl');
    const mockPsv = mockVehicleTechnicalRecord('psv');
    const mockHgv = mockVehicleTechnicalRecord('hgv');

    expect(component.getVehicleDescription(mockTrl, VehicleTypes.TRL)).toEqual('articulated');
    expect(component.getVehicleDescription(mockPsv, VehicleTypes.PSV)).toEqual('Body make-Body model');
    expect(component.getVehicleDescription(mockHgv, VehicleTypes.HGV)).toEqual('1234-1234');
  });

  it('should display an empty string if all required data cannot be retrieved', () => {
    const mockTrl = mockVehicleTechnicalRecord('trl');
    const mockPsv = mockVehicleTechnicalRecord('psv');
    const mockHgv = mockVehicleTechnicalRecord('hgv');

    delete mockTrl.techRecord_vehicleConfiguration;
    delete (mockPsv as TechRecordType<'psv'>).techRecord_bodyMake;
    delete (mockHgv as TechRecordType<'hgv'>).techRecord_make;

    expect(component.getVehicleDescription(mockTrl, VehicleTypes.TRL)).toBeFalsy();
    expect(component.getVehicleDescription(mockPsv, VehicleTypes.PSV)).toBeFalsy();
    expect(component.getVehicleDescription(mockHgv, VehicleTypes.HGV)).toBeFalsy();
  });

  it('should display "Unknown Vehicle Type" if vehicle type is unknown/undefined', () => {
    const mockRecord = {
      techRecord_bodyMake: 'testBodyMake',
      techRecord_bodyModel: 'testBodyModel',
      techRecord_chassisMake: 'testChassisMake',
      techRecord_chassisModel: 'testChassisModel'
    } as unknown as V3TechRecordModel;
    expect(component.getVehicleDescription(mockRecord, undefined)).toEqual('Unknown Vehicle Type');
  });
});
