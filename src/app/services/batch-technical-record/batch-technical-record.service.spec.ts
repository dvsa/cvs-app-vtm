import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { StatusCodes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { Observable, firstValueFrom, of } from 'rxjs';
import { BatchTechnicalRecordService } from './batch-technical-record.service';

describe('TechnicalRecordService', () => {
	let service: BatchTechnicalRecordService;
	let httpClient: HttpTestingController;
	let technicalRecordHttpService: TechnicalRecordHttpService;
	let technicalRecordService: TechnicalRecordService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, RouterTestingModule],
			providers: [
				BatchTechnicalRecordService,
				provideMockStore({ initialState: initialAppState }),
				TechnicalRecordHttpService,
				TechnicalRecordService,
			],
		});
		httpClient = TestBed.inject(HttpTestingController);
		service = TestBed.inject(BatchTechnicalRecordService);
		technicalRecordHttpService = TestBed.inject(TechnicalRecordHttpService);
		technicalRecordService = TestBed.inject(TechnicalRecordService);
	});

	afterEach(() => {
		// After every test, assert that there are no more pending requests.
		httpClient.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('validateForBatch', () => {
		let testGroup: FormGroup;
		beforeEach(() => {
			testGroup = new FormGroup({
				vin: new CustomFormControl({ name: 'vin', type: FormNodeTypes.CONTROL }, null, null),
				trailerIdOrVrm: new FormControl({ name: 'trailerIdOrVrm', value: '' }, null),
				systemNumber: new FormControl({ name: 'systemNumber', value: '' }, null),
				oldVehicleStatus: new FormControl({ name: 'oldVehicleStatus', value: '' }, null),
				vehicleType: new FormControl({ name: 'vehicleType', value: '' }, null),
				createdTimestamp: new FormControl({ name: 'createdTimestamp', value: '' }, null),
			});
		});

		it('return null if vin and trailer id are not provided', (done) => {
			expect.assertions(1);
			testGroup.get('vin')?.setValue(null);
			testGroup.get('trailerIdOrVrm')?.setValue(null);
			const serviceCall = service.validateForBatch()(testGroup.get('vin') as AbstractControl);
			(serviceCall as Observable<ValidationErrors | null>).subscribe((errors) => {
				expect(errors).toBeNull();
				done();
			});
		});

		it('return null if the required controls do not exist', (done) => {
			expect.assertions(1);
			testGroup = new FormGroup({ vin: new FormControl({ name: 'vin' }) });
			const serviceCall = service.validateForBatch()(testGroup.get('vin') as AbstractControl);
			(serviceCall as Observable<ValidationErrors | null>).subscribe((errors) => {
				expect(errors).toBeNull();
				done();
			});
		});

		it('throws an error if trailer id is provided but vin is not', (done) => {
			expect.assertions(1);
			testGroup.get('trailerIdOrVrm')?.setValue('test');

			const serviceCall = service.validateForBatch()(testGroup.get('vin') as AbstractControl);
			(serviceCall as Observable<ValidationErrors | null>).subscribe((errors) => {
				expect(errors).toEqual({ validateForBatch: { message: 'VIN is required' } });
				done();
			});
		});

		describe('when only vin is provided', () => {
			it('should return null when it is a unique vin', async () => {
				testGroup.get('trailerIdOrVrm')?.setValue('');
				testGroup.get('vin')?.setValue('TESTVIN');

				const isUniqueSpy = jest.spyOn(technicalRecordService, 'isUnique').mockReturnValueOnce(of(true));

				const serviceCall = service.validateForBatch()(
					testGroup.get('vin') as AbstractControl
				) as Observable<ValidationErrors | null>;
				const errors = await firstValueFrom(serviceCall);
				expect(isUniqueSpy).toHaveBeenCalled();
				expect(errors).toBeNull();
			});

			it('should set a warning when it is not a unique vin', async () => {
				testGroup.get('trailerIdOrVrm')?.setValue('');
				const vinControl = testGroup.get('vin') as CustomFormControl;
				vinControl.setValue('TESTVIN');
				jest.spyOn(technicalRecordService, 'isUnique').mockReturnValueOnce(of(false));
				await firstValueFrom(
					service.validateForBatch()(testGroup.get('vin') as AbstractControl) as Observable<ValidationErrors | null>
				);
				expect(vinControl.meta.warning).toBe(
					'This VIN already exists, if you continue it will be associated with two vehicles'
				);
			});
		});

		describe('when both vin and trailer id are provided', () => {
			it('returns null if only 1 vehicle exists with those values with no current tech record', async () => {
				expect.assertions(1);
				testGroup.get('vin')?.setValue('TESTVIN');
				testGroup.get('trailerIdOrVrm')?.setValue('TESTTRAILERID');
				const mockSearchResult = {
					vin: 'TESTVIN',
					trailerId: 'TESTTRAILERID',
					systemNumber: 'TESTSYSTEMNUMBER',
					techRecord_statusCode: StatusCodes.PROVISIONAL,
					createdTimestamp: '1234',
				} as TechRecordSearchSchema;

				jest.spyOn(technicalRecordHttpService, 'search$').mockReturnValue(of([mockSearchResult]));

				const serviceCall = service.validateForBatch()(
					testGroup.get('vin') as AbstractControl
				) as Observable<ValidationErrors | null>;
				const errors = await firstValueFrom(serviceCall);
				expect(errors).toBeNull();
			});

			it('throws error if only 1 trailer exists with those values with a current tech record', async () => {
				expect.assertions(1);
				testGroup.get('vin')?.setValue('TESTVIN');
				testGroup.get('trailerIdOrVrm')?.setValue('TESTTRAILERID');
				testGroup.get('vehicleType')?.setValue(VehicleTypes.TRL);
				const mockSearchResult = {
					vin: 'TESTVIN',
					trailerId: 'TESTTRAILERID',
					systemNumber: 'TESTSYSTEMNUMBER',
					techRecord_statusCode: StatusCodes.CURRENT,
					techRecord_vehicleType: VehicleTypes.TRL,
				} as TechRecordSearchSchema;

				jest.spyOn(technicalRecordHttpService, 'search$').mockReturnValue(of([mockSearchResult]));

				const serviceCall = service.validateForBatch()(
					testGroup.get('vin') as AbstractControl
				) as Observable<ValidationErrors | null>;
				const errors = await firstValueFrom(serviceCall);
				expect(errors).toEqual({
					validateForBatch: { message: 'This record cannot be updated as it has a current tech record' },
				});
			});

			it('returns null if only 1 vehicle other than trailer exists with those values with a current tech record', async () => {
				expect.assertions(1);
				testGroup.get('vin')?.setValue('TESTVIN');
				testGroup.get('trailerIdOrVrm')?.setValue('TESTTRAILERID');
				const mockSearchResult = {
					vin: '1234',
					trailerId: 'TESTTRAILERID',
					systemNumber: 'TESTSYSTEMNUMBER',
					techRecord_statusCode: StatusCodes.CURRENT,
					techRecord_vehicleType: VehicleTypes.PSV,
					createdTimestamp: '1234',
				} as TechRecordSearchSchema;

				jest.spyOn(technicalRecordHttpService, 'search$').mockReturnValue(of([mockSearchResult]));

				const serviceCall = service.validateForBatch()(
					testGroup.get('vin') as AbstractControl
				) as Observable<ValidationErrors | null>;
				const errors = await firstValueFrom(serviceCall);
				expect(errors).toBeNull();
			});

			it('throws an error if more than 1 vehicle exists with those values', async () => {
				expect.assertions(1);
				testGroup.get('vin')?.setValue('TESTVIN');
				testGroup.get('trailerIdOrVrm')?.setValue('TESTTRAILERID');
				const mockSearchResult = {
					vin: 'TESTVIN',
					trailerId: 'TESTTRAILERID',
					techRecord_statusCode: StatusCodes.PROVISIONAL,
				} as TechRecordSearchSchema;

				jest
					.spyOn(technicalRecordHttpService, 'search$')
					.mockReturnValue(of([mockSearchResult, { ...mockSearchResult, systemNumber: 'foobar' }]));

				const errors = await firstValueFrom(
					service.validateForBatch()(testGroup.get('vin') as AbstractControl) as Observable<ValidationErrors | null>
				);
				expect(errors).toEqual({
					validateForBatch: { message: 'More than one vehicle has this VIN and VRM/Trailer ID' },
				});
			});
		});

		it('throws an error if no vehicle exists with those values', async () => {
			expect.assertions(1);

			const vinControl = testGroup.get('vin');
			const trailerIdOrVrmControl = testGroup.get('trailerIdOrVrm');

			if (vinControl && trailerIdOrVrmControl) {
				vinControl.setValue('TESTVIN');
				trailerIdOrVrmControl.setValue('TESTTRAILERID');
			}

			jest.spyOn(technicalRecordHttpService, 'search$').mockReturnValue(of([]));

			const errors = await firstValueFrom(
				service.validateForBatch()(testGroup.get('vin') as AbstractControl) as Observable<ValidationErrors | null>
			);
			expect(errors).toEqual({
				validateForBatch: { message: 'Could not find a record with matching VIN and VRM/Trailer ID' },
			});
		});
	});
});
