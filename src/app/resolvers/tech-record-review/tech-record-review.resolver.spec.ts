import { TestBed } from '@angular/core/testing';

import { ResolveFn, RouterStateSnapshot } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/.';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { TechRecordReviewResolver } from './tech-record-review.resolver';
describe('TechRecordViewResolver', () => {
  let resolver: ResolveFn<boolean>;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  const mockSnapshot: any = jest.fn;
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
    resolver = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => TechRecordReviewResolver(...resolverParameters));
  });

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

});
