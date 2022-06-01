import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { fetchSelectedTestResultFailed, fetchSelectedTestResultSuccess } from '@store/test-records';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { TestResultResolver } from './test-result.resolver';

describe('TestResultResolver', () => {
  let resolver: TestResultResolver;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let route: ActivatedRoute;
  let state: RouterStateSnapshot;
  let mockSnapshot: any = jest.fn;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [TestResultResolver, provideMockStore({ initialState: initialAppState }), provideMockActions(() => actions$), { provide: RouterStateSnapshot, useValue: mockSnapshot }]
    });

    resolver = TestBed.inject(TestResultResolver);
    route = TestBed.inject(ActivatedRoute);
    state = TestBed.inject(RouterStateSnapshot);
  });

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve to true when fetchSelectedTestResultSuccess action is emitted', () => {
    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', { a: fetchSelectedTestResultSuccess });
      expectObservable(resolver.resolve(route.snapshot, state)).toBe('-(b|)', {
        b: true
      });
    });
  });

  it('should resolve to false when fetchSelectedTestResultFailed action is emitted', () => {
    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-', { a: fetchSelectedTestResultFailed });
      expectObservable(resolver.resolve(route.snapshot, state)).toBe('-(b|)', {
        b: false
      });
    });
  });
});
