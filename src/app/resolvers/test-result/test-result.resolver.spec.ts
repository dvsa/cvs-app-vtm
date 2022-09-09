import { TestBed } from '@angular/core/testing';
import { RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { fetchDefectsFailed, fetchDefectsSuccess } from '@store/defects';
import { fetchSelectedTestResult, fetchSelectedTestResultFailed, fetchSelectedTestResultSuccess, selectedTestResultState } from '@store/test-records';
import { fetchTestTypesSuccess } from '@store/test-types/actions/test-types.actions';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { TestResultResolver } from './test-result.resolver';

describe('TestResultResolver', () => {
  let resolver: TestResultResolver;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let mockSnapshot: any = jest.fn;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        TestResultResolver,
        provideMockStore({ initialState: initialAppState }),
        provideMockActions(() => actions$),
        { provide: RouterStateSnapshot, useValue: mockSnapshot }
      ]
    });
    resolver = TestBed.inject(TestResultResolver);
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe('fetch test result', () => {
    it(`should resolve to true when all actions are success type`, () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      store.overrideSelector(selectedTestResultState, undefined);
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a-b-c', { a: fetchSelectedTestResultSuccess, b: fetchTestTypesSuccess, c: fetchDefectsSuccess });
        expectObservable(resolver.resolve()).toBe('-----(c|)', {
          c: true
        });
      });

      expect(dispatchSpy).toHaveBeenCalledWith(fetchSelectedTestResult());
    });

    it(`should resolve to false when one or more actions are of failure type`, () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      store.overrideSelector(selectedTestResultState, undefined);
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a-b-c', { a: fetchSelectedTestResultFailed, b: fetchTestTypesSuccess, c: fetchDefectsFailed });
        expectObservable(resolver.resolve()).toBe('-----(b|)', {
          b: false
        });
      });

      expect(dispatchSpy).toHaveBeenCalledWith(fetchSelectedTestResult());
    });
  });
});
