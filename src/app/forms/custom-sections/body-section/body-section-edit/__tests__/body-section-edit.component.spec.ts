import { updateVehicleConfiguration } from '@/src/app/store/technical-records';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectorRef, ComponentRef } from '@angular/core';
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
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { selectReferenceDataByResourceKey } from '@store/reference-data';
import { ReplaySubject, of } from 'rxjs';
import { BodySectionEditComponent } from '../body-section-edit.component';

const mockReferenceDataService = {
	addSearchInformation: jest.fn(),
	getTyreSearchReturn$: jest.fn(),
	getTyreSearchCriteria$: jest.fn(),
	loadReferenceDataByKeySearch: jest.fn(),
	loadTyreReferenceDataByKeySearch: jest.fn(),
	loadReferenceData: jest.fn(),
	getReferenceDataOptions: jest.fn(),
};

describe('BodySectionEditComponent', () => {
	let controlContainer: ControlContainer;
	let component: BodySectionEditComponent;
	let componentRef: ComponentRef<BodySectionEditComponent>;
	let fixture: ComponentFixture<BodySectionEditComponent>;
	let formGroupDirective: FormGroupDirective;
	let store: MockStore;
	let optionsService: MultiOptionsService;

	const actions$ = new ReplaySubject<Action>();

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<
			Partial<Record<keyof TechRecordType<'hgv' | 'car' | 'psv' | 'lgv' | 'trl'>, FormControl>>
		>({});
		const mockTechRecord = mockVehicleTechnicalRecord('hgv');

		await TestBed.configureTestingModule({
			declarations: [BodySectionEditComponent],
			imports: [DynamicFormsModule, FormsModule, ReactiveFormsModule],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockActions(() => actions$),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
				TechnicalRecordService,
				{ provide: ReferenceDataService, useValue: mockReferenceDataService },
				ChangeDetectorRef,
				{ provide: MultiOptionsService, useValue: { getOptions: jest.fn(), loadOptions: jest.fn() } },
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		controlContainer = TestBed.inject(ControlContainer);
		optionsService = TestBed.inject(MultiOptionsService);

		fixture = TestBed.createComponent(BodySectionEditComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;
		componentRef.setInput('techRecord', mockTechRecord);
		component.form.reset();
		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should call addControlsBasedOffVehicleType', () => {
			const addControlsBasedOffVehicleTypeSpy = jest.spyOn(component, 'addControlsBasedOffVehicleType');
			component.ngOnInit();
			expect(addControlsBasedOffVehicleTypeSpy).toHaveBeenCalled();
		});

		it('should attach all form controls to parent', () => {
			const parent = controlContainer.control as FormGroup;
			component.ngOnInit();
			expect(parent.controls).toEqual(component.form.controls);
		});

		it('should call loadOptions', () => {
			const loadOptionsSpy = jest.spyOn(component, 'loadOptions');
			component.ngOnInit();
			expect(loadOptionsSpy).toHaveBeenCalled();
		});
		it('should patch the form when dtpNumber changes', () => {
			const form = new FormGroup({
				techRecord_brakes_dtpNumber: new FormControl(''),
			});
			const refData: ReferenceDataModelBase = {
				resourceType: ReferenceDataResourceType.PsvMake,
				resourceKey: '1234',
			};
			const mockTechRecord = mockVehicleTechnicalRecord('psv');
			mockTechRecord.techRecord_vehicleType = VehicleTypes.PSV;
			componentRef.setInput('techRecord', mockTechRecord);

			store.overrideSelector(selectReferenceDataByResourceKey(ReferenceDataResourceType.PsvMake, '1234'), refData);
			const control = form.get('techRecord_brakes_dtpNumber');
			const pipeSpy = jest.spyOn(control!.valueChanges, 'pipe').mockReturnValue(of(refData));
			const dtpSpy = jest.spyOn(component, 'handleDTpNumberChange');

			component.form = form;
			component.ngOnInit();

			form.patchValue({
				techRecord_brakes_dtpNumber: '1234',
			});

			expect(pipeSpy).toHaveBeenCalled();
			expect(dtpSpy).toHaveBeenCalled();
		});

		it('should listen for vehicleConfiguration changes', () => {
			const handleUpdateVehicleConfigurationSpy = jest.spyOn(component, 'handleUpdateVehicleConfiguration');
			component.ngOnInit();
			expect(handleUpdateVehicleConfigurationSpy).toHaveBeenCalled();
		});
	});

	describe('handleDTpNumberChange', () => {
		it('should patch the form and call cdr.detectChanges', () => {
			let psvMake: ReferenceDataModelBase;
			store
				.select(selectReferenceDataByResourceKey(ReferenceDataResourceType.PsvMake, '1234'))
				.subscribe((value: ReferenceDataModelBase) => {
					const cdrSpy = jest.spyOn(component.cdr, 'detectChanges');
					const formSpy = jest.spyOn(component.form, 'patchValue');
					psvMake = value;
					component.handleDTpNumberChange(psvMake);
					expect(cdrSpy).toHaveBeenCalled();
					expect(formSpy).toHaveBeenCalled();
				});
		});
	});

	describe('handleUpdateVehicleConfiguration', () => {
		it('should, for HGVs, set the body type description to articulated and code to A if articulated is selected', () => {
			const formSpy = jest.spyOn(component.form, 'patchValue');
			const mockTechRecord = mockVehicleTechnicalRecord('hgv');
			componentRef.setInput('techRecord', mockTechRecord);
			component.handleUpdateVehicleConfiguration();
			actions$.next(updateVehicleConfiguration({ vehicleConfiguration: 'articulated' }));
			expect(formSpy).toHaveBeenCalledWith({
				techRecord_bodyType_description: 'articulated',
				techRecord_bodyType_code: 'a',
			});
		});

		it('should, for HGVs set the function code to R if rigid is selected', () => {
			const formSpy = jest.spyOn(component.form, 'patchValue');
			const mockTechRecord = mockVehicleTechnicalRecord('hgv');
			componentRef.setInput('techRecord', mockTechRecord);
			component.handleUpdateVehicleConfiguration();
			actions$.next(updateVehicleConfiguration({ vehicleConfiguration: 'rigid' }));
			expect(formSpy).toHaveBeenCalledWith({
				techRecord_functionCode: 'R',
			});
		});

		it('should, for HGVs set the function code to A if articulated is selected', () => {
			const formSpy = jest.spyOn(component.form, 'patchValue');
			const mockTechRecord = mockVehicleTechnicalRecord('hgv');
			componentRef.setInput('techRecord', mockTechRecord);
			component.handleUpdateVehicleConfiguration();
			actions$.next(updateVehicleConfiguration({ vehicleConfiguration: 'articulated' }));
			expect(formSpy).toHaveBeenCalledWith({
				techRecord_functionCode: 'A',
			});
		});

		it('should, for TRLs, set the function code to A is semi-trailer is selected', () => {
			const formSpy = jest.spyOn(component.form, 'patchValue');
			const mockTechRecord = mockVehicleTechnicalRecord('trl');
			componentRef.setInput('techRecord', mockTechRecord);
			component.handleUpdateVehicleConfiguration();
			actions$.next(updateVehicleConfiguration({ vehicleConfiguration: 'semi-trailer' }));
			expect(formSpy).toHaveBeenCalledWith({
				techRecord_functionCode: 'A',
			});
		});
	});

	describe('ngOnDestroy', () => {
		it('should detach all form controls from parent', () => {
			const parent = controlContainer.control as FormGroup;
			component.ngOnDestroy();
			expect(Object.keys(parent.controls)).toEqual([]);
		});

		it('should complete destroy$ subject', () => {
			const completeSpy = jest.spyOn(component.destroy$, 'complete');
			component.ngOnDestroy();
			expect(completeSpy).toHaveBeenCalled();
		});

		it('should emit true to destroy$ subject', () => {
			let emittedValue: boolean | undefined;
			component.destroy$.subscribe((value) => (emittedValue = value));
			component.ngOnDestroy();
			expect(emittedValue).toBe(true);
		});
	});

	describe('addControlsBasedOffVehicleType', () => {
		it('should add vehicle specific controls to the form', () => {
			const addControlSpy = jest.spyOn(component.form, 'addControl');
			const vehicleControlsSpy = jest
				.spyOn(component, 'controlsBasedOffVehicleType', 'get')
				.mockReturnValue(component.psvFields);
			component.addControlsBasedOffVehicleType();
			expect(vehicleControlsSpy).toHaveBeenCalled();
			expect(addControlSpy).toHaveBeenCalled();
		});
	});

	describe('loadOptions', () => {
		it('should load the options based off the vehicle type (PSV)', () => {
			const optionServSpy = jest.spyOn(optionsService, 'loadOptions');
			const mockTechRecord = mockVehicleTechnicalRecord('psv');
			componentRef.setInput('techRecord', mockTechRecord);
			component.loadOptions();
			expect(optionServSpy).toHaveBeenCalledWith(ReferenceDataResourceType.PsvMake);
		});

		it('should load the options based off the vehicle type (HGV)', () => {
			const optionServSpy = jest.spyOn(optionsService, 'loadOptions');
			const mockTechRecord = mockVehicleTechnicalRecord('hgv');
			componentRef.setInput('techRecord', mockTechRecord);
			component.loadOptions();
			expect(optionServSpy).toHaveBeenCalledWith(ReferenceDataResourceType.HgvMake);
		});

		it('should load the options based off the vehicle type (TRL)', () => {
			const optionServSpy = jest.spyOn(optionsService, 'loadOptions');
			const mockTechRecord = mockVehicleTechnicalRecord('trl');
			componentRef.setInput('techRecord', mockTechRecord);
			component.loadOptions();
			expect(optionServSpy).toHaveBeenCalledWith(ReferenceDataResourceType.TrlMake);
		});
	});

	describe('bodyMakeRequiredWithDangerousGoods', () => {
		it('should return an error if dangerous goods is true and body make is empty', () => {
			const control = new FormControl('');
			const parent = new FormGroup({
				techRecord_adrDetails_dangerousGoods: new FormControl(true),
				techRecord_make: control,
			});
			control.setParent(parent);
			const validator = component.bodyMakeRequiredWithDangerousGoods();
			expect(validator(control)).toEqual({ required: 'Body make is required' });
		});

		it('should return null if dangerous goods is true and body make is not empty', () => {
			const control = new FormControl('Some Make');
			const parent = new FormGroup({
				techRecord_adrDetails_dangerousGoods: new FormControl(true),
				techRecord_make: control,
			});
			control.setParent(parent);
			const validator = component.bodyMakeRequiredWithDangerousGoods();
			expect(validator(control)).toBeNull();
		});

		it('should return null if dangerous goods is false and body make is empty', () => {
			const control = new FormControl('');
			const parent = new FormGroup({
				techRecord_adrDetails_dangerousGoods: new FormControl(false),
				techRecord_make: control,
			});
			control.setParent(parent);
			const validator = component.bodyMakeRequiredWithDangerousGoods();
			expect(validator(control)).toBeNull();
		});
	});
});
