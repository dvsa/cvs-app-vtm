import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TestResultsService } from '@services/test-results/test-results.service';
import { initialAppState } from '@store/.';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { mockTestResult } from '../../../../mocks/mock-test-result';
import { fetchTestResultBySystemId, fetchTestResultBySystemIdSuccess } from '../actions/test-results.actions';
import { TestResultsEffects } from './test-results.effects';

describe('TestResultsEffects', () => {
  let effects: TestResultsEffects;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let testResultsService: TestResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestResultsEffects, provideMockActions(() => actions$), TestResultsService, provideMockStore({ initialState: initialAppState })]
    });

    effects = TestBed.inject(TestResultsEffects);
    testResultsService = TestBed.inject(TestResultsService);
  });

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('fetchTestResultBySystemId$', () => {
    it('should return fetchTestResultBySystemIdSuccess action', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const testResult = mockTestResult();

        // mock action to trigger effect
        actions$ = hot('-a--', { a: fetchTestResultBySystemId });

        // mock service call
        jest.spyOn(testResultsService, 'fetchTestResultbyServiceId').mockReturnValue(cold('--a|', { a: testResult }));

        // expect effect to return success action
        expectObservable(effects.fetchTestResultBySystemId$).toBe('---b', {
          b: fetchTestResultBySystemIdSuccess({ payload: testResult })
        });
      });
    });
  });
});
