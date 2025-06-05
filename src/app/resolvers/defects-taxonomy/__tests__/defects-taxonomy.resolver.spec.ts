import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { fetchDefects } from '@store/defects';
import { State, initialAppState } from '@store/index';
import { defectsTaxonomyResolver } from '../defects-taxonomy.resolver';

describe('DefectsTaxonomyResolver', () => {
	let resolver: ResolveFn<void>;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState })],
		});
		resolver = (...resolverParameters) =>
			TestBed.runInInjectionContext(() => defectsTaxonomyResolver(...resolverParameters));
		store = TestBed.inject(MockStore);
	});

	it('should be created', () => {
		expect(resolver).toBeTruthy();
	});

	it('should dispatch the fetchDefects action', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		TestBed.runInInjectionContext(() => resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

		expect(dispatchSpy).toHaveBeenCalledWith(fetchDefects());
	});
});
