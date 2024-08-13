import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/.';
import {
	fetchSelectedTestResult,
	fetchSelectedTestResultFailed,
	fetchSelectedTestResultSuccess,
	selectedTestResultState,
} from '@store/test-records';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { testResultResolver } from './test-result.resolver';

describe('TestResultResolver', () => {
	let resolver: ResolveFn<boolean>;
	let actions$ = new Observable<Action>();
	let testScheduler: TestScheduler;
	const mockSnapshot = jest.fn;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => actions$),
				{ provide: RouterStateSnapshot, useValue: mockSnapshot },
			],
		});
		resolver = (...resolverParameters) =>
			TestBed.runInInjectionContext(() => testResultResolver(...resolverParameters));
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

	describe('fetch test result', () => {
		it('should resolve to true when all actions are success type', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			store.overrideSelector(selectedTestResultState, undefined);
			testScheduler.run(({ hot, expectObservable }) => {
				actions$ = hot('-a', { a: fetchSelectedTestResultSuccess });
				expectObservable(result).toBe('-(b|)', {
					b: true,
				});
			});

			expect(dispatchSpy).toHaveBeenCalledWith(fetchSelectedTestResult());
		});

		it('should resolve to false when one or more actions are of failure type', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			store.overrideSelector(selectedTestResultState, undefined);
			testScheduler.run(({ hot, expectObservable }) => {
				actions$ = hot('-a', { a: fetchSelectedTestResultFailed });
				expectObservable(result).toBe('-(b|)', {
					b: false,
				});
			});

			expect(dispatchSpy).toHaveBeenCalledWith(fetchSelectedTestResult());
		});
	});
});
