import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { VehicleClassDescription } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescription.enum.js';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { HttpService } from '@services/http/http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { selectMergedRouteUrl } from '@store/router/router.selectors';
import { Observable, firstValueFrom, of, throwError, toArray } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import * as actions from '../technical-record-service.actions';
import { TechnicalRecordServiceEffects } from '../technical-record-service.effects';
import { editingTechRecord, selectTechRecord, techRecord } from '../technical-record-service.selectors';

describe('Technical record effect behaviour', () => {
	let actions$: Observable<Action>;
	let effects: TechnicalRecordServiceEffects;
	let store: MockStore;
	let http: {
		searchTechRecordBySystemNumber: ReturnType<typeof vi.fn>;
		getTechRecordBySysNumberAndTimestamp: ReturnType<typeof vi.fn>;
		createTechRecord: ReturnType<typeof vi.fn>;
		updateTechRecord: ReturnType<typeof vi.fn>;
		amendTechRecordVrm: ReturnType<typeof vi.fn>;
		amendTechRecordVin: ReturnType<typeof vi.fn>;
		promoteTechRecord: ReturnType<typeof vi.fn>;
		generatePlate: ReturnType<typeof vi.fn>;
		generateLetter: ReturnType<typeof vi.fn>;
		generateADRCertificate: ReturnType<typeof vi.fn>;
	};
	let navigate: ReturnType<typeof vi.fn>;
	const record = {
		systemNumber: 'system-1',
		createdTimestamp: '2026-11-09T12:00:00Z',
		vin: 'VIN-1',
		techRecord_vehicleType: VehicleTypes.HGV,
	} as TechRecordType<'get'>;
	const editedRecord = { ...record, vin: 'EDITED-VIN' } as TechRecordType<'put'>;

	beforeEach(() => {
		actions$ = of();
		http = {
			searchTechRecordBySystemNumber: vi.fn(),
			getTechRecordBySysNumberAndTimestamp: vi.fn(),
			createTechRecord: vi.fn(),
			updateTechRecord: vi.fn(),
			amendTechRecordVrm: vi.fn(),
			amendTechRecordVin: vi.fn(),
			promoteTechRecord: vi.fn(),
			generatePlate: vi.fn(),
			generateLetter: vi.fn(),
			generateADRCertificate: vi.fn(),
		};
		navigate = vi.fn().mockResolvedValue(true);
		TestBed.configureTestingModule({
			providers: [
				TechnicalRecordServiceEffects,
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
				{ provide: HttpService, useValue: http },
				{ provide: Router, useValue: { navigate } },
				{ provide: TechnicalRecordService, useValue: { updateEditingTechRecord: vi.fn() } },
				{ provide: BatchTechnicalRecordService, useValue: { applicationId$: of('application-1') } },
				{
					provide: UserService,
					useValue: { name$: of('Test User'), id$: of('user-1'), userEmail$: of('user@example.com') },
				},
			],
		});
		store = TestBed.inject(MockStore);
		store.overrideSelector(editingTechRecord, editedRecord);
		store.overrideSelector(selectTechRecord, record);
		store.overrideSelector(selectMergedRouteUrl, '');
		effects = TestBed.inject(TechnicalRecordServiceEffects);
	});

	describe('record retrieval', () => {
		it('requests history for the supplied system number', async () => {
			const history = [
				{ systemNumber: 'system-1', createdTimestamp: record.createdTimestamp },
			] as TechRecordSearchSchema[];
			http.searchTechRecordBySystemNumber.mockReturnValue(of(history));
			actions$ = of(actions.getBySystemNumber({ systemNumber: 'system-1' }));
			expect(await firstValueFrom(effects.getTechnicalRecordHistory$)).toEqual(
				actions.getBySystemNumberSuccess({ techRecordHistory: history })
			);
			expect(http.searchTechRecordBySystemNumber).toHaveBeenCalledExactlyOnceWith('system-1');
		});

		it('keeps listening for history requests after an API failure', async () => {
			http.searchTechRecordBySystemNumber
				.mockReturnValueOnce(throwError(() => new Error('offline')))
				.mockReturnValueOnce(of([]));
			actions$ = of(
				actions.getBySystemNumber({ systemNumber: 'missing' }),
				actions.getBySystemNumber({ systemNumber: 'system-1' })
			);
			expect(await firstValueFrom(effects.getTechnicalRecordHistory$.pipe(toArray()))).toEqual([
				actions.getBySystemNumberFailure({
					error: 'could not find technical record history',
					anchorLink: 'search-term',
				}),
				actions.getBySystemNumberSuccess({ techRecordHistory: [] }),
			]);
			expect(http.searchTechRecordBySystemNumber.mock.calls).toEqual([['missing'], ['system-1']]);
		});

		it('retrieves the exact record version requested', async () => {
			http.getTechRecordBySysNumberAndTimestamp.mockReturnValue(of(record));
			actions$ = of(actions.getTechRecordV3({ systemNumber: 'system-1', createdTimestamp: record.createdTimestamp }));
			expect(await firstValueFrom(effects.getTechRecordV3$)).toEqual(
				actions.getTechRecordV3Success({ vehicleTechRecord: record })
			);
			expect(http.getTechRecordBySysNumberAndTimestamp).toHaveBeenCalledExactlyOnceWith(
				'system-1',
				record.createdTimestamp
			);
		});

		it.each([
			[404, 'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number'],
			[500, 'There was a problem getting the Tech Record by systemNumber'],
		] as const)('reports a %s retrieval failure against the search field', async (status, error) => {
			http.getTechRecordBySysNumberAndTimestamp.mockReturnValue(throwError(() => new HttpErrorResponse({ status })));
			actions$ = of(actions.getTechRecordV3({ systemNumber: 'system-1', createdTimestamp: record.createdTimestamp }));
			expect(await firstValueFrom(effects.getTechRecordV3$)).toEqual(
				actions.getTechRecordV3Failure({ error, anchorLink: 'search-term' })
			);
		});
	});

	describe('creating and updating records', () => {
		it('adds the batch application ID without mutating the supplied vehicle and preserves the row ID', async () => {
			http.createTechRecord.mockReturnValue(of(record));
			actions$ = of(actions.createVehicleRecord({ batchRecordId: 7, vehicle: editedRecord }));
			expect(await firstValueFrom(effects.createVehicleRecord$)).toEqual(
				actions.createVehicleRecordSuccess({ batchRecordId: 7, vehicleTechRecord: record })
			);
			expect(http.createTechRecord).toHaveBeenCalledExactlyOnceWith({
				...editedRecord,
				techRecord_applicationId: 'application-1',
			});
			expect(editedRecord).not.toHaveProperty('techRecord_applicationId');
		});

		it('preserves batch retry information and API validation messages when creation fails', async () => {
			http.createTechRecord.mockReturnValue(
				throwError(() => new HttpErrorResponse({ status: 400, error: { errors: ['VIN already exists'] } }))
			);
			actions$ = of(actions.createVehicleRecord({ batchRecordId: 7, vehicle: editedRecord }));
			expect(await firstValueFrom(effects.createVehicleRecord$)).toEqual(
				actions.createVehicleRecordFailure({
					batchRecordId: 7,
					vehicleRecord: { ...editedRecord, techRecord_applicationId: 'application-1' },
					error: 'Unable to create vehicle with VIN EDITED-VIN because:\nVIN already exists',
				})
			);
		});

		it('queues batch creations and continues with the next row after an error', () => {
			const scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
			scheduler.run(({ hot, cold, expectObservable, expectSubscriptions }) => {
				const failedRequest = cold('--#', {}, new HttpErrorResponse({ status: 500 }));
				const successfulRequest = cold('--r|', { r: record });
				http.createTechRecord.mockReturnValueOnce(failedRequest).mockReturnValueOnce(successfulRequest);
				actions$ = hot('-ab---|', {
					a: actions.createVehicleRecord({ batchRecordId: 1, vehicle: editedRecord }),
					b: actions.createVehicleRecord({ batchRecordId: 2, vehicle: editedRecord }),
				});
				expectObservable(effects.createVehicleRecord$).toBe('---f-s|', {
					f: actions.createVehicleRecordFailure({
						batchRecordId: 1,
						vehicleRecord: { ...editedRecord, techRecord_applicationId: 'application-1' },
						error: 'Unable to create vehicle with VIN EDITED-VIN',
					}),
					s: actions.createVehicleRecordSuccess({ batchRecordId: 2, vehicleTechRecord: record }),
				});
				expectSubscriptions(failedRequest.subscriptions).toBe('-^-!');
				expectSubscriptions(successfulRequest.subscriptions).toBe('---^--!');
			});
		});

		it('rejects updates without an editing record before calling the API', async () => {
			store.overrideSelector(editingTechRecord, undefined);
			actions$ = of(
				actions.updateTechRecord({
					batchRecordId: 7,
					systemNumber: 'system-1',
					createdTimestamp: record.createdTimestamp,
					groupType: 'batch',
				})
			);
			expect(await firstValueFrom(effects.updateTechRecord$)).toEqual(
				actions.updateTechRecordFailure({
					batchRecordId: 7,
					techRecord: undefined,
					error: 'There is no technical record in edit',
				})
			);
			expect(http.updateTechRecord).not.toHaveBeenCalled();
		});

		it('sends the editing record and retains batch context on successful updates', async () => {
			http.updateTechRecord.mockReturnValue(of(record));
			actions$ = of(
				actions.updateTechRecord({
					batchRecordId: 7,
					systemNumber: 'system-1',
					createdTimestamp: record.createdTimestamp,
					groupType: 'batch',
				})
			);
			expect(await firstValueFrom(effects.updateTechRecord$)).toEqual(
				actions.updateTechRecordSuccess({ batchRecordId: 7, vehicleTechRecord: record, groupType: 'batch' })
			);
			expect(http.updateTechRecord).toHaveBeenCalledExactlyOnceWith('system-1', record.createdTimestamp, editedRecord);
		});

		it('retains the editing record and row ID when an update fails', async () => {
			http.updateTechRecord.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 400 })));
			actions$ = of(
				actions.updateTechRecord({
					batchRecordId: 7,
					systemNumber: 'system-1',
					createdTimestamp: record.createdTimestamp,
					groupType: 'batch',
				})
			);
			expect(await firstValueFrom(effects.updateTechRecord$)).toEqual(
				actions.updateTechRecordFailure({
					batchRecordId: 7,
					techRecord: editedRecord,
					error: 'Unable to update technical record with VIN EDITED-VIN',
				})
			);
		});
	});

	describe('navigation after saving', () => {
		it('clears editing UI state and refreshes history after a single-record update', async () => {
			actions$ = of(actions.updateTechRecordSuccess({ vehicleTechRecord: record, groupType: 'single' }));
			expect(await firstValueFrom(effects.updateSingleTechRecordSuccess.pipe(toArray()))).toEqual([
				actions.clearAllSectionStates(),
				actions.clearScrollPosition(),
				actions.getBySystemNumber({ systemNumber: 'system-1' }),
			]);
			expect(navigate).toHaveBeenCalledExactlyOnceWith([`/tech-records/system-1/${record.createdTimestamp}`], {
				queryParams: { from: 'amend' },
				queryParamsHandling: 'merge',
			});
		});

		it('does not redirect or clear editing state after a batch update', async () => {
			actions$ = of(
				actions.updateTechRecordSuccess({ batchRecordId: 7, vehicleTechRecord: record, groupType: 'batch' })
			);
			expect(await firstValueFrom(effects.updateSingleTechRecordSuccess.pipe(toArray()))).toEqual([]);
			expect(navigate).not.toHaveBeenCalled();
		});

		it.each(['create/new-record-details', 'tech-records/batch/summary', ''])(
			'handles creation success from route "%s"',
			async (route) => {
				store.overrideSelector(selectMergedRouteUrl, route);
				actions$ = of(actions.createVehicleRecordSuccess({ vehicleTechRecord: record }));
				await firstValueFrom(effects.createVehicleSuccess.pipe(toArray()));
				if (route === 'create/new-record-details') {
					expect(navigate).toHaveBeenCalledExactlyOnceWith(['tech-records', 'system-1', record.createdTimestamp], {
						queryParams: { from: 'create' },
						queryParamsHandling: 'merge',
					});
				} else {
					expect(navigate).not.toHaveBeenCalled();
				}
			}
		);
	});

	describe('amending identifiers and promoting records', () => {
		it('passes all VRM amendment details, including a third mark, to the API', async () => {
			http.amendTechRecordVrm.mockReturnValue(of(record));
			actions$ = of(
				actions.amendVrm({
					newVrm: 'AB12CDE',
					cherishedTransfer: true,
					thirdMark: 'XY34ZAB',
					systemNumber: 'system-1',
					createdTimestamp: record.createdTimestamp,
				})
			);
			expect(await firstValueFrom(effects.amendVrm$)).toEqual(actions.amendVrmSuccess({ vehicleTechRecord: record }));
			expect(http.amendTechRecordVrm).toHaveBeenCalledExactlyOnceWith(
				'AB12CDE',
				true,
				'system-1',
				record.createdTimestamp,
				'XY34ZAB'
			);
		});

		it('reports a rejected VRM amendment', async () => {
			http.amendTechRecordVrm.mockReturnValue(
				throwError(() => new HttpErrorResponse({ status: 400, error: { message: 'VRM already exists' } }))
			);
			actions$ = of(
				actions.amendVrm({
					newVrm: 'AB12CDE',
					cherishedTransfer: false,
					systemNumber: 'system-1',
					createdTimestamp: record.createdTimestamp,
				})
			);
			expect(await firstValueFrom(effects.amendVrm$)).toEqual(
				actions.amendVrmFailure({ error: 'Unable to update technical record {"message":"VRM already exists"}' })
			);
		});

		it('passes the new VIN and record version to the API', async () => {
			http.amendTechRecordVin.mockReturnValue(of(record));
			actions$ = of(
				actions.amendVin({ newVin: 'NEW-VIN', systemNumber: 'system-1', createdTimestamp: record.createdTimestamp })
			);
			expect(await firstValueFrom(effects.amendVin$)).toEqual(actions.amendVinSuccess({ vehicleTechRecord: record }));
			expect(http.amendTechRecordVin).toHaveBeenCalledExactlyOnceWith('NEW-VIN', 'system-1', record.createdTimestamp);
		});

		it('promotes the requested record with the supplied reason', async () => {
			http.promoteTechRecord.mockReturnValue(of(record));
			actions$ = of(
				actions.promoteTechRecord({
					systemNumber: 'system-1',
					createdTimestamp: record.createdTimestamp,
					reasonForPromoting: 'Application approved',
				})
			);
			expect(await firstValueFrom(effects.promoteTechRecord$)).toEqual(
				actions.promoteTechRecordSuccess({ vehicleTechRecord: record })
			);
			expect(http.promoteTechRecord).toHaveBeenCalledExactlyOnceWith(
				'system-1',
				record.createdTimestamp,
				'Application approved'
			);
		});

		it('returns a failure action when promotion is rejected', async () => {
			http.promoteTechRecord.mockReturnValue(
				throwError(() => new HttpErrorResponse({ status: 400, error: { message: 'Not provisional' } }))
			);
			actions$ = of(
				actions.promoteTechRecord({
					systemNumber: 'system-1',
					createdTimestamp: record.createdTimestamp,
					reasonForPromoting: 'Application approved',
				})
			);
			expect(await firstValueFrom(effects.promoteTechRecord$)).toEqual(
				actions.promoteTechRecordFailure({ error: 'Unable to promote technical record {"message":"Not provisional"}' })
			);
		});
	});

	describe('generating documents', () => {
		it('generates a plate using the selected record and logged-in user', async () => {
			http.generatePlate.mockReturnValue(of({}));
			actions$ = of(actions.generatePlate({ reason: 'Replacement' }));
			expect(await firstValueFrom(effects.generatePlate$)).toEqual(actions.generatePlateSuccess());
			expect(http.generatePlate).toHaveBeenCalledExactlyOnceWith(record, 'Replacement', {
				name: 'Test User',
				email: 'user@example.com',
			});
		});

		it('generates a letter with the chosen paragraph and logged-in user', async () => {
			http.generateLetter.mockReturnValue(of({}));
			actions$ = of(actions.generateLetter({ letterType: 'trailer', paragraphId: 3 }));
			expect(await firstValueFrom(effects.generateLetter$)).toEqual(actions.generateLetterSuccess());
			expect(http.generateLetter).toHaveBeenCalledExactlyOnceWith(record, 'trailer', 3, {
				name: 'Test User',
				email: 'user@example.com',
			});
		});

		it('returns the generated ADR certificate ID', async () => {
			http.generateADRCertificate.mockReturnValue(of({ id: 'certificate-1' }));
			actions$ = of(
				actions.generateADRCertificate({
					systemNumber: 'system-1',
					createdTimestamp: record.createdTimestamp,
					certificateType: 'ADR',
				})
			);
			expect(await firstValueFrom(effects.generateADRCertificate$)).toEqual(
				actions.generateADRCertificateSuccess({ id: 'certificate-1' })
			);
			expect(http.generateADRCertificate).toHaveBeenCalledExactlyOnceWith('system-1', record.createdTimestamp, 'ADR');
		});

		it('reports ADR generation errors and keeps listening for a subsequent request', async () => {
			http.generateADRCertificate
				.mockReturnValueOnce(
					throwError(() => new HttpErrorResponse({ status: 500, error: { message: 'Unavailable' } }))
				)
				.mockReturnValueOnce(of({ id: 'certificate-2' }));
			const request = actions.generateADRCertificate({
				systemNumber: 'system-1',
				createdTimestamp: record.createdTimestamp,
				certificateType: 'ADR',
			});
			actions$ = of(request, request);
			expect(await firstValueFrom(effects.generateADRCertificate$.pipe(toArray()))).toEqual([
				actions.generateADRCertificateFailure({
					error: 'Unable to generate ADR certificate {"message":"Unavailable"}',
				}),
				actions.generateADRCertificateSuccess({ id: 'certificate-2' }),
			]);
		});
	});

	describe('vehicle type defaults', () => {
		it.each([
			[VehicleTypes.CAR, EUVehicleCategory.M1],
			[VehicleTypes.LGV, EUVehicleCategory.N1],
		] as const)('sets the %s category when creating a vehicle', async (vehicleType, category) => {
			actions$ = of(actions.createVehicle({ techRecord_vehicleType: vehicleType }));
			await firstValueFrom(effects.generateTechRecordBasedOnSectionTemplates$.pipe(toArray()));
			expect(TestBed.inject(TechnicalRecordService).updateEditingTechRecord).toHaveBeenCalledExactlyOnceWith({
				...editedRecord,
				techRecord_vehicleType: vehicleType,
				techRecord_euVehicleCategory: category,
			});
			expect(editedRecord.techRecord_vehicleType).toBe(VehicleTypes.HGV);
		});

		it.each([
			[
				VehicleTypes.HGV,
				{
					techRecord_approvalType: null,
					techRecord_vehicleConfiguration: null,
					techRecord_vehicleClass_description: VehicleClassDescription.HeavyGoodsVehicle,
				},
			],
			[VehicleTypes.PSV, { techRecord_approvalType: null, techRecord_vehicleConfiguration: null }],
			[VehicleTypes.CAR, { techRecord_euVehicleCategory: EUVehicleCategory.M1 }],
			[VehicleTypes.LGV, { techRecord_euVehicleCategory: EUVehicleCategory.N1 }],
		] as const)('preserves saved identity and registration when changing to %s', async (vehicleType, defaults) => {
			const savedRecord = {
				...record,
				partialVin: 'SAVED-PARTIAL-VIN',
				primaryVrm: 'AB12CDE',
				secondaryVrms: ['XY34ZAB'],
				techRecord_statusCode: 'current',
				techRecord_hiddenInVta: false,
				techRecord_recordCompleteness: 'complete',
			} as TechRecordType<'get'>;
			const editing = {
				...editedRecord,
				primaryVrm: 'EDITED',
				techRecord_approvalType: 'iva',
				techRecord_vehicleConfiguration: 'rigid',
				techRecord_euVehicleCategory: EUVehicleCategory.N2,
			} as TechRecordType<'put'>;
			store.overrideSelector(editingTechRecord, editing);
			store.overrideSelector(techRecord, savedRecord);
			actions$ = of(actions.changeVehicleType({ techRecord_vehicleType: vehicleType }));

			const result = await firstValueFrom(effects.generateTechRecordBasedOnSectionTemplatesAfterVehicleTypeChange$);

			expect(result).toMatchObject({
				vin: 'VIN-1',
				partialVin: 'SAVED-PARTIAL-VIN',
				systemNumber: 'system-1',
				createdTimestamp: record.createdTimestamp,
				primaryVrm: 'AB12CDE',
				secondaryVrms: ['XY34ZAB'],
				techRecord_statusCode: 'current',
				techRecord_hiddenInVta: false,
				techRecord_recordCompleteness: 'complete',
				techRecord_vehicleType: vehicleType,
				...defaults,
			});
			expect(TestBed.inject(TechnicalRecordService).updateEditingTechRecord).toHaveBeenCalledExactlyOnceWith(result);
			expect(editing.vin).toBe('EDITED-VIN');
			expect(editing.primaryVrm).toBe('EDITED');
			expect(editing.techRecord_euVehicleCategory).toBe(EUVehicleCategory.N2);
			expect(editing.techRecord_approvalType).toBe('iva');
		});

		it('preserves the saved trailer ID and resets the category when changing to trailer', async () => {
			store.overrideSelector(techRecord, {
				...record,
				techRecord_vehicleType: VehicleTypes.TRL,
				trailerId: 'C123456',
			} as TechRecordType<'get'>);
			actions$ = of(actions.changeVehicleType({ techRecord_vehicleType: VehicleTypes.TRL }));
			const result = await firstValueFrom(effects.generateTechRecordBasedOnSectionTemplatesAfterVehicleTypeChange$);
			expect(result).toMatchObject({
				vin: 'VIN-1',
				trailerId: 'C123456',
				techRecord_vehicleType: VehicleTypes.TRL,
				techRecord_vehicleClass_description: VehicleClassDescription.Trailer,
				techRecord_euVehicleCategory: null,
			});
			expect(TestBed.inject(TechnicalRecordService).updateEditingTechRecord).toHaveBeenCalledExactlyOnceWith(result);
		});
	});
});
