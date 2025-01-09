import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
	ControlContainer,
	FormControl,
	FormGroup,
	FormGroupDirective,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VehicleClassDescription } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescriptionPSV.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { VehicleSectionEditComponent } from '@forms/custom-sections/vehicle-section/vehicle-section-edit/vehicle-section-edit.component';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import {
	ALL_VEHICLE_CLASS_DESCRIPTION_OPTIONS,
	PSV_EU_VEHICLE_CATEGORY_OPTIONS,
	TRL_VEHICLE_CONFIGURATION_OPTIONS,
} from '@models/options.model';
import { V3TechRecordModel, VehicleSizes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';

describe('VehicleSectionEditComponent', () => {
	let controlContainer: ControlContainer;
	let component: VehicleSectionEditComponent;
	let componentRef: ComponentRef<VehicleSectionEditComponent>;
	let fixture: ComponentFixture<VehicleSectionEditComponent>;
	let formGroupDirective: FormGroupDirective;
	let technicalRecordService: TechnicalRecordService;
	let store: MockStore;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<
			Partial<Record<keyof TechRecordType<'hgv' | 'car' | 'psv' | 'lgv' | 'trl'>, FormControl>>
		>({});
		const mockTechRecord = mockVehicleTechnicalRecord('hgv');

		await TestBed.configureTestingModule({
			declarations: [VehicleSectionEditComponent],
			imports: [DynamicFormsModule, FormsModule, ReactiveFormsModule],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
				TechnicalRecordService,
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		controlContainer = TestBed.inject(ControlContainer);
		technicalRecordService = TestBed.inject(TechnicalRecordService);

		fixture = TestBed.createComponent(VehicleSectionEditComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;
		componentRef.setInput('techRecord', mockTechRecord);
		component.form.reset();
		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should attach its form to its parent form', () => {
			const vehicleTypeControlsSpy = jest.spyOn(component, 'addControlsBasedOffVehicleType');
			const parentFormSpy = jest.spyOn(controlContainer.control as FormGroup, 'addControl');
			component.ngOnInit();
			expect(vehicleTypeControlsSpy).toHaveBeenCalled();
			expect(parentFormSpy).toHaveBeenCalled();
		});
	});

	describe('ngOnDestroy', () => {
		it('should unsubscribe from all subscriptions', () => {
			const spy = jest.spyOn(component.destroy$, 'complete');
			component.ngOnDestroy();
			expect(spy).toHaveBeenCalled();
		});

		it('should detach its form from its parent form', () => {
			const spy = jest.spyOn(controlContainer.control as FormGroup, 'removeControl');
			component.ngOnDestroy();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('getVehicleType', () => {
		it('should return the vehicle type', () => {
			const mockTechRecord = { techRecord_vehicleType: VehicleTypes.HGV } as V3TechRecordModel;
			jest.spyOn(component.technicalRecordService, 'getVehicleTypeWithSmallTrl').mockReturnValue(VehicleTypes.HGV);
			componentRef.setInput('techRecord', mockTechRecord);
			expect(component.getVehicleType()).toBe(VehicleTypes.HGV);
		});

		it('should return the small trailer type', () => {
			const mockTechRecord = {
				techRecord_vehicleType: VehicleTypes.TRL,
				techRecord_euVehicleCategory: 'o1',
			} as V3TechRecordModel;
			jest.spyOn(component.technicalRecordService, 'getVehicleTypeWithSmallTrl').mockReturnValue(VehicleTypes.HGV);
			componentRef.setInput('techRecord', mockTechRecord);
			expect(component.getVehicleType()).toBe(VehicleTypes.HGV);
		});
	});

	describe('shouldDisplayFormControl', () => {
		it('should return true if the form control exists', () => {
			component.form.patchValue({ techRecord_vehicleType: VehicleTypes.HGV });
			const result = component.shouldDisplayFormControl('techRecord_vehicleType');
			expect(result).toBe(true);
		});

		it('should return false if the form control does not exist', () => {
			component.form = new FormGroup({});
			const result = component.shouldDisplayFormControl('techRecord_vehicleType');
			expect(result).toBe(false);
		});
	});

	describe('get EUCategoryOptions', () => {
		it('should return the eu category that belongs to the vehicle type', () => {
			const mockTechRecord = { techRecord_vehicleType: VehicleTypes.PSV } as V3TechRecordModel;
			componentRef.setInput('techRecord', mockTechRecord);
			expect(component.EUCategoryOptions).toEqual(PSV_EU_VEHICLE_CATEGORY_OPTIONS);
		});
	});

	describe('get vehicleClassDescriptionOptions', () => {
		it('should return the class descriptions that belong to the vehicle type', () => {
			const mockTechRecord = { techRecord_vehicleType: VehicleTypes.MOTORCYCLE } as V3TechRecordModel;
			componentRef.setInput('techRecord', mockTechRecord);
			expect(component.vehicleClassDescriptionOptions).toEqual(ALL_VEHICLE_CLASS_DESCRIPTION_OPTIONS);
		});
	});

	describe('get vehicleConfigurationOptions', () => {
		it('should return the configuration options based off vehicle type', () => {
			const mockTechRecord = { techRecord_vehicleType: VehicleTypes.TRL } as V3TechRecordModel;
			componentRef.setInput('techRecord', mockTechRecord);
			expect(component.vehicleConfigurationOptions).toEqual(TRL_VEHICLE_CONFIGURATION_OPTIONS);
		});
	});

	describe('get shouldShowSubclass', () => {
		it('should return true if vehicle is either small trl/lgv/car', () => {
			jest.spyOn(component, 'getVehicleType').mockReturnValue(VehicleTypes.LGV);
			expect(component.shouldShowSubclass).toBe(true);
		});

		it('should return false if vehicle is not either small trl/lgv/car', () => {
			jest.spyOn(component, 'getVehicleType').mockReturnValue(VehicleTypes.HGV);
			expect(component.shouldShowSubclass).toBe(false);
		});
	});

	describe('get shouldShowClass', () => {
		it('should return true if vehicle is either small trl/hgv/trl/motorcycle', () => {
			jest.spyOn(component, 'getVehicleType').mockReturnValue(VehicleTypes.HGV);
			expect(component.shouldShowClass).toBe(true);
		});

		it('should return false if vehicle is not either small trl/hgv/trl/motorcycle', () => {
			jest.spyOn(component, 'getVehicleType').mockReturnValue(VehicleTypes.LGV);
			expect(component.shouldShowClass).toBe(false);
		});
	});

	describe('addControlsBasedOffVehicleType', () => {
		it('should add vehicle specific controls to the form', () => {
			const addControlSpy = jest.spyOn(component.form, 'addControl');
			const vehicleControlsSpy = jest
				.spyOn(component, 'controlsBasedOffVehicleType', 'get')
				.mockReturnValue(component.motorcycleFields);
			component.addControlsBasedOffVehicleType();
			expect(vehicleControlsSpy).toHaveBeenCalled();
			expect(addControlSpy).toHaveBeenCalled();
		});
	});

	describe('handlePsvPassengersChange', () => {
		let form: FormGroup;

		beforeEach(() => {
			form = new FormGroup({
				techRecord_seatsUpperDeck: new FormControl(0),
				techRecord_seatsLowerDeck: new FormControl(0),
				techRecord_standingCapacity: new FormControl(0),
				techRecord_vehicleClass_description: new FormControl(''),
				techRecord_vehicleSize: new FormControl(''),
			});
		});

		it('should set vehicle size to SMALL and class to SmallPsvIeLessThanOrEqualTo22Seats when total passengers are less than or equal to 22', () => {
			form.patchValue({
				techRecord_seatsUpperDeck: 5,
				techRecord_seatsLowerDeck: 10,
				techRecord_standingCapacity: 5,
			});

			const control = form.get('techRecord_standingCapacity') as FormControl;
			control.markAsDirty();
			const validator = component.handlePsvPassengersChange()(control);
			expect(validator).toBe(null);
			expect(form.getRawValue().techRecord_vehicleSize).toBe(VehicleSizes.SMALL);
			expect(form.getRawValue().techRecord_vehicleClass_description).toBe(VehicleClassDescription.SMALL_PSV);
		});

		it('should set vehicle size to LARGE and class to LargePsvIeGreaterThan23Seats when total passengers are greater than 22', () => {
			form.patchValue({
				techRecord_seatsUpperDeck: 5,
				techRecord_seatsLowerDeck: 20,
				techRecord_standingCapacity: 5,
			});

			const control = form.get('techRecord_standingCapacity') as FormControl;
			control.markAsDirty();
			const validator = component.handlePsvPassengersChange()(control);
			expect(validator).toBe(null);
			expect(form.getRawValue().techRecord_vehicleSize).toBe(VehicleSizes.LARGE);
			expect(form.getRawValue().techRecord_vehicleClass_description).toBe(VehicleClassDescription.LARGE_PSV);
		});
	});

	describe('handleUpdateFunctionCode', () => {
		it('should update the function code to A when articulated is selected', () => {
			const updateTechRecordSpy = jest.spyOn(technicalRecordService, 'updateEditingTechRecord');
			component.form.patchValue({ techRecord_vehicleConfiguration: 'articulated' });
			component.handleUpdateFunctionCode();
			expect(updateTechRecordSpy).toHaveBeenCalledWith({ techRecord_functionCode: 'A' });
		});

		it('should update the function code to A when semi-trailer is selected', () => {
			const updateTechRecordSpy = jest.spyOn(technicalRecordService, 'updateEditingTechRecord');
			component.form.patchValue({ techRecord_vehicleConfiguration: 'semi-trailer' });
			component.handleUpdateFunctionCode();
			expect(updateTechRecordSpy).toHaveBeenCalledWith({ techRecord_functionCode: 'A' });
		});

		it('should update the function code to R when rigid is selected', () => {
			const updateTechRecordSpy = jest.spyOn(technicalRecordService, 'updateEditingTechRecord');
			component.form.patchValue({ techRecord_vehicleConfiguration: 'rigid' });
			component.handleUpdateFunctionCode();
			expect(updateTechRecordSpy).toHaveBeenCalledWith({ techRecord_functionCode: 'R' });
		});

		it('should not update the function code if value is null', () => {
			const updateTechRecordSpy = jest.spyOn(technicalRecordService, 'updateEditingTechRecord');
			component.form.patchValue({ techRecord_vehicleConfiguration: null });
			component.handleUpdateFunctionCode();
			expect(updateTechRecordSpy).not.toHaveBeenCalled();
		});
	});
});
