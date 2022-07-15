import { TestBed } from '@angular/core/testing';
import { RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { fetchSelectedTestResult, fetchSelectedTestResultFailed, fetchSelectedTestResultSuccess, selectedTestResultState } from '@store/test-records';
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
    it(`should dispatch 'fetchSelectedTestResult' action and resolve to true when 'fetchSelectedTestResultSuccess' action is emitted`, () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      store.overrideSelector(selectedTestResultState, undefined);
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a-', { a: fetchSelectedTestResultSuccess });
        expectObservable(resolver.resolve()).toBe('-(b|)', {
          b: true
        });
      });

      expect(dispatchSpy).toHaveBeenCalledWith(fetchSelectedTestResult());
    });

    it(`should dispatch 'fetchSelectedTestResult' action and resolve to false when 'fetchSelectedTestResultFailed' action is emitted`, () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      store.overrideSelector(selectedTestResultState, undefined);
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a-', { a: fetchSelectedTestResultFailed });
        expectObservable(resolver.resolve()).toBe('-(b|)', {
          b: false
        });
      });

      expect(dispatchSpy).toHaveBeenCalledWith(fetchSelectedTestResult());
    });
  });
});
