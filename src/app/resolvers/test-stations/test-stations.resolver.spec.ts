import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { fetchTestStations, fetchTestStationsFailed, fetchTestStationsSuccess } from '@store/test-stations';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { TestStationsResolver } from './test-stations.resolver';

describe('TestTypeTaxonomyResolver', () => {
  let resolver: TestStationsResolver;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: initialAppState }), provideMockActions(() => actions$)]
    });
    resolver = TestBed.inject(TestStationsResolver);
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

  describe('fetch test stations', () => {
    it(`should resolve to true when all actions are success type`, () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a', { a: fetchTestStationsSuccess });
        expectObservable(resolver.resolve()).toBe('-(b|)', {
          b: true
        });
      });

      expect(dispatchSpy).toHaveBeenCalledWith(fetchTestStations());
    });

    it(`should resolve to false when one or more actions are of failure type`, () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a', { a: fetchTestStationsFailed });
        expectObservable(resolver.resolve()).toBe('-(b|)', {
          b: false
        });
      });

      expect(dispatchSpy).toHaveBeenCalledWith(fetchTestStations());
    });
  });
});
