import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { VehicleConfiguration } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationHgvPsv.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { hgvRequiredFields } from '@forms/models/plateRequiredFields.model';
import { Roles } from '@models/roles.enum';
import { VehicleConfigurations } from '@models/vehicle-tech-record.model';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
import { State, initialAppState } from '@store/index';
import { canGeneratePlate } from '@store/technical-records';
import { of } from 'rxjs';
import { PlatesComponent } from './plates.component';

global.scrollTo = jest.fn();

describe('PlatesComponent', () => {
	let component: PlatesComponent;
	let fixture: ComponentFixture<PlatesComponent>;
	let router: Router;
	let errorService: GlobalErrorService;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				DynamicFormsModule,
				SharedModule,
				StoreModule.forRoot({}),
				HttpClientTestingModule,
				RouterModule.forRoot([]),
				RouterTestingModule,
			],
			declarations: [PlatesComponent],
			providers: [
				provideMockStore<State>({ initialState: initialAppState }),
				{
					provide: UserService,
					useValue: {
						roles$: of([Roles.TechRecordAmend]),
					},
				},
				{
					provide: ActivatedRoute,
					useValue: {
						useValue: { params: of([{ id: 1 }]) },
					},
				},
				{
					provide: APP_BASE_HREF,
					useValue: '/',
				},
				GlobalErrorService,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PlatesComponent);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
		errorService = TestBed.inject(GlobalErrorService);
		component.techRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as TechRecordType<
			'hgv' | 'trl'
		>;
		store = TestBed.inject(MockStore);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('mostRecentPlate', () => {
		it('should fetch the plate if only 1 exists', () => {
			(component.techRecord as TechRecordType<'trl'>).techRecord_plates = [
				{
					plateIssueDate: new Date().toISOString(),
					plateSerialNumber: '123456',
					plateIssuer: 'issuer',
					plateReasonForIssue: 'Replacement',
				},
			];
			const plateFetched = component.mostRecentPlate;

			expect(plateFetched).toBeDefined();
			expect(plateFetched?.plateSerialNumber).toBe('123456');
		});

		it('should fetch the latest plate if more than 1 exists', () => {
			component.techRecord = {
				techRecord_plates: [
					{
						plateIssueDate: new Date(new Date().getTime()).toISOString(),
						plateSerialNumber: '123456',
						plateIssuer: 'issuer',
						plateReasonForIssue: 'Replacement',
					},
					{
						plateIssueDate: new Date(new Date().getTime() + 5).toISOString(),
						plateSerialNumber: '234567',
						plateIssuer: 'issuer',
						plateReasonForIssue: 'Replacement',
					},
					{
						plateIssueDate: new Date(new Date().getTime() - 5).toISOString(),
						plateSerialNumber: '345678',
						plateIssuer: 'issuer',
						plateReasonForIssue: 'Replacement',
					},
				],
			} as TechRecordType<'trl'>;

			const plateFetched = component.mostRecentPlate;

			expect(plateFetched).toBeDefined();
			expect(plateFetched?.plateSerialNumber).toBe('234567');
		});

		it('should return null if plates are empty', () => {
			component.techRecord = { techRecord_plates: [] } as unknown as TechRecordType<'trl'>;

			const plateFetched = component.mostRecentPlate;

			expect(plateFetched).toBeUndefined();
		});
	});

	describe('hasPlates', () => {
		it('should return false if plates is undefined', () => {
			component.techRecord = { techRecord_plates: undefined } as unknown as TechRecordType<'trl'>;

			expect(component.hasPlates).toBeFalsy();
		});

		it('should return false if plates is empty', () => {
			component.techRecord = { techRecord_plates: [] } as unknown as TechRecordType<'trl'>;

			expect(component.hasPlates).toBeFalsy();
		});

		it('should return true if plates is not empty', () => {
			component.techRecord = {
				techRecord_plates: [
					{
						plateIssueDate: new Date().toISOString(),
						plateSerialNumber: '123456',
						plateIssuer: 'issuer',
						plateReasonForIssue: 'Replacement',
					},
				],
			} as TechRecordType<'trl'>;

			expect(component.hasPlates).toBeTruthy();
		});
	});

	describe('validateTechRecordPlates', () => {
		beforeEach(() => {
			component.techRecord = {
				primaryVrm: '123456',
				techRecord_approvalType: 'NTA',
				techRecord_approvalTypeNumber: '1',
				techRecord_bodyType_code: 'b',
				techRecord_bodyType_description: 'box',
				techRecord_brakes_dtpNumber: '12345',
				techRecord_dimensions_length: 1,
				techRecord_dimensions_width: 1,
				techRecord_frontVehicleTo5thWheelCouplingMax: 1,
				techRecord_frontVehicleTo5thWheelCouplingMin: 1,
				techRecord_functionCode: 'R',
				techRecord_grossDesignWeight: 1,
				techRecord_grossEecWeight: 1,
				techRecord_grossGbWeight: 1,
				techRecord_make: 'AEC',
				techRecord_manufactureYear: 2020,
				techRecord_maxTrainDesignWeight: 1,
				techRecord_maxTrainEecWeight: 11,
				techRecord_maxTrainGbWeight: 1,
				techRecord_model: '123',
				techRecord_noOfAxles: 1,
				techRecord_ntaNumber: '1',
				techRecord_reasonForCreation: 'Test',
				techRecord_recordCompleteness: 'skeleton',
				techRecord_regnDate: '2020-10-10',
				techRecord_speedLimiterMrk: true,
				techRecord_statusCode: 'current',
				techRecord_trainDesignWeight: 1,
				techRecord_trainEecWeight: 1,
				techRecord_trainGbWeight: 1,
				techRecord_tyreUseCode: 'a',
				techRecord_vehicleType: 'hgv',
				techRecord_variantNumber: '1',
				techRecord_roadFriendly: true,
				techRecord_vehicleConfiguration: VehicleConfigurations.RIGID,
				vin: 'HGVTEST01',
				techRecord_axles: [],
			} as unknown as TechRecordType<'hgv' | 'trl'>;

			component.techRecord.techRecord_axles = [
				{
					parkingBrakeMrk: true,
					axleNumber: 1,
					brakes_brakeActuator: 1,
					brakes_leverLength: 1,
					brakes_springBrakeParking: true,
					weights_gbWeight: 1,
					weights_designWeight: 2,
					weights_ladenWeight: 3,
					weights_kerbWeight: 4,
					weights_eecWeight: 5,
					tyres_tyreCode: 1,
					tyres_tyreSize: '2',
					tyres_plyRating: '3',
					tyres_fitmentCode: 'single',
					tyres_dataTrAxles: 1,
					tyres_speedCategorySymbol: 'a7',
				},
			];
		});
		it('should show an error if tech record is not valid for plates', () => {
			component.techRecord.vin = '';
			const plateFieldsErrorMessage = 'All fields marked plate are mandatory to generate a plate.';
			const errorSpy = jest.spyOn(errorService, 'addError');
			component.validateTechRecordPlates();
			expect(errorSpy).toHaveBeenCalledWith({ error: plateFieldsErrorMessage });
		});
		it('should dispatch the canGeneratePlate action if the record is valid', () => {
			fixture.ngZone?.run(() => {
				const dispatchSpy = jest.spyOn(store, 'dispatch');
				component.validateTechRecordPlates();
				expect(dispatchSpy).toHaveBeenCalledWith(canGeneratePlate());
			});
		});
		it('should call router.navigate on a valid record', () => {
			fixture.ngZone?.run(() => {
				const navigateSpy = jest.spyOn(router, 'navigate');
				component.validateTechRecordPlates();
				expect(navigateSpy).toHaveBeenCalledWith(['generate-plate'], { relativeTo: expect.anything() });
			});
		});
	});

	describe('cannotGeneratePlate', () => {
		it('should not generate if missing a tyre fitment code', () => {
			component.techRecord = {
				primaryVrm: 'thing',
				vin: 'thing',
				techRecord_brakes_dtpNumber: 'thing',
				techRecord_regnDate: 'thing',
				techRecord_manufactureYear: 1,
				techRecord_speedLimiterMrk: true,
				techRecord_variantNumber: 'thing',
				techRecord_make: 'thing',
				techRecord_model: 'thing',
				techRecord_functionCode: 'thing',
				techRecord_frontVehicleTo5thWheelCouplingMin: 1,
				techRecord_frontVehicleTo5thWheelCouplingMax: 1,
				techRecord_dimensions_length: 1,
				techRecord_dimensions_width: 1,
				techRecord_tyreUseCode: '2R',
				techRecord_roadFriendly: true,
				techRecord_vehicleConfiguration: VehicleConfiguration.ARTICULATED,
				techRecord_axles: [
					{
						tyres_tyreSize: '215/25',
						weights_gbWeight: '123',
						tyres_plyRating: '2R',
					},
					{
						tyres_fitmentCode: 'single',
						tyres_tyreSize: '215/25',
						weights_gbWeight: '123',
						tyres_plyRating: '2R',
					},
				],
				techRecord_noOfAxles: 2,
			} as unknown as TechRecordType<'hgv'>;
			const res = component.cannotGeneratePlate(hgvRequiredFields);
			expect(res).toBeTruthy();
		});
		it('should not generate if both axles missing a tyre fitment code', () => {
			component.techRecord = {
				primaryVrm: 'thing',
				vin: 'thing',
				techRecord_brakes_dtpNumber: 'thing',
				techRecord_regnDate: 'thing',
				techRecord_manufactureYear: 1,
				techRecord_speedLimiterMrk: true,
				techRecord_variantNumber: 'thing',
				techRecord_make: 'thing',
				techRecord_model: 'thing',
				techRecord_functionCode: 'thing',
				techRecord_frontVehicleTo5thWheelCouplingMin: 1,
				techRecord_frontVehicleTo5thWheelCouplingMax: 1,
				techRecord_dimensions_length: 1,
				techRecord_dimensions_width: 1,
				techRecord_tyreUseCode: '2R',
				techRecord_roadFriendly: true,
				techRecord_vehicleConfiguration: VehicleConfiguration.ARTICULATED,
				techRecord_axles: [
					{
						tyres_tyreSize: '215/25',
						weights_gbWeight: '123',
						tyres_plyRating: '2R',
					},
					{
						tyres_tyreSize: '215/25',
						weights_gbWeight: '123',
						tyres_plyRating: '2R',
					},
				],
				techRecord_noOfAxles: 2,
			} as unknown as TechRecordType<'hgv'>;
			const res = component.cannotGeneratePlate(hgvRequiredFields);
			expect(res).toBeTruthy();
		});
		it('should not generate if missing a tyre size', () => {
			component.techRecord = {
				primaryVrm: 'thing',
				vin: 'thing',
				techRecord_brakes_dtpNumber: 'thing',
				techRecord_regnDate: 'thing',
				techRecord_manufactureYear: 1,
				techRecord_speedLimiterMrk: true,
				techRecord_variantNumber: 'thing',
				techRecord_make: 'thing',
				techRecord_model: 'thing',
				techRecord_functionCode: 'thing',
				techRecord_frontVehicleTo5thWheelCouplingMin: 1,
				techRecord_frontVehicleTo5thWheelCouplingMax: 1,
				techRecord_dimensions_length: 1,
				techRecord_dimensions_width: 1,
				techRecord_tyreUseCode: '2R',
				techRecord_roadFriendly: true,
				techRecord_vehicleConfiguration: VehicleConfiguration.ARTICULATED,
				techRecord_axles: [
					{
						tyres_fitmentCode: 'single',
						weights_gbWeight: '123',
						tyres_plyRating: '2R',
					},
					{
						tyres_fitmentCode: 'single',
						tyres_tyreSize: '215/25',
						weights_gbWeight: '123',
						tyres_plyRating: '2R',
					},
				],
				techRecord_noOfAxles: 2,
			} as unknown as TechRecordType<'hgv'>;
			const res = component.cannotGeneratePlate(hgvRequiredFields);
			expect(res).toBeTruthy();
		});
		it('should not generate if a load/plyRating', () => {
			component.techRecord = {
				primaryVrm: 'thing',
				vin: 'thing',
				techRecord_brakes_dtpNumber: 'thing',
				techRecord_regnDate: 'thing',
				techRecord_manufactureYear: 1,
				techRecord_speedLimiterMrk: true,
				techRecord_variantNumber: 'thing',
				techRecord_make: 'thing',
				techRecord_model: 'thing',
				techRecord_functionCode: 'thing',
				techRecord_frontVehicleTo5thWheelCouplingMin: 1,
				techRecord_frontVehicleTo5thWheelCouplingMax: 1,
				techRecord_dimensions_length: 1,
				techRecord_dimensions_width: 1,
				techRecord_tyreUseCode: '2R',
				techRecord_roadFriendly: true,
				techRecord_vehicleConfiguration: VehicleConfiguration.ARTICULATED,
				techRecord_axles: [
					{
						tyres_fitmentCode: 'single',
						tyres_tyreSize: '215/25',
						weights_gbWeight: '123',
					},
					{
						tyres_fitmentCode: 'single',
						tyres_tyreSize: '215/25',
						weights_gbWeight: '123',
					},
				],
				techRecord_noOfAxles: 2,
			} as unknown as TechRecordType<'hgv'>;
			const res = component.cannotGeneratePlate(hgvRequiredFields);
			expect(res).toBeTruthy();
		});
		it('should not generate if missing axles', () => {
			component.techRecord = {
				primaryVrm: 'thing',
				vin: 'thing',
				techRecord_brakes_dtpNumber: 'thing',
				techRecord_regnDate: 'thing',
				techRecord_manufactureYear: 1,
				techRecord_speedLimiterMrk: true,
				techRecord_variantNumber: 'thing',
				techRecord_make: 'thing',
				techRecord_model: 'thing',
				techRecord_functionCode: 'thing',
				techRecord_frontVehicleTo5thWheelCouplingMin: 1,
				techRecord_frontVehicleTo5thWheelCouplingMax: 1,
				techRecord_dimensions_length: 1,
				techRecord_dimensions_width: 1,
				techRecord_tyreUseCode: '2R',
				techRecord_roadFriendly: true,
				techRecord_vehicleConfiguration: VehicleConfiguration.ARTICULATED,
				techRecord_axles: [],
				techRecord_noOfAxles: 0,
			} as unknown as TechRecordType<'hgv'>;
			const res = component.cannotGeneratePlate(hgvRequiredFields);
			expect(res).toBeTruthy();
		});
		it('should not generate without gbWeight on axle 1', () => {
			component.techRecord = {
				primaryVrm: 'thing',
				vin: 'thing',
				techRecord_brakes_dtpNumber: 'thing',
				techRecord_regnDate: 'thing',
				techRecord_manufactureYear: 1,
				techRecord_speedLimiterMrk: true,
				techRecord_variantNumber: 'thing',
				techRecord_make: 'thing',
				techRecord_model: 'thing',
				techRecord_functionCode: 'thing',
				techRecord_frontVehicleTo5thWheelCouplingMin: 1,
				techRecord_frontVehicleTo5thWheelCouplingMax: 1,
				techRecord_dimensions_length: 1,
				techRecord_dimensions_width: 1,
				techRecord_tyreUseCode: '2R',
				techRecord_roadFriendly: true,
				techRecord_vehicleConfiguration: VehicleConfiguration.ARTICULATED,
				techRecord_axles: [
					{
						tyres_fitmentCode: 'single',
						tyres_tyreSize: '215/25',
						tyres_plyRating: '2R',
					},
					{
						tyres_fitmentCode: 'single',
						tyres_tyreSize: '215/25',
						tyres_plyRating: '2R',
					},
				],
				techRecord_noOfAxles: 2,
			} as unknown as TechRecordType<'hgv'>;
			const res = component.cannotGeneratePlate(hgvRequiredFields);
			expect(res).toBeTruthy();
		});
		it('should not generate with a missing required hgv validation field', () => {
			component.techRecord = {
				primaryVrm: 'thing',
				vin: 'thing',
				techRecord_brakes_dtpNumber: 'thing',
				techRecord_regnDate: 'thing',
				techRecord_manufactureYear: 1,
				techRecord_speedLimiterMrk: true,
				techRecord_variantNumber: 'thing',
				techRecord_model: 'thing',
				techRecord_functionCode: 'thing',
				techRecord_frontVehicleTo5thWheelCouplingMin: 1,
				techRecord_frontVehicleTo5thWheelCouplingMax: 1,
				techRecord_dimensions_length: 1,
				techRecord_dimensions_width: 1,
				techRecord_tyreUseCode: '2R',
				techRecord_roadFriendly: true,
				techRecord_vehicleConfiguration: VehicleConfiguration.ARTICULATED,
				techRecord_axles: [
					{
						tyres_fitmentCode: 'single',
						tyres_tyreSize: '215/25',
						weights_gbWeight: '123',
						tyres_plyRating: '2R',
					},
					{
						tyres_fitmentCode: 'single',
						tyres_tyreSize: '215/25',
						weights_gbWeight: '123',
						tyres_plyRating: '2R',
					},
				],
				techRecord_noOfAxles: 2,
			} as unknown as TechRecordType<'hgv'>;
			const res = component.cannotGeneratePlate(hgvRequiredFields);
			expect(res).toBeTruthy();
		});
		it('should generate with a hgv plate', () => {
			component.techRecord = {
				primaryVrm: 'thing',
				vin: 'thing',
				techRecord_brakes_dtpNumber: 'thing',
				techRecord_regnDate: 'thing',
				techRecord_manufactureYear: 1,
				techRecord_speedLimiterMrk: true,
				techRecord_variantNumber: 'thing',
				techRecord_make: 'thing',
				techRecord_model: 'thing',
				techRecord_functionCode: 'thing',
				techRecord_frontVehicleTo5thWheelCouplingMin: 1,
				techRecord_frontVehicleTo5thWheelCouplingMax: 1,
				techRecord_dimensions_length: 1,
				techRecord_dimensions_width: 1,
				techRecord_tyreUseCode: '2R',
				techRecord_roadFriendly: true,
				techRecord_vehicleConfiguration: VehicleConfiguration.ARTICULATED,
				techRecord_axles: [
					{
						tyres_fitmentCode: 'single',
						tyres_tyreSize: '215/25',
						weights_gbWeight: '123',
						tyres_plyRating: '2R',
					},
					{
						tyres_fitmentCode: 'single',
						tyres_tyreSize: '215/25',
						weights_gbWeight: '123',
						tyres_plyRating: '2R',
					},
				],
				techRecord_noOfAxles: 2,
			} as unknown as TechRecordType<'hgv'>;
			const res = component.cannotGeneratePlate(hgvRequiredFields);
			expect(res).toBeFalsy();
		});
	});
});
