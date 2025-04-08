import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { selectRouteNestedParams } from '@store/router/router.selectors';
import { amendVin, amendVinSuccess } from '@store/technical-records';
import { ReplaySubject, of } from 'rxjs';
import { AmendVinComponent } from '../tech-record-amend-vin.component';

const mockTechRecordService = {
	editableTechRecord$: of({}),
	selectedVehicleTechRecord$: of({}),
	viewableTechRecord$: jest.fn(),
	updateEditingTechRecord: jest.fn(),
	isUnique: jest.fn(),
	getVehicleTypeWithSmallTrl: jest.fn(),
	validateVinForUpdate: jest.fn().mockReturnValue(of(null)),
};

const mockDynamicFormService = {
	createForm: jest.fn(),
};

describe('TechRecordChangeVinComponent', () => {
	const actions$ = new ReplaySubject<Action>();
	let component: AmendVinComponent;
	let errorService: GlobalErrorService;
	let expectedTechRecord = {} as V3TechRecordModel;
	let fixture: ComponentFixture<AmendVinComponent>;
	let route: ActivatedRoute;
	let router: Router;
	let store: MockStore;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AmendVinComponent, ReactiveFormsModule],
			providers: [
				GlobalErrorService,
				provideRouter([]),
				provideMockActions(() => actions$),
				provideMockStore({ initialState: initialAppState }),
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]), snapshot: new ActivatedRouteSnapshot() } },
				{ provide: DynamicFormService, useValue: mockDynamicFormService },
				{ provide: TechnicalRecordService, useValue: mockTechRecordService },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AmendVinComponent);
		errorService = TestBed.inject(GlobalErrorService);
		route = TestBed.inject(ActivatedRoute);
		router = TestBed.inject(Router);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;
		component.form.controls['vin'].clearAsyncValidators();
		component.form.controls['vin'].setAsyncValidators(mockTechRecordService.validateVinForUpdate.bind(this));
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('handleSubmit', () => {
		beforeEach(() => {
			expectedTechRecord = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				newVin: 'testVin',
			} as unknown as TechRecordType<'put'>;
			component.techRecord = expectedTechRecord;
		});
		it('should dispatch the amendVin action with the new vin', () => {
			const createdTimestamp = '2022';
			const systemNumber = '123456';
			const newVin = 'myNewVin';
			store.overrideSelector(selectRouteNestedParams, { createdTimestamp, systemNumber });
			const dispatchSpy = jest.spyOn(store, 'dispatch');

			component.form.controls['vin'].setValue('myNewVin');

			component.handleSubmit();

			expect(dispatchSpy).toHaveBeenCalledWith(amendVin({ newVin, systemNumber, createdTimestamp }));
		});
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

			expect(navigateSpy).toHaveBeenCalledWith(['..'], { relativeTo: route });
		});

		it('should navigate away amendVinSuccess', fakeAsync(() => {
			const navigateSpy = jest.spyOn(router, 'navigate');
			jest.spyOn(router, 'navigate').mockImplementation();

			actions$.next(
				amendVinSuccess({
					vehicleTechRecord: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as TechRecordType<'get'>,
				})
			);
			tick();

			expect(navigateSpy).toHaveBeenCalled();
		}));
	});
});
