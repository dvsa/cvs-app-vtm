import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TestTypesTaxonomy } from '@api/test-types';
import { TestTypesService } from '@services/test-types/test-types.service';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { TestTypeEffects } from './test-types.effects';
import { ApiModule as TestTypesApiModule } from '@api/test-types/api.module';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { RouterService } from '@services/router/router.service';
import { TestTypes } from '@api/test-results';
import { fetchTestTypes, fetchTestTypesFailed, fetchTestTypesSuccess } from '../actions/test-types.actions';
import { HttpErrorResponse, HttpEvent } from '@angular/common/http';

describe('TestResultsEffects', () => {
  let effects: TestTypeEffects;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let testTypesService: TestTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TestTypesApiModule],
      providers: [
        TestTypeEffects,
        provideMockActions(() => actions$),
        TestTypesService,
        provideMockStore({
          initialState: initialAppState
        }),
        // { provide: UserService, useValue: { userName$: of('username'), id$: of('iod') } },
        RouterService
      ]
    });

    effects = TestBed.inject(TestTypeEffects);
    testTypesService = TestBed.inject(TestTypesService);
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

        // type FetchTestTypesWatchBody = () => Observable<TestTypesTaxonomy>;
        // mock service call
        (testTypesService.getTestTypes as () => Observable<TestTypesTaxonomy>) = jest.fn((): Observable<TestTypesTaxonomy> => {
          return cold('--a|', { a: testTypes });
        });
        //jest.spyOn(testTypesService, 'getTestTypes').mockReturnValue(cold('--a|', { a: testTypes }));

        // expect effect to return success action
        expectObservable(effects.fetchTestTypeTaxonomy$).toBe('---b', {
          b: fetchTestTypesSuccess({ payload: testTypes })
        });
      });
    });

    it('should return fetchTestTypesFailed action on successfull API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a--', { a: fetchTestTypes });

        const expectedError = new HttpErrorResponse({
          status: 500,
          statusText: 'Internal server error'
        });

        // mock service call
        (testTypesService.getTestTypes as () => Observable<any>) = jest.fn((): Observable<HttpErrorResponse> => {
          return cold('--#|', {}, expectedError);
        });

        // expect effect to return success action
        expectObservable(effects.fetchTestTypeTaxonomy$).toBe('---b', {
          b: fetchTestTypesFailed({ error: expectedError.message })
        });
      });
    });
  });
});
