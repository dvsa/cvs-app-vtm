import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TestStationSchema } from '@dvsa/cvs-type-definitions/types/v1/test-station';
import { HttpCacheManager } from '@ngneat/cashew';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpService } from '@services/http/http.service';
import { TestStationsService } from '@services/test-stations/test-stations.service';
import { initialAppState } from '@store/index';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
	fetchTestStation,
	fetchTestStationFailed,
	fetchTestStationSuccess,
	fetchTestStations,
	fetchTestStationsFailed,
	fetchTestStationsSuccess,
} from '../test-stations.actions';
import { TestStationsEffects } from '../test-stations.effects';

describe('TestStationsEffects', () => {
	let effects: TestStationsEffects;
	let actions$ = new Observable<Action>();
	let testScheduler: TestScheduler;
	let service: HttpService;

	const expectedResult = { testStationId: 'some ID' } as TestStationSchema;
	const testCases = [
		{
			id: expectedResult.testStationId,
			payload: [expectedResult],
		},
	];

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				TestStationsEffects,
				provideMockActions(() => actions$),
				TestStationsService,
				provideMockStore({
					initialState: initialAppState,
				}),
				{ provide: HttpCacheManager, useValue: { has: vi.fn().mockReturnValue(false) } },
			],
		});

		effects = TestBed.inject(TestStationsEffects);
		service = TestBed.inject(HttpService);
	});

	beforeEach(() => {
		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).toEqual(expected);
		});
	});

	describe('fetchTestStations$', () => {
		it.each(testCases)('should return fetchTestStationsSuccess action on successfull API call', (value) => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const { payload } = value;

				// mock action to trigger effect
				actions$ = hot('-a--', { a: fetchTestStations() });

				// mock service call
				vi.spyOn(service, 'fetchTestStations').mockReturnValue(cold('--a|', { a: payload }));

				// expect effect to return success action
				expectObservable(effects.fetchTestStations$).toBe('---b', {
					b: fetchTestStationsSuccess({ payload }),
				});
			});
		});

		it.each(testCases)('should return fetchTestStationsFailed action on API error', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				actions$ = hot('-a--', { a: fetchTestStations() });

				const expectedError = new Error('Reference data resourceType is required');

				vi.spyOn(service, 'fetchTestStations').mockReturnValue(cold('--#|', {}, expectedError));

				expectObservable(effects.fetchTestStations$).toBe('---b', {
					b: fetchTestStationsFailed({ error: 'Reference data resourceType is required' }),
				});
			});
		});
	});

	describe('fetchTestStation$', () => {
		it.each(testCases)('should return fetchTestStationSuccess action on successfull API call', (value) => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const { id, payload } = value;

				const entity = payload.find((p) => p.testStationId === id) as TestStationSchema;

				// mock action to trigger effect
				actions$ = hot('-a--', { a: fetchTestStation({ id }) });

				// mock service call
				vi.spyOn(service, 'fetchTestStation').mockReturnValue(cold('--a|', { a: entity }));

				// expect effect to return success action
				expectObservable(effects.fetchTestStation$).toBe('---b', {
					b: fetchTestStationSuccess({ id, payload: entity }),
				});
			});
		});

		it.each(testCases)('should return fetchTestStationFailed action on API error', (value) => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const { id } = value;
				actions$ = hot('-a--', { a: fetchTestStation({ id }) });

				const expectedError = new Error('Reference data resourceKey is required');

				vi.spyOn(service, 'fetchTestStation').mockReturnValue(cold('--#|', {}, expectedError));

				expectObservable(effects.fetchTestStation$).toBe('---b', {
					b: fetchTestStationFailed({ error: 'Reference data resourceKey is required' }),
				});
			});
		});
	});
});
