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
import { initialAppState } from '@store/index';
import { Subject, of } from 'rxjs';
import { CreateTechRecordComponent } from '../create-tech-record.component';

describe('CreateTechRecordComponent', () => {
	let component: CreateTechRecordComponent;
	let fixture: ComponentFixture<CreateTechRecordComponent>;
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
		store = TestBed.inject(MockStore);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('navigateBack', () => {
		it('should clear all errors', () => {
			vi.spyOn(router, 'navigate').mockImplementation();

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
		beforeEach(() => {
			component.vinUnique = true;
		});

		it('should navigate to hydrate when successful', async () => {
			vi.spyOn(component, 'isFormValueUnique').mockImplementation(() => Promise.resolve(true));
			vi.spyOn(errorService, 'extractGlobalErrors').mockImplementation(() => []);
			const routerSpy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
			vi.spyOn(techRecordService, 'updateEditingTechRecord');

			await component.handleSubmit();

			fixture.detectChanges();
			expect(routerSpy).toHaveBeenCalledWith(['../create/new-record-details'], { relativeTo: route });
		});

		it('should set the global errors if form is not valid', async () => {
			vi.spyOn(errorService, 'extractGlobalErrors').mockImplementation(() => [{ error: 'Form is invalid' }]);
			vi.spyOn(errorService, 'setErrors');

			await component.handleSubmit();

			expect(errorService.setErrors).toHaveBeenCalled();
		});

		it('should not navigate anywhere if the VRM or Trailer ID is not unique', async () => {
			vi.spyOn(component, 'isFormValueUnique').mockImplementation(() => Promise.resolve(false));
			vi.spyOn(errorService, 'extractGlobalErrors').mockImplementation(() => []);
			const routerSpy = vi.spyOn(router, 'navigate');
			component.vrmUnique = false;
			component.trlUnique = false;
			component.form.controls.generateID.setValue(false);

			await component.handleSubmit();

			expect(routerSpy).not.toHaveBeenCalled();
		});

		it('should navigate to the duplicate VIN page if the VIN is not unique', async () => {
			vi.spyOn(component, 'isFormValueUnique').mockImplementation(() => Promise.resolve(false));
			vi.spyOn(errorService, 'extractGlobalErrors').mockImplementation(() => []);
			const routerSpy = vi.spyOn(router, 'navigate');
			component.vrmUnique = true;
			component.vinUnique = false;

			await component.handleSubmit();

			expect(routerSpy).toHaveBeenCalledWith(['../create/duplicate-vin'], { relativeTo: component.route });
		});
	});

	describe('isFormValueUnique', () => {
		it.each(['hgv', 'trl'] as const)('should check VIN and the %s identifier concurrently', async (vehicleType) => {
			component.form.controls.vehicleType.setValue(vehicleType);
			component.form.controls.generateID.setValue(false);
			component.form.controls.vin.setValue('VIN123');
			component.form.controls.vrmTrm.setValue('AB123');
			const vin = new Subject<boolean>();
			const identifier = new Subject<boolean>();
			const isUnique = vi
				.spyOn(techRecordService, 'isUnique')
				.mockImplementation((_, type) => (type === SEARCH_TYPES.VIN ? vin : identifier));

			const result = component.isFormValueUnique();
			expect(isUnique).toHaveBeenCalledWith('VIN123', SEARCH_TYPES.VIN);
			expect(isUnique).toHaveBeenCalledWith(
				'AB123',
				vehicleType === 'trl' ? SEARCH_TYPES.TRAILER_ID : SEARCH_TYPES.VRM
			);

			identifier.next(true);
			vin.next(false);
			expect(await result).toBe(false);
			expect(component.vinUnique).toBe(false);
			expect(vehicleType === 'trl' ? component.trlUnique : component.vrmUnique).toBe(true);
		});

		it('should skip identifier checks when generating an ID', async () => {
			component.form.controls.generateID.setValue(true);
			const isUnique = vi.spyOn(techRecordService, 'isUnique').mockReturnValue(of(true));

			expect(await component.isFormValueUnique()).toBe(true);
			expect(isUnique).toHaveBeenCalledOnce();
			expect(isUnique).toHaveBeenCalledWith(component.form.controls.vin.value, SEARCH_TYPES.VIN);
		});

		it('should retain the completed VIN check if the identifier check fails and is retried', async () => {
			component.form.controls.vehicleType.setValue('hgv');
			component.form.controls.generateID.setValue(false);
			const identifier = new Subject<boolean>();
			const isUnique = vi
				.spyOn(techRecordService, 'isUnique')
				.mockImplementation((_, type) => (type === SEARCH_TYPES.VIN ? of(true) : identifier));
			const result = component.isFormValueUnique();
			const rejected = expect(result).rejects.toThrow('lookup failed');
			identifier.error(new Error('lookup failed'));
			await rejected;

			isUnique.mockClear().mockReturnValue(of(true));
			expect(await component.isFormValueUnique()).toBe(true);
			expect(isUnique).toHaveBeenCalledOnce();
			expect(isUnique.mock.calls[0][1]).toBe(SEARCH_TYPES.VRM);
		});
	});

	describe('isVinUnique', () => {
		it('should call isUnique with an empty string and the type of vin', async () => {
			const isUniqueSpy = vi.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(true));
			component.form.controls.vin.setValue('');

			await component.isVinUnique();

			expect(isUniqueSpy).toHaveBeenCalledWith('', SEARCH_TYPES.VIN);
		});

		it('should return true when the VIN is unique', async () => {
			vi.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(true));

			const result = await component.isVinUnique();

			expect(result).toBeTruthy();
		});
	});

	describe('isVrmUnique', () => {
		it('should return true when the VRM is unique', async () => {
			vi.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(true));

			const result = await component.isVrmUnique();

			expect(result).toBeTruthy();
		});

		it('should call addError when the VRM must be unique', async () => {
			vi.spyOn(techRecordService, 'isUnique').mockImplementation(() => of(false));
			const addErrorSpy = vi.spyOn(errorService, 'addError').mockImplementation();

			const result = await component.isVrmUnique();

			expect(addErrorSpy).toHaveBeenCalledWith({ error: 'VRM must be unique', anchorLink: 'input-vrm-or-trailer-id' });
			expect(result).toBeFalsy();
		});
	});
});
