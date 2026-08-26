import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
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
	createVehicleRecord,
	createVehicleRecordFailure,
	createVehicleRecordSuccess,
	getTechRecordV3,
	getTechRecordV3Success,
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

	describe('getTechRecordV3$', () => {
		it('should cancel an older request when a different record is requested', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const archivedRecord = {
					systemNumber: 'system-number',
					createdTimestamp: '2026-01-01T00:00:00.000Z',
				} as TechRecordType<'get'>;
				const currentRecord = {
					systemNumber: 'system-number',
					createdTimestamp: '2026-02-01T00:00:00.000Z',
				} as TechRecordType<'get'>;

				actions$ = hot('-a-b----|', {
					a: getTechRecordV3({
						systemNumber: archivedRecord.systemNumber,
						createdTimestamp: archivedRecord.createdTimestamp,
					}),
					b: getTechRecordV3({
						systemNumber: currentRecord.systemNumber,
						createdTimestamp: currentRecord.createdTimestamp,
					}),
				});

				jest
					.spyOn(httpService, 'getTechRecordV3')
					.mockImplementation((_systemNumber, createdTimestamp) =>
						createdTimestamp === archivedRecord.createdTimestamp
							? cold('-----a|', { a: archivedRecord })
							: cold('-a|', { a: currentRecord })
					);

				expectObservable(effects.getTechRecordV3$).toBe('----c---|', {
					c: getTechRecordV3Success({ vehicleTechRecord: currentRecord }),
				});
			});
		});
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

		// TODO: move test logic into tech-record-summary component once other section templates are removed
		it('should generate new techRecord based on vehicle type', fakeAsync(() => {
			const techRecordServiceSpy = jest.spyOn(technicalRecordService, 'updateEditingTechRecord');

			const oldTechRecord = {
				vin: 'foo',
				primaryVrm: 'bar',
				systemNumber: 'foobar',
				createdTimestamp: 'barfoo',
				techRecord_vehicleType: 'lgv',
			} as unknown as TechRecordType<'put'>;

			const expectedTechRecord = {
				...oldTechRecord,
				techRecord_vehicleType: VehicleTypes.CAR,
				techRecord_euVehicleCategory: EUVehicleCategory.M1,
			};

			store.overrideSelector(editingTechRecord, oldTechRecord);

			actions$ = of(
				changeVehicleType({
					techRecord_vehicleType: VehicleTypes.CAR,
				})
			);

			testScheduler.run(({ hot, expectObservable }) => {
				store.overrideSelector(editingTechRecord, oldTechRecord);
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
	});
});
