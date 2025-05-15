import { HttpService } from '@/src/app/services/http/http.service';
import { techRecord } from '@/src/app/store/technical-records';
import { patchEditingTestResult } from '@/src/app/store/test-records';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { RecallsSchema } from '@dvsa/cvs-type-definitions/types/v1/recalls';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { Observable, of, take, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { recallsResolver } from '../recalls.resolver';

describe('recallsResolver', () => {
	let resolver: ResolveFn<Observable<RecallsSchema | undefined>>;
	const actions$ = new Observable<Action>();
	let testScheduler: TestScheduler;
	let store: MockStore<State>;
	let httpService: HttpService;
	const activatedRouteSnapshot = {} as ActivatedRouteSnapshot;
	const routerStateSnapshot = {} as RouterStateSnapshot;
	const mockRecall = { hasRecall: true, manufacturer: 'MAN' } as RecallsSchema;
	const mockTechRecord = { vin: '12345678901234567' } as TechRecordType<'get'>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => actions$),
			],
		});

		resolver = (...resolverParameters) => TestBed.runInInjectionContext(() => recallsResolver(...resolverParameters));

		store = TestBed.inject(MockStore);
		httpService = TestBed.inject(HttpService);

		store.overrideSelector(techRecord, mockTechRecord);
	});

	beforeEach(() => {
		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).toEqual(expected);
		});
	});

	it('should be created', () => {
		expect(resolver).toBeTruthy();
	});

	it('should add the result of the recalls check to the test record currently being edited', () => {
		const spy = jest.spyOn(httpService, 'getRecalls').mockReturnValue(of(mockRecall));

		const result = TestBed.runInInjectionContext(() =>
			resolver(activatedRouteSnapshot, routerStateSnapshot)
		) as Observable<RecallsSchema | undefined>;

		result.pipe(take(1)).subscribe((result) => {
			expect(spy).toHaveBeenCalledWith(mockTechRecord.vin);
			expect(store.dispatch).toHaveBeenCalledWith(patchEditingTestResult({ testResult: { recalls: mockRecall } }));
			expect(result).toBe(mockRecall);
		});
	});

	it('should add undefined (no recall) to the test record if an error occurs', () => {
		const spy = jest
			.spyOn(httpService, 'getRecalls')
			.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

		const result = TestBed.runInInjectionContext(() =>
			resolver(activatedRouteSnapshot, routerStateSnapshot)
		) as Observable<RecallsSchema | undefined>;

		result.pipe(take(1)).subscribe((result) => {
			expect(spy).toHaveBeenCalledWith(mockTechRecord.vin);
			expect(store.dispatch).not.toHaveBeenCalled();
			expect(result).toBeUndefined();
		});
	});
});
