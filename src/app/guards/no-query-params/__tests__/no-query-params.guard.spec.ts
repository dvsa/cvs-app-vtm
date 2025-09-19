import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '@store/index';

import { Navigation, NavigationExtras, Params, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { selectQueryParams } from '@store/router/router.selectors';
import { NoQueryParamsGuard } from '../no-query-params.guard';

describe('NoQueryParamsGuard', () => {
	let guard: NoQueryParamsGuard;
	let store: MockStore<State>;
	let router: Router;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				NoQueryParamsGuard,
				provideMockStore({}),
				{ provide: RouterStateSnapshot, useValue: jest.fn().mockReturnValue({ url: '' }) },
			],
		});
		guard = TestBed.inject(NoQueryParamsGuard);
		store = TestBed.inject(MockStore);
		store.overrideSelector(selectQueryParams, {});
		router = TestBed.inject(Router);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});

	describe('No query params guard', () => {
		it('should return true if there are query params', (done) => {
			store.overrideSelector(selectQueryParams, { foo: 'bar' } as Params);
			guard.canActivate().subscribe((result) => {
				expect(result).toBe(true);
				done();
			});
		});

		it('should return an empty url when the previous navigation is undefined', (done) => {
			const mockNavigation: Navigation = {
				abort(): void {},
				id: 1,
				initialUrl: '/some/path' as unknown as UrlTree,
				extractedUrl: {} as UrlTree,
				trigger: 'hashchange',
				extras: {} as NavigationExtras,
				previousNavigation: {} as Navigation,
			};
			router.getCurrentNavigation = jest.fn().mockReturnValue(mockNavigation);
			guard.canActivate().subscribe((tree) => {
				expect(tree instanceof UrlTree).toBeTruthy();
				expect((tree as UrlTree).toString()).toBe('/');
				done();
			});
		});

		it('should return the previous Url if the previous navigation is defined', (done) => {
			const mockNavigation: Navigation = {
				abort(): void {},
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
			router.getCurrentNavigation = jest.fn().mockReturnValue(previousNavigation);
			guard.canActivate().subscribe((url_tree) => {
				expect(url_tree instanceof UrlTree).toBeTruthy();
				expect(previousNavigation.previousNavigation?.finalUrl?.toString()).toBeTruthy();
				expect(url_tree.toString()).toEqual(previousNavigation.previousNavigation?.finalUrl?.toString());
				done();
			});
		});
	});
});
