import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { fetchTestTypes } from '@store/test-types/test-types.actions';
import { selectTestTypesTotal } from '@store/test-types/test-types.selectors';
import { testTypeTaxonomyResolver } from '../test-type-taxonomy.resolver';

describe('TestTypeTaxonomyResolver', () => {
	let resolver: ResolveFn<void>;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState })],
		});
		resolver = (...resolverParameters) =>
			TestBed.runInInjectionContext(() => testTypeTaxonomyResolver(...resolverParameters));
		store = TestBed.inject(MockStore);
	});

	it('should be created', () => {
		expect(resolver).toBeTruthy();
	});

	it('should dispatch the fetchTestTypes action', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		TestBed.runInInjectionContext(() => resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

		expect(dispatchSpy).toHaveBeenCalledWith(fetchTestTypes());
	});

	it('should not fetch test types again when they are already loaded', () => {
		store.overrideSelector(selectTestTypesTotal, 1);
		const dispatchSpy = jest.spyOn(store, 'dispatch');

		TestBed.runInInjectionContext(() => resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

		expect(dispatchSpy).not.toHaveBeenCalled();
	});
});
