import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { TestResultModel } from '@models/test-results/test-result.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import {
	getRequiredStandards,
	getRequiredStandardsFailure,
	getRequiredStandardsSuccess,
} from '@store/required-standards/required-standards.actions';
import { testResultInEdit } from '@store/test-records/test-records.selectors';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { requiredStandardsResolver } from '../required-standards.resolver';

describe('RequiredStandardsResolver', () => {
	let resolver: ResolveFn<boolean>;
	let actions$ = new Observable<Action>();
	let testScheduler: TestScheduler;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState }), provideMockActions(() => actions$)],
		});
		resolver = (...resolverParameters) =>
			TestBed.runInInjectionContext(() => requiredStandardsResolver(...resolverParameters));
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

	describe('get required standards', () => {
		it('should resolve to true when all actions are success type', () => {
			store.overrideSelector(testResultInEdit, { euVehicleCategory: 'm1' } as unknown as TestResultModel);
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			testScheduler.run(({ hot, expectObservable }) => {
				actions$ = hot('-a', { a: getRequiredStandardsSuccess });
				expectObservable(result).toBe('-(b|)', {
					b: true,
				});
			});

			expect(dispatchSpy).toHaveBeenCalledWith(getRequiredStandards({ euVehicleCategory: 'm1' }));
		});

		it('should resolve to false when one or more actions are of failure type', () => {
			store.overrideSelector(testResultInEdit, { euVehicleCategory: 'm1' } as unknown as TestResultModel);
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			testScheduler.run(({ hot, expectObservable }) => {
				actions$ = hot('-a', { a: getRequiredStandardsFailure });
				expectObservable(result).toBe('-(b|)', {
					b: false,
				});
			});

			expect(dispatchSpy).toHaveBeenCalledWith(getRequiredStandards({ euVehicleCategory: 'm1' }));
		});
	});
});
