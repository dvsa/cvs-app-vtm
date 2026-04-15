import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '@store/index';
import { routeEditable } from '@store/router/router.selectors';
import { NoEditGuard } from '../no-edit.guard';

describe('NoEditGuard', () => {
	let guard: NoEditGuard;
	let store: MockStore<State>;
	let mockRouteEditable: MemoizedSelector<Record<string, unknown>, boolean, DefaultProjectorFn<boolean>>;
	let route: ActivatedRoute;
	let mockRouterStateSnapshot: RouterStateSnapshot;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				NoEditGuard,
				provideMockStore({}),
				{ provide: RouterStateSnapshot, useValue: vi.fn().mockReturnValue({ url: '', toString: vi.fn() }) },
			],
		});

		guard = TestBed.inject(NoEditGuard);
		store = TestBed.inject(MockStore);
		route = TestBed.inject(ActivatedRoute);
		mockRouterStateSnapshot = TestBed.inject(RouterStateSnapshot);
		mockRouteEditable = store.overrideSelector(routeEditable, false);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});

	describe('canActivate', () => {
		it('should return true when not in edit mode', () => new Promise<void>((done) => {
			guard.canActivate(route.snapshot, mockRouterStateSnapshot).subscribe((result) => {
				expect(result).toBeTruthy();
				done();
			});
		}));

		it('should reject navigation and return UrlTree without edit query param', () => new Promise<void>((done) => {
			mockRouteEditable.setResult(true);
			store.refreshState();

			mockRouterStateSnapshot.url = '/test-result/1/amended/1?edit=true&sanityCheck=bar';

			guard.canActivate(route.snapshot, mockRouterStateSnapshot).subscribe((tree) => {
				expect(tree instanceof UrlTree).toBeTruthy();
				expect((tree as UrlTree).queryParams['edit']).toBeUndefined();
				expect((tree as UrlTree).queryParams['sanityCheck']).toBe('bar');
				done();
			});
		}));
	});
});
