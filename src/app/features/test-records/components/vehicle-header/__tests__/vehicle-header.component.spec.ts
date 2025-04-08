import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TestType, resultOfTestEnum } from '@models/test-types/test-type.model';
import { V3TechRecordModel, VehicleConfigurations, VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpService } from '@services/http/http.service';
import { ResultOfTestService } from '@services/result-of-test/result-of-test.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { VehicleHeaderComponent } from '../vehicle-header.component';

const mockTechnicalRecordService = {
	get techRecord$() {
		return of({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' });
	},
};

describe('VehicleHeaderComponent', () => {
	let component: VehicleHeaderComponent;
	let fixture: ComponentFixture<VehicleHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [VehicleHeaderComponent],
			providers: [
				HttpService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				ResultOfTestService,
				{ provide: TechnicalRecordService, useValue: mockTechnicalRecordService },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(VehicleHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should combine the odometer reading', () => {
		expect(component.combinedOdometerReading('1234', 'kilometres')).toBe('1234 km');
	});

	it('should display the unit if the reading is undefined', () => {
		expect(component.combinedOdometerReading(undefined, 'kilometres')).toBe(' km');
	});

	it('should display the reading if the unit is undefined', () => {
		expect(component.combinedOdometerReading('1234', undefined)).toBe('1234 ');
	});

	it('should display the correct data based on vehicle type', () => {
		const mockRecord = {
			techRecord_vehicleConfiguration: VehicleConfigurations.RIGID,
			techRecord_bodyMake: 'testBody',
			techRecord_bodyModel: 'testBodyModel',
			techRecord_chassisMake: 'testChassis',
			techRecord_chassisModel: 'testChassisModel',
			techRecord_make: 'testHGV',
			techRecord_model: 'testHGVModel',
		} as unknown as V3TechRecordModel;

		expect(component.getVehicleDescription(mockRecord, VehicleTypes.TRL)).toBe('rigid');
		expect(component.getVehicleDescription(mockRecord, VehicleTypes.PSV)).toBe('testBody-testBodyModel');
		expect(component.getVehicleDescription(mockRecord, VehicleTypes.HGV)).toBe('testHGV-testHGVModel');
	});

	it('should display an empty string if all required data cannot be retrieved', () => {
		const mockRecord = {
			techRecord_bodyMake: '',
			techRecord_bodyModel: 'testBodyModel',
			techRecord_chassisMake: '',
			techRecord_chassisModel: 'testChassisModel',
			techRecord_make: '',
			techRecord_model: 'testHGVModel',
		} as unknown as V3TechRecordModel;

		expect(component.getVehicleDescription(mockRecord, VehicleTypes.TRL)).toBeFalsy();
		expect(component.getVehicleDescription(mockRecord, VehicleTypes.PSV)).toBeFalsy();
		expect(component.getVehicleDescription(mockRecord, VehicleTypes.HGV)).toBeFalsy();
	});

	it('should display "Unknown Vehicle Type" if vehicle type is unknown/undefined', () => {
		const mockRecord = {
			techRecord_bodyMake: 'testBodyMake',
			techRecord_bodyModel: 'testBodyModel',
			techRecord_chassisMake: 'testChassisMake',
			techRecord_chassisModel: 'testChassisModel',
		} as unknown as V3TechRecordModel;
		expect(component.getVehicleDescription(mockRecord, undefined)).toBe('Unknown Vehicle Type');
	});

	describe('isADRTest', () => {
		it('should return true if the selected test type is an ADR test', () => {
			jest.spyOn(component, 'test', 'get').mockReturnValue({ testTypeId: '50' } as TestType);
			expect(component.isADRTest).toBe(true);
		});

		it('should return false if the selected test type is not an ADR test', () => {
			jest.spyOn(component, 'test', 'get').mockReturnValue({ testTypeId: '94' } as TestType);
			expect(component.isADRTest).toBe(false);
		});
	});

	describe('shouldShowAbandonCert', () => {
		it('should return true if the VTG/VTP12 document should show', () => {
			jest.spyOn(component, 'resultOfTest', 'get').mockReturnValue(resultOfTestEnum.abandoned);
			jest.spyOn(component, 'test', 'get').mockReturnValue({ testTypeId: '3' } as TestType);
			jest.spyOn(component, 'vehicleTypes', 'get').mockReturnValue('psv' as unknown as typeof VehicleTypes);
			expect(component.shouldShowAbandonCert).toBe(true);
		});

		it('should return false if the VTG/VTP12 document should show', () => {
			jest.spyOn(component, 'resultOfTest', 'get').mockReturnValue(resultOfTestEnum.abandoned);
			jest.spyOn(component, 'test', 'get').mockReturnValue({ testTypeId: '193' } as TestType);
			jest.spyOn(component, 'vehicleTypes', 'get').mockReturnValue('psv' as unknown as typeof VehicleTypes);
			expect(component.shouldShowAbandonCert).toBe(false);
		});
	});
});
