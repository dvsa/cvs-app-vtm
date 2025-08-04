import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Breadcrumbs2Component } from '@core/components/breadcrumbs-2/breadcrumbs-2.component';
import { RouterReducerState } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { State, initialAppState } from '@store/index';
import { routerState } from '@store/router/router.selectors';
import { firstValueFrom } from 'rxjs';

describe('Breadcrumbs2Component', () => {
	let component: Breadcrumbs2Component;
	let fixture: ComponentFixture<Breadcrumbs2Component>;
	let store: MockStore<State>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Breadcrumbs2Component],
			providers: [RouterService, provideRouter([]), provideMockStore({ initialState: initialAppState })],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(Breadcrumbs2Component);
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

	it('should set showBackButton to true if the title is Create new technical record', async () => {
		const routeState: RouterReducerState = {
			state: { root: { firstChild: { data: { title: 'Create new technical record' }, url: [{ path: 'path1' }] } } },
		} as unknown as RouterReducerState;
		store.overrideSelector(routerState, routeState);
		await firstValueFrom(component.breadcrumbs$);
		expect(component.showBackButton).toEqual(true);
	});
});
