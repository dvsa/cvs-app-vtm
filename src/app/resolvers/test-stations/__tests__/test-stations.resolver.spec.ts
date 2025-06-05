import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { fetchTestStations, fetchTestStationsFailed, fetchTestStationsSuccess } from '@store/test-stations';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { testStationsResolver } from '../test-stations.resolver';

describe('TestTypeTaxonomyResolver', () => {
	let resolver: ResolveFn<boolean>;
	let actions$ = new Observable<Action>();
	let testScheduler: TestScheduler;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState }), provideMockActions(() => actions$)],
		});
		store = TestBed.inject(MockStore);
		resolver = (...resolverParameters) =>
			TestBed.runInInjectionContext(() => testStationsResolver(...resolverParameters));
	});

	beforeEach(() => {
		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).toEqual(expected);
		});
	});

	it('should be created', () => {
		expect(resolver).toBeTruthy();
	});

	describe('fetch test stations', () => {
		it('should resolve to true when all actions are success type', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			testScheduler.run(({ hot, expectObservable }) => {
				actions$ = hot('-a', { a: fetchTestStationsSuccess });

				expectObservable(result).toBe('-(b|)', {
					b: true,
				});
			});

			expect(dispatchSpy).toHaveBeenCalledWith(fetchTestStations());
		});

		it('should resolve to false when one or more actions are of failure type', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			testScheduler.run(({ hot, expectObservable }) => {
				actions$ = hot('-a', { a: fetchTestStationsFailed });
				expectObservable(result).toBe('-(b|)', {
					b: false,
				});
			});

			expect(dispatchSpy).toHaveBeenCalledWith(fetchTestStations());
		});
	});
});
