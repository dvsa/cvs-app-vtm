import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { State, initialAppState } from '@store/index';
import { selectRouteNestedParams, selectRouteParam } from '@store/router/router.selectors';
import { getTechRecordV3, getTechRecordV3Failure, getTechRecordV3Success, techRecord } from '@store/technical-records';
import {
	fetchTestResultsBySystemNumber,
	fetchTestResultsBySystemNumberFailed,
	fetchTestResultsBySystemNumberSuccess,
} from '@store/test-records';
import { Observable, firstValueFrom } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { techRecordViewResolver } from '../tech-record-view.resolver';

describe('TechRecordViewResolver', () => {
	let resolver: ResolveFn<boolean>;
	let actions$ = new Observable<Action>();
	let testScheduler: TestScheduler;
	const mockSnapshot = jest.fn;
	let store: MockStore<State>;
	const featureToggleService = { isFeatureEnabled: jest.fn().mockReturnValue(false) };

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => actions$),
				{ provide: FeatureToggleService, useValue: featureToggleService },
				{ provide: RouterStateSnapshot, useValue: mockSnapshot },
			],
		});
		store = TestBed.inject(MockStore);
		featureToggleService.isFeatureEnabled.mockReturnValue(false);
		resolver = (...resolverParameters) =>
			TestBed.runInInjectionContext(() => techRecordViewResolver(...resolverParameters));
	});

	beforeEach(() => {
		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).toEqual(expected);
		});
	});

	it('should be created', () => {
		expect(resolver).toBeTruthy();
	});

	describe('fetch tech record result', () => {
		it('reuses the matching loaded record when entering the redesigned edit flow', async () => {
			const systemNumber = '12345';
			const createdTimestamp = '2026-08-19T12:00:00.000Z';
			featureToggleService.isFeatureEnabled.mockReturnValue(true);
			store.overrideSelector(techRecord, { systemNumber, createdTimestamp } as never);
			const dispatchSpy = jest.spyOn(store, 'dispatch');

			const result = TestBed.runInInjectionContext(() =>
				resolver(
					{
						data: { isEditing: true },
						params: { systemNumber, createdTimestamp },
					} as unknown as ActivatedRouteSnapshot,
					{} as RouterStateSnapshot
				)
			) as Observable<boolean>;

			expect(dispatchSpy).not.toHaveBeenCalled();
			await expect(firstValueFrom(result)).resolves.toBe(true);
		});

		it('fetches the record when a redesigned edit route does not have a matching record loaded', () => {
			const systemNumber = '12345';
			const createdTimestamp = '2026-08-19T12:00:00.000Z';
			featureToggleService.isFeatureEnabled.mockReturnValue(true);
			store.overrideSelector(techRecord, {
				systemNumber: 'another-record',
				createdTimestamp,
			} as never);
			store.overrideSelector(selectRouteNestedParams, { systemNumber, createdTimestamp });
			const dispatchSpy = jest.spyOn(store, 'dispatch');

			TestBed.runInInjectionContext(() =>
				resolver(
					{
						data: { isEditing: true },
						params: { systemNumber, createdTimestamp },
					} as unknown as ActivatedRouteSnapshot,
					{} as RouterStateSnapshot
				)
			);

			expect(dispatchSpy).toHaveBeenNthCalledWith(1, getTechRecordV3({ systemNumber, createdTimestamp }));
			expect(dispatchSpy).toHaveBeenNthCalledWith(2, fetchTestResultsBySystemNumber({ systemNumber }));
		});

		it('should resolved to true when both success actions are triggered', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			store.overrideSelector(selectRouteParam('systemNumber'), undefined);
			store.overrideSelector(selectRouteParam('createdTimestamp'), undefined);
			testScheduler.run(({ hot, expectObservable }) => {
				actions$ = hot('-a-b-', { a: getTechRecordV3Success, b: fetchTestResultsBySystemNumberSuccess });
				expectObservable(result).toBe('---(c|)', {
					c: true,
				});
			});

			expect(dispatchSpy).toHaveBeenCalledTimes(2);
		});

		it("should resolve to false if 'getTechRecordV3Failure' action if dispatched", () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			store.overrideSelector(selectRouteParam('systemNumber'), undefined);
			store.overrideSelector(selectRouteParam('createdTimestamp'), undefined);
			testScheduler.run(({ hot, expectObservable }) => {
				actions$ = hot('-a-b-', { a: getTechRecordV3Failure, b: fetchTestResultsBySystemNumberSuccess });
				expectObservable(result).toBe('---(c|)', {
					c: false,
				});
			});

			expect(dispatchSpy).toHaveBeenCalledTimes(2);
		});

		it("should resolved to false if 'fetchTestResultsBySystemNumberFailed' action is dipatched", () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			store.overrideSelector(selectRouteParam('systemNumber'), undefined);
			store.overrideSelector(selectRouteParam('createdTimestamp'), undefined);
			testScheduler.run(({ hot, expectObservable }) => {
				actions$ = hot('-a-b-', { a: getTechRecordV3Success, b: fetchTestResultsBySystemNumberFailed });
				expectObservable(result).toBe('---(c|)', {
					c: false,
				});
			});

			expect(dispatchSpy).toHaveBeenCalledTimes(2);
		});
	});
});
