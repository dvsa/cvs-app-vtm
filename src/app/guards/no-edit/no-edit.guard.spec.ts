import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot, UrlTree,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/index';
import { routeEditable } from '@store/router/selectors/router.selectors';
import { NoEditGuard } from './no-edit.guard';

describe('NoEditGuard', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [provideMockStore({ initialState: initialAppState })],
    });

    store = TestBed.inject(MockStore);
  });

  it('should return true when not in edit mode', (done) => {
    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockRouteState = {} as RouterStateSnapshot;
    store.overrideSelector(routeEditable, false);
    store.refreshState();

    TestBed.runInInjectionContext(() => {
      NoEditGuard(mockRoute, mockRouteState).subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });
  });

  it('should reject navigation and return UrlTree without edit query param', (done) => {
    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockRouteState = {} as RouterStateSnapshot;
    mockRouteState.url = '/test-result/1/amended/1?edit=true&sanityCheck=bar';
    store.overrideSelector(routeEditable, true);
    store.refreshState();

    TestBed.runInInjectionContext(() => {
      NoEditGuard(mockRoute, mockRouteState).subscribe((tree) => {
        expect(tree instanceof UrlTree).toBeTruthy();
        expect((tree as UrlTree).queryParams['edit']).toBeUndefined();
        expect((tree as UrlTree).queryParams['sanityCheck']).toBe('bar');
        done();
      });
    });
  });
});
