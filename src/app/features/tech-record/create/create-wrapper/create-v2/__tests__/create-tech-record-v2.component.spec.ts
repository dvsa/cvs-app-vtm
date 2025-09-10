import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';

import { SEARCH_TYPES } from '@models/search-types-enum';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType as V3TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { CreateTechRecordV2Component } from '@features/tech-record/create/create-wrapper/create-v2/create-tech-record-v2.component';
import { initialAppState } from '@store/index';
import { of } from 'rxjs';

describe('CreateTechRecordV2Component', () => {
	let component: CreateTechRecordV2Component;
	let fixture: ComponentFixture<CreateTechRecordV2Component>;
	let errorService: GlobalErrorService;
	let route: ActivatedRoute;
	let router: Router;
	let store: MockStore;
	let techRecordService: TechnicalRecordService;
	let formGroupDirective: FormGroupDirective;

	const techRecord: V3TechRecordType<'hgv', 'put'> = {
		techRecord_vehicleType: 'hgv',
		partialVin: '',
		techRecord_bodyType_description: '',
		techRecord_noOfAxles: 2,
		techRecord_reasonForCreation: 'test',
		techRecord_statusCode: 'provisional',
		techRecord_vehicleClass_description: 'heavy goods vehicle',
		primaryVrm: '',
		vin: '',
		techRecord_adrDetails_dangerousGoods: false,
	};

	beforeEach(async () => {
		formGroupDirective = new FormGroupDirective([], []);
		formGroupDirective.form = new FormGroup<
			Partial<Record<keyof TechRecordType<'hgv' | 'car' | 'psv' | 'lgv' | 'trl'>, FormControl>>
		>({});

		await TestBed.configureTestingModule({
			imports: [CreateTechRecordV2Component, ReactiveFormsModule],
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
		fixture = TestBed.createComponent(CreateTechRecordV2Component);
		errorService = TestBed.inject(GlobalErrorService);
		route = TestBed.inject(ActivatedRoute);
		router = TestBed.inject(Router);
		techRecordService = TestBed.inject(TechnicalRecordService);
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;
		fixture.detectChanges();
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

			expect(navigateSpy).toHaveBeenCalledWith(['..'], { relativeTo: route });
		});
	});

	describe('handleSubmit', () => {
		beforeEach(() => {
			component.vinUnique = true;
		});

		it('should navigate to hydrate when successful', async () => {
			jest.spyOn(component, 'isFormValueUnique').mockImplementation(() => Promise.resolve(true));
			jest.spyOn(errorService, 'extractGlobalErrors').mockImplementation(() => []);
			const routerSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
			jest.spyOn(techRecordService, 'updateEditingTechRecord');

			await component.handleSubmit();

			fixture.detectChanges();
			expect(routerSpy).toHaveBeenCalledWith(['../create/new-record-details'], { relativeTo: route });
		});

		it('should set the global errors if form is not valid', async () => {
			jest.spyOn(errorService, 'extractGlobalErrors').mockImplementation(() => [{ error: 'Form is invalid' }]);
			jest.spyOn(errorService, 'setErrors');

			await component.handleSubmit();

			expect(errorService.setErrors).toHaveBeenCalled();
		});

		it('should not navigate anywhere if the VRM or Trailer ID is not unique', async () => {
			jest.spyOn(component, 'isFormValueUnique').mockImplementation(() => Promise.resolve(false));
			jest.spyOn(errorService, 'extractGlobalErrors').mockImplementation(() => []);
			const routerSpy = jest.spyOn(router, 'navigate');

			await component.handleSubmit();

			expect(routerSpy).not.toHaveBeenCalled();
		});

		it('should navigate to the duplicate VIN page if the VIN is not unique', async () => {
			jest.spyOn(component, 'isFormValueUnique').mockImplementation(() => Promise.resolve(false));
			jest.spyOn(errorService, 'extractGlobalErrors').mockImplementation(() => []);
			const routerSpy = jest.spyOn(router, 'navigate');
			component.vrmUnique = true;
			component.vinUnique = false;

			await component.handleSubmit();

			expect(routerSpy).toHaveBeenCalledWith(['../create/duplicate-vin'], { relativeTo: component.route });
		});
	});

	describe('isVinUnique', () => {
		it('should call isUnique with an empty string and the type of vin', async () => {
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

		it('should call addError when the VRM must be unique', async () => {
			jest.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(false));
			const addErrorSpy = jest.spyOn(errorService, 'addError').mockImplementation();

			const result = await component.isVrmUnique();

			expect(addErrorSpy).toHaveBeenCalledWith({ error: 'VRM must be unique', anchorLink: 'input-vrm-or-trailer-id' });
			expect(result).toBeFalsy();
		});
	});
});
