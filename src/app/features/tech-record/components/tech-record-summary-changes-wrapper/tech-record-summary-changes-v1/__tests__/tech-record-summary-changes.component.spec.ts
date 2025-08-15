import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { UserService } from '@services/user-service/user-service';

import { initialAppState } from '@store/index';
import {
	amendVrmSuccess,
	editingTechRecord,
	selectTechRecordChanges,
	selectTechRecordDeletions,
	techRecord,
} from '@store/technical-records';
import { ReplaySubject, of } from 'rxjs';
import { TechRecordSummaryChangesComponent } from '../tech-record-summary-changes.component';

let actions$: ReplaySubject<Action>;
let store: MockStore;
describe('TechRecordSummaryChangesComponent', () => {
	let component: TechRecordSummaryChangesComponent;
	let fixture: ComponentFixture<TechRecordSummaryChangesComponent>;
	let router: Router;

	beforeEach(async () => {
		actions$ = new ReplaySubject<Action>();
		await TestBed.configureTestingModule({
			imports: [TechRecordSummaryChangesComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
				{
					provide: UserService,
					useValue: {
						name$: of('tester'),
					},
				},
				{
					provide: RouterService,
					useValue: {
						getRouteDataProperty$: jest.fn(),
						getRouteNestedParam$(param: string) {
							if (param === 'systemNumber') return of('123456');
							if (param === 'createdTimestamp') return of('123123123');
							return of('');
						},
					},
				},
			],
		}).compileComponents();
		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(TechRecordSummaryChangesComponent);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('navigateUponSuccess', () => {
		it('should handle state management', () => {
			const spy = jest.spyOn(component.actions$, 'pipe');
			component.navigateUponSuccess();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('ngOnInit', () => {
		it('should call navigateOnSuccess and initSubscriptions', () => {
			const navigateOnSuccessSpy = jest.spyOn(component, 'navigateUponSuccess');
			const initSubscriptionsSpy = jest.spyOn(component, 'initSubscriptions');
			component.ngOnInit();
			expect(navigateOnSuccessSpy).toHaveBeenCalled();
			expect(initSubscriptionsSpy).toHaveBeenCalled();
		});
		it('should navigate when updateRecordSuccess dispatched', () => {
			const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

			component.ngOnInit();

			actions$.next(
				amendVrmSuccess({
					vehicleTechRecord: {
						createdTimestamp: 'now',
						vin: 'testVin',
						systemNumber: 'testNumber',
					} as TechRecordType<'get'>,
				})
			);

			expect(navigateSpy).toHaveBeenCalled();
		});
	});

	describe('initSubscriptions', () => {
		let spy: unknown;

		beforeEach(() => {
			spy = jest.spyOn(store, 'select');
			component.ngOnInit();
		});
		it('should grab techRecord from the store', () => {
			expect(spy).toHaveBeenCalledWith(techRecord);
		});
		it('should grab editingTechRecord from the store', () => {
			expect(spy).toHaveBeenCalledWith(editingTechRecord);
		});
		it('should grab selectTechRecordChanges from the store', () => {
			expect(spy).toHaveBeenCalledWith(selectTechRecordChanges);
		});
		it('should grab selectTechRecordDeletions from the store', () => {
			expect(spy).toHaveBeenCalledWith(selectTechRecordDeletions);
		});
	});

	describe('ngOnDestroy', () => {
		it('should call the destroy.next and destroy.complete', () => {
			const nextSpy = jest.spyOn(component.destroy$, 'next');
			const completeSpy = jest.spyOn(component.destroy$, 'complete');
			component.ngOnDestroy();
			expect(nextSpy).toHaveBeenCalled();
			expect(completeSpy).toHaveBeenCalled();
		});
	});

	describe('submit', () => {
		it('should dispatch clearADRDetailsBeforeUpdate', () => {
			const dispatch = jest.spyOn(store, 'dispatch');
			component.submit();
			expect(dispatch).toHaveBeenCalled();
		});

		it('should dispatch updateTechRecords', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			component.submit();
			expect(dispatchSpy).toHaveBeenCalled();
			expect(dispatchSpy).toHaveBeenCalledWith({
				systemNumber: '123456',
				createdTimestamp: '123123123',
				type: '[Technical Record Service] updateTechRecords',
			});
		});
	});

	describe('cancel', () => {
		it('should call globalErrorService.clearErrors and then navigate', () => {
			const clearErrorsSpy = jest.spyOn(component.globalErrorService, 'clearErrors');
			const navigateSpy = jest.spyOn(component.router, 'navigate');
			component.cancel();
			expect(clearErrorsSpy).toHaveBeenCalled();
			expect(navigateSpy).toHaveBeenCalled();
		});
	});
});

function getEmptyTechRecord(): V3TechRecordModel {
	return {
		techRecord_createdAt: '',
		techRecord_createdById: null,
		techRecord_createdByName: null,
		techRecord_euVehicleCategory: null,
		techRecord_lastUpdatedAt: null,
		techRecord_lastUpdatedById: null,
		techRecord_lastUpdatedByName: null,
		techRecord_manufactureYear: null,
		techRecord_noOfAxles: 2,
		techRecord_notes: undefined,
		techRecord_applicantDetails_address1: null,
		techRecord_applicantDetails_address2: null,
		techRecord_applicantDetails_address3: null,
		techRecord_applicantDetails_emailAddress: null,
		techRecord_applicantDetails_name: null,
		techRecord_applicantDetails_postCode: null,
		techRecord_applicantDetails_postTown: null,
		techRecord_applicantDetails_telephoneNumber: null,
		techRecord_reasonForCreation: '',
		techRecord_regnDate: null,
		techRecord_statusCode: '',
		techRecord_vehicleConfiguration: 'other',
		techRecord_vehicleSubclass: undefined,
		techRecord_vehicleType: 'hgv',
	} as unknown as V3TechRecordModel;
}
