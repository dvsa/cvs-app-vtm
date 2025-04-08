import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { initialAppState } from '@store/index';

import { provideHttpClient } from '@angular/common/http';
import { SimpleChanges } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { HgvAndTrlBodyTemplate } from '@forms/templates/general/hgv-trl-body.template';
import { PsvBodyTemplate } from '@forms/templates/psv/psv-body.template';
import { createMockHgv } from '@mocks/hgv-record.mock';
import { createMockPsv } from '@mocks/psv-record.mock';
import { createMockTrl } from '@mocks/trl-record.mock';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { FormNodeEditTypes, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { UserService } from '@services/user-service/user-service';
import { asapScheduler, lastValueFrom, of } from 'rxjs';
import { BodyComponent } from '../body.component';

describe('BodyComponent', () => {
	let component: BodyComponent;
	let fixture: ComponentFixture<BodyComponent>;
	let store: MockStore;
	let multiOptionsService: MultiOptionsService;
	let dynamicFormService: DynamicFormService;
	let referenceDataService: ReferenceDataService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule, BodyComponent, ReactiveFormsModule],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				ReferenceDataService,
				{ provide: UserService, useValue: {} },
				{ provide: MultiOptionsService, useValue: { getOptions: jest.fn(), loadOptions: jest.fn() } },
			],
		}).compileComponents();
		store = TestBed.inject(MockStore);
		multiOptionsService = TestBed.inject(MultiOptionsService);
		dynamicFormService = TestBed.inject(DynamicFormService);
		referenceDataService = TestBed.inject(ReferenceDataService);
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BodyComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('techRecord', {
			systemNumber: 'foo',
			createdTimestamp: 'bar',
			vin: 'testVin',
			techRecord_vehicleType: VehicleTypes.PSV,
			techRecord_brakes_dtpNumber: '000000',
			techRecord_bodyModel: 'model',
			techRecord_bodyType_description: 'type',
			techRecord_chassisMake: 'chassisType',
		} as unknown as TechRecordType<'psv'>);

		fixture.detectChanges();
	});
	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('The DTpNumber value on this.form', () => {
		it('should match the corresponding values on vehicleTechRecord', () => {
			expect((component.techRecord() as TechRecordType<'psv'>).techRecord_brakes_dtpNumber).toStrictEqual(
				component.form.value.techRecord_brakes_dtpNumber
			);
		});
	});
	describe('The bodyModel value on this.form', () => {
		it('should match the corresponding values on vehicleTechRecord', () => {
			expect((component.techRecord() as TechRecordType<'psv'>).techRecord_bodyModel).toStrictEqual(
				component.form.value.techRecord_bodyModel
			);
		});
	});
	describe('The bodyType value on this.form', () => {
		it('should match the corresponding values on vehicleTechRecord', () => {
			expect((component.techRecord() as TechRecordType<'psv'>).techRecord_bodyType_description).toStrictEqual(
				component.form.controls['techRecord_bodyType_description']?.value
			);
		});
	});
	describe('The chassisMake value on this.form', () => {
		it('should match the corresponding values on vehicleTechRecord', () => {
			expect((component.techRecord() as TechRecordType<'psv'>).techRecord_chassisMake).toStrictEqual(
				component.form.controls['techRecord_chassisMake']?.value
			);
		});
	});
	describe('updateArticulatedHgvVehicleBodyType', () => {
		it('should dispatch updateEditingTechRecord if vehicle is hgv and articulated', () => {
			const mockRecord = {
				techRecord_vehicleType: 'hgv',
				techRecord_vehicleConfiguration: 'articulated',
				techRecord_bodyType_description: '',
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_brakes_dtpNumber: '000000',
				techRecord_bodyModel: 'model',
				techRecord_chassisMake: 'chassisType',
			} as unknown as V3TechRecordModel;
			fixture.componentRef.setInput('techRecord', mockRecord);

			const dispatchSpy = jest.spyOn(asapScheduler, 'schedule');
			component.updateHgvVehicleBodyType(mockRecord as TechRecordType<'hgv'>);
			expect(dispatchSpy).toHaveBeenCalled();
		});
		it('should not dispatch updateEditingTechRecord if vehicle is hgv and rigid', () => {
			const mockRecord = {
				techRecord_vehicleType: 'hgv',
				techRecord_vehicleConfiguration: 'rigid',
				techRecord_bodyType_description: '',
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testVin',
				techRecord_brakes_dtpNumber: '000000',
				techRecord_bodyModel: 'model',
				techRecord_chassisMake: 'chassisType',
			} as unknown as V3TechRecordModel;

			fixture.componentRef.setInput('techRecord', mockRecord);

			const dispatchSpy = jest.spyOn(store, 'dispatch');
			component.updateHgvVehicleBodyType(mockRecord as TechRecordType<'hgv'>);
			expect(dispatchSpy).not.toHaveBeenCalled();
		});
	});

	describe('loadOptions', () => {
		it('should trigger the loading of HGV make ref data when viewing a HGV', () => {
			const spy = jest.spyOn(multiOptionsService, 'loadOptions');
			fixture.componentRef.setInput('disableLoadOptions', false);
			fixture.componentRef.setInput('techRecord', createMockHgv(123));
			component.loadOptions();
			expect(spy).toHaveBeenCalledWith(ReferenceDataResourceType.HgvMake);
		});

		it('should trigger the loading of PSV make ref data when viewing a PSV', () => {
			const spy = jest.spyOn(multiOptionsService, 'loadOptions');
			fixture.componentRef.setInput('disableLoadOptions', false);
			fixture.componentRef.setInput('techRecord', createMockPsv(123));
			component.loadOptions();
			expect(spy).toHaveBeenCalledWith(ReferenceDataResourceType.PsvMake);
		});

		it('should trigger the loading of TRL make ref data when viewing a TRL', () => {
			const spy = jest.spyOn(multiOptionsService, 'loadOptions');
			fixture.componentRef.setInput('disableLoadOptions', false);
			fixture.componentRef.setInput('techRecord', createMockTrl(123));
			component.loadOptions();
			expect(spy).toHaveBeenCalledWith(ReferenceDataResourceType.TrlMake);
		});
	});

	describe('ngOnInit', () => {
		it('should use the PSV body type template to create the form when the vehicle type of the provided tech record is PSV', () => {
			const techRecord = createMockPsv(123);
			const dfsSpy = jest.spyOn(dynamicFormService, 'createForm');
			fixture.componentRef.setInput('techRecord', techRecord);
			component.ngOnInit();
			expect(dfsSpy).toHaveBeenCalledWith(PsvBodyTemplate, techRecord);
		});

		it('should use the HGV body type template to create the form when the vehicle type of the provided tech record is HGV', () => {
			const techRecord = createMockHgv(123);
			const dfsSpy = jest.spyOn(dynamicFormService, 'createForm');
			fixture.componentRef.setInput('techRecord', techRecord);
			component.ngOnInit();
			expect(dfsSpy).toHaveBeenCalledWith(HgvAndTrlBodyTemplate, techRecord);
		});

		it('should call load options to fetch the ref data required for displaying the vehicle type', () => {
			const loadOptionsSpy = jest.spyOn(component, 'loadOptions');
			component.ngOnInit();
			expect(loadOptionsSpy).toHaveBeenCalled();
		});
	});

	describe('ngOnChanges', () => {
		it('should do nothing if the tech record input has not changed', () => {
			const formSpy = jest.spyOn(component.form, 'patchValue');
			component.ngOnChanges({} as SimpleChanges);
			expect(formSpy).not.toHaveBeenCalled();
		});

		it('should patch the form with the current tech record when this changes', () => {
			const formSpy = jest.spyOn(component.form, 'patchValue');
			component.ngOnChanges({ techRecord: { currentValue: {}, previousValue: null } } as unknown as SimpleChanges);
			expect(formSpy).toHaveBeenCalled();
		});
	});

	describe('editTypes', () => {
		it('should return the form node edit types enum', () => {
			expect(component.editTypes).toBe(FormNodeEditTypes);
		});
	});

	describe('widths', () => {
		it('should return the form node width enum', () => {
			expect(component.widths).toBe(FormNodeWidth);
		});
	});

	describe('bodyMakes', () => {
		it('should return an observable which emits PSV body make ref data when the tech record is a PSV', async () => {
			const mockData = [{ label: 'PSV', value: 'psv' }];
			const spy = jest.spyOn(multiOptionsService, 'getOptions').mockReturnValue(of(mockData));
			fixture.componentRef.setInput('techRecord', createMockPsv(123));
			await expect(lastValueFrom(component.bodyMakes$)).resolves.toEqual(mockData);
			expect(spy).toHaveBeenCalledWith(ReferenceDataResourceType.PsvMake);
		});

		it('should return an observable which emits HGV body make ref data when the tech record is a HGV', async () => {
			const mockData = [{ label: 'HGV', value: 'HGV' }];
			const spy = jest.spyOn(multiOptionsService, 'getOptions').mockReturnValue(of(mockData));
			fixture.componentRef.setInput('techRecord', createMockHgv(123));
			await expect(lastValueFrom(component.bodyMakes$)).resolves.toEqual(mockData);
			expect(spy).toHaveBeenCalledWith(ReferenceDataResourceType.HgvMake);
		});

		it('should return an observable which emits TRL body make ref data when the tech record is a TRL', async () => {
			const mockData = [{ label: 'TRL', value: 'TRL' }];
			const spy = jest.spyOn(multiOptionsService, 'getOptions').mockReturnValue(of(mockData));
			fixture.componentRef.setInput('techRecord', createMockTrl(123));
			await expect(lastValueFrom(component.bodyMakes$)).resolves.toEqual(mockData);
			expect(spy).toHaveBeenCalledWith(ReferenceDataResourceType.TrlMake);
		});
	});

	describe('dtpNumbers', () => {
		it('should return an observable which emits an array of multi options derrived from reference data', async () => {
			const allMockData = [{ resourceKey: 'psv', resourceType: ReferenceDataResourceType.PsvMake }];
			const getAllSpy = jest.spyOn(referenceDataService, 'getAll$').mockReturnValue(of(allMockData));
			const getPsvMakeDataLoadingSpy = jest
				.spyOn(referenceDataService, 'getReferencePsvMakeDataLoading$')
				.mockReturnValue(of(false));
			fixture.componentRef.setInput('techRecord', createMockPsv(123));
			await expect(lastValueFrom(component.dtpNumbers$)).resolves.toEqual([{ value: 'psv', label: 'psv' }]);
			expect(getAllSpy).toHaveBeenCalledWith(ReferenceDataResourceType.PsvMake);
			expect(getPsvMakeDataLoadingSpy).toHaveBeenCalled();
		});
	});
});
