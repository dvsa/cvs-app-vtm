import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestTypesService } from '@api/test-types';
import { provideMockStore } from '@ngrx/store/testing';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/.';
import { VehicleHeaderComponent } from './vehicle-header.component';
import { TechRecordModel, VehicleTypes, VehicleConfigurations } from '@models/vehicle-tech-record.model';
import { RouterTestingModule } from '@angular/router/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { of } from 'rxjs';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';

const mockTechnicalRecordService = {
  get viewableTechRecord$() {
    return of(mockVehicleTechnicalRecord().techRecord.pop());
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
    const mockRecord = {
      vehicleConfiguration: VehicleConfigurations.RIGID,
      bodyMake: 'testBody',
      bodyModel: 'testBodyModel',
      chassisMake: 'testChassis',
      chassisModel: 'testChassisModel',
      make: 'testHGV',
      model: 'testHGVModel'
    } as TechRecordModel;

    expect(component.getVehicleDescription(mockRecord, VehicleTypes.TRL)).toEqual('rigid');
    expect(component.getVehicleDescription(mockRecord, VehicleTypes.PSV)).toEqual('testBody-testBodyModel');
    expect(component.getVehicleDescription(mockRecord, VehicleTypes.HGV)).toEqual('testHGV-testHGVModel');
  });

  it('should display an empty string if all required data cannot be retrieved', () => {
    const mockRecord = {
      bodyMake: '',
      bodyModel: 'testBodyModel',
      chassisMake: '',
      chassisModel: 'testChassisModel',
      make: '',
      model: 'testHGVModel'
    } as TechRecordModel;

    expect(component.getVehicleDescription(mockRecord, VehicleTypes.TRL)).toBeFalsy();
    expect(component.getVehicleDescription(mockRecord, VehicleTypes.PSV)).toBeFalsy();
    expect(component.getVehicleDescription(mockRecord, VehicleTypes.HGV)).toBeFalsy();
  });

  it('should display "Unknown Vehicle Type" if vehicle type is unknown/undefined', () => {
    const mockRecord = {
      bodyMake: 'testBodyMake',
      bodyModel: 'testBodyModel',
      chassisMake: 'testChassisMake',
      chassisModel: 'testChassisModel'
    } as TechRecordModel;
    expect(component.getVehicleDescription(mockRecord, undefined)).toEqual('Unknown Vehicle Type');
  });
});
