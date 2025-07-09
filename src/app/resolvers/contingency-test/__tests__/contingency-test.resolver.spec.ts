import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { State, initialAppState } from '@store/index';
import { initialContingencyTest } from '@store/test-records';
import { Observable, ReplaySubject, firstValueFrom, of, throwError } from 'rxjs';
import { contingencyTestResolver, getBodyMake, getBodyModel, getBodyType } from '../contingency-test.resolver';

describe('ContingencyTestResolver', () => {
	let resolver: ResolveFn<boolean>;
	const actions$ = new ReplaySubject<Action>();
	let store: MockStore<State>;
	let techRecordService: TechnicalRecordService;

	const MockUserService = {
		getUserName$: jest.fn().mockReturnValue(new Observable()),
		get user$() {
			return of('foo');
		},
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, RouterTestingModule],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => actions$),
				TechnicalRecordService,
				{ provide: UserService, useValue: MockUserService },
			],
		});
		resolver = (...resolverParameters) =>
			TestBed.runInInjectionContext(() => contingencyTestResolver(...resolverParameters));
		store = TestBed.inject(MockStore);
		techRecordService = TestBed.inject(TechnicalRecordService);
	});

	it('should be created', () => {
		expect(resolver).toBeTruthy();
	});

	it('should return true and dispatch the initial contingency test action', async () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		techRecordService.techRecord$ = of(mockVehicleTechnicalRecord('psv') as TechRecordType<'psv'>);
		const result = TestBed.runInInjectionContext(() =>
			resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
		) as Observable<boolean>;
		const resolveResult = await firstValueFrom(result);

		expect(resolveResult).toBe(true);
		expect(dispatchSpy).toHaveBeenCalledTimes(1);
		expect(dispatchSpy).toHaveBeenCalledWith(
			expect.objectContaining({ type: initialContingencyTest.type, testResult: expect.anything() })
		);
	});

	it('should return false if there is an error', async () => {
		techRecordService.techRecord$ = of(mockVehicleTechnicalRecord('psv') as TechRecordType<'psv'>);
		jest.spyOn(MockUserService, 'user$', 'get').mockImplementationOnce(() => throwError(() => new Error('foo')));
		const result = TestBed.runInInjectionContext(() =>
			resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
		) as Observable<boolean>;
		const resolveResult = await firstValueFrom(result);
		expect(resolveResult).toBe(false);
	});

	describe('getBodyMake', () => {
		it('should return vehicle make if vehicle is psv', () => {
			const techRecord = {
				techRecord_vehicleType: 'psv',
				techRecord_bodyMake: 'test make 1',
			} as V3TechRecordModel;

			const make = getBodyMake(techRecord);
			expect(make).toBe('test make 1');
		});

		it('should return vehicle make if vehicle is hgv', () => {
			const techRecord = {
				techRecord_vehicleType: 'hgv',
				techRecord_make: 'test make 2',
			} as V3TechRecordModel;

			const make = getBodyMake(techRecord);
			expect(make).toBe('test make 2');
		});

		it('should return vehicle make if vehicle is trl', () => {
			const techRecord = {
				techRecord_vehicleType: 'trl',
				techRecord_make: 'test make 3',
			} as V3TechRecordModel;

			const make = getBodyMake(techRecord);
			expect(make).toBe('test make 3');
		});

		it('should not return vehicle make if vehicle is not hgv, psv or trl', () => {
			const techRecord = {
				techRecord_vehicleType: 'car',
			} as V3TechRecordModel;

			const make = getBodyMake(techRecord);
			expect(make).toBeNull();
		});
	});

	describe('getBodyModel', () => {
		it('should return vehicle model if vehicle is psv', () => {
			const techRecord = {
				techRecord_vehicleType: 'psv',
				techRecord_bodyModel: 'test model 1',
			} as V3TechRecordModel;

			const model = getBodyModel(techRecord);
			expect(model).toBe('test model 1');
		});

		it('should return vehicle model if vehicle is hgv', () => {
			const techRecord = {
				techRecord_vehicleType: 'hgv',
				techRecord_model: 'test model 2',
			} as V3TechRecordModel;

			const model = getBodyModel(techRecord);
			expect(model).toBe('test model 2');
		});

		it('should return vehicle model if vehicle is trl', () => {
			const techRecord = {
				techRecord_vehicleType: 'trl',
				techRecord_model: 'test model 3',
			} as V3TechRecordModel;

			const model = getBodyModel(techRecord);
			expect(model).toBe('test model 3');
		});

		it('should not return vehicle model if vehicle is not hgv, psv or trl', () => {
			const techRecord = {
				techRecord_vehicleType: 'car',
			} as V3TechRecordModel;

			const model = getBodyModel(techRecord);
			expect(model).toBeNull();
		});
	});

	describe('getBodyType', () => {
		it('should return vehicle body type if vehicle is psv', () => {
			const techRecord = {
				techRecord_vehicleType: 'psv',
				techRecord_bodyType_code: 'test code 1',
				techRecord_bodyType_description: 'flat',
			} as V3TechRecordModel;

			const bodyType = getBodyType(techRecord);
			expect(bodyType).toStrictEqual({ code: 'test code 1', description: 'flat' });
		});

		it('should return vehicle body type if vehicle is hgv', () => {
			const techRecord = {
				techRecord_vehicleType: 'hgv',
				techRecord_bodyType_code: 'test code 2',
				techRecord_bodyType_description: 'flat',
			} as V3TechRecordModel;

			const bodyType = getBodyType(techRecord);
			expect(bodyType).toStrictEqual({ code: 'test code 2', description: 'flat' });
		});

		it('should return vehicle body type if vehicle is trl', () => {
			const techRecord = {
				techRecord_vehicleType: 'trl',
				techRecord_bodyType_code: 'test code 3',
				techRecord_bodyType_description: 'flat',
			} as V3TechRecordModel;

			const bodyType = getBodyType(techRecord);
			expect(bodyType).toStrictEqual({ code: 'test code 3', description: 'flat' });
		});

		it('should not return vehicle body type if vehicle is not hgv, psv or trl', () => {
			const techRecord = {
				techRecord_vehicleType: 'car',
			} as V3TechRecordModel;

			const bodyType = getBodyType(techRecord);
			expect(bodyType).toBeNull();
		});
	});
});
