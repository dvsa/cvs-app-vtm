import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryCar.enum.js';
import { EUVehicleCategory as EUVehicleCategoryLGV } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryLgv.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TechRecordType as V3TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HttpService } from '@services/http/http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { State, initialAppState } from '@store/index';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
	archiveTechRecord,
	archiveTechRecordFailure,
	archiveTechRecordSuccess,
	changeVehicleType,
	createVehicle,
	createVehicleRecord,
	createVehicleRecordFailure,
	createVehicleRecordSuccess,
	unarchiveTechRecord,
	unarchiveTechRecordFailure,
	unarchiveTechRecordSuccess,
	updateTechRecord,
	updateTechRecordFailure,
	updateTechRecordSuccess,
} from '../technical-record-service.actions';
import { TechnicalRecordServiceEffects } from '../technical-record-service.effects';
import { editingTechRecord } from '../technical-record-service.selectors';

describe('TechnicalRecordServiceEffects', () => {
	let actions$ = new Observable<Action>();
	let effects: TechnicalRecordServiceEffects;
	let store: MockStore<State>;
	let httpService: HttpService;
	let testScheduler: TestScheduler;
	let technicalRecordService: TechnicalRecordService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, RouterTestingModule],
			providers: [
				TechnicalRecordServiceEffects,
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
				{ provide: UserService, useValue: { name$: of('name'), id$: of('iod') } },
				{ provide: TechnicalRecordService, useValue: { updateEditingTechRecord: jest.fn() } },
			],
		});
		effects = TestBed.inject(TechnicalRecordServiceEffects);
		httpService = TestBed.inject(HttpService);
		technicalRecordService = TestBed.inject(TechnicalRecordService);
	});

	beforeEach(() => {
		testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
	});

	describe('createVehicleRecord', () => {
		it('should return a vehicle on successful API call', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const mockVehicle = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };
				const expectedVehicle = {
					...mockVehicle,
				} as TechRecordType<'get'>;

				// mock action to trigger effect
				actions$ = hot('-a--', {
					a: createVehicleRecord({
						vehicle: {
							systemNumber: 'foo',
							createdTimestamp: 'bar',
							vin: 'testVin',
						} as unknown as TechRecordType<'put'>,
					}),
				});

				// mock service call
				jest.spyOn(httpService, 'createTechRecord').mockReturnValue(cold('--a|', { a: expectedVehicle }));

				// expect effect to return success action
				expectObservable(effects.createVehicleRecord$).toBe('---b', {
					b: createVehicleRecordSuccess({ vehicleTechRecord: expectedVehicle }),
				});
			});
		});

		it('should return an error message if not created', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				// mock action to trigger effect
				actions$ = hot('-a--', {
					a: createVehicleRecord({
						vehicle: {
							systemNumber: 'foo',
							createdTimestamp: 'bar',
							vin: 'testVin',
						} as unknown as TechRecordType<'put'>,
					}),
				});

				// mock service call
				const expectedError = new HttpErrorResponse({ status: 500, statusText: 'Internal server error' });

				jest.spyOn(httpService, 'createTechRecord').mockReturnValue(cold('--#|', {}, expectedError));

				expectObservable(effects.createVehicleRecord$).toBe('---b', {
					b: createVehicleRecordFailure({ error: 'Unable to create vehicle with VIN testVin' }),
				});
			});
		});
	});

	describe('updateTechRecords$', () => {
		beforeEach(() => {
			store = TestBed.inject(MockStore);
			store.overrideSelector(editingTechRecord, {} as unknown as TechRecordType<'put'>);
		});
		it('should return a technical record on successful API call', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const technicalRecord = {
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
				} as TechRecordType<'get'>;

				// mock action to trigger effect
				actions$ = hot('-a--', { a: updateTechRecord });

				// mock service call
				jest.spyOn(httpService, 'updateTechRecord').mockReturnValue(cold('--a|', { a: technicalRecord }));

				// expect effect to return success action
				expectObservable(effects.updateTechRecord$).toBe('---b', {
					b: updateTechRecordSuccess({ vehicleTechRecord: technicalRecord }),
				});
			});
		});

		it('should return an error message if not updated', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				// mock action to trigger effect
				actions$ = hot('-a--', { a: updateTechRecord });

				// mock service call
				const expectedError = new HttpErrorResponse({ status: 500, statusText: 'Internal server error' });
				jest.spyOn(httpService, 'updateTechRecord').mockReturnValue(cold('--#|', {}, expectedError));

				expectObservable(effects.updateTechRecord$).toBe('---b', {
					b: updateTechRecordFailure({
						error: 'Unable to update technical record null',
					}),
				});
			});
		});
	});

	describe('archiveTechRecord', () => {
		it('should return an archived technical record on successful API call', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const technicalRecord = {
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
				} as TechRecordType<'get'>;

				// mock action to trigger effect
				actions$ = hot('-a--', { a: archiveTechRecord });

				// mock service call
				jest.spyOn(httpService, 'archiveTechRecord').mockReturnValue(cold('--a|', { a: technicalRecord }));

				// expect effect to return success action
				expectObservable(effects.archiveTechRecord$).toBe('---b', {
					b: archiveTechRecordSuccess({ vehicleTechRecord: technicalRecord }),
				});
			});
		});

		it.each([
			[500, 'Internal server error'],
			[400, 'You are not allowed to update an archived tech-record'],
		])('should return an error message if not found', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				// mock action to trigger effect
				actions$ = hot('-a--', { a: archiveTechRecord });

				// mock service call
				const expectedError = new HttpErrorResponse({ status: 500, statusText: 'Internal server error' });
				jest.spyOn(httpService, 'archiveTechRecord').mockReturnValue(cold('--#|', {}, expectedError));

				expectObservable(effects.archiveTechRecord$).toBe('---b', {
					b: archiveTechRecordFailure({
						error: 'Unable to archive technical record null',
					}),
				});
			});
		});
	});

	describe('unarchiveTechRecord', () => {
		it('should return an unarchived technical record on successful API call', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const technicalRecord = {
					systemNumber: 'foo',
					createdTimestamp: 'bar',
					vin: 'testVin',
				} as TechRecordType<'get'>;

				// mock action to trigger effect
				actions$ = hot('-a--', { a: unarchiveTechRecord });

				// mock service call
				jest.spyOn(httpService, 'unarchiveTechRecord').mockReturnValue(cold('--a|', { a: technicalRecord }));

				// expect effect to return success action
				expectObservable(effects.unarchiveTechRecord$).toBe('---b', {
					b: unarchiveTechRecordSuccess({ vehicleTechRecord: technicalRecord }),
				});
			});
		});

		it('should return an error message if not there is a non-archived record with the same VRM', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				// mock action to trigger effect
				actions$ = hot('-a--', { a: unarchiveTechRecord });

				// mock service call
				const expectedError = new HttpErrorResponse({
					status: 400,
					statusText: 'Cannot archive a record with unarchived records',
				});
				jest.spyOn(httpService, 'unarchiveTechRecord').mockReturnValue(cold('--#|', {}, expectedError));

				expectObservable(effects.unarchiveTechRecord$).toBe('---b', {
					b: unarchiveTechRecordFailure({
						error: 'Unable to unarchive technical record null',
					}),
				});
			});
		});

		it('should return an error message if there was an internal server error', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				// mock action to trigger effect
				actions$ = hot('-a--', { a: unarchiveTechRecord });

				// mock service call
				const expectedError = new HttpErrorResponse({ status: 500, statusText: 'Failed to unarchive record' });
				jest.spyOn(httpService, 'unarchiveTechRecord').mockReturnValue(cold('--#|', {}, expectedError));

				expectObservable(effects.unarchiveTechRecord$).toBe('---b', {
					b: unarchiveTechRecordFailure({
						error: 'Unable to unarchive technical record null',
					}),
				});
			});
		});
	});

	describe('generateTechRecordBasedOnSectionTemplates', () => {
		beforeEach(() => {
			store = TestBed.inject(MockStore);
			store.resetSelectors();
			jest.resetModules();
		});

		it('should generate new techRecord based on vehicle type', fakeAsync(() => {
			const techRecordServiceSpy = jest.spyOn(technicalRecordService, 'updateEditingTechRecord');
			const expectedTechRecord = getEmptyTechRecord();

			testScheduler.run(({ hot, expectObservable }) => {
				store.overrideSelector(editingTechRecord, {
					vin: 'foo',
					primaryVrm: 'bar',
					systemNumber: 'foobar',
					createdTimestamp: 'barfoo',
					techRecord_vehicleType: 'lgv',
				} as unknown as TechRecordType<'put'>);
				// mock action to trigger effect
				actions$ = hot('-a--', {
					a: changeVehicleType({
						techRecord_vehicleType: VehicleTypes.CAR,
					}),
				});

				expectObservable(effects.generateTechRecordBasedOnSectionTemplatesAfterVehicleTypeChange$).toBe('-b', {
					b: expectedTechRecord,
				});
			});

			flush();
			expect(techRecordServiceSpy).toHaveBeenCalledTimes(1);
			expect(techRecordServiceSpy).toHaveBeenCalledWith(expectedTechRecord);
		}));
		it('should default EU vehicle category to M1 if the vehicle type is a car', fakeAsync(() => {
			const techRecordServiceSpy = jest.spyOn(technicalRecordService, 'updateEditingTechRecord');

			const carTechRecord: V3TechRecordType<'car', 'put'> = {
				vin: 'foo',
				primaryVrm: 'bar',
				techRecord_vehicleSubclass: undefined,
				techRecord_euVehicleCategory: undefined,
				techRecord_notes: '',
				techRecord_vehicleConfiguration: undefined,
				techRecord_vehicleType: 'car',
				techRecord_noOfAxles: 2,
				techRecord_reasonForCreation: 'test',
				techRecord_regnDate: null,
				techRecord_statusCode: 'provisional',
				techRecord_applicantDetails_address1: null,
				techRecord_applicantDetails_address2: null,
				techRecord_applicantDetails_address3: null,
				techRecord_applicantDetails_emailAddress: null,
				techRecord_applicantDetails_name: null,
				techRecord_applicantDetails_postCode: null,
				techRecord_applicantDetails_postTown: null,
				techRecord_applicantDetails_telephoneNumber: null,
				techRecord_manufactureYear: null,
			};
			const prepopulatedTechRecord = {
				techRecord_vehicleSubclass: undefined,
				techRecord_notes: '',
				techRecord_vehicleConfiguration: undefined,
				techRecord_vehicleType: 'car',
				techRecord_noOfAxles: 2,
				techRecord_reasonForCreation: 'test',
				techRecord_regnDate: null,
				techRecord_statusCode: 'provisional',
				techRecord_applicantDetails_address1: null,
				techRecord_applicantDetails_address2: null,
				techRecord_applicantDetails_address3: null,
				techRecord_applicantDetails_emailAddress: null,
				techRecord_applicantDetails_name: null,
				techRecord_applicantDetails_postCode: null,
				techRecord_applicantDetails_postTown: null,
				techRecord_applicantDetails_telephoneNumber: null,
				techRecord_manufactureYear: null,
				techRecord_createdAt: '',
				techRecord_createdById: null,
				techRecord_createdByName: null,
				techRecord_euVehicleCategory: EUVehicleCategory.M1,
				techRecord_lastUpdatedAt: null,
				techRecord_lastUpdatedById: null,
				techRecord_lastUpdatedByName: null,
			};
			testScheduler.run(({ hot, expectObservable }) => {
				store.overrideSelector(editingTechRecord, carTechRecord);
				// mock action to trigger effect
				actions$ = hot('-a--', {
					a: createVehicle({
						techRecord_vehicleType: VehicleTypes.CAR,
					}),
				});

				expectObservable(effects.generateTechRecordBasedOnSectionTemplates$).toBe('-b', {
					b: prepopulatedTechRecord,
				});
			});

			flush();
			expect(techRecordServiceSpy).toHaveBeenCalledTimes(1);
			expect(techRecordServiceSpy).toHaveBeenCalledWith(prepopulatedTechRecord);
		}));
		it('should default the eu vehicle category to N1 if the vehicle type is an lgv', fakeAsync(() => {
			const techRecordServiceSpy = jest.spyOn(technicalRecordService, 'updateEditingTechRecord');

			const carTechRecord: V3TechRecordType<'lgv', 'put'> = {
				vin: 'foo',
				primaryVrm: 'bar',
				techRecord_vehicleSubclass: undefined,
				techRecord_euVehicleCategory: undefined,
				techRecord_notes: '',
				techRecord_vehicleConfiguration: undefined,
				techRecord_vehicleType: 'lgv',
				techRecord_noOfAxles: 2,
				techRecord_reasonForCreation: 'test',
				techRecord_regnDate: null,
				techRecord_statusCode: 'provisional',
				techRecord_applicantDetails_address1: null,
				techRecord_applicantDetails_address2: null,
				techRecord_applicantDetails_address3: null,
				techRecord_applicantDetails_emailAddress: null,
				techRecord_applicantDetails_name: null,
				techRecord_applicantDetails_postCode: null,
				techRecord_applicantDetails_postTown: null,
				techRecord_applicantDetails_telephoneNumber: null,
				techRecord_manufactureYear: null,
			};
			const prepopulatedTechRecord = {
				techRecord_vehicleSubclass: undefined,
				techRecord_notes: '',
				techRecord_vehicleConfiguration: undefined,
				techRecord_vehicleType: 'lgv',
				techRecord_noOfAxles: 2,
				techRecord_reasonForCreation: 'test',
				techRecord_regnDate: null,
				techRecord_statusCode: 'provisional',
				techRecord_applicantDetails_address1: null,
				techRecord_applicantDetails_address2: null,
				techRecord_applicantDetails_address3: null,
				techRecord_applicantDetails_emailAddress: null,
				techRecord_applicantDetails_name: null,
				techRecord_applicantDetails_postCode: null,
				techRecord_applicantDetails_postTown: null,
				techRecord_applicantDetails_telephoneNumber: null,
				techRecord_manufactureYear: null,
				techRecord_createdAt: '',
				techRecord_createdById: null,
				techRecord_createdByName: null,
				techRecord_euVehicleCategory: EUVehicleCategoryLGV.N1,
				techRecord_lastUpdatedAt: null,
				techRecord_lastUpdatedById: null,
				techRecord_lastUpdatedByName: null,
				techRecord_adrDetails_certificates: undefined,
			};
			testScheduler.run(({ hot, expectObservable }) => {
				store.overrideSelector(editingTechRecord, carTechRecord);
				// mock action to trigger effect
				actions$ = hot('-a--', {
					a: createVehicle({
						techRecord_vehicleType: VehicleTypes.LGV,
					}),
				});

				expectObservable(effects.generateTechRecordBasedOnSectionTemplates$).toBe('-b', {
					b: prepopulatedTechRecord,
				});
			});

			flush();
			expect(techRecordServiceSpy).toHaveBeenCalledTimes(1);
			expect(techRecordServiceSpy).toHaveBeenCalledWith(prepopulatedTechRecord);
		}));
		it('should default to heavy goods vehicle class when vehicle type is changed to hgv', fakeAsync(() => {
			const techRecordServiceSpy = jest.spyOn(technicalRecordService, 'updateEditingTechRecord');
			const expectedTechRecord = getEmptyHGVRecord();
			testScheduler.run(({ hot, expectObservable }) => {
				store.overrideSelector(editingTechRecord, {
					vin: 'foo',
					primaryVrm: 'bar',
					systemNumber: 'foobar',
					createdTimestamp: 'barfoo',
					techRecord_vehicleType: 'lgv',
				} as unknown as TechRecordType<'put'>);
				// mock action to trigger effect
				actions$ = hot('-a--', {
					a: changeVehicleType({
						techRecord_vehicleType: VehicleTypes.HGV,
					}),
				});

				expectObservable(effects.generateTechRecordBasedOnSectionTemplatesAfterVehicleTypeChange$).toBe('-b', {
					b: expectedTechRecord,
				});
			});

			flush();
			expect(techRecordServiceSpy).toHaveBeenCalledTimes(1);
			expect(techRecordServiceSpy).toHaveBeenCalledWith(expectedTechRecord);
		}));
	});
});

