import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { BatchRoutes, RootRoutes } from '@/src/app/models/routes.enum';
import { SEARCH_TYPES } from '@/src/app/models/search-types-enum';
import { StatusCodes, TrailerFormType, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { HttpService } from '@/src/app/services/http/http.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { initialAppState } from '@/src/app/store';
import { upsertVehicleBatch } from '@/src/app/store/technical-records/batch-create.actions';
import { selectBatchDetails } from '@/src/app/store/technical-records/batch-create.selectors';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { EnterBatchIdentifiers } from '../enter-batch-identifiers.component';

function createForm(initialValues: object) {
	const form = new FormGroup({
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
					{ path: `${RootRoutes.BATCH}/${BatchRoutes.CANCEL_BATCH}`, component: jest.fn() },
					{ path: `${RootRoutes.BATCH}/${BatchRoutes.ENTER_BATCH_DETAILS}`, component: jest.fn() },
					{ path: `${RootRoutes.BATCH}/${BatchRoutes.ENTER_TECH_RECORD_DETAILS}`, component: jest.fn() },
				]),
				provideMockStore({ initialState: initialAppState }),
				{ provide: HttpService, useValue: { searchTechRecords: jest.fn() } },
				{ provide: GlobalErrorService, useValue: { extractGlobalErrors: jest.fn(), setErrors: jest.fn() } },
				{ provide: TechnicalRecordService, useValue: { isUnique: jest.fn() } },
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
			jest.spyOn(component, 'handlePopulateForm');
			component.ngOnInit();
			expect(component.handlePopulateForm).toHaveBeenCalled();
		});
	});

	describe('handlePopulateForm', () => {
		it('should call addVehicles with form state from the previous steps', () => {
			jest.spyOn(component, 'addVehicles');
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
			jest.spyOn(component, 'addVehicle');
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
			jest.spyOn(component.form.controls.vehicles, 'push');
			component.addVehicle(VehicleTypes.TRL, 1);
			expect(component.form.controls.vehicles.push).toHaveBeenCalled();
		});
	});

	describe('validateVehicleForCreate', () => {
		it('should return null when vin is empty', (done) => {
			const form = createForm({});

			component.validateVehicleForCreate(form).subscribe((result) => {
				expect(result).toBeNull();
				expect(technicalRecordService.isUnique).not.toHaveBeenCalled();
				done();
			});
		});

		it('should call isUnique with vin and search type', (done) => {
			const vin = 'ABCDEFG';
			const form = createForm({ vin });
			jest.spyOn(technicalRecordService, 'isUnique').mockReturnValue(of(true));

			component.validateVehicleForCreate(form).subscribe(() => {
				expect(technicalRecordService.isUnique).toHaveBeenCalledWith(vin, SEARCH_TYPES.VIN);
				done();
			});
		});

		it('should not add vin to duplicateVins when vin is unique', (done) => {
			const vin = 'ABC123';
			const form = createForm({ vin });
			jest.spyOn(technicalRecordService, 'isUnique').mockReturnValue(of(true));

			component.validateVehicleForCreate(form).subscribe((result) => {
				expect(result).toBeNull();
				expect(component.duplicateVins).toEqual([]);
				done();
			});
		});

		it('should add vin to duplicateVins when vin is not unique', (done) => {
			const vin = 'ABC123';
			const form = createForm({ vin });
			jest.spyOn(technicalRecordService, 'isUnique').mockReturnValue(of(false));

			component.validateVehicleForCreate(form).subscribe((result) => {
				expect(result).toBeNull();
				expect(component.duplicateVins).toContain(vin);
				done();
			});
		});

		it('should return null when isUnique throws', (done) => {
			const vin = 'ABC123';
			const form = createForm({ vin });
			jest.spyOn(technicalRecordService, 'isUnique').mockReturnValue(throwError(() => new Error('API error')));

			component.validateVehicleForCreate(form).subscribe((result) => {
				expect(result).toBeNull();
				expect(component.duplicateVins).toEqual([]);
				done();
			});
		});
	});

	describe('validateVehicleForUpdate', () => {
		it('should return null when vin is empty', (done) => {
			const form = createForm({});

			component.validateVehicleForUpdate(form, 0, VehicleTypes.TRL).subscribe((result) => {
				expect(result).toBeNull();
				expect(httpService.searchTechRecords).not.toHaveBeenCalled();
				done();
			});
		});

		it('should return an error when no matching VIN and Trailer ID is found for trailers', (done) => {
			const form = createForm({
				vin: 'VIN123',
				trailerIdOrVrm: 'TRL001',
			});

			jest.spyOn(httpService, 'searchTechRecords').mockReturnValue(
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
						error: 'Vehicle 1 - could not find a record with matching VIN and Trailer ID',
					},
				});
				done();
			});
		});

		it('should return an error when no matching VIN and VRM is found for non-trailers', (done) => {
			const form = createForm({
				vin: 'VIN123',
				trailerIdOrVrm: 'AB12CDE',
			});

			jest.spyOn(httpService, 'searchTechRecords').mockReturnValue(
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
						error: 'Vehicle 1 - could not find a record with matching VIN and VRM',
					},
				});
				done();
			});
		});

		it('should return an error when multiple unique system numbers are found for a trailer', (done) => {
			const form = createForm({
				vin: 'VIN123',
				trailerIdOrVrm: 'TRL001',
			});

			jest.spyOn(httpService, 'searchTechRecords').mockReturnValue(
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
						error: 'Vehicle 1 - more than one vehicle has this VIN and Trailer ID',
					},
				});
				done();
			});
		});

		it('should return an error when multiple unique system numbers are found for a non-trailer', (done) => {
			const form = createForm({
				vin: 'VIN123',
				trailerIdOrVrm: 'AB12CDE',
			});

			jest.spyOn(httpService, 'searchTechRecords').mockReturnValue(
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
						error: 'Vehicle 1 - more than one vehicle has this VIN and VRM',
					},
				});
				done();
			});
		});

		it('should patch systemNumber and createdTimestamp when a matching active vehicle is found', (done) => {
			const form = createForm({
				vin: 'VIN123',
				trailerIdOrVrm: 'TRL001',
			});

			jest.spyOn(httpService, 'searchTechRecords').mockReturnValue(
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

		it('should not patch values when only archived records are found', (done) => {
			const form = createForm({
				vin: 'VIN123',
				trailerIdOrVrm: 'TRL001',
			});

			jest.spyOn(httpService, 'searchTechRecords').mockReturnValue(
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

		it('should return an error when searchTechRecords throws', (done) => {
			const form = createForm({
				vin: 'VIN123',
			});

			jest.spyOn(httpService, 'searchTechRecords').mockReturnValue(throwError(() => new Error('API error')));

			component.validateVehicleForUpdate(form, 0, VehicleTypes.TRL).subscribe((result) => {
				expect(result).toEqual({
					vehicle: {
						error: 'Vehicle 1 - could not find a record with matching VIN',
					},
				});
				done();
			});
		});
	});

	describe('validateVehicle', () => {
		it('should return null when control has no parent', (done) => {
			const control = new FormControl('ABC123');
			const validator = component.validateVehicle(0, VehicleTypes.TRL)(control) as Observable<ValidationErrors | null>;
			validator.subscribe((result) => {
				expect(result).toBeNull();
				done();
			});
		});

		it('should return null when control has errors', (done) => {
			const form = createForm({
				vin: 'VIN123',
				trailerIdOrVrm: 'TRL001',
			});

			const control = form.get('vin')!;
			control.setErrors({ required: true });

			const validator = component.validateVehicle(0, VehicleTypes.TRL)(control) as Observable<ValidationErrors | null>;
			validator.subscribe((result) => {
				expect(result).toBeNull();
				done();
			});
		});

		it('should return a VIN required error when trailerIdOrVrm is provided but vin is missing', (done) => {
			const form = createForm({
				trailerIdOrVrm: 'TRL001',
			});
			const control = form.get('vin')!;

			const validator = component.validateVehicle(0, VehicleTypes.TRL)(control) as Observable<ValidationErrors | null>;
			validator.subscribe((result) => {
				expect(result).toEqual({
					vin: {
						error: 'Vehicle 1 VIN is required',
					},
				});
				done();
			});
		});

		it('should call validateVehicleForUpdate when trailerIdOrVrm and vin are provided', (done) => {
			const form = createForm({
				vin: 'VIN123',
				trailerIdOrVrm: 'TRL001',
			});
			const control = form.get('vin')!;
			const updateSpy = jest.spyOn(component, 'validateVehicleForUpdate').mockReturnValue(of(null));

			const validator = component.validateVehicle(0, VehicleTypes.TRL)(control) as Observable<ValidationErrors | null>;
			validator.subscribe((result) => {
				expect(result).toBeNull();
				expect(updateSpy).toHaveBeenCalledWith(form, 0, VehicleTypes.TRL);
				done();
			});
		});

		it('should return the result from validateVehicleForUpdate', (done) => {
			const form = createForm({
				vin: 'VIN123',
				trailerIdOrVrm: 'TRL001',
			});

			const control = form.get('vin')!;

			const validationError = {
				vehicle: {
					error: 'Vehicle 1 - could not find a record with matching VIN and Trailer ID',
				},
			};

			jest.spyOn(component, 'validateVehicleForUpdate').mockReturnValue(of(validationError));

			const validator = component.validateVehicle(0, VehicleTypes.TRL)(control) as Observable<ValidationErrors | null>;
			validator.subscribe((result) => {
				expect(result).toEqual(validationError);
				done();
			});
		});

		it('should call validateVehicleForCreate when trailerIdOrVrm is not provided', (done) => {
			const form = createForm({
				vin: 'VIN123',
			});
			const control = form.get('vin')!;
			const createSpy = jest.spyOn(component, 'validateVehicleForCreate').mockReturnValue(of(null));

			const validator = component.validateVehicle(0, VehicleTypes.TRL)(control) as Observable<ValidationErrors | null>;
			validator.subscribe((result) => {
				expect(result).toBeNull();
				expect(createSpy).toHaveBeenCalledWith(form);
				done();
			});
		});

		it('should return the result from validateVehicleForCreate', (done) => {
			const form = createForm({
				vin: 'VIN123',
			});
			const control = form.get('vin')!;

			jest.spyOn(component, 'validateVehicleForCreate').mockReturnValue(
				of({
					vehicle: {
						error: 'Duplicate VIN',
					},
				})
			);

			const validator = component.validateVehicle(0, VehicleTypes.TRL)(control) as Observable<ValidationErrors | null>;
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

	describe('handleAddVehicle', () => {
		it('should call addVehicle with the correct parameters', () => {
			jest.spyOn(component, 'addVehicle');
			jest.spyOn(component.form.controls.vehicles, 'length', 'get').mockReturnValue(10);
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
			jest.spyOn(store, 'dispatch');
			jest.spyOn(component.router, 'navigate');
			jest.spyOn(component.form, 'getRawValue').mockReturnValue({ vehicles: [] });
			component.handleCancel();
			expect(store.dispatch).toHaveBeenCalledWith(upsertVehicleBatch({ vehicles: [] }));
			expect(component.router.navigate).toHaveBeenCalledWith([RootRoutes.BATCH, BatchRoutes.CANCEL_BATCH]);
		});
	});

	describe('handleConfirm', () => {
		it('should do nothing when form is pending', () => {
			jest.spyOn(store, 'dispatch');
			jest.spyOn(router, 'navigate');
			jest.spyOn(component.form, 'status', 'get').mockReturnValue('PENDING');
			jest.spyOn(component.form, 'markAllAsTouched');

			component.handleConfirm();

			expect(component.form.markAllAsTouched).not.toHaveBeenCalled();
			expect(store.dispatch).not.toHaveBeenCalled();
			expect(router.navigate).not.toHaveBeenCalled();
		});

		it('should mark the form as touched', () => {
			jest.spyOn(component.form, 'status', 'get').mockReturnValue('VALID');
			jest.spyOn(component.form, 'markAllAsTouched');
			jest.spyOn(errorService, 'extractGlobalErrors').mockReturnValue([]);

			component.form.patchValue({
				vehicles: [{ vin: 'VIN123' }],
			});
			component.handleConfirm();
			expect(component.form.markAllAsTouched).toHaveBeenCalled();
		});

		it('should add an error when no vehicles contain a VIN', () => {
			jest.spyOn(errorService, 'extractGlobalErrors').mockReturnValue([]);
			jest.spyOn(errorService, 'setErrors');

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
			jest.spyOn(errorService, 'extractGlobalErrors').mockReturnValue([
				{
					error: 'Some existing error',
					anchorLink: 'field-1',
				},
			]);
			jest.spyOn(errorService, 'setErrors');

			component.form.patchValue({
				vehicles: [{ vin: null }],
			});
			component.handleConfirm();

			expect(errorService.setErrors).toHaveBeenCalledWith([
				{
					error: 'Some existing error',
					anchorLink: 'field-1',
				},
				{
					error: 'At least 1 vehicle must have a VIN',
					anchorLink: 'vin-0',
				},
			]);
		});

		it('should set errors when validation errors exist', () => {
			const errors = [
				{
					error: 'Validation error',
					anchorLink: 'field-1',
				},
			];

			jest.spyOn(store, 'dispatch');
			jest.spyOn(router, 'navigate');
			jest.spyOn(errorService, 'extractGlobalErrors').mockReturnValue(errors);
			jest.spyOn(errorService, 'setErrors');

			component.form.patchValue({
				vehicles: [{ vin: 'VIN123' }],
			});

			component.handleConfirm();

			expect(errorService.setErrors).toHaveBeenCalledWith(errors);
			expect(store.dispatch).not.toHaveBeenCalled();
			expect(router.navigate).not.toHaveBeenCalled();
		});

		it('should dispatch and navigate when there are no errors and at least one VIN', () => {
			jest.spyOn(store, 'dispatch');
			jest.spyOn(router, 'navigate');
			jest.spyOn(errorService, 'extractGlobalErrors').mockReturnValue([]);

			const vehicles = [
				{
					vin: 'VIN123',
					trailerIdOrVrm: 'TRL001',
					vehicleType: 'trl',
					createdTimestamp: '',
					systemNumber: '',
				},
			];
			jest.spyOn(component.form, 'getRawValue').mockReturnValue({ vehicles });

			component.handleConfirm();

			expect(store.dispatch).toHaveBeenCalledWith(upsertVehicleBatch({ vehicles }));
			expect(router.navigate).toHaveBeenCalledWith([RootRoutes.BATCH, BatchRoutes.ENTER_TECH_RECORD_DETAILS]);
		});

		it('should treat an empty string VIN as missing', () => {
			jest.spyOn(errorService, 'extractGlobalErrors').mockReturnValue([]);
			jest.spyOn(errorService, 'setErrors');

			component.form.patchValue({
				vehicles: [{ vin: '' }],
			});
			component.handleConfirm();

			expect(errorService.setErrors).toHaveBeenCalled();
		});
	});
});
