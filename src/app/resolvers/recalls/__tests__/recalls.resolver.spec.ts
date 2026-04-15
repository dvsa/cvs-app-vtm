import { techRecord } from '@/src/app/store/technical-records';
import { getRecalls, getRecallsFailure, getRecallsSuccess } from '@/src/app/store/test-records';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { RecallsSchema } from '@dvsa/cvs-type-definitions/types/v1/recalls';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { recallsResolver } from '../recalls.resolver';

describe('recallsResolver', () => {
	let resolver: ResolveFn<Observable<RecallsSchema | undefined>>;
	let actions$: Subject<Action>;
	let testScheduler: TestScheduler;
	let store: MockStore<State>;
	const activatedRouteSnapshot = {} as ActivatedRouteSnapshot;
	const routerStateSnapshot = {} as RouterStateSnapshot;
	const mockRecall = { hasRecall: true, manufacturer: 'MAN' } as RecallsSchema;
	const mockTechRecord = { techRecord_vehicleType: 'hgv' } as TechRecordType<'get'>;

	beforeEach(() => {
		actions$ = new Subject<Action>();
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
		vi.spyOn(store, 'dispatch');

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

	it('should add the result of the recalls check to the test record currently being edited', async () => {
		const result = TestBed.runInInjectionContext(() =>
			resolver(activatedRouteSnapshot, routerStateSnapshot)
		) as Observable<RecallsSchema | undefined>;
		const resultPromise = firstValueFrom(result);

		expect(store.dispatch).toHaveBeenCalledWith(getRecalls());
		actions$.next(getRecallsSuccess({ recalls: mockRecall }));
		await expect(resultPromise).resolves.toBe(mockRecall);
	});

	it('should add undefined (no recall) to the test record if an error occurs', async () => {
		const result = TestBed.runInInjectionContext(() =>
			resolver(activatedRouteSnapshot, routerStateSnapshot)
		) as Observable<RecallsSchema | undefined>;
		const resultPromise = firstValueFrom(result);

		expect(store.dispatch).toHaveBeenCalledWith(getRecalls());
		actions$.next(getRecallsFailure({ error: 'error' }));
		await expect(resultPromise).resolves.toBeUndefined();
	});
});
