import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { initialAppState } from '@store/.';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { getByVINSuccess } from '@store/technical-records';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { mockTestResult, mockTestResultList } from '../../../../mocks/mock-test-result';
import { fetchSelectedTestResult, fetchSelectedTestResultFailed, fetchSelectedTestResultSuccess, fetchTestResultsBySystemId, fetchTestResultsBySystemIdFailed, fetchTestResultsBySystemIdSuccess } from '../actions/test-records.actions';
import { TestResultsEffects } from './test-records.effects';

describe('TestResultsEffects', () => {
  let effects: TestResultsEffects;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let testResultsService: TestRecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
        })
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

        expectObservable(effects.fetchTestResultsBySystemNumber$).toBe('---b', { b: fetchTestResultsBySystemIdFailed({ error: 'Http failure response for (unknown url): 500 Internal server error' }) });
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

        expectObservable(effects.fetchTestResultsBySystemNumber$).toBe('---b', { b: fetchTestResultsBySystemIdFailed({ error: 'Http failure response for (unknown url): 404 Not found' }) });
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

        expectObservable(effects.fetchTestResultsBySystemNumberAfterSearchByVinSucces$).toBe('---b', { b: fetchTestResultsBySystemIdFailed({ error: 'Http failure response for (unknown url): 500 Internal server error' }) });
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
});
