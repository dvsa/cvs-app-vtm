import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { Observable, firstValueFrom, of } from 'rxjs';
import { techRecordCleanResolver } from '../tech-record-clean.resolver';

describe('techRecordCleanResolver', () => {
	const executeResolver: ResolveFn<Observable<boolean>> = (...resolverParameters) =>
		TestBed.runInInjectionContext(() => techRecordCleanResolver(...resolverParameters));

	const actions$ = new Observable<Action>();
	const mockActivatedRouteSnapshot = jest.fn;
	let store: MockStore<State>;
	let activatedRouteSnapshot: ActivatedRouteSnapshot;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideMockActions(() => actions$),
				{ provide: ActivatedRouteSnapshot, useValue: mockActivatedRouteSnapshot },
			],
		});

		store = TestBed.inject(MockStore);
		activatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
		activatedRouteSnapshot.data = {
			isEditing: true,
		};
	});

	it('should be created', () => {
		expect(executeResolver).toBeTruthy();
	});

	describe('fetch tech record', () => {
		it('should update the editing tech record when approval type = Small series and approval number is in NKS format', async () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			jest.spyOn(store, 'select').mockReturnValue(
				of({
					techRecord_vehicleType: 'hgv',
					techRecord_approvalType: 'Small series' as ApprovalType,
					techRecord_approvalTypeNumber: '811*NKS*666666',
				})
			);
			const result = executeResolver(activatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<boolean>;
			const resolveResult = await firstValueFrom(result);

			expect(resolveResult).toBe(true);
			expect(dispatchSpy).toHaveBeenCalledTimes(1);
			expect(dispatchSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					vehicleTechRecord: {
						techRecord_approvalType: ApprovalType.SMALL_SERIES_NKS,
						techRecord_approvalTypeNumber: '811*NKS*666666',
						techRecord_vehicleType: 'hgv',
					},
				})
			);
		});

		it('should update the editing tech record when approval type = Small series and approval number is in NKSXX format', async () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			jest.spyOn(store, 'select').mockReturnValue(
				of({
					techRecord_vehicleType: 'hgv',
					techRecord_approvalType: 'Small series' as ApprovalType,
					techRecord_approvalTypeNumber: '811*NKSXX/1234*666666',
				})
			);
			const result = executeResolver(activatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<boolean>;
			const resolveResult = await firstValueFrom(result);

			expect(resolveResult).toBe(true);
			expect(dispatchSpy).toHaveBeenCalledTimes(1);
			expect(dispatchSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					vehicleTechRecord: {
						techRecord_approvalType: ApprovalType.SMALL_SERIES_NKSXX,
						techRecord_approvalTypeNumber: '811*NKSXX/1234*666666',
						techRecord_vehicleType: 'hgv',
					},
				})
			);
		});

		it('should not update the editing tech record when the approval type is Small series, but the approval number is invalid', async () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			jest.spyOn(store, 'select').mockReturnValue(
				of({
					techRecord_vehicleType: 'hgv',
					techRecord_approvalType: 'Small series' as ApprovalType,
					techRecord_approvalTypeNumber: 'INVALID NUMBER',
				})
			);
			const result = executeResolver(activatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<boolean>;
			const resolveResult = await firstValueFrom(result);

			expect(resolveResult).toBe(true);
			expect(dispatchSpy).toHaveBeenCalledTimes(1);

			// This bad data gets nulled by the tech-record-validate resolver
			expect(dispatchSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					vehicleTechRecord: {
						techRecord_approvalType: 'Small series' as ApprovalType,
						techRecord_approvalTypeNumber: 'INVALID NUMBER',
						techRecord_vehicleType: 'hgv',
					},
				})
			);
		});
	});

	it('should sort additional examiner notes by createdAtDate in descending order', async () => {
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		jest.spyOn(store, 'select').mockReturnValue(
			of({
				techRecord_vehicleType: 'hgv',
				techRecord_adrDetails_additionalExaminerNotes: [
					{
						createdAtDate: '2023-01-01T00:00:00.000Z',
						note: 'Note 2',
					},
					{
						createdAtDate: '2025-12-31T00:00:00.000Z',
						note: 'Note 3',
					},
					{
						createdAtDate: '2022-12-30T00:00:00.000Z',
						note: 'Note 1',
					},
				],
			})
		);
		const result = executeResolver(activatedRouteSnapshot, {} as RouterStateSnapshot) as Observable<boolean>;
		const resolveResult = await firstValueFrom(result);

		expect(resolveResult).toBe(true);
		expect(dispatchSpy).toHaveBeenCalledTimes(1);
		expect(dispatchSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				vehicleTechRecord: {
					techRecord_vehicleType: 'hgv',
					techRecord_adrDetails_additionalExaminerNotes: [
						{
							createdAtDate: '2025-12-31T00:00:00.000Z',
							note: 'Note 3',
						},
						{
							createdAtDate: '2023-01-01T00:00:00.000Z',
							note: 'Note 2',
						},
						{
							createdAtDate: '2022-12-30T00:00:00.000Z',
							note: 'Note 1',
						},
					],
				},
			})
		);
	});
});
