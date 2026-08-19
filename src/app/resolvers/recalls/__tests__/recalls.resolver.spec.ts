import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { techRecord } from '@store/technical-records';
import { getRecalls, getRecallsSuccess, selectRecallsState } from '@store/test-records';
import { Observable, ReplaySubject, firstValueFrom } from 'rxjs';
import { recallsResolver } from '../recalls.resolver';

describe('recallsResolver', () => {
	const activatedRouteSnapshot = {} as ActivatedRouteSnapshot;
	const routerStateSnapshot = {} as RouterStateSnapshot;
	const vin = '12345678901234567';
	let actions$: ReplaySubject<Action>;
	let store: MockStore<State>;

	beforeEach(() => {
		actions$ = new ReplaySubject<Action>(1);
		TestBed.configureTestingModule({
			providers: [provideMockStore({ initialState: initialAppState }), provideMockActions(() => actions$)],
		});

		store = TestBed.inject(MockStore);
	});

	it('waits for recalls when the earlier request has not completed', async () => {
		store.overrideSelector(techRecord, {
			vin,
			techRecord_vehicleType: VehicleTypes.HGV,
		} as never);
		store.overrideSelector(selectRecallsState, { recalls: undefined, vin: undefined, loading: false });
		const dispatchSpy = jest.spyOn(store, 'dispatch');

		const result = TestBed.runInInjectionContext(() =>
			recallsResolver(activatedRouteSnapshot, routerStateSnapshot)
		) as Observable<{ hasRecall: boolean; manufacturer?: string } | undefined>;
		const resolved = firstValueFrom(result);

		expect(dispatchSpy).toHaveBeenCalledWith(getRecalls({ vin }));

		const recalls = { hasRecall: true, manufacturer: 'Ford' };
		actions$.next(getRecallsSuccess({ vin, recalls }));
		expect(await resolved).toEqual(recalls);
	});

	it('uses recalls that were prefetched for the selected vehicle', async () => {
		const recalls = { hasRecall: true, manufacturer: 'Ford' };
		store.overrideSelector(techRecord, {
			vin,
			techRecord_vehicleType: VehicleTypes.HGV,
		} as never);
		store.overrideSelector(selectRecallsState, { recalls, vin, loading: false });
		const dispatchSpy = jest.spyOn(store, 'dispatch');

		const result = TestBed.runInInjectionContext(() =>
			recallsResolver(activatedRouteSnapshot, routerStateSnapshot)
		) as Observable<typeof recalls | undefined>;

		expect(await firstValueFrom(result)).toEqual(recalls);
		expect(dispatchSpy).not.toHaveBeenCalled();
	});

	it('does not request recalls for an unsupported vehicle type', async () => {
		store.overrideSelector(techRecord, {
			vin,
			techRecord_vehicleType: VehicleTypes.CAR,
		} as never);
		const dispatchSpy = jest.spyOn(store, 'dispatch');

		const result = TestBed.runInInjectionContext(() =>
			recallsResolver(activatedRouteSnapshot, routerStateSnapshot)
		) as Observable<undefined>;

		await expect(firstValueFrom(result)).resolves.toBeUndefined();
		expect(dispatchSpy).not.toHaveBeenCalled();
	});
});
