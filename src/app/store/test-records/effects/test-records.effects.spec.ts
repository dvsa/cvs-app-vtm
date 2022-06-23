import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiModule as TestResultsApiModule } from '@api/test-results';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/.';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { getByVINSuccess } from '@store/technical-records';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { mockTestResult, mockTestResultList } from '../../../../mocks/mock-test-result';
import {
  fetchSelectedTestResult,
  fetchSelectedTestResultFailed,
  fetchSelectedTestResultSuccess,
  fetchTestResultsBySystemId,
  fetchTestResultsBySystemIdFailed,
  fetchTestResultsBySystemIdSuccess,
  updateTestResultFailed,
  updateTestResultState,
  updateTestResultSuccess
} from '../actions/test-records.actions';
import { TestResultsEffects } from './test-records.effects';

describe('TestResultsEffects', () => {
  let effects: TestResultsEffects;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let testResultsService: TestRecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TestResultsApiModule],
      providers: [
        TestResultsEffects,
        provideMockActions(() => actions$),
        TestRecordsService,
        provideMockStore({
          initialState: initialAppState,
          selectors: [
            {
              selector: selectRouteNestedParams,
              value: [
                {
                  systemId: 'systemId01',
                  testResultId: 'testResult01'
                }
              ]
            }
          ]
        }),
        { provide: UserService, useValue: { userName$: of('username'), id$: of('iod') } }
      ]
    });

    effects = TestBed.inject(TestResultsEffects);
    testResultsService = TestBed.inject(TestRecordsService);
  });

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('fetchTestResultsBySystemNumber$', () => {
    it('should return fetchTestResultBySystemIdSuccess action on successfull API call', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const testResults = mockTestResultList();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: fetchTestResultsBySystemId });

        // mock service call
        jest.spyOn(testResultsService, 'fetchTestResultbySystemId').mockReturnValue(cold('--a|', { a: testResults }));

        // expect effect to return success action
        expectObservable(effects.fetchTestResultsBySystemNumber$).toBe('---b', {
          b: fetchTestResultsBySystemIdSuccess({ payload: testResults })
        });
      });
    });

    it('should return fetchTestResultsBySystemIdFailed action on API error', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a--', { a: fetchTestResultsBySystemId });

        const expectedError = new HttpErrorResponse({
          status: 500,
          statusText: 'Internal server error'
        });
        jest.spyOn(testResultsService, 'fetchTestResultbySystemId').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchTestResultsBySystemNumber$).toBe('---b', {
          b: fetchTestResultsBySystemIdFailed({ error: 'Http failure response for (unknown url): 500 Internal server error' })
        });
      });
    });

    it('should return fetchTestResultsBySystemIdFailed action on API error', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a--', { a: fetchTestResultsBySystemId });

        const expectedError = new HttpErrorResponse({
          status: 404,
          statusText: 'Not found'
        });
        jest.spyOn(testResultsService, 'fetchTestResultbySystemId').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchTestResultsBySystemNumber$).toBe('---b', {
          b: fetchTestResultsBySystemIdFailed({ error: 'Http failure response for (unknown url): 404 Not found' })
        });
      });
    });
  });

  describe('fetchTestResultsBySystemNumberAfterSearchByVinSucces$', () => {
    it('should return fetchTestResultBySystemIdSuccess action', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const testResults = mockTestResultList();
        const vehicleTechRecords = [{ systemNumber: 'systemSumber' }] as VehicleTechRecordModel[];
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByVINSuccess({ vehicleTechRecords }) });

        // mock service call
        jest.spyOn(testResultsService, 'fetchTestResultbySystemId').mockReturnValue(cold('--a|', { a: testResults }));

        // expect effect to return success action
        expectObservable(effects.fetchTestResultsBySystemNumberAfterSearchByVinSucces$).toBe('---b', {
          b: fetchTestResultsBySystemIdSuccess({ payload: testResults })
        });
      });
    });

    it('should return fetchTestResultsBySystemIdFailed', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const vehicleTechRecords = [{ systemNumber: 'systemSumber' }] as VehicleTechRecordModel[];
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByVINSuccess({ vehicleTechRecords }) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 500,
          statusText: 'Internal server error'
        });
        jest.spyOn(testResultsService, 'fetchTestResultbySystemId').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchTestResultsBySystemNumberAfterSearchByVinSucces$).toBe('---b', {
          b: fetchTestResultsBySystemIdFailed({ error: 'Http failure response for (unknown url): 500 Internal server error' })
        });
      });
    });

    it('should not return fetchTestResultsBySystemIdFailed when not found a test record', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const vehicleTechRecords = [{ systemNumber: 'systemSumber' }] as VehicleTechRecordModel[];
        // mock action to trigger effect
        actions$ = hot('-a--', { a: getByVINSuccess({ vehicleTechRecords }) });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 404,
          statusText: 'Not found'
        });
        jest.spyOn(testResultsService, 'fetchTestResultbySystemId').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchTestResultsBySystemNumberAfterSearchByVinSucces$).toBe('---b', {
          b: fetchTestResultsBySystemIdSuccess({ payload: [] })
        });
      });
    });
  });

  describe('fetchSelectedTestResult$', () => {
    it('should return fetchSelectedTestResultSuccess', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const testResult = mockTestResult();

        actions$ = hot('-a-', { a: fetchSelectedTestResult() });

        jest.spyOn(testResultsService, 'fetchTestResultbySystemId').mockReturnValue(cold('--a|', { a: [testResult] }));

        expectObservable(effects.fetchSelectedTestResult$).toBe('---b', {
          b: fetchSelectedTestResultSuccess({ payload: testResult })
        });
      });
    });

    it('should return fetchSelectedTestResultFailed if API returns empty array', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a-', { a: fetchSelectedTestResult() });

        jest.spyOn(testResultsService, 'fetchTestResultbySystemId').mockReturnValue(cold('--a|', { a: [] }));

        expectObservable(effects.fetchSelectedTestResult$).toBe('---b', {
          b: fetchSelectedTestResultFailed({ error: 'Test result not found' })
        });
      });
    });

    it('should return fetchSelectedTestResultFailed if API returns an error', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a-', { a: fetchSelectedTestResult() });

        // mock service call
        const expectedError = new HttpErrorResponse({
          status: 400,
          statusText: 'Bad Request'
        });
        jest.spyOn(testResultsService, 'fetchTestResultbySystemId').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.fetchSelectedTestResult$).toBe('---b', {
          b: fetchSelectedTestResultFailed({ error: 'Http failure response for (unknown url): 400 Bad Request' })
        });
      });
    });
  });

  describe('updateTestResult$', () => {
    describe('debounce', () => {
      it('should only call API once and return updateTestResultSuccess', () => {
        testScheduler.run(({ hot, cold, expectObservable }) => {
          const action = updateTestResultState({ section: '', testResultId: '', testTypeId: '', value: '' });
          actions$ = hot('a 100ms b', { a: action, b: action });

          jest.spyOn(testResultsService, 'saveTestResult').mockReturnValue(cold('a|', {}));

          expectObservable(effects.updateTestResult$).toBe('601ms b', {
            b: updateTestResultSuccess()
          });
        });
      });

      it('should call API twice and dispatch updateTestResultSuccess both times', () => {
        testScheduler.run(({ hot, cold, expectObservable }) => {
          const action = updateTestResultState({ section: '', testResultId: '', testTypeId: '', value: '' });
          actions$ = hot('a 500ms b', { a: action, b: action });

          jest.spyOn(testResultsService, 'saveTestResult').mockReturnValue(cold('a|', {}));

          expectObservable(effects.updateTestResult$).toBe('500ms b 500ms c', {
            b: updateTestResultSuccess(),
            c: updateTestResultSuccess()
          });
        });
      });

      it('should call API twice and dispatch success and failure actions', () => {
        testScheduler.run(({ hot, cold, expectObservable }) => {
          const action = updateTestResultState({ section: '', testResultId: '', testTypeId: '', value: '' });
          actions$ = hot('a 500ms b', { a: action, b: action });

          jest
            .spyOn(testResultsService, 'saveTestResult')
            .mockReturnValueOnce(cold('a|', {}))
            .mockReturnValueOnce(cold('#|', {}, new HttpErrorResponse({ status: 500, error: 'some error' })));

          expectObservable(effects.updateTestResult$).toBe('500ms b 500ms c', {
            b: updateTestResultSuccess(),
            c: updateTestResultFailed({ errors: [] })
          });
        });
      });
    });

    it('should dispatch updateTestResultFailed action with empty errors array', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a-', { a: updateTestResultState({ section: '', testResultId: '', testTypeId: '', value: '' }) });

        jest
          .spyOn(testResultsService, 'saveTestResult')
          .mockReturnValue(cold('---#|', {}, new HttpErrorResponse({ status: 500, error: 'some error' })));

        expectObservable(effects.updateTestResult$).toBe('504ms b', {
          b: updateTestResultFailed({ errors: [] })
        });
      });
    });

    it('should dispatch updateTestResultFailed action with validation errors', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a-', { a: updateTestResultState({ section: '', testResultId: '', testTypeId: '', value: '' }) });

        jest
          .spyOn(testResultsService, 'saveTestResult')
          .mockReturnValue(
            cold('---#|', {}, new HttpErrorResponse({ status: 400, error: { errors: ['"name" is missing', '"age" is missing', 'random error'] } }))
          );

        const expectedErrors: GlobalError[] = [
          { error: '"name" is missing', anchorLink: 'name' },
          { error: '"age" is missing', anchorLink: 'age' },
          { error: 'random error', anchorLink: '' }
        ];
        expectObservable(effects.updateTestResult$).toBe('504ms b', {
          b: updateTestResultFailed({ errors: expectedErrors })
        });
      });
    });
  });
});
