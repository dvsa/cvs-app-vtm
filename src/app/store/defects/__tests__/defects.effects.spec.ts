import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Defect } from '@models/defects/defect.model';
import { HttpCacheManager } from '@ngneat/cashew';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpService } from '@services/http/http.service';
import { initialAppState } from '@store/index';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
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

	const expectedResult = { imNumber: 1 } as Defect;
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
				provideMockStore({
					initialState: initialAppState,
				}),
				{ provide: HttpCacheManager, useValue: { has: jest.fn().mockReturnValue(false) } },
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
				jest.spyOn(service, 'fetchDefects').mockReturnValue(cold('--a|', { a: payload }));

				// expect effect to return success action
				expectObservable(effects.fetchDefects$).toBe('---b', {
					b: fetchDefectsSuccess({ payload }),
				});
			});
		});

		it.each(testCases)('should return fetchDefectsFailed action on API error', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				actions$ = hot('-a--', { a: fetchDefects() });

				const expectedError = new Error('Reference data resourceType is required');

				jest.spyOn(service, 'fetchDefects').mockReturnValue(cold('--#|', {}, expectedError));

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
				const entity = payload.find((d) => d.imNumber === id) as Defect;

				// mock action to trigger effect
				actions$ = hot('-a--', { a: fetchDefect({ id }) });

				// mock service call
				jest.spyOn(service, 'fetchDefect').mockReturnValue(cold('--a|', { a: entity }));

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

				jest.spyOn(service, 'fetchDefect').mockReturnValue(cold('--#|', {}, expectedError));

				expectObservable(effects.fetchDefect$).toBe('---b', {
					b: fetchDefectFailed({ error: 'Reference data resourceKey is required' }),
				});
			});
		});
	});
});
