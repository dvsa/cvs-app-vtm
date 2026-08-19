import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { techRecord } from '@store/technical-records';
import { getRecalls } from '@store/test-records';
import { NEVER, Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { recallsResolver } from '../recalls.resolver';

describe('recallsResolver', () => {
	const actions$ = NEVER as Observable<Action>;
	const activatedRouteSnapshot = {} as ActivatedRouteSnapshot;
	const routerStateSnapshot = {} as RouterStateSnapshot;
	let store: MockStore<State>;
	let testScheduler: TestScheduler;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState }), provideMockActions(() => actions$)],
		});

		store = TestBed.inject(MockStore);
		testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
	});

	it('starts the recalls request without blocking route activation', () => {
		store.overrideSelector(techRecord, {
			vin: '12345678901234567',
			techRecord_vehicleType: VehicleTypes.HGV,
		} as never);
		const dispatchSpy = jest.spyOn(store, 'dispatch');

		const result = TestBed.runInInjectionContext(() =>
			recallsResolver(activatedRouteSnapshot, routerStateSnapshot)
		) as Observable<undefined>;

		testScheduler.run(({ expectObservable }) => {
			expectObservable(result).toBe('(a|)', { a: undefined });
		});
		expect(dispatchSpy).toHaveBeenCalledWith(getRecalls());
	});

	it('does not request recalls for an unsupported vehicle type', () => {
		store.overrideSelector(techRecord, {
			vin: '12345678901234567',
			techRecord_vehicleType: VehicleTypes.CAR,
		} as never);
		const dispatchSpy = jest.spyOn(store, 'dispatch');

		const result = TestBed.runInInjectionContext(() =>
			recallsResolver(activatedRouteSnapshot, routerStateSnapshot)
		) as Observable<undefined>;

		testScheduler.run(({ expectObservable }) => {
			expectObservable(result).toBe('(a|)', { a: undefined });
		});
		expect(dispatchSpy).not.toHaveBeenCalled();
	});
});
