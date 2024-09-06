import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { titleResolver } from '../title.resolver';

describe('TitleResolver', () => {
	let resolver: ResolveFn<boolean>;
	let titleService: Title;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [Title, provideMockStore({ initialState: initialAppState })],
		});

		resolver = (...resolverParameters) => TestBed.runInInjectionContext(() => titleResolver(...resolverParameters));
		titleService = TestBed.inject(Title);
		store = TestBed.inject(MockStore);
	});

	it('should be created', () => {
		expect(resolver).toBeTruthy();
	});

	it('should set title using Title service', () => {
		const titleServiceSpy = jest.spyOn(titleService, 'setTitle');
		const result = TestBed.runInInjectionContext(() =>
			resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
		) as Promise<boolean>;
		store.setState({
			...initialAppState,
			router: {
				state: {
					root: {
						params: {
							systemNumber: 'SYS0001',
						},
						data: {
							title: 'Test Results',
						},
						url: [
							{
								path: 'SYS0001',
								parameters: {},
							},
						],
						outlet: 'primary',
						routeConfig: {
							path: ':systemNumber',
						},
						queryParams: {},
						fragment: null,
						children: [],
					},
				},
				navigationId: 1,
			},
		});
		const resolved = result;
		expect(resolved).toBeTruthy();
		expect(titleServiceSpy).toHaveBeenCalledWith('Vehicle Testing Management - Test Results');
	});
});
