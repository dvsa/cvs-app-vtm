import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { selectQueryParam, selectQueryParams } from '@store/router/selectors/router.selectors';
import { firstValueFrom, take } from 'rxjs';
import { RouterService } from './router.service';

describe('RouterService', () => {
  let service: RouterService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [RouterService, provideMockStore({ initialState: initialAppState })] });
    service = TestBed.inject(RouterService);
    store = TestBed.inject(MockStore);
    store.resetSelectors();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('queryParams$', () => {
    it('should return the query params', async () => {
      const queryParams = { foo: 'bar', baz: 'qux' };
      store.overrideSelector(selectQueryParams, queryParams);
      expect(await firstValueFrom(service.queryParams$.pipe(take(1)))).toEqual(queryParams);
    });
  });

  describe(RouterService.prototype.getQueryParam$.name, () => {
    it('should return the query param', async () => {
      // overriding selectQueryParam(param) has no effect here, I think because it might use selectQueryParams internally so we override that instead
      store.overrideSelector(selectQueryParams, { bar: 'foo' });
      store.refreshState();
      expect(await firstValueFrom(service.getQueryParam$('bar').pipe(take(1)))).toEqual('foo');
    });
  });
});
