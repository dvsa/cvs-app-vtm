import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { selectRouteData } from '@store/router/router.selectors';
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

	it('should set title using Title service', async () => {
		const titleServiceSpy = vi.spyOn(titleService, 'setTitle');
		store.overrideSelector(selectRouteData, { title: 'Test Results' });
		const resolved = (await TestBed.runInInjectionContext(() =>
			resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
		)) as Promise<boolean>;
		expect(resolved).toBe(true);
		expect(titleServiceSpy).toHaveBeenCalledWith('Test Results - Vehicle Testing Management');
	});
});
