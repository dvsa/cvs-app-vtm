import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DefectCategoryReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { CacheKeys } from '@models/cache-keys.enum';
import { HttpCacheManager } from '@ngneat/cashew';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpService } from '@services/http/http.service';
import { initialAppState } from '@store/index';
import { Observable, Subject, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
	deleteDefect,
	deleteDefectFailed,
	deleteDefectSuccess,
	fetchDefect,
	fetchDefectFailed,
	fetchDefectSuccess,
	fetchDefects,
	fetchDefectsFailed,
	fetchDefectsSuccess,
} from '../defects.actions';
import { DefectsEffects } from '../defects.effects';

describe('DefectsEffects', () => {
	let effects: DefectsEffects;
	let actions$ = new Observable<Action>();
	let testScheduler: TestScheduler;
	let service: HttpService;

	const expectedResult = { imNumber: 1 } as DefectCategoryReferenceDataSchema;
	const testCases = [
		{
			id: expectedResult.imNumber,
			payload: [expectedResult],
		},
	];

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				DefectsEffects,
				provideMockActions(() => actions$),
				HttpService,
				{ provide: Router, useValue: { navigate: vi.fn().mockResolvedValue(true) } },
				{ provide: GlobalErrorService, useValue: { clearErrors: vi.fn(), setErrors: vi.fn() } },
				provideMockStore({
					initialState: initialAppState,
				}),
				{ provide: HttpCacheManager, useValue: { has: vi.fn().mockReturnValue(false), delete: vi.fn() } },
			],
		});

		effects = TestBed.inject(DefectsEffects);
		service = TestBed.inject(HttpService);
	});

	beforeEach(() => {
		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).toEqual(expected);
		});
	});

	describe('fetchDefects$', () => {
		it.each(testCases)('should return fetchDefectsSuccess action on successfull API call', (value) => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const { payload } = value;

				// mock action to trigger effect
				actions$ = hot('-a--', { a: fetchDefects() });

				// mock service call
				vi.spyOn(service, 'fetchDefects').mockReturnValue(cold('--a|', { a: payload }));

				// expect effect to return success action
				expectObservable(effects.fetchDefects$).toBe('---b', {
					b: fetchDefectsSuccess({ payload }),
				});
			});
		});

		it('waits for deletion to succeed and ignores repeated confirmations during the request', () => {
			const actions = new Subject<Action>();
			actions$ = actions;
			const response = new Subject<void>();
			const request = vi.spyOn(service, 'deleteDefect').mockReturnValue(response);
			const result = vi.fn();
			const subscription = effects.deleteDefect$.subscribe(result);
			actions.next(deleteDefect({ id: 1 }));
			actions.next(deleteDefect({ id: 1 }));
			expect(request).toHaveBeenCalledExactlyOnceWith(1);
			expect(result).not.toHaveBeenCalled();
			response.next();
			response.complete();
			expect(result).toHaveBeenCalledExactlyOnceWith(deleteDefectSuccess({ id: 1 }));
			subscription.unsubscribe();
		});

		it('emits failure without navigating or clearing the cache on an API error', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				actions$ = hot('-a', { a: deleteDefect({ id: 1 }) });
				vi.spyOn(service, 'deleteDefect').mockReturnValue(cold('-#', {}, new Error('Failure')));
				expectObservable(effects.deleteDefect$).toBe('--b', {
					b: deleteDefectFailed({ error: 'The defect category could not be deleted. Please try again.' }),
				});
			});
			expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled();
			expect(TestBed.inject(HttpCacheManager).delete).not.toHaveBeenCalled();
		});

		it('invalidates cached defects and returns to the filtered category list after success', () => {
			actions$ = of(deleteDefectSuccess({ id: 1 }));
			effects.deleteDefectSuccess$.subscribe();
			expect(TestBed.inject(HttpCacheManager).delete).toHaveBeenCalledWith(CacheKeys.DEFECTS);
			expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['reference-data', 'defects'], {
				queryParamsHandling: 'preserve',
			});
			expect(TestBed.inject(GlobalErrorService).clearErrors).toHaveBeenCalled();
		});

		it('displays deletion failures', () => {
			actions$ = of(deleteDefectFailed({ error: 'Deletion failed' }));
			effects.deleteDefectFailed$.subscribe();
			expect(TestBed.inject(GlobalErrorService).setErrors).toHaveBeenCalledWith([{ error: 'Deletion failed' }]);
		});

		it.each(testCases)('should return fetchDefectsFailed action on API error', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				actions$ = hot('-a--', { a: fetchDefects() });

				const expectedError = new Error('Reference data resourceType is required');

				vi.spyOn(service, 'fetchDefects').mockReturnValue(cold('--#|', {}, expectedError));

				expectObservable(effects.fetchDefects$).toBe('---b', {
					b: fetchDefectsFailed({ error: 'Reference data resourceType is required' }),
				});
			});
		});
	});

	describe('fetchDefect$', () => {
		it.each(testCases)('should return fetchDefectSuccess action on successfull API call', (value) => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const { id, payload } = value;
				const entity = payload.find((d) => d.imNumber === id) as DefectCategoryReferenceDataSchema;

				// mock action to trigger effect
				actions$ = hot('-a--', { a: fetchDefect({ id }) });

				// mock service call
				vi.spyOn(service, 'fetchDefect').mockReturnValue(cold('--a|', { a: entity }));

				// expect effect to return success action
				expectObservable(effects.fetchDefect$).toBe('---b', {
					b: fetchDefectSuccess({ id, payload: entity }),
				});
			});
		});

		it.each(testCases)('should return fetchDefectFailed action on API error', (value) => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const { id } = value;
				actions$ = hot('-a--', { a: fetchDefect({ id }) });

				const expectedError = new Error('Reference data resourceKey is required');

				vi.spyOn(service, 'fetchDefect').mockReturnValue(cold('--#|', {}, expectedError));

				expectObservable(effects.fetchDefect$).toBe('---b', {
					b: fetchDefectFailed({ error: 'Reference data resourceKey is required' }),
				});
			});
		});
	});
});
