import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { State, initialAppState } from '@store/index';
import { routerState } from '@store/router/router.selectors';
import { firstValueFrom } from 'rxjs';
import { BreadcrumbsComponent } from '../breadcrumbs.component';

describe('BreadcrumbsComponent', () => {
	let component: BreadcrumbsComponent;
	let fixture: ComponentFixture<BreadcrumbsComponent>;
	let store: MockStore<State>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BreadcrumbsComponent],
			providers: [RouterService, provideRouter([]), provideMockStore({ initialState: initialAppState })],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BreadcrumbsComponent);
		component = fixture.componentInstance;
		store = TestBed.inject(MockStore);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it.each([
		[
			[],
			{
				state: { root: { firstChild: { data: { title: 'Path1' }, url: [{ path: 'path1' }] } } },
			} as unknown as RouterReducerState,
		],

		[
			[{ label: 'Path1', path: '', preserveQueryParams: false }],
			{
				state: { root: { firstChild: { data: { title: 'Path1' }, routeConfig: { path: 'path1' }, url: [] } } },
			} as unknown as RouterReducerState,
		],

		[
			[{ label: 'Path1', path: 'path1', preserveQueryParams: false }],
			{
				state: {
					root: { firstChild: { data: { title: 'Path1' }, routeConfig: { path: 'path1' }, url: [{ path: 'path1' }] } },
				},
			} as unknown as RouterReducerState,
		],

		[
			[
				{ label: 'Path1', path: 'path1', preserveQueryParams: false },
				{ label: 'Path2', path: 'path1/path2', preserveQueryParams: false },
			],
			{
				state: {
					root: {
						firstChild: {
							data: { title: 'Path1' },
							routeConfig: { path: 'path1' },
							url: [{ path: 'path1' }],
							firstChild: { data: { title: 'Path2' }, routeConfig: { path: 'path2' }, url: [{ path: 'path2' }] },
						},
					},
				},
			} as unknown as RouterReducerState,
		],
		[
			[
				{ label: 'Path1', path: 'path1', preserveQueryParams: false },
				{ label: 'Path2', path: 'path1/path2', preserveQueryParams: true },
			],
			{
				navigationId: 'foo',
				state: {
					root: {
						firstChild: {
							data: { title: 'Path1' },
							routeConfig: { path: 'path1' },
							url: [{ path: 'path1' }],
							firstChild: {
								data: { title: 'Path2', breadcrumbPreserveQueryParams: true },
								routeConfig: { path: 'path2' },
								url: [{ path: 'path2' }],
							},
						},
					},
				},
			} as unknown as RouterReducerState,
		],
	])(
		'should return %o when router state is %o',
		async (
			expected: { label: string; path: string; preserveQueryParams: boolean }[],
			routeState: RouterReducerState
		) => {
			store.overrideSelector(routerState, routeState);
			expect(await firstValueFrom(component.breadcrumbs$)).toEqual(expected);
		}
	);
});
