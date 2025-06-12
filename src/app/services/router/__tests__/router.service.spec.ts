import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { selectQueryParams, selectRouteNestedParams, selectRouteParams } from '@store/router/router.selectors';
import { firstValueFrom, of, take } from 'rxjs';
import { RouterService } from '../router.service';

describe('RouterService', () => {
	let service: RouterService;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [RouterService, provideMockStore({ initialState: initialAppState })],
		});
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

	describe('RouterService.prototype.getQueryParam$.name', () => {
		it('should return the query param', async () => {
			// overriding selectQueryParam(param) has no effect here, I think because it might use selectQueryParams internally so we override that instead
			store.overrideSelector(selectQueryParams, { bar: 'foo' });
			store.refreshState();
			expect(await firstValueFrom(service.getQueryParam$('bar').pipe(take(1)))).toBe('foo');
		});
	});

	describe('RouterService.prototype.getRouteParam$.name', () => {
		it('should return an Observable of the given route param', async () => {
			store.overrideSelector(selectRouteParams, { bar: 'baz' });
			store.refreshState();
			expect(await firstValueFrom(service.getRouteParam$('bar').pipe(take(1)))).toBe('baz');
		});
	});

	describe('get routeNestedParams$', () => {
		it('should return an Observable route Params', (done) => {
			store.overrideSelector(selectRouteNestedParams, { foo: 'bar' });
			store.refreshState();
			service.routeNestedParams$.subscribe((value) => {
				expect(value).toEqual({ foo: 'bar' });
				done();
			});
		});
	});

	describe('getRouteNestedParam', () => {
		it('should return the correct value', (done) => {
			service.routeNestedParams$ = of({ foo: 'bar' });
			service.getRouteNestedParam$('foo').subscribe((value) => {
				expect(value).toBe('bar');
				done();
			});
		});
	});
});
