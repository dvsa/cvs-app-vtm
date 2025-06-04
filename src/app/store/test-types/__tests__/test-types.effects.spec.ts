import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TestTypesTaxonomy } from '@models/test-types/testTypesTaxonomy';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpService } from '@services/http/http.service';
import { RouterService } from '@services/router/router.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/index';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { fetchTestTypes, fetchTestTypesFailed, fetchTestTypesSuccess } from '../test-types.actions';
import { TestTypeEffects } from '../test-types.effects';

describe('TestResultsEffects', () => {
	let effects: TestTypeEffects;
	let actions$ = new Observable<Action>();
	let testScheduler: TestScheduler;
	let httpService: HttpService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				TestTypeEffects,
				provideMockActions(() => actions$),
				HttpService,
				provideMockStore({
					initialState: initialAppState,
				}),
				RouterService,
				{
					provide: UserService,
					useValue: { roles$: of(['TestResult.CreateDeskBased']) },
				},
			],
		});

		effects = TestBed.inject(TestTypeEffects);
		httpService = TestBed.inject(HttpService);
	});

	beforeEach(() => {
		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).toEqual(expected);
		});
	});

	describe('fetchTestTypeTaxonomy$', () => {
		it('should return fetchTestTypesSuccess action on successfull API call', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				const testTypes = {} as TestTypesTaxonomy;

				// mock action to trigger effect
				actions$ = hot('-a--', { a: fetchTestTypes });

				// mock service call
				(httpService.getTestTypes as () => Observable<TestTypesTaxonomy>) = jest.fn(
					(): Observable<TestTypesTaxonomy> => {
						return cold('--a|', { a: testTypes });
					}
				);

				// expect effect to return success action
				expectObservable(effects.fetchTestTypeTaxonomy$).toBe('---b', {
					b: fetchTestTypesSuccess({ payload: testTypes }),
				});
			});
		});

		it('should return fetchTestTypesFailed action on successful API call', () => {
			testScheduler.run(({ hot, cold, expectObservable }) => {
				actions$ = hot('-a--', { a: fetchTestTypes });

				const expectedError = new HttpErrorResponse({
					status: 500,
					statusText: 'Internal server error',
				});

				// mock service call
				(httpService.getTestTypes as () => Observable<unknown>) = jest.fn((): Observable<HttpErrorResponse> => {
					return cold('--#|', {}, expectedError);
				});

				// expect effect to return success action
				expectObservable(effects.fetchTestTypeTaxonomy$).toBe('---b', {
					b: fetchTestTypesFailed({ error: expectedError.message }),
				});
			});
		});
	});
});
