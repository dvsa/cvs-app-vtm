import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DefectGETRequiredStandards } from '@dvsa/cvs-type-definitions/types/required-standards/defects/get';
import { HttpCacheManager } from '@ngneat/cashew';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpService } from '@services/http/http.service';
import { initialAppState } from '@store/index';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
	getRequiredStandards,
	getRequiredStandardsFailure,
	getRequiredStandardsSuccess,
} from '../required-standards.actions';
import { RequiredStandardsEffects } from '../required-standards.effects';

describe('RequiredStandardEffects', () => {
	let effects: RequiredStandardsEffects;
	let actions$ = new Observable<Action>();
	let testScheduler: TestScheduler;
	let service: HttpService;

	const testCases = [
		{
			requiredStandards: [
				{
					rsNumber: 1,
				},
			] as unknown as DefectGETRequiredStandards,
		},
	];

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				RequiredStandardsEffects,
				provideMockActions(() => actions$),
				HttpService,
				provideMockStore({
					initialState: initialAppState,
				}),
				{ provide: HttpCacheManager, useValue: { has: jest.fn().mockReturnValue(false) } },
			],
		});

		effects = TestBed.inject(RequiredStandardsEffects);
		service = TestBed.inject(HttpService);
	});

	beforeEach(() => {
		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).toEqual(expected);
		});
	});

	describe('getRequiredStandards$', () => {
		it.each(testCases)('should return requiredStandardsSuccess action on successful API call', (value) => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const { requiredStandards } = value;

				// mock action to trigger effect
				actions$ = hot('-a--', { a: getRequiredStandards({ euVehicleCategory: 'm1' }) });

				// mock service call
				jest.spyOn(service, 'fetchRequiredStandards').mockReturnValue(cold('--a|', { a: requiredStandards }));

				// expect effect to return success action
				expectObservable(effects.getRequiredStandards$).toBe('---b', {
					b: getRequiredStandardsSuccess({ requiredStandards }),
				});
			});
		});

		it.each(testCases)('should return getRequiredStandardsFailed action on API error', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				actions$ = hot('-a--', { a: getRequiredStandards({ euVehicleCategory: 'm1' }) });

				const expectedError = new Error('No required standards found');

				jest.spyOn(service, 'fetchRequiredStandards').mockReturnValue(cold('--#|', {}, expectedError));

				expectObservable(effects.getRequiredStandards$).toBe('---b', {
					b: getRequiredStandardsFailure({ error: 'No required standards found' }),
				});
			});
		});
	});
});
