import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/.';
import { selectRouteParam } from '@store/router/selectors/router.selectors';
import { getTechRecordV3Failure, getTechRecordV3Success } from '@store/technical-records';
import { fetchTestResultsBySystemNumberFailed, fetchTestResultsBySystemNumberSuccess } from '@store/test-records';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { techRecordViewResolver } from './tech-record-view.resolver';

describe('TechRecordViewResolver', () => {
  let resolver: ResolveFn<boolean>;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  const mockSnapshot = jest.fn;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: initialAppState }),
        provideMockActions(() => actions$),
        { provide: RouterStateSnapshot, useValue: mockSnapshot },
      ],
    });
    store = TestBed.inject(MockStore);
    resolver = (...resolverParameters) => TestBed.runInInjectionContext(() => techRecordViewResolver(...resolverParameters));
  });

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe('fetch tech record result', () => {
    it('should resolved to true when both success actions are triggered', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const result = TestBed.runInInjectionContext(() => resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)) as Observable<boolean>;
      store.overrideSelector(selectRouteParam('systemNumber'), undefined);
      store.overrideSelector(selectRouteParam('createdTimestamp'), undefined);
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a-b-', { a: getTechRecordV3Success, b: fetchTestResultsBySystemNumberSuccess });
        expectObservable(result).toBe('---(c|)', {
          c: true,
        });
      });

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it('should resolve to false if \'getTechRecordV3Failure\' action if dispatched', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const result = TestBed.runInInjectionContext(() => resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)) as Observable<boolean>;
      store.overrideSelector(selectRouteParam('systemNumber'), undefined);
      store.overrideSelector(selectRouteParam('createdTimestamp'), undefined);
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a-b-', { a: getTechRecordV3Failure, b: fetchTestResultsBySystemNumberSuccess });
        expectObservable(result).toBe('---(c|)', {
          c: false,
        });
      });

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it('should resolved to false if \'fetchTestResultsBySystemNumberFailed\' action is dipatched', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const result = TestBed.runInInjectionContext(() => resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)) as Observable<boolean>;
      store.overrideSelector(selectRouteParam('systemNumber'), undefined);
      store.overrideSelector(selectRouteParam('createdTimestamp'), undefined);
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a-b-', { a: getTechRecordV3Success, b: fetchTestResultsBySystemNumberFailed });
        expectObservable(result).toBe('---(c|)', {
          c: false,
        });
      });

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it('should resolved to false if \'fetchTestResultsBySystemNumberFailed\' and \'getTechRecordV3Failure\' action are dipatched', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const result = TestBed.runInInjectionContext(() => resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)) as Observable<boolean>;
      store.overrideSelector(selectRouteParam('systemNumber'), undefined);
      store.overrideSelector(selectRouteParam('createdTimestamp'), undefined);
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a-b-', { a: getTechRecordV3Failure, b: fetchTestResultsBySystemNumberFailed });
        expectObservable(result).toBe('---(c|)', {
          c: false,
        });
      });

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });
  });
});
