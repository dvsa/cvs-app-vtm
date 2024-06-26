import { TestBed } from '@angular/core/testing';
import {
  Navigation,
  NavigationExtras,
  Params, Router, UrlTree,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { selectQueryParams } from '@store/router/selectors/router.selectors';
import { NoQueryParamsGuard } from './no-query-params.guard';

describe('NoQueryParamsGuard', () => {
  let store: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RouterTestingModule,
        provideMockStore({ initialState: initialAppState }),
      ],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should return true if there are query params', (done) => {
    store.overrideSelector(selectQueryParams, { foo: 'bar' } as Params);

    TestBed.runInInjectionContext(() => {
      NoQueryParamsGuard().subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });
  });

  it('should return an empty url when the previous navigation is undefined', (done) => {
    store.overrideSelector(selectQueryParams, {});

    const mockNavigation: Navigation = {
      id: 1,
      initialUrl: '/some/path' as unknown as UrlTree,
      extractedUrl: {} as UrlTree,
      trigger: 'hashchange',
      extras: {},
      previousNavigation: {} as Navigation,
    };

    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue(mockNavigation);

    TestBed.runInInjectionContext(() => {
      NoQueryParamsGuard().subscribe((tree) => {
        expect(tree instanceof UrlTree).toBeTruthy();
        expect((tree as UrlTree).toString()).toBe('/');
        done();
      });
    });
  });

  it('should return the previous Url if the previous navigation is defined', (done) => {
    store.overrideSelector(selectQueryParams, {});

    const mockNavigation: Navigation = {
      id: 1,
      initialUrl: '/some/path' as unknown as UrlTree,
      extractedUrl: {} as UrlTree,
      trigger: 'hashchange',
      extras: {} as NavigationExtras,
      previousNavigation: {} as Navigation,
    };

    const tree = router.parseUrl('/path');

    const previousNavigation: Navigation = {
      ...mockNavigation,
      previousNavigation: {
        ...mockNavigation,
        finalUrl: tree,
      },
    };

    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue(previousNavigation);

    TestBed.runInInjectionContext(() => {
      NoQueryParamsGuard().subscribe((urlTree) => {
        expect(urlTree instanceof UrlTree).toBeTruthy();
        expect(previousNavigation.previousNavigation?.finalUrl?.toString()).toBeTruthy();
        expect(urlTree.toString()).toEqual(previousNavigation.previousNavigation?.finalUrl?.toString());
        done();
      });
    });
  });
});
