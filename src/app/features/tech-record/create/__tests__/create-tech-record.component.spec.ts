import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';

import { SEARCH_TYPES } from '@models/search-types-enum';
import { provideMockStore } from '@ngrx/store/testing';
import { DynamicFormService } from '@services/dynamic-forms/dynamic-form.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

import { initialAppState } from '@store/index';
import { of } from 'rxjs';
import { CreateTechRecordComponent } from '../create-tech-record.component';

describe('CreateNewVehicleRecordComponent', () => {
	let component: CreateTechRecordComponent;
	let fixture: ComponentFixture<CreateTechRecordComponent>;
	let errorService: GlobalErrorService;
	let route: ActivatedRoute;
	let router: Router;
	let techRecordService: TechnicalRecordService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CreateTechRecordComponent, ReactiveFormsModule],
			providers: [
				GlobalErrorService,
				provideRouter([]),
				provideHttpClient(),
				provideHttpClientTesting(),
				provideMockStore({ initialState: initialAppState }),
				{ provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateTechRecordComponent);
		errorService = TestBed.inject(GlobalErrorService);
		route = TestBed.inject(ActivatedRoute);
		router = TestBed.inject(Router);
		techRecordService = TestBed.inject(TechnicalRecordService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('get vehicleTypeOptions', () => {
		it('should return the expected options', () => {
			expect(component.vehicleTypeOptions).toBeTruthy();
		});
	});

	describe('get vehicleStatusOptions', () => {
		it('should return the expected options', () => {
			expect(component.vehicleStatusOptions).toBeTruthy();
		});
	});

	describe('get isFormValid', () => {
		it('should call validate with the vehicleForm and an empty array', () => {
			const validateSpy = jest.spyOn(DynamicFormService, 'validate').mockImplementation();
			const isValid = component.isFormValid;
			expect(isValid).toBeDefined();
			expect(validateSpy).toHaveBeenCalledTimes(1);
			expect(validateSpy).toHaveBeenCalledWith(component.form, []);
		});

		it('should call setErrors with an empty array', () => {
			jest.spyOn(DynamicFormService, 'validate').mockImplementation(() => {});
			const setErrorsSpy = jest.spyOn(errorService, 'setErrors').mockImplementation();
			const isValid = component.isFormValid;
			expect(isValid).toBeDefined();
			expect(setErrorsSpy).toHaveBeenCalledTimes(1);
			expect(setErrorsSpy).toHaveBeenCalledWith([]);
		});

		it('should return vehicleForm.valid', () => {
			const formValid = component.isFormValid;
			expect(formValid).toBeFalsy();
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
	});

	describe('handleSubmit', () => {
		it('should do nothing if the form is not valid', async () => {
			const formUniqueSpy = jest.spyOn(component, 'isFormValueUnique').mockImplementation();
			await component.handleSubmit();
			expect(formUniqueSpy).toHaveBeenCalledTimes(0);
		});

		it('should do nothing if the form value not unique', () => {
			const isFormValid = jest.spyOn(component, 'isFormValid', 'get').mockReturnValue(true);
			const updateEditingSpy = jest.spyOn(techRecordService, 'updateEditingTechRecord');
			const navigateSpy = jest.spyOn(router, 'navigate');
			const generateTechREcordSpy = jest.spyOn(
				techRecordService,
				'generateEditingVehicleTechnicalRecordFromVehicleType'
			);
			void component.handleSubmit();

			expect(isFormValid).toHaveReturned();
			expect(updateEditingSpy).toHaveBeenCalledTimes(0);
			expect(generateTechREcordSpy).toHaveBeenCalledTimes(0);
			expect(navigateSpy).toHaveBeenCalledTimes(0);
		});

		it('should navigate to hydrate when successful', async () => {
			jest.spyOn(component, 'isFormValid', 'get').mockReturnValue(true);
			jest.spyOn(component, 'isFormValueUnique').mockImplementation(() => Promise.resolve(true));
			const routerSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
			jest.spyOn(techRecordService, 'updateEditingTechRecord');

			await component.handleSubmit();

			fixture.detectChanges();
			expect(routerSpy).toHaveBeenCalledWith(['../create/new-record-details'], { relativeTo: route });
		});
	});

	describe('isVinUnique', () => {
		it('should call isUnique with an emptry string and the type of vin', async () => {
			const isUniqueSpy = jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(true));

			await component.isVinUnique();

			expect(isUniqueSpy).toHaveBeenCalledWith('', SEARCH_TYPES.VIN);
		});

		it('should return true when the VIN is unique', async () => {
			jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(true));

			const result = await component.isVinUnique();

			expect(result).toBeTruthy();
		});
	});

	describe('isVrmUnique', () => {
		it('should return true when the VRM is unique', async () => {
			jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(true));

			const result = await component.isVrmUnique();

			expect(result).toBeTruthy();
		});

		it('should call addError when the VRM is not unique', async () => {
			jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(false));
			const addErrorSpy = jest.spyOn(errorService, 'addError').mockImplementation();

			const result = await component.isVrmUnique();

			expect(addErrorSpy).toHaveBeenCalledWith({ error: 'Vrm not unique', anchorLink: 'input-vrm-or-trailer-id' });
			expect(result).toBeFalsy();
		});
	});

	describe('isTrailerIdUnique', () => {
		it('should return true when the trailer ID is unique', async () => {
			jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(true));
			component.techRecord = { techRecord_vehicleType: 'trl' };

			const result = await component.isTrailerIdUnique();

			expect(result).toBeTruthy();
		});

		it('should call addError when the trailer ID is not unique', async () => {
			jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(false));
			const addErrorSpy = jest.spyOn(errorService, 'addError').mockImplementation();
			component.techRecord = { techRecord_vehicleType: 'trl' };

			const result = await component.isTrailerIdUnique();

			expect(addErrorSpy).toHaveBeenCalledWith({
				error: 'TrailerId not unique',
				anchorLink: 'input-vrm-or-trailer-id',
			});
			expect(result).toBeFalsy();
		});
	});
});
