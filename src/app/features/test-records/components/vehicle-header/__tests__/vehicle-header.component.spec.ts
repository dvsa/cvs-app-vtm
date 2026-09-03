import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { VehicleType as VehicleTypes } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleType.enum.js';
import { TestResultTestTypeSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { resultOfTestEnum } from '@models/test-types/test-type.model';
import { V3TechRecordModel, VehicleConfigurations } from '@models/vehicle-tech-record.model';
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
			jest.spyOn(component, 'test', 'get').mockReturnValue({ testTypeId: '50' } as TestResultTestTypeSchema);
			expect(component.isADRTest).toBe(true);
		});

		it('should return false if the selected test type is not an ADR test', () => {
			jest.spyOn(component, 'test', 'get').mockReturnValue({ testTypeId: '94' } as TestResultTestTypeSchema);
			expect(component.isADRTest).toBe(false);
		});
	});

	describe('shouldShowAbandonCert', () => {
		it('should return true if the VTG/VTP12 document should show', () => {
			jest.spyOn(component, 'resultOfTest', 'get').mockReturnValue(resultOfTestEnum.abandoned);
			jest.spyOn(component, 'test', 'get').mockReturnValue({ testTypeId: '3' } as TestResultTestTypeSchema);
			jest.spyOn(component, 'vehicleTypes', 'get').mockReturnValue('psv' as unknown as typeof VehicleTypes);
			expect(component.shouldShowAbandonCert).toBe(true);
		});

		it('should return false if the VTG/VTP12 document should show', () => {
			jest.spyOn(component, 'resultOfTest', 'get').mockReturnValue(resultOfTestEnum.abandoned);
			jest.spyOn(component, 'test', 'get').mockReturnValue({ testTypeId: '193' } as TestResultTestTypeSchema);
			jest.spyOn(component, 'vehicleTypes', 'get').mockReturnValue('psv' as unknown as typeof VehicleTypes);
			expect(component.shouldShowAbandonCert).toBe(false);
		});
	});

	describe('getCertificateLinkText', () => {
		it('should return null if test is undefined', () => {
			expect(component.getCertificateLinkText(undefined)).toBe(null);
		});

		it('should return testNumber for roadworthiness tests', () => {
			expect(
				component.getCertificateLinkText({ testTypeId: '62', testNumber: '12345' } as TestResultTestTypeSchema)
			).toBe('12345');
		});

		it('should return certificateNumber for other tests', () => {
			expect(component.getCertificateLinkText({ certificateNumber: '12345' } as TestResultTestTypeSchema)).toBe(
				'12345'
			);
		});
	});

	describe('hasVTG15Media', () => {
		it('should return false when testResult is null', () => {
			fixture.componentRef.setInput('testResult', null);
			expect(component.hasVTG15Media()).toBe(false);
		});

		it('should return false when testResult is undefined', () => {
			fixture.componentRef.setInput('testResult', undefined);
			expect(component.hasVTG15Media()).toBe(false);
		});

		it('should return false when vtg15 is undefined', () => {
			fixture.componentRef.setInput('testResult', { vtg15: undefined } as any);
			expect(component.hasVTG15Media()).toBe(false);
		});

		it('should return false when media is undefined', () => {
			fixture.componentRef.setInput('testResult', { vtg15: { media: undefined } } as any);
			expect(component.hasVTG15Media()).toBe(false);
		});

		it('should return false when media is an empty array', () => {
			fixture.componentRef.setInput('testResult', { vtg15: { media: [] } } as any);
			expect(component.hasVTG15Media()).toBe(false);
		});

		it('should return false when media only contains failReason items', () => {
			fixture.componentRef.setInput('testResult', {
				vtg15: {
					media: [{ type: 'failReason', location: 'test' }],
				},
			} as any);
			expect(component.hasVTG15Media()).toBe(false);
		});

		it('should return true when media contains valid non-failReason items', () => {
			fixture.componentRef.setInput('testResult', {
				vtg15: {
					media: [{ type: 'image', location: 'test' }],
				},
			} as any);
			expect(component.hasVTG15Media()).toBe(true);
		});
	});

	describe('hasVTG15RetentionPeriodPassed', () => {
		it('should return false when testResult is null', () => {
			fixture.componentRef.setInput('testResult', null);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return false when testResult is undefined', () => {
			fixture.componentRef.setInput('testResult', undefined);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return false when testTypes is undefined', () => {
			fixture.componentRef.setInput('testResult', { testTypes: undefined } as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return false when testTypes is empty array', () => {
			fixture.componentRef.setInput('testResult', { testTypes: [] } as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return false when testTypeEndTimestamp is invalid', () => {
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: 'invalid-date' }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return false when testTypeEndTimestamp is empty string', () => {
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: '' }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return false when retention period has not passed (5 days)', () => {
			const recentDate = new Date();
			recentDate.setDate(recentDate.getDate() - 5); // 5 days ago
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: recentDate.toISOString() }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return true when retention period has exactly passed (21 days)', () => {
			const pastDate = new Date();
			pastDate.setDate(pastDate.getDate() - 21); // 21 days ago
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: pastDate.toISOString() }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(true);
		});

		it('should return true when retention period has long passed (60 days)', () => {
			const oldDate = new Date();
			oldDate.setDate(oldDate.getDate() - 60); // 60 days ago
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: oldDate.toISOString() }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(true);
		});

		it('should return false for date exactly 21 days in future', () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 21); // 21 days in future
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: futureDate.toISOString() }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should handle dates with time component correctly', () => {
			const pastDate = new Date();
			pastDate.setDate(pastDate.getDate() - 21);
			pastDate.setHours(12, 30, 45);
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: pastDate.toISOString() }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(true);
		});

		it('should use first testType when multiple testTypes exist', () => {
			const pastDate = new Date();
			pastDate.setDate(pastDate.getDate() - 25); // 25 days ago, past 21-day threshold
			const recentDate = new Date();
			recentDate.setDate(recentDate.getDate() - 5); // 5 days ago, within 21-day threshold
			fixture.componentRef.setInput('testResult', {
				testTypes: [
					{ testTypeEndTimestamp: pastDate.toISOString() },
					{ testTypeEndTimestamp: recentDate.toISOString() },
				],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(true);
		});

		it('should return false for undefined testTypeEndTimestamp', () => {
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: undefined }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return false for dates less than 21 days old', () => {
			const testDate = new Date();
			testDate.setDate(testDate.getDate() - 20); // 20 days ago
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: testDate.toISOString() }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(false);
		});

		it('should return true for dates more than 21 days old', () => {
			const testDate = new Date();
			testDate.setDate(testDate.getDate() - 22); // 22 days ago
			fixture.componentRef.setInput('testResult', {
				testTypes: [{ testTypeEndTimestamp: testDate.toISOString() }],
			} as any);
			expect(component.hasVTG15RetentionPeriodPassed()).toBe(true);
		});
	});
});
