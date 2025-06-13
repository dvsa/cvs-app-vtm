import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { VehiclesOtherThan } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State, initialAppState } from '@store/index';
import { selectRouteData } from '@store/router/router.selectors';
import { amendVrm, amendVrmSuccess } from '@store/technical-records';
import { ReplaySubject, of } from 'rxjs';
import { AmendVrmComponent } from '../tech-record-amend-vrm.component';

const mockTechRecordService = {
	techRecord$: of({}),
	get viewableTechRecord$() {
		return of({
			systemNumber: 'foo',
			createdTimestamp: 'bar',
			vin: 'testVin',
			primaryVrm: 'TESTVRM',
		});
	},
	updateEditingTechRecord: jest.fn(),
	validateVrmDoesNotExist: jest.fn(),
	validateVrmForCherishedTransfer: jest.fn(),
	checkVrmNotActive: jest.fn(),
	getVehicleTypeWithSmallTrl: jest.fn(),
};

const mockDynamicFormService = {
	createForm: jest.fn(),
};

describe('TechRecordChangeVrmComponent', () => {
	const actions$ = new ReplaySubject<Action>();
	let component: AmendVrmComponent;
	let errorService: GlobalErrorService;
	let fixture: ComponentFixture<AmendVrmComponent>;
	let route: ActivatedRoute;
	let router: Router;
	let store: MockStore<State>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AmendVrmComponent, ReactiveFormsModule],
			providers: [
				GlobalErrorService,
				provideRouter([]),
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
				{
					provide: ActivatedRoute,
					useValue: { params: of([{ id: 1, reason: 'correcting-error' }]), snapshot: new ActivatedRouteSnapshot() },
				},
				{ provide: DynamicFormService, useValue: mockDynamicFormService },
				{ provide: TechnicalRecordService, useValue: mockTechRecordService },
			],
		}).compileComponents();
	});
	beforeEach(() => {
		fixture = TestBed.createComponent(AmendVrmComponent);
		errorService = TestBed.inject(GlobalErrorService);
		route = TestBed.inject(ActivatedRoute);
		router = TestBed.inject(Router);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;
		component.cherishedTransferForm.controls['currentVrm'].clearAsyncValidators();
		component.cherishedTransferForm.controls['currentVrm'].setAsyncValidators(
			mockTechRecordService.validateVrmForCherishedTransfer.bind(this)
		);
		component.cherishedTransferForm.controls['thirdMark'].clearAsyncValidators();
		component.cherishedTransferForm.controls['thirdMark'].setAsyncValidators(
			mockTechRecordService.validateVrmDoesNotExist.bind(this)
		);
		component.correctingAnErrorForm.controls['newVrm'].clearAsyncValidators();
		component.correctingAnErrorForm.controls['newVrm'].setAsyncValidators(
			mockTechRecordService.validateVrmDoesNotExist.bind(this)
		);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('navigateBack', () => {
		it('should clear all errors', () => {
			jest.spyOn(router, 'navigate').mockImplementation();

			const clearErrorsSpy = jest.spyOn(errorService, 'clearErrors');

			component.navigateBack();

			expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
		});

		it('should navigate back to the previous page', () => {
			const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

			component.navigateBack();

			expect(navigateSpy).toHaveBeenCalledWith(['../../'], { relativeTo: route });
		});

		it('should navigate to a new record on amendVrmSuccess', () => {
			const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

			store.overrideSelector(selectRouteData, { data: { isEditing: true } });
			component.ngOnInit();

			actions$.next(amendVrmSuccess({ vehicleTechRecord: mockVehicleTechnicalRecord('psv') as TechRecordType<'get'> }));

			expect(navigateSpy).toHaveBeenCalled();
		});
	});

	describe('handleSubmit', () => {
		beforeEach(() => {
			component.techRecord = mockVehicleTechnicalRecord('psv') as VehiclesOtherThan<'trl'>;
			jest.resetAllMocks();
			jest.resetModules();
		});

		it('should add an error when the vrm field is not filled out', () => {
			const addErrorSpy = jest.spyOn(errorService, 'setErrors');

			component.handleSubmit();

			expect(addErrorSpy).toHaveBeenCalledWith([{ anchorLink: 'new-vrm', error: 'New VRM is required' }]);
		});

		it('should not dispatch an action if isFormValid returns false', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');

			component.handleSubmit();

			expect(dispatchSpy).not.toHaveBeenCalledWith(
				amendVrm({
					newVrm: '',
					cherishedTransfer: false,
					thirdMark: '',
					systemNumber: 'PSV',
					createdTimestamp: 'now',
				})
			);
		});
		it('should dispatch the amendVrm action', fakeAsync(() => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			mockTechRecordService.validateVrmDoesNotExist.mockReturnValue(of(null));
			component.correctingAnErrorForm.controls['newVrm'].setValue('TESTVRM1');

			component.handleSubmit();

			expect(dispatchSpy).toHaveBeenCalledWith(
				amendVrm({
					newVrm: 'TESTVRM1',
					cherishedTransfer: false,
					systemNumber: 'PSV',
					createdTimestamp: 'now',
					thirdMark: undefined,
				})
			);
		}));
		it('should dispatch the action with the correct information', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			mockTechRecordService.validateVrmDoesNotExist.mockReturnValue(of(null));
			mockTechRecordService.validateVrmForCherishedTransfer.mockReturnValue(of(null));
			component.cherishedTransferForm.controls['currentVrm'].setValue('TESTVRM1');
			component.cherishedTransferForm.controls['thirdMark'].setValue('3MARK');
			component.isCherishedTransfer = true;

			component.handleSubmit();

			expect(dispatchSpy).toHaveBeenCalledWith(
				amendVrm({
					newVrm: 'TESTVRM1',
					cherishedTransfer: true,
					systemNumber: 'PSV',
					createdTimestamp: 'now',
					thirdMark: '3MARK',
				})
			);
		});
	});

	describe('showWarning', () => {
		it('should return true if the vehicle type is a psv', () => {
			component.techRecord = { techRecord_vehicleType: 'psv' } as VehiclesOtherThan<'trl'>;
			mockTechRecordService.getVehicleTypeWithSmallTrl.mockReturnValue('psv');

			expect(component.showWarning).toBe(true);
		});

		it('should return true if the vehicle type is a hgv', () => {
			component.techRecord = { techRecord_vehicleType: 'hgv' } as VehiclesOtherThan<'trl'>;
			mockTechRecordService.getVehicleTypeWithSmallTrl.mockReturnValue('hgv');

			expect(component.showWarning).toBe(true);
		});

		it('should return false if the vehicle type is not a psv or hgv', () => {
			component.techRecord = { techRecord_vehicleType: 'lgv' } as VehiclesOtherThan<'trl'>;
			mockTechRecordService.getVehicleTypeWithSmallTrl.mockReturnValue('lgv');

			expect(component.showWarning).toBe(false);
		});

		it('should default to false if the vehicle type is not present', () => {
			component.techRecord = undefined;
			mockTechRecordService.getVehicleTypeWithSmallTrl.mockReturnValue(undefined);

			expect(component.showWarning).toBe(false);
		});
	});
});
