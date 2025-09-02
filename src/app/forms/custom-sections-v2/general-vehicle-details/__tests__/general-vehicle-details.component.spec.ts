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
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryTrl.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GeneralVehicleDetailsComponent } from '@forms/custom-sections-v2/general-vehicle-details/general-vehicle-details.component';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { BodyTypeCode, BodyTypeDescription, trlBodyTypeCodeMap } from '@models/body-type-enum';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { V3TechRecordModel, VehicleConfigurations, VehicleTypes } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';

describe('GeneralVehicleDetailsComponent', () => {
	let technicalRecordService: TechnicalRecordService;
	let store: MockStore;
	let component: GeneralVehicleDetailsComponent;
	let componentRef: ComponentRef<GeneralVehicleDetailsComponent>;
	let fixture: ComponentFixture<GeneralVehicleDetailsComponent>;
	let controlContainer: ControlContainer;
	let formGroupDirective: FormGroupDirective;
	let optionsService: MultiOptionsService;

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<
			Partial<Record<keyof TechRecordType<'hgv' | 'car' | 'psv' | 'lgv' | 'trl'>, FormControl>>
		>({});
		const mockTechRecord = mockVehicleTechnicalRecord('hgv');

		await TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, GeneralVehicleDetailsComponent],
			providers: [
				provideMockStore({ initialState: initialAppState }),
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: ControlContainer, useValue: formGroupDirective },
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
				TechnicalRecordService,
				{ provide: MultiOptionsService, useValue: { getOptions: jest.fn(), loadOptions: jest.fn() } },
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		technicalRecordService = TestBed.inject(TechnicalRecordService);
		controlContainer = TestBed.inject(ControlContainer);
		optionsService = TestBed.inject(MultiOptionsService);

		fixture = TestBed.createComponent(GeneralVehicleDetailsComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;
		componentRef.setInput('techRecord', mockTechRecord);
		component.form.reset();
		fixture.detectChanges();
	});

	describe('ngOnInit', () => {
		it('should attach its form to its parent form', () => {
			const parentFormSpy = jest.spyOn(controlContainer.control as FormGroup, 'addControl');
			const loadOptions = jest.spyOn(component, 'loadOptions');
			const loadBodyMakes = jest.spyOn(component, 'loadBodyMakes');
			component.ngOnInit();
			expect(parentFormSpy).toHaveBeenCalled();
			expect(loadOptions).toHaveBeenCalled();
			expect(loadBodyMakes).toHaveBeenCalled();
		});

		it('should set bodyTypes to trailer options when vehicle type is TRL', () => {
			jest.spyOn(component, 'getVehicleType').mockReturnValue(VehicleTypes.TRL);
			const trailerBodyTypes = [BodyTypeDescription.FLAT, BodyTypeDescription.ARTICULATED];
			jest.spyOn(trlBodyTypeCodeMap, 'values').mockReturnValue(trailerBodyTypes.values());
			const trailerOptions = [
				{ label: 'Flat', value: 'flat' },
				{ label: 'Articulated', value: 'articulated' },
			];
			jest.spyOn<any, any>(getOptionsFromEnum, 'apply').mockReturnValue(trailerOptions);

			const vehicleType = component.getVehicleType();
			if (vehicleType === VehicleTypes.TRL) {
				component.bodyTypes = getOptionsFromEnum(Array.from(trlBodyTypeCodeMap.values()));
			}

			expect(component.bodyTypes).toEqual(trailerOptions);
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
				techRecord_euVehicleCategory: EUVehicleCategory.O1,
			} as V3TechRecordModel;
			jest.spyOn(component.technicalRecordService, 'getVehicleTypeWithSmallTrl').mockReturnValue(VehicleTypes.HGV);
			componentRef.setInput('techRecord', mockTechRecord);
			expect(component.getVehicleType()).toBe(VehicleTypes.HGV);
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

	describe('loadBodyMakes', () => {
		it('should load the options based off the vehicle type (PSV)', () => {
			const optionServSpy = jest.spyOn(optionsService, 'getOptions');
			const mockTechRecord = mockVehicleTechnicalRecord('psv');
			componentRef.setInput('techRecord', mockTechRecord);
			component.loadBodyMakes();
			expect(optionServSpy).toHaveBeenCalledWith(ReferenceDataResourceType.PsvMake);
		});

		it('should load the options based off the vehicle type (HGV)', () => {
			const optionServSpy = jest.spyOn(optionsService, 'getOptions');
			const mockTechRecord = mockVehicleTechnicalRecord('hgv');
			componentRef.setInput('techRecord', mockTechRecord);
			component.loadBodyMakes();
			expect(optionServSpy).toHaveBeenCalledWith(ReferenceDataResourceType.HgvMake);
		});

		it('should load the options based off the vehicle type (TRL)', () => {
			const optionServSpy = jest.spyOn(optionsService, 'getOptions');
			const mockTechRecord = mockVehicleTechnicalRecord('trl');
			componentRef.setInput('techRecord', mockTechRecord);
			component.loadBodyMakes();
			expect(optionServSpy).toHaveBeenCalledWith(ReferenceDataResourceType.TrlMake);
		});
	});

	describe('handleUpdateVehicleConfiguration', () => {
		it('should, for HGVs, set the body type description to articulated and code to A if articulated is selected', () => {
			const mockTechRecord = mockVehicleTechnicalRecord('hgv');
			componentRef.setInput('techRecord', mockTechRecord);
			component.form.patchValue({
				techRecord_vehicleConfiguration: 'articulated',
			});

			const formSpy = jest.spyOn(component.form, 'patchValue');
			component.handleVehicleConfigurationChange();

			expect(formSpy).toHaveBeenCalledWith({
				techRecord_bodyType_description: 'articulated',
				techRecord_bodyType_code: 'a',
			});
		});

		it('should, for HGVs, set the body type description to null and code to null if rigid is selected, and articulated was previously selected', () => {
			const mockTechRecord = mockVehicleTechnicalRecord('hgv');
			componentRef.setInput('techRecord', mockTechRecord);
			component.form.patchValue({
				techRecord_vehicleConfiguration: 'rigid',
				techRecord_bodyType_description: BodyTypeDescription.ARTICULATED,
				techRecord_bodyType_code: BodyTypeCode.A,
			});

			const formSpy = jest.spyOn(component.form, 'patchValue');
			component.handleVehicleConfigurationChange();

			expect(formSpy).toHaveBeenCalledWith({
				techRecord_bodyType_description: null,
				techRecord_bodyType_code: null,
			});
		});

		it('should, for HGVs set the function code to R if rigid is selected', () => {
			const mockTechRecord = mockVehicleTechnicalRecord('hgv');
			componentRef.setInput('techRecord', mockTechRecord);
			component.form.patchValue({
				techRecord_vehicleConfiguration: 'rigid',
			});

			const formSpy = jest.spyOn(component.form, 'patchValue');
			component.handleVehicleConfigurationChange();

			expect(formSpy).toHaveBeenCalledWith({
				techRecord_functionCode: 'R',
			});
		});

		it('should, for HGVs set the function code to A if articulated is selected', () => {
			const mockTechRecord = mockVehicleTechnicalRecord('hgv');
			componentRef.setInput('techRecord', mockTechRecord);
			component.form.patchValue({
				techRecord_vehicleConfiguration: 'articulated',
			});

			const formSpy = jest.spyOn(component.form, 'patchValue');
			component.handleVehicleConfigurationChange();

			expect(formSpy).toHaveBeenCalledWith({
				techRecord_functionCode: 'A',
			});
		});

		it('should, for TRLs, set the function code to A is semi-trailer is selected', () => {
			const mockTechRecord = mockVehicleTechnicalRecord('trl');
			componentRef.setInput('techRecord', mockTechRecord);
			component.form.patchValue({
				techRecord_vehicleConfiguration: 'semi-trailer',
			});

			const formSpy = jest.spyOn(component.form, 'patchValue');
			component.handleVehicleConfigurationChange();

			expect(formSpy).toHaveBeenCalledWith({
				techRecord_functionCode: 'A',
			});
		});
	});

	describe('handleBodyTypeDescriptionChange', () => {
		it('should set the bodyType code to a if the vehicle configuration and body type are articulated for a hgv', () => {
			const mockTechRecord = mockVehicleTechnicalRecord('hgv');
			componentRef.setInput('techRecord', mockTechRecord);
			component.form.patchValue({
				techRecord_bodyType_description: BodyTypeDescription.ARTICULATED,
				techRecord_vehicleConfiguration: VehicleConfigurations.ARTICULATED,
				techRecord_vehicleType: VehicleTypes.HGV,
			});

			const formSpy = jest.spyOn(component.form, 'patchValue');
			component.handleBodyTypeDescriptionChange();

			expect(formSpy).toHaveBeenCalledWith({
				techRecord_bodyType_code: 'a',
			});
		});
	});
});
