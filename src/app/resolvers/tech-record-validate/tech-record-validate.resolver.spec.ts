import { TestBed } from '@angular/core/testing';

import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/.';
import { Observable, firstValueFrom, of } from 'rxjs';
import { techRecordValidateResolver } from './tech-record-validate.resolver';

describe('TechRecordViewResolver', () => {
	let resolver: ResolveFn<boolean>;
	const actions$ = new Observable<Action>();
	const mockSnapshot = jest.fn;
	let store: MockStore<State>;
	let router: Router;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => actions$),
				{ provide: RouterStateSnapshot, useValue: mockSnapshot },
			],
		});
		resolver = (...resolverParameters) =>
			TestBed.runInInjectionContext(() => techRecordValidateResolver(...resolverParameters));
		store = TestBed.inject(MockStore);
		router = TestBed.inject(Router);
	});

	it('should be created', () => {
		expect(resolver).toBeTruthy();
	});

	describe('fetch tech record result', () => {
		it('should dispatch a tech record with null if hgv vehicle configuration invalid', async () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			jest.spyOn(store, 'select').mockReturnValue(
				of({
					techRecord_vehicleType: 'hgv',
					techRecord_vehicleConfiguration: 'semi-trailer',
					techRecord_euVehicleCategory: 'o1',
				})
			);
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			const resolveResult = await firstValueFrom(result);

			expect(resolveResult).toBe(true);
			expect(dispatchSpy).toHaveBeenCalledTimes(1);
			expect(dispatchSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					vehicleTechRecord: {
						techRecord_vehicleType: 'hgv',
						techRecord_vehicleConfiguration: null,
						techRecord_vehicleClass_description: 'heavy goods vehicle',
						techRecord_euVehicleCategory: null,
					},
				})
			);
		});
		it('should dispatch a tech record with null if psv vehicle configuration invalid', async () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			jest.spyOn(store, 'select').mockReturnValue(
				of({
					techRecord_vehicleType: 'psv',
					techRecord_vehicleConfiguration: 'semi-trailer',
					techRecord_euVehicleCategory: 'o1',
				})
			);
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			const resolveResult = await firstValueFrom(result);

			expect(resolveResult).toBe(true);
			expect(dispatchSpy).toHaveBeenCalledTimes(1);
			expect(dispatchSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					vehicleTechRecord: {
						techRecord_vehicleType: 'psv',
						techRecord_vehicleConfiguration: null,
						techRecord_euVehicleCategory: null,
					},
				})
			);
		});
		it('should dispatch a tech record with null if psv vehicle class is invalid', async () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			jest
				.spyOn(store, 'select')
				.mockReturnValue(of({ techRecord_vehicleType: 'psv', techRecord_vehicleClass_description: 'trailer' }));
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			const resolveResult = await firstValueFrom(result);

			expect(resolveResult).toBe(true);
			expect(dispatchSpy).toHaveBeenCalledTimes(1);
			expect(dispatchSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					vehicleTechRecord: { techRecord_vehicleType: 'psv', techRecord_vehicleClass_description: null },
				})
			);
		});
		it('should dispatch a tech record with null if trl vehicle configuration invalid', async () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			jest.spyOn(store, 'select').mockReturnValue(
				of({
					techRecord_vehicleType: 'trl',
					techRecord_vehicleConfiguration: 'rigid',
				})
			);
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			const resolveResult = await firstValueFrom(result);

			expect(resolveResult).toBe(true);
			expect(dispatchSpy).toHaveBeenCalledTimes(1);
			expect(dispatchSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					vehicleTechRecord: {
						techRecord_vehicleType: 'trl',
						techRecord_vehicleConfiguration: null,
						techRecord_vehicleClass_description: 'trailer',
					},
				})
			);
		});
		it('should not dispatch a tech record with trl vehicle configuration is valid', async () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			jest.spyOn(store, 'select').mockReturnValue(
				of({
					techRecord_vehicleType: 'trl',
					techRecord_vehicleConfiguration: 'semi-trailer',
					techRecord_vehicleClass_description: 'trailer',
					techRecord_euVehicleCategory: 'o1',
				})
			);
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			const resolveResult = await firstValueFrom(result);

			expect(resolveResult).toBe(true);
			expect(dispatchSpy).toHaveBeenCalledTimes(0);
		});
		it('should dispatch a tech record with hgv if hgv vehicle class is invalid', async () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			jest
				.spyOn(store, 'select')
				.mockReturnValue(of({ techRecord_vehicleType: 'hgv', techRecord_vehicleClass_description: 'trailer' }));
			const result = TestBed.runInInjectionContext(() =>
				resolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
			) as Observable<boolean>;
			const resolveResult = await firstValueFrom(result);

			expect(resolveResult).toBe(true);
			expect(dispatchSpy).toHaveBeenCalledTimes(1);
			expect(dispatchSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					vehicleTechRecord: {
						techRecord_vehicleType: 'hgv',
						techRecord_vehicleClass_description: 'heavy goods vehicle',
					},
				})
			);
		});
		it('should navigate if there is no tech record', async () => {
			jest.spyOn(store, 'select').mockReturnValue(of(undefined));
			const routerSpy = jest.spyOn(router, 'navigate').mockImplementation();
			const result = TestBed.runInInjectionContext(() =>
				resolver(
					{
						params: { systemNumber: '12345', createdTimestamp: 'now' },
					} as unknown as ActivatedRouteSnapshot,
					{} as RouterStateSnapshot
				)
			) as Observable<boolean>;
			await firstValueFrom(result);
			expect(routerSpy).toHaveBeenCalled();
			expect(routerSpy).toHaveBeenCalledWith(['./tech-records/12345/now']);
		});
	});
});
