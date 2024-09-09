import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { fetchDefects, fetchDefectsFailed, fetchDefectsSuccess } from '@store/defects';
import { State, initialAppState } from '@store/index';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { defectsTaxonomyResolver } from '../defects-taxonomy.resolver';

describe('DefectsTaxonomyResolver', () => {
	let resolver: ResolveFn<boolean>;
	let actions$ = new Observable<Action>();
	let testScheduler: TestScheduler;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState }), provideMockActions(() => actions$)],
		});
		resolver = (...resolverParameters) =>
			TestBed.runInInjectionContext(() => defectsTaxonomyResolver(...resolverParameters));
		store = TestBed.inject(MockStore);
	});

	beforeEach(() => {
		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).toEqual(expected);
		});
	});

	it('should be created', () => {
		expect(resolver).toBeTruthy();
	});

	describe('fetch test types', () => {
		it('should resolve to true when all actions are success type', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			testScheduler.run(({ hot, expectObservable }) => {
				actions$ = hot('-a', { a: fetchDefectsSuccess });
				expectObservable(result).toBe('-(b|)', {
					b: true,
				});
			});

			expect(dispatchSpy).toHaveBeenCalledWith(fetchDefects());
		});

		it('should resolve to false when one or more actions are of failure type', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			testScheduler.run(({ hot, expectObservable }) => {
				actions$ = hot('-a', { a: fetchDefectsFailed });
				expectObservable(result).toBe('-(b|)', {
					b: false,
				});
			});

			expect(dispatchSpy).toHaveBeenCalledWith(fetchDefects());
		});
	});
});
