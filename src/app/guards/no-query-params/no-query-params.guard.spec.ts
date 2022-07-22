import { TestBed } from '@angular/core/testing';
import { State } from '@store/.';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { NoQueryParamsGuard } from './no-query-params.guard';
import { ActivatedRoute, Navigation, NavigationExtras, Params, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { selectQueryParams } from '@store/router/selectors/router.selectors';

describe('NoQueryParamsGuard', () => {
  let guard: NoQueryParamsGuard;
  let store: MockStore<State>;
  let route: ActivatedRoute;
  let mockRouterStateSnapshot: RouterStateSnapshot;
  let mockUrl: Params;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [NoQueryParamsGuard, provideMockStore({}), { provide: RouterStateSnapshot, useValue: jest.fn().mockReturnValue({ url: '' }) }]
    });
    guard = TestBed.inject(NoQueryParamsGuard);
    store = TestBed.inject(MockStore);
    mockRouterStateSnapshot = TestBed.inject(RouterStateSnapshot);
    mockUrl = store.overrideSelector(selectQueryParams, {});
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('No query params guard', () => {
    it('should return true if there are query params', done => {
      mockUrl = store.overrideSelector(selectQueryParams, { foo: 'bar' } as Params);
      guard.canActivate().subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should return an empty url when the previous navigation is undefined', done => {
      const mockNavigation: Navigation = {
        id: 1,
        initialUrl: '/some/path',
        extractedUrl: {} as UrlTree,
        trigger: 'hashchange',
        extras: {} as NavigationExtras,
        previousNavigation: {} as Navigation
      };
      router.getCurrentNavigation = jest.fn().mockReturnValue(mockNavigation);
      guard.canActivate().subscribe(tree => {
        expect(tree instanceof UrlTree).toBeTruthy();
        expect((tree as UrlTree).toString()).toEqual('/');
        done();
      });
    });

    it('should return the previous Url if the previous navigation is defined', done => {
      const mockNavigation: Navigation = {
        id: 1,
        initialUrl: '/some/path',
        extractedUrl: {} as UrlTree,
        trigger: 'hashchange',
        extras: {} as NavigationExtras,
        previousNavigation: {} as Navigation
      };

      const tree = router.parseUrl('/path');

      const previousNavigation: Navigation = {
        ...mockNavigation,
        previousNavigation: {
          ...mockNavigation,
          finalUrl: tree
        }
      };
      router.getCurrentNavigation = jest.fn().mockReturnValue(previousNavigation);
      guard.canActivate().subscribe(tree => {
        expect(tree instanceof UrlTree).toBeTruthy();
        expect(previousNavigation.previousNavigation?.finalUrl?.toString).toBeTruthy();
        expect(tree.toString()).toEqual(previousNavigation.previousNavigation?.finalUrl?.toString());
        done();
      });
    });
  });
});
