import { getRequiredStandards } from '@/src/app/store/required-standards/required-standards.actions';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { requiredStandardsResolver } from '../required-standards.resolver';

describe('RequiredStandardsResolver', () => {
	let resolver: ResolveFn<boolean>;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState })],
		});
		resolver = (...resolverParameters) =>
			TestBed.runInInjectionContext(() => requiredStandardsResolver(...resolverParameters));
		store = TestBed.inject(MockStore);
	});

	it('should be created', () => {
		expect(resolver).toBeTruthy();
	});

	it('should dispatch the getRequiredStandards action', () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		TestBed.runInInjectionContext(() => resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

		expect(dispatchSpy).toHaveBeenCalledWith(getRequiredStandards({ euVehicleCategory: '' }));
	});
});
