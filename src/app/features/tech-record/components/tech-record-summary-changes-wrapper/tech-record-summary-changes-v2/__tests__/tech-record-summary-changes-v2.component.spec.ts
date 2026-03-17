import { AxlesService } from '@/src/app/services/axles/axles.service';
import { RouterService } from '@/src/app/services/router/router.service';
import { UserService } from '@/src/app/services/user-service/user-service';
import { initialAppState } from '@/src/app/store';
import { amendVrmSuccess } from '@/src/app/store/technical-records';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReplaySubject, of } from 'rxjs';
import { TechRecordSummaryChangesV2Component } from '../tech-record-summary-changes-v2.component';

describe('TechRecordSummaryChangesV2Component', () => {
	let component: TechRecordSummaryChangesV2Component;
	let fixture: ComponentFixture<TechRecordSummaryChangesV2Component>;
	let router: Router;
	let actions$: ReplaySubject<Action>;
	let store: MockStore;

	beforeEach(async () => {
		actions$ = new ReplaySubject<Action>();
		await TestBed.configureTestingModule({
			imports: [TechRecordSummaryChangesV2Component],
			providers: [
				AxlesService,
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
		fixture = TestBed.createComponent(TechRecordSummaryChangesV2Component);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should call navigateOnSuccess', () => {
			const navigateOnSuccessSpy = jest.spyOn(component, 'navigateUponSuccess');
			component.ngOnInit();
			expect(navigateOnSuccessSpy).toHaveBeenCalled();
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

	describe('ngOnDestroy', () => {
		it('should call the destroy.next and destroy.complete', () => {
			const nextSpy = jest.spyOn(component.destroy, 'next');
			const completeSpy = jest.spyOn(component.destroy, 'complete');
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
