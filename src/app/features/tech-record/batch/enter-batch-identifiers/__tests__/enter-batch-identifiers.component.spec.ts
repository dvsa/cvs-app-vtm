import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { BatchRoutes, RootRoutes } from '@/src/app/models/routes.enum';
import { SEARCH_TYPES } from '@/src/app/models/search-types-enum';
import { StatusCodes, TrailerFormType, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { HttpService } from '@/src/app/services/http/http.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { initialAppState } from '@/src/app/store';
import { upsertBatchVehicles } from '@/src/app/store/batch/batch.actions';
import { selectBatchDetails } from '@/src/app/store/batch/batch.selectors';
import { GlobalErrorServiceMock } from '@/src/mocks/global-error-service.mock';
import { TechnicalRecordServiceMock } from '@/src/mocks/technical-record-service.mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, Subject, of, throwError } from 'rxjs';
import { EnterBatchIdentifiers } from '../enter-batch-identifiers.component';

function createForm(initialValues: object) {
	const form = new FormGroup({
		id: new FormControl<number | null>(null),
		vin: new FormControl<string | null>(null),
		trailerIdOrVrm: new FormControl<string | null>(null),
		vehicleType: new FormControl<string>(VehicleTypes.TRL, { nonNullable: true }),
		createdTimestamp: new FormControl<string | null>(null),
		systemNumber: new FormControl<string | null>(null),
	});

	form.patchValue(initialValues, { emitEvent: false });

	return form;
}

describe('EnterBatchIdentifiers', () => {
	let fixture: ComponentFixture<EnterBatchIdentifiers>;
	let component: EnterBatchIdentifiers;
	let store: MockStore;
	let router: Router;
	let httpService: HttpService;
	let errorService: GlobalErrorService;
	let technicalRecordService: TechnicalRecordService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EnterBatchIdentifiers],
			providers: [
				provideRouter([
					{ path: `${RootRoutes.BATCH}/${BatchRoutes.CANCEL_BATCH}`, component: vi.fn() },
					{ path: `${RootRoutes.BATCH}/${BatchRoutes.ENTER_BATCH_DETAILS}`, component: vi.fn() },
					{ path: `${RootRoutes.BATCH}/${BatchRoutes.ENTER_TECH_RECORD_DETAILS}`, component: vi.fn() },
				]),
				provideMockStore({ initialState: initialAppState }),
				{ provide: HttpService, useValue: { searchTechRecords: vi.fn() } },
				{ provide: GlobalErrorService, useValue: GlobalErrorServiceMock },
				{ provide: TechnicalRecordService, useValue: TechnicalRecordServiceMock },
			],
		}).compileComponents();

		store = TestBed.inject(MockStore);
		router = TestBed.inject(Router);
		httpService = TestBed.inject(HttpService);
		errorService = TestBed.inject(GlobalErrorService);
		technicalRecordService = TestBed.inject(TechnicalRecordService);

		fixture = TestBed.createComponent(EnterBatchIdentifiers);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should call handlePopulateForm', () => {
			vi.spyOn(component, 'handlePopulateForm');
			component.ngOnInit();
			expect(component.handlePopulateForm).toHaveBeenCalled();
		});
	});

	describe('handlePopulateForm', () => {
		it('should call addVehicles with form state from the previous steps', () => {
			vi.spyOn(component, 'addVehicles');
			store.overrideSelector(selectBatchDetails, {
				vehicleType: VehicleTypes.TRL,
				vehicleStatus: StatusCodes.CURRENT,
				trlFormType: TrailerFormType.TES1,
				batchSize: 10,
				vehicles: [],
			});
			store.refreshState();
			component.handlePopulateForm();
			expect(component.addVehicles).toHaveBeenCalledWith(VehicleTypes.TRL, 10);
		});
	});

	describe('addVehicles', () => {
		it('should call addVehicle x times, where x is the batch size', () => {
			vi.spyOn(component, 'addVehicle');
			store.overrideSelector(selectBatchDetails, {
				vehicleType: VehicleTypes.TRL,
				vehicleStatus: StatusCodes.CURRENT,
				trlFormType: TrailerFormType.TES1,
				batchSize: 10,
				vehicles: [],
			});
			component.addVehicles(VehicleTypes.TRL, 10);
			expect(component.addVehicle).toHaveBeenCalledTimes(10);
		});
	});

	describe('addVehicle', () => {
		it('should add a vehicle form to the vehicles form array', () => {
			vi.spyOn(component.form.controls.vehicles, 'push');
			component.addVehicle(VehicleTypes.TRL, 1);
			expect(component.form.controls.vehicles.push).toHaveBeenCalled();
		});
	});

	describe('validateVehicleForCreate', () => {
		it('should return null when vin is empty', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const form = createForm({});

				component.validateVehicleForCreate(form).subscribe((result) => {
					expect(result).toBeNull();
					expect(technicalRecordService.isUnique).not.toHaveBeenCalled();
					done();
				});
			});
		});

		it('should call isUnique with vin and search type', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const vin = 'ABCDEFG';
				const form = createForm({ vin });
				vi.spyOn(technicalRecordService, 'isUnique').mockReturnValue(of(true));

				component.validateVehicleForCreate(form).subscribe(() => {
					expect(technicalRecordService.isUnique).toHaveBeenCalledWith(vin, SEARCH_TYPES.VIN);
					done();
				});
			});
		});

		it('should not add vin to duplicateVins when vin is unique', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const vin = 'ABC123';
				const form = createForm({ vin });
				vi.spyOn(technicalRecordService, 'isUnique').mockReturnValue(of(true));

				component.validateVehicleForCreate(form).subscribe((result) => {
					expect(result).toBeNull();
					expect(component.duplicateVins).toEqual([]);
					done();
				});
			});
		});

		it('should add vin to duplicateVins when vin is not unique', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const vin = 'ABC123';
				const form = createForm({ vin });
				vi.spyOn(technicalRecordService, 'isUnique').mockReturnValue(of(false));

				component.validateVehicleForCreate(form).subscribe((result) => {
					expect(result).toBeNull();
					expect(component.duplicateVins).toContain(vin);
					done();
				});
			});
		});

		it('should return null when isUnique throws', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const vin = 'ABC123';
				const form = createForm({ vin });
				vi.spyOn(technicalRecordService, 'isUnique').mockReturnValue(throwError(() => new Error('API error')));

				component.validateVehicleForCreate(form).subscribe((result) => {
					expect(result).toBeNull();
					expect(component.duplicateVins).toEqual([]);
					done();
				});
			});
		});
	});

	describe('validateVehicleForUpdate', () => {
		it('should return null when vin is empty', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const form = createForm({});

				component.validateVehicleForUpdate(form, 0, VehicleTypes.TRL).subscribe((result) => {
					expect(result).toBeNull();
					expect(httpService.searchTechRecords).not.toHaveBeenCalled();
					done();
				});
			});
		});

		it('should return an error when no matching VIN and Trailer ID is found for trailers', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const form = createForm({
					vin: 'VIN123',
					trailerIdOrVrm: 'TRL001',
				});

				vi.spyOn(httpService, 'searchTechRecords').mockReturnValue(
					of([
						{
							trailerId: 'TRL999',
							systemNumber: 'SYS1',
						},
					] as any)
				);

				component.validateVehicleForUpdate(form, 0, VehicleTypes.TRL).subscribe((result) => {
					expect(result).toEqual({
						vehicle: {
							error: 'Vehicle 1 - Could not find a record with matching VIN and Trailer ID',
							anchorLink: 'vin-0',
						},
					});
					done();
				});
			});
		});

		it('should return an error when no matching VIN and VRM is found for non-trailers', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const form = createForm({
					vin: 'VIN123',
					trailerIdOrVrm: 'AB12CDE',
				});

				vi.spyOn(httpService, 'searchTechRecords').mockReturnValue(
					of([
						{
							primaryVrm: 'ZZ99ZZZ',
							systemNumber: 'SYS1',
						},
					] as any)
				);

				component.validateVehicleForUpdate(form, 0, VehicleTypes.PSV).subscribe((result) => {
					expect(result).toEqual({
						vehicle: {
							error: 'Vehicle 1 - Could not find a record with matching VIN and VRM',
							anchorLink: 'vin-0',
						},
					});
					done();
				});
			});
		});

		it('should return an error when multiple unique system numbers are found for a trailer', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const form = createForm({
					vin: 'VIN123',
					trailerIdOrVrm: 'TRL001',
				});

				vi.spyOn(httpService, 'searchTechRecords').mockReturnValue(
					of([
						{
							trailerId: 'TRL001',
							systemNumber: 'SYS1',
						},
						{
							trailerId: 'TRL001',
							systemNumber: 'SYS2',
						},
					] as any)
				);

				component.validateVehicleForUpdate(form, 0, VehicleTypes.TRL).subscribe((result) => {
					expect(result).toEqual({
						vehicle: {
							error: 'Vehicle 1 - More than one vehicle has this VIN and Trailer ID',
							anchorLink: 'vin-0',
						},
					});
					done();
				});
			});
		});

		it('should return an error when multiple unique system numbers are found for a non-trailer', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const form = createForm({
					vin: 'VIN123',
					trailerIdOrVrm: 'AB12CDE',
				});

				vi.spyOn(httpService, 'searchTechRecords').mockReturnValue(
					of([
						{
							primaryVrm: 'AB12CDE',
							systemNumber: 'SYS1',
						},
						{
							primaryVrm: 'AB12CDE',
							systemNumber: 'SYS2',
						},
					] as any)
				);

				component.validateVehicleForUpdate(form, 0, VehicleTypes.PSV).subscribe((result) => {
					expect(result).toEqual({
						vehicle: {
							error: 'Vehicle 1 - More than one vehicle has this VIN and VRM',
							anchorLink: 'vin-0',
						},
					});
					done();
				});
			});
		});

		it('should patch systemNumber and createdTimestamp when a matching active vehicle is found', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const form = createForm({
					vin: 'VIN123',
					trailerIdOrVrm: 'TRL001',
				});

				vi.spyOn(httpService, 'searchTechRecords').mockReturnValue(
					of([
						{
							trailerId: 'TRL001',
							systemNumber: 'SYS123',
							createdTimestamp: '2024-01-01T00:00:00Z',
							techRecord_statusCode: StatusCodes.CURRENT,
						},
					] as any)
				);

				component.validateVehicleForUpdate(form, 0, VehicleTypes.TRL).subscribe((result) => {
					expect(result).toBeNull();
					expect(form.getRawValue().systemNumber).toBe('SYS123');
					expect(form.getRawValue().createdTimestamp).toBe('2024-01-01T00:00:00Z');
					done();
				});
			});
		});

		it('should not patch values when only archived records are found', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const form = createForm({
					vin: 'VIN123',
					trailerIdOrVrm: 'TRL001',
				});

				vi.spyOn(httpService, 'searchTechRecords').mockReturnValue(
					of([
						{
							trailerId: 'TRL001',
							systemNumber: 'SYS123',
							createdTimestamp: '2024-01-01T00:00:00Z',
							techRecord_statusCode: StatusCodes.ARCHIVED,
						},
					] as any)
				);

				component.validateVehicleForUpdate(form, 0, VehicleTypes.TRL).subscribe((result) => {
					expect(result).toBeNull();
					expect(form.getRawValue().systemNumber).toBeNull();
					expect(form.getRawValue().createdTimestamp).toBeNull();
					done();
				});
			});
		});

		it('should return an error when searchTechRecords throws', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const form = createForm({
					vin: 'VIN123',
				});

				vi.spyOn(httpService, 'searchTechRecords').mockReturnValue(throwError(() => new Error('API error')));

				component.validateVehicleForUpdate(form, 0, VehicleTypes.TRL).subscribe((result) => {
					expect(result).toEqual({
						vehicle: {
							error: 'Vehicle 1 - Could not find a record with matching VIN',
							anchorLink: 'vin-0',
						},
					});
					done();
				});
			});
		});
	});

	describe('validateVehicle', () => {
		it('should return null when control has no parent', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const control = new FormControl('ABC123');
				const validator = component.validateVehicle(
					0,
					VehicleTypes.TRL
				)(control) as Observable<ValidationErrors | null>;
				validator.subscribe((result) => {
					expect(result).toBeNull();
					done();
				});
			});
		});

		it('should return null when control has errors', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const form = createForm({
					vin: 'VIN123',
					trailerIdOrVrm: 'TRL001',
				});

				const control = form.get('vin')!;
				control.setErrors({ required: true });

				const validator = component.validateVehicle(
					0,
					VehicleTypes.TRL
				)(control) as Observable<ValidationErrors | null>;
				validator.subscribe((result) => {
					expect(result).toBeNull();
					done();
				});
			});
		});

		it('should return a VIN required error when trailerIdOrVrm is provided but vin is missing', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const form = createForm({
					trailerIdOrVrm: 'TRL001',
				});
				const control = form.get('vin')!;

				const validator = component.validateVehicle(
					0,
					VehicleTypes.TRL
				)(control) as Observable<ValidationErrors | null>;
				validator.subscribe((result) => {
					expect(result).toEqual({
						vin: {
							error: 'Vehicle 1 - VIN is required',
							anchorLink: 'vin-0',
						},
					});
					done();
				});
			});
		});

		it('should call validateVehicleForUpdate when trailerIdOrVrm and vin are provided', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const form = createForm({
					vin: 'VIN123',
					trailerIdOrVrm: 'TRL001',
				});
				const control = form.get('vin')!;
				const updateSpy = vi.spyOn(component, 'validateVehicleForUpdate').mockReturnValue(of(null));

				const validator = component.validateVehicle(
					0,
					VehicleTypes.TRL
				)(control) as Observable<ValidationErrors | null>;
				validator.subscribe((result) => {
					expect(result).toBeNull();
					expect(updateSpy).toHaveBeenCalledWith(form, 0, VehicleTypes.TRL);
					done();
				});
			});
		});

		it('should return the result from validateVehicleForUpdate', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const form = createForm({
					vin: 'VIN123',
					trailerIdOrVrm: 'TRL001',
				});

				const control = form.get('vin')!;

				const validationError = {
					vehicle: {
						error: 'Vehicle 1 - Could not find a record with matching VIN and Trailer ID',
					},
				};

				vi.spyOn(component, 'validateVehicleForUpdate').mockReturnValue(of(validationError));

				const validator = component.validateVehicle(
					0,
					VehicleTypes.TRL
				)(control) as Observable<ValidationErrors | null>;
				validator.subscribe((result) => {
					expect(result).toEqual(validationError);
					done();
				});
			});
		});

		it('should call validateVehicleForCreate when trailerIdOrVrm is not provided', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const form = createForm({
					vin: 'VIN123',
				});
				const control = form.get('vin')!;
				const createSpy = vi.spyOn(component, 'validateVehicleForCreate').mockReturnValue(of(null));

				const validator = component.validateVehicle(
					0,
					VehicleTypes.TRL
				)(control) as Observable<ValidationErrors | null>;
				validator.subscribe((result) => {
					expect(result).toBeNull();
					expect(createSpy).toHaveBeenCalledWith(form);
					done();
				});
			});
		});

		it('should return the result from validateVehicleForCreate', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const form = createForm({
					vin: 'VIN123',
				});
				const control = form.get('vin')!;

				vi.spyOn(component, 'validateVehicleForCreate').mockReturnValue(
					of({
						vehicle: {
							error: 'Duplicate VIN',
						},
					})
				);

				const validator = component.validateVehicle(
					0,
					VehicleTypes.TRL
				)(control) as Observable<ValidationErrors | null>;
				validator.subscribe((result) => {
					expect(result).toEqual({
						vehicle: {
							error: 'Duplicate VIN',
						},
					});
					done();
				});
			});
		});
	});

	describe('handleAddVehicle', () => {
		it('should call addVehicle with the correct parameters', () => {
			vi.spyOn(component, 'addVehicle');
			vi.spyOn(component.form.controls.vehicles, 'length', 'get').mockReturnValue(10);
			store.overrideSelector(selectBatchDetails, {
				vehicleType: VehicleTypes.TRL,
				vehicleStatus: StatusCodes.CURRENT,
				trlFormType: TrailerFormType.TES1,
				batchSize: 10,
				vehicles: [],
			});
			store.refreshState();
			component.handleAddVehicle();
			expect(component.addVehicle).toHaveBeenCalledWith(VehicleTypes.TRL, 10);
		});
	});

	describe('handleCancel', () => {
		it('should call save unsaved changes and call router.navigate', () => {
			vi.spyOn(store, 'dispatch');
			vi.spyOn(component.router, 'navigate');
			vi.spyOn(component.form, 'getRawValue').mockReturnValue({ vehicles: [] });
			component.handleCancel();
			expect(store.dispatch).toHaveBeenCalledWith(upsertBatchVehicles({ vehicles: [] }));
			expect(component.router.navigate).toHaveBeenCalledWith([RootRoutes.BATCH, BatchRoutes.CANCEL_BATCH]);
		});
	});

	describe('handleConfirm', () => {
		function addVehicle(vehicleType = VehicleTypes.HGV) {
			component.form.controls.vehicles.clear();
			component.addVehicle(vehicleType, 0);
			return component.form.controls.vehicles.controls[0];
		}

		it('should wait for validation that is still running before confirming', () => {
			const validation = new Subject<ValidationErrors | null>();
			vi.spyOn(component, 'validateVehicleForCreate').mockReturnValue(validation);
			vi.spyOn(store, 'dispatch');
			vi.spyOn(router, 'navigate');

			addVehicle().controls.vin.setValue('ABC123');
			expect(component.form.status).toBe('PENDING');

			component.handleConfirm();

			expect(router.navigate).not.toHaveBeenCalled();

			validation.next(null);
			validation.complete();

			expect(router.navigate).toHaveBeenCalledWith([RootRoutes.BATCH, BatchRoutes.ENTER_TECH_RECORD_DETAILS]);
		});

		it('should not confirm when a VIN and VRM do not match an existing record', () => {
			vi.spyOn(httpService, 'searchTechRecords').mockReturnValue(of([]));
			vi.spyOn(errorService, 'setErrors');
			vi.spyOn(store, 'dispatch');
			vi.spyOn(router, 'navigate');

			const vehicle = addVehicle();
			vehicle.controls.vin.setValue('ABC123');
			vehicle.controls.trailerIdOrVrm.setValue('AB12CDE');

			component.handleConfirm();

			expect(errorService.setErrors).toHaveBeenCalledWith([
				{ error: 'Vehicle 1 - Could not find a record with matching VIN and VRM', anchorLink: 'vin-0' },
			]);
			expect(store.dispatch).not.toHaveBeenCalled();
			expect(router.navigate).not.toHaveBeenCalled();
		});

		it('should mark the form as touched', () => {
			vi.spyOn(component.form, 'status', 'get').mockReturnValue('VALID');
			vi.spyOn(component.form, 'markAllAsTouched');
			vi.spyOn(errorService, 'extractGlobalErrors').mockReturnValue([]);

			component.form.patchValue({
				vehicles: [{ vin: 'VIN123' }],
			});
			component.handleConfirm();
			expect(component.form.markAllAsTouched).toHaveBeenCalled();
		});

		it('should add an error when no vehicles contain a VIN', () => {
			vi.spyOn(errorService, 'extractGlobalErrors').mockReturnValue([]);
			vi.spyOn(errorService, 'setErrors');

			component.form.patchValue({
				vehicles: [{ vin: null }, { vin: '' }],
			});
			component.handleConfirm();

			expect(errorService.setErrors).toHaveBeenCalledWith([
				{
					error: 'At least 1 vehicle must have a VIN',
					anchorLink: 'vin-0',
				},
			]);
		});

		it('should combine validation errors with the missing VIN error', () => {
			vi.spyOn(errorService, 'setErrors');

			addVehicle().controls.trailerIdOrVrm.setValue('AB12CDEFGHJ');
			component.handleConfirm();

			expect(errorService.setErrors).toHaveBeenCalledWith([
				{
					error: 'Vehicle 1 - VRM must be less than or equal to 9 characters',
					anchorLink: 'trailerIdOrVrm-0',
				},
				{
					error: 'At least 1 vehicle must have a VIN',
					anchorLink: 'vin-0',
				},
			]);
		});

		it('should set errors when validation errors exist', () => {
			vi.spyOn(component, 'validateVehicleForCreate').mockReturnValue(of(null));
			vi.spyOn(store, 'dispatch');
			vi.spyOn(router, 'navigate');
			vi.spyOn(errorService, 'setErrors');

			addVehicle().controls.vin.setValue('AB');

			component.handleConfirm();

			expect(errorService.setErrors).toHaveBeenCalledWith([
				{
					error: 'Vehicle 1 - VIN must be greater than or equal to 3 characters',
					anchorLink: 'vin-0',
				},
			]);
			expect(store.dispatch).not.toHaveBeenCalled();
			expect(router.navigate).not.toHaveBeenCalled();
		});

		it('should dispatch and navigate when there are no errors and at least one VIN', () => {
			vi.spyOn(store, 'dispatch');
			vi.spyOn(router, 'navigate');
			vi.spyOn(errorService, 'extractGlobalErrors').mockReturnValue([]);

			const vehicles = [
				{
					id: 0,
					vin: 'VIN123',
					trailerIdOrVrm: 'TRL001',
					vehicleType: VehicleTypes.TRL,
					createdTimestamp: '',
					systemNumber: '',
				},
			];
			vi.spyOn(component.form, 'getRawValue').mockReturnValue({ vehicles });

			component.handleConfirm();

			expect(store.dispatch).toHaveBeenCalledWith(upsertBatchVehicles({ vehicles }));
			expect(router.navigate).toHaveBeenCalledWith([RootRoutes.BATCH, BatchRoutes.ENTER_TECH_RECORD_DETAILS]);
		});

		it('should treat an empty string VIN as missing', () => {
			vi.spyOn(errorService, 'extractGlobalErrors').mockReturnValue([]);
			vi.spyOn(errorService, 'setErrors');

			component.form.patchValue({
				vehicles: [{ vin: '' }],
			});
			component.handleConfirm();

			expect(errorService.setErrors).toHaveBeenCalled();
		});
	});
});