function getEmptyTechRecord(): V3TechRecordModel {
	return {
		techRecord_createdAt: '',
		techRecord_createdById: null,
		techRecord_createdByName: null,
		techRecord_euVehicleCategory: null,
		techRecord_lastUpdatedAt: null,
		techRecord_lastUpdatedById: null,
		techRecord_lastUpdatedByName: null,
		techRecord_manufactureYear: null,
		techRecord_noOfAxles: 2,
		techRecord_notes: undefined,
		techRecord_applicantDetails_address1: null,
		techRecord_applicantDetails_address2: null,
		techRecord_applicantDetails_address3: null,
		techRecord_applicantDetails_emailAddress: null,
		techRecord_applicantDetails_name: null,
		techRecord_applicantDetails_postCode: null,
		techRecord_applicantDetails_postTown: null,
		techRecord_applicantDetails_telephoneNumber: null,
		techRecord_reasonForCreation: '',
		techRecord_regnDate: null,
		techRecord_statusCode: '',
		techRecord_vehicleConfiguration: 'other',
		techRecord_vehicleSubclass: undefined,
		techRecord_vehicleType: 'car',
	} as unknown as V3TechRecordModel;
}
function getEmptyHGVRecord(): V3TechRecordModel {
	return {
		techRecord_adrDetails_certificates: undefined,
		techRecord_alterationMarker: null,
		techRecord_applicantDetails_address1: null,
		techRecord_applicantDetails_address2: null,
		techRecord_applicantDetails_address3: null,
		techRecord_applicantDetails_emailAddress: null,
		techRecord_applicantDetails_name: null,
		techRecord_applicantDetails_postCode: null,
		techRecord_applicantDetails_postTown: null,
		techRecord_applicantDetails_telephoneNumber: null,
		techRecord_approvalType: null,
		techRecord_axles: [],
		techRecord_approvalTypeNumber: undefined,
		techRecord_bodyType_code: null,
		techRecord_bodyType_description: null,
		techRecord_brakes_dtpNumber: null,
		techRecord_conversionRefNo: null,
		techRecord_departmentalVehicleMarker: null,
		techRecord_dimensions_axleSpacing: [],
		techRecord_dimensions_length: null,
		techRecord_dimensions_width: null,
		techRecord_drawbarCouplingFitted: null,
		techRecord_emissionsLimit: null,
		techRecord_euVehicleCategory: null,
		techRecord_euroStandard: undefined,
		techRecord_frontAxleTo5thWheelMax: null,
		techRecord_frontAxleTo5thWheelMin: null,
		techRecord_frontAxleToRearAxle: null,
		techRecord_frontVehicleTo5thWheelCouplingMax: null,
		techRecord_frontVehicleTo5thWheelCouplingMin: null,
		techRecord_fuelPropulsionSystem: null,
		techRecord_functionCode: null,
		techRecord_grossDesignWeight: null,
		techRecord_grossEecWeight: null,
		techRecord_grossGbWeight: null,
		techRecord_make: null,
		techRecord_manufactureYear: null,
		techRecord_maxTrainDesignWeight: null,
		techRecord_maxTrainEecWeight: null,
		techRecord_maxTrainGbWeight: null,
		techRecord_microfilm_microfilmDocumentType: undefined,
		techRecord_microfilm_microfilmRollNumber: undefined,
		techRecord_microfilm_microfilmSerialNumber: undefined,
		techRecord_model: null,
		techRecord_noOfAxles: null,
		techRecord_notes: undefined,
		techRecord_ntaNumber: undefined,
		techRecord_numberOfWheelsDriven: null,
		techRecord_offRoad: null,
		techRecord_plates: [],
		techRecord_reasonForCreation: undefined,
		techRecord_regnDate: null,
		techRecord_roadFriendly: null,
		techRecord_speedLimiterMrk: null,
		techRecord_statusCode: '',
		techRecord_tachoExemptMrk: null,
		techRecord_trainDesignWeight: null,
		techRecord_trainEecWeight: null,
		techRecord_trainGbWeight: null,
		techRecord_tyreUseCode: null,
		techRecord_variantNumber: undefined,
		techRecord_variantVersionNumber: undefined,
		techRecord_vehicleClass_description: 'heavy goods vehicle',
		techRecord_vehicleConfiguration: null,
		techRecord_vehicleType: 'hgv',
	} as unknown as V3TechRecordModel;
}
