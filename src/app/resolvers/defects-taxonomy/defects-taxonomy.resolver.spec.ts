import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { fetchDefects, fetchDefectsFailed, fetchDefectsSuccess } from '@store/defects';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { DefectsTaxonomyResolver } from './defects-taxonomy.resolver';

describe('DefectsTaxonomyResolver', () => {
  let resolver: DefectsTaxonomyResolver;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: initialAppState }), provideMockActions(() => actions$)],
    });
    resolver = TestBed.inject(DefectsTaxonomyResolver);
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

  describe('fetch test types', () => {
    it('should resolve to true when all actions are success type', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a', { a: fetchDefectsSuccess });
        expectObservable(resolver.resolve()).toBe('-(b|)', {
          b: true,
        });
      });

      expect(dispatchSpy).toHaveBeenCalledWith(fetchDefects());
    });

    it('should resolve to false when one or more actions are of failure type', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a', { a: fetchDefectsFailed });
        expectObservable(resolver.resolve()).toBe('-(b|)', {
          b: false,
        });
      });

      expect(dispatchSpy).toHaveBeenCalledWith(fetchDefects());
    });
  });
});
