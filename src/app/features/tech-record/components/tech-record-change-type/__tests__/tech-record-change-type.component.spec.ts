import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { getOptionsFromEnumAcronym } from '@forms/utils/enum-map';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { FixNavigationTriggeredOutsideAngularZoneNgModule } from '@shared/custom-module/fixNgZoneError';
import { initialAppState } from '@store/index';
import { changeVehicleType } from '@store/technical-records';
import { ReplaySubject, of } from 'rxjs';
import { ChangeVehicleTypeComponent } from '../tech-record-change-type.component';

const mockGetVehicleType = vi.fn();

const mockTechRecordService = {
	get techRecord$() {
		return of({});
	},
	getMakeAndModel: vi.fn(),
	clearReasonForCreation: vi.fn(),
	getVehicleTypeWithSmallTrl: mockGetVehicleType,
};

const mockDynamicFormService = {
	createForm: vi.fn(),
};

describe('TechRecordChangeTypeComponent', () => {
	const actions$ = new ReplaySubject<Action>();
	let component: ChangeVehicleTypeComponent;
	let errorService: GlobalErrorService;
	let expectedTechRecord = {} as V3TechRecordModel;
	let fixture: ComponentFixture<ChangeVehicleTypeComponent>;
	let route: ActivatedRoute;
	let router: Router;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ChangeVehicleTypeComponent, FixNavigationTriggeredOutsideAngularZoneNgModule],
			providers: [
				GlobalErrorService,
				provideRouter([]),
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
				{ provide: DynamicFormService, useValue: mockDynamicFormService },
				{ provide: TechnicalRecordService, useValue: mockTechRecordService },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ChangeVehicleTypeComponent);
		errorService = TestBed.inject(GlobalErrorService);
		route = TestBed.inject(ActivatedRoute);
		router = TestBed.inject(Router);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;
		expectedTechRecord = {
			systemNumber: 'foo',
			createdTimestamp: 'bar',
			vin: 'testVin',
			techRecord_vehicleType: VehicleTypes.PSV,
			techRecord_chassisMake: 'test-make',
			techRecord_chassisModel: 'test-model',
		} as V3TechRecordModel;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('makeAndModel', () => {
		it('should should return the make and model', () => {
			const techRecord = expectedTechRecord as TechRecordType<'psv'>;
			const expectedMakeModel = `${techRecord.techRecord_chassisMake} - ${techRecord.techRecord_chassisModel}`;

			vi.spyOn(mockTechRecordService, 'getMakeAndModel').mockReturnValueOnce(expectedMakeModel);

			component.techRecord = expectedTechRecord;
			component.ngOnInit();

			expect(component.makeAndModel).toBe(expectedMakeModel);
		});

		it('should return an empty string when the current record is null', () => {
			delete component.techRecord;
			component.ngOnInit();

			expect(component.makeAndModel).toBeUndefined();
		});
	});

	describe('vehicleTypeOptions', () => {
		it('should return all types except for the current one', () => {
			component.techRecord = expectedTechRecord;
			mockGetVehicleType.mockReturnValue('psv');
			const expectedOptions = getOptionsFromEnumAcronym(VehicleTypes).filter((type) => type.value !== VehicleTypes.PSV);
			expect(component.vehicleTypeOptions).toStrictEqual(expectedOptions);
		});
	});

	describe('navigateBack', () => {
		it('should clear all errors', () => {
			vi.spyOn(router, 'navigate').mockImplementation((() => {}) as any);

			const clearErrorsSpy = vi.spyOn(errorService, 'clearErrors');

			component.navigateBack();

			expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
		});

		it('should navigate back to the previous page', () => {
			const navigateSpy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

			component.navigateBack();

			expect(navigateSpy).toHaveBeenCalledWith(['..'], { relativeTo: route });
		});
	});

	describe('handleSubmit', () => {
		it('should add an error when no vehicle type is selected', () => {
			const setErrorsSpy = vi.spyOn(errorService, 'setErrors');

			component.handleSubmit(null as unknown as VehicleTypes);

			expect(setErrorsSpy).toHaveBeenCalledWith([
				{ error: 'Select a new vehicle type is required', anchorLink: 'change-vehicle-type-select' },
			]);
		});

		it('should dispatch the changeVehicleType action', () => {
			vi.spyOn(router, 'navigate').mockImplementation((() => {}) as any);

			const dispatchSpy = vi.spyOn(store, 'dispatch');

			component.handleSubmit(VehicleTypes.PSV);

			expect(dispatchSpy).toHaveBeenCalledWith(changeVehicleType({ techRecord_vehicleType: VehicleTypes.PSV }));
		});

		it('should call clearReasonForCreation', () => {
			vi.spyOn(router, 'navigate').mockImplementation((() => {}) as any);

			const clearReasonForCreationSpy = vi.spyOn(mockTechRecordService, 'clearReasonForCreation');

			vi.resetAllMocks();
			component.handleSubmit(VehicleTypes.PSV);

			expect(clearReasonForCreationSpy).toHaveBeenCalledTimes(1);
		});

		it('navigate to the editing page', () => {
			const navigateSpy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

			component.handleSubmit(VehicleTypes.PSV);

			expect(navigateSpy).toHaveBeenCalledWith(['../amend-reason'], { relativeTo: route });
		});
	});
});
