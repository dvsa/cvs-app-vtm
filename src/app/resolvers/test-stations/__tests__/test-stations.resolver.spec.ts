import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { fetchTestStations } from '@store/test-stations';
import { testStationsResolver } from '../test-stations.resolver';

describe('TestTypeTaxonomyResolver', () => {
	let resolver: ResolveFn<boolean>;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState })],
		});
		store = TestBed.inject(MockStore);
		resolver = (...resolverParameters) =>
			TestBed.runInInjectionContext(() => testStationsResolver(...resolverParameters));
	});

	it('should be created', () => {
		expect(resolver).toBeTruthy();
	});
	it('should dispatch the fetchTestStations action', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		TestBed.runInInjectionContext(() => resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

		expect(dispatchSpy).toHaveBeenCalledWith(fetchTestStations());
	});
});
