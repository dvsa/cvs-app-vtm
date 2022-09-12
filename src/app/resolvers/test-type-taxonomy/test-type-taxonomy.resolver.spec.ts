import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { fetchTestTypes, fetchTestTypesFailed, fetchTestTypesSuccess } from '@store/test-types/actions/test-types.actions';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { TestTypeTaxonomyResolver } from './test-type-taxonomy.resolver';

describe('TestTypeTaxonomyResolver', () => {
  let resolver: TestTypeTaxonomyResolver;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: initialAppState }), provideMockActions(() => actions$)]
    });
    resolver = TestBed.inject(TestTypeTaxonomyResolver);
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
    it(`should resolve to true when all actions are success type`, () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a', { a: fetchTestTypesSuccess });
        expectObservable(resolver.resolve()).toBe('-(b|)', {
          b: true
        });
      });

      expect(dispatchSpy).toHaveBeenCalledWith(fetchTestTypes());
    });

    it(`should resolve to false when one or more actions are of failure type`, () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      testScheduler.run(({ hot, expectObservable }) => {
        actions$ = hot('-a', { a: fetchTestTypesFailed });
        expectObservable(resolver.resolve()).toBe('-(b|)', {
          b: false
        });
      });

      expect(dispatchSpy).toHaveBeenCalledWith(fetchTestTypes());
    });
  });
});
