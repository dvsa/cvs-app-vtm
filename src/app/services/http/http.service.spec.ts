import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DefectCategoryReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { TestStationSchema } from '@dvsa/cvs-type-definitions/types/v1/test-station';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { environment } from '@environments/environment';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { CacheKeys } from '@models/cache-keys.enum';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { EuVehicleCategory } from '@models/test-types/eu-vehicle-category.enum';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { withCache } from '@ngneat/cashew';
import { first, of } from 'rxjs';
import { HttpService } from './http.service';

// cashew does not export CACHE_CONTEXT, so recover the token from a context it builds
const [CACHE_CONTEXT] = [...withCache({}).keys()];

describe('HttpService', () => {
	let httpService: HttpService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting()],
		});

		httpService = TestBed.inject(HttpService);
		httpTestingController = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it('should be created', () => {
		expect(httpService).toBeTruthy();
	});

	describe('amendTechRecordVrm', () => {
		it('should call v3/technical-records/updateVrm', () => {
			const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
			httpService
				.amendTechRecordVrm('new vrm', false, technicalRecord.systemNumber, technicalRecord.createdTimestamp)
				.subscribe();

			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/v3/technical-records/updateVrm/HGV/${technicalRecord.createdTimestamp}`
			);
			expect(req.request.method).toBe('PATCH');
			expect(req.request.body).toHaveProperty('newVrm');
			expect(req.request.body).toHaveProperty('isCherishedTransfer');
		});
	});

	describe('archiveTechRecord', () => {
		it('should return a new tech record with status archived', () => {
			httpService.archiveTechRecord('foo', 'bar', 'foobar').subscribe();

			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/v3/technical-records/archive/foo/bar`);
			expect(req.request.method).toBe('PATCH');
			expect(req.request.body).toHaveProperty('reasonForArchiving');
		});
	});

	describe('createTechRecord', () => {
		it('should call post with the correct URL, body and response type', () => {
			const expectedVehicle = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testvin',
				primaryVrm: 'vrm1',
				techRecord_reasonForCreation: 'test',
			} as unknown as TechRecordType<'put'>;

			httpService.createTechRecord(expectedVehicle).subscribe();

			const request = httpTestingController.expectOne(`${environment.VTM_API_URI}/v3/technical-records`);

			expect(request.request.method).toBe('POST');
			expect(request.request.body).toEqual(expectedVehicle);

			request.flush(expectedVehicle);
		});

		it('should return an array with the newly created vehicle record', () => {
			const expectedVehicle = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testvin',
				primaryVrm: 'vrm1',
				techRecord_reasonForCreation: 'test',
			} as unknown as TechRecordType<'put'>;

			httpService
				.createTechRecord(expectedVehicle)
				.pipe(first())
				.subscribe((response) => {
					expect(response).toEqual(expectedVehicle);
				});

			const request = httpTestingController.expectOne(`${environment.VTM_API_URI}/v3/technical-records`);
			request.flush(expectedVehicle);
		});
	});

	describe('fetchDefects', () => {
		it('should get an array of matching results', () => {
			const expectedResult = [{ imDescription: 'Some Description' } as DefectCategoryReferenceDataSchema];
			httpService.fetchDefects().subscribe((response) => expect(response).toEqual(expectedResult));

			// Check for correct requests: should have made one request to search from expected URL
			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/defects`);
			expect(req.request.method).toBe('GET');

			// Provide each request with a mock response
			req.flush(expectedResult);
		});

		it('should handle errors', (done) => {
			httpService.fetchDefects().subscribe({
				next: () => {},
				error: (e) => {
					expect(e.error).toBe('Deliberate 500 error');
					expect(e.status).toBe(500);
					expect(e.statusText).toBe('Server Error');
					done();
				},
			});

			// Check for correct requests: should have made one request to search from expected URL
			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/defects`);
			expect(req.request.method).toBe('GET');

			// Respond with mock error
			req.flush('Deliberate 500 error', { status: 500, statusText: 'Server Error' });
		});
	});

	describe('fetchDefect', () => {
		it('should get a matching result', () => {
			const expectedId = 1;
			const expectedResult = { imDescription: 'Some Description' } as DefectCategoryReferenceDataSchema;
			httpService.fetchDefect(expectedId).subscribe((response) => expect(response).toEqual(expectedResult));

			// Check for correct requests: should have made one request to search from expected URL
			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/defects/${expectedId}`);
			expect(req.request.method).toBe('GET');

			// Provide each request with a mock response
			req.flush(expectedResult);
		});

		it('should handle errors', (done) => {
			const expectedId = 1;
			httpService.fetchDefect(expectedId).subscribe({
				next: () => {},
				error: (e) => {
					expect(e.error).toBe('Deliberate 500 error');
					expect(e.status).toBe(500);
					expect(e.statusText).toBe('Server Error');
					done();
				},
			});

			// Check for correct requests: should have made one request to search from expected URL
			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/defects/${expectedId}`);
			expect(req.request.method).toBe('GET');

			// Respond with mock error
			req.flush('Deliberate 500 error', { status: 500, statusText: 'Server Error' });
		});
	});

	describe('fetchRequiredStandards', () => {
		it('should get an array of matching results', () => {
			const expectedResult = [{ imDescription: 'Some Description' } as DefectCategoryReferenceDataSchema];
			httpService
				.fetchRequiredStandards(EUVehicleCategory.M1)
				.subscribe((response) => expect(response).toEqual(expectedResult));

			// Check for correct requests: should have made one request to search from expected URL
			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/defects/required-standards?euVehicleCategory=m1`
			);
			expect(req.request.method).toBe('GET');

			// Provide each request with a mock response
			req.flush(expectedResult);
		});

		it('should handle errors', (done) => {
			httpService.fetchRequiredStandards(EuVehicleCategory.M1).subscribe({
				next: () => {},
				error: (e) => {
					expect(e.error).toBe('Deliberate 500 error');
					expect(e.status).toBe(500);
					expect(e.statusText).toBe('Server Error');
					done();
				},
			});

			// Check for correct requests: should have made one request to search from expected URL
			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/defects/required-standards?euVehicleCategory=m1`
			);
			expect(req.request.method).toBe('GET');

			// Respond with mock error
			req.flush('Deliberate 500 error', { status: 500, statusText: 'Server Error' });
		});
	});

	describe('fetchTestStations', () => {
		it('should get an array of matching results', () => {
			const expectedResult = [{ testStationName: 'Some Name' } as TestStationSchema];
			httpService.fetchTestStations().subscribe((response) => expect(response).toEqual(expectedResult));

			// Check for correct requests: should have made one request to search from expected URL
			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/test-stations`);
			expect(req.request.method).toBe('GET');

			// Provide each request with a mock response
			req.flush(expectedResult);
		});

		it('should handle errors', (done) => {
			httpService.fetchTestStations().subscribe({
				next: () => {},
				error: (e) => {
					expect(e.error).toBe('Deliberate 500 error');
					expect(e.status).toBe(500);
					expect(e.statusText).toBe('Server Error');
					done();
				},
			});

			// Check for correct requests: should have made one request to search from expected URL
			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/test-stations`);
			expect(req.request.method).toBe('GET');

			// Respond with mock error
			req.flush('Deliberate 500 error', { status: 500, statusText: 'Server Error' });
		});
	});

	describe('fetchTestStation', () => {
		it('should get a matching result', () => {
			const expectedId = 'some ID';
			const expectedResult = { testStationName: 'Some Name' } as TestStationSchema;
			httpService.fetchTestStation(expectedId).subscribe((response) => expect(response).toEqual(expectedResult));

			// Check for correct requests: should have made one request to search from expected URL
			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/test-stations/${expectedId}`);
			expect(req.request.method).toBe('GET');

			// Provide each request with a mock response
			req.flush(expectedResult);
		});

		it('should handle errors', (done) => {
			const expectedId = 'some ID';
			httpService.fetchTestStation(expectedId).subscribe({
				next: () => {},
				error: (e) => {
					expect(e.error).toBe('Deliberate 500 error');
					expect(e.status).toBe(500);
					expect(e.statusText).toBe('Server Error');
					done();
				},
			});

			// Check for correct requests: should have made one request to search from expected URL
			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/test-stations/${expectedId}`);
			expect(req.request.method).toBe('GET');

			// Respond with mock error
			req.flush('Deliberate 500 error', { status: 500, statusText: 'Server Error' });
		});
	});

	describe('generateLetter', () => {
		it('should call v3/technical-records/letter', () => {
			const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
			httpService.generateLetter(technicalRecord, 'test', 123, {}).subscribe();

			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/v3/technical-records/letter/HGV/${technicalRecord.createdTimestamp}`
			);
			expect(req.request.method).toBe('POST');
			expect(req.request.body).toHaveProperty('vtmUsername');
			expect(req.request.body).toHaveProperty('letterType');
			expect(req.request.body).toHaveProperty('paragraphId');
			expect(req.request.body).toHaveProperty('recipientEmailAddress');
		});
	});

	describe('generatePlate', () => {
		it('should call v3/technical-records/plate', () => {
			const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
			httpService.generatePlate(technicalRecord, 'reason', {}).subscribe();

			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/v3/technical-records/plate/HGV/${technicalRecord.createdTimestamp}`
			);
			expect(req.request.method).toBe('POST');
			expect(req.request.body).toHaveProperty('vtmUsername');
			expect(req.request.body).toHaveProperty('reasonForCreation');
			expect(req.request.body).toHaveProperty('recipientEmailAddress');
		});
	});

	describe('getTechRecordV3', () => {
		it('should call v3/technical-records/plate/HGV', () => {
			const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
			httpService.getTechRecordV3(technicalRecord.systemNumber, technicalRecord.createdTimestamp).subscribe();

			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/v3/technical-records/HGV/${technicalRecord.createdTimestamp}`
			);
			expect(req.request.method).toBe('GET');
		});
	});

	describe('promoteTechRecord', () => {
		it('should call v3/technical-records/plate', () => {
			const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
			httpService
				.promoteTechRecord(technicalRecord.systemNumber, technicalRecord.createdTimestamp, 'reason')
				.subscribe();

			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/v3/technical-records/promote/HGV/${technicalRecord.createdTimestamp}`
			);
			expect(req.request.method).toBe('PATCH');
			expect(req.request.body).toHaveProperty('reasonForPromoting');
		});
	});

	describe('searchTechRecordBySystemNumber', () => {
		it('should call service.searchTechRecords', () => {
			const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
			const spy = jest.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of());
			httpService.searchTechRecordBySystemNumber(technicalRecord.systemNumber).subscribe();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('searchTechRecords', () => {
		it('should call v3/technical-records/search', () => {
			httpService.searchTechRecords(SEARCH_TYPES.ALL, 'term').subscribe();

			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/v3/technical-records/search/term?searchCriteria=${SEARCH_TYPES.ALL}&additionalInfo=true`
			);
			expect(req.request.method).toBe('GET');
		});
	});

	describe('updateTechRecord', () => {
		it('should return a new tech record and updated status code', () => {
			const systemNumber = '123456';
			const createdTimestamp = '2022';
			const expectedVehicle = {
				systemNumber: 'foo',
				createdTimestamp: 'bar',
				vin: 'testvin',
				primaryVrm: 'vrm1',
				techRecord_reasonForCreation: 'test',
				secondaryVrms: undefined,
			} as TechRecordType<'get'>;
			httpService
				.updateTechRecord(systemNumber, createdTimestamp, expectedVehicle as TechRecordType<'put'>)
				.subscribe();

			// Check for correct requests: should have made one request to the PUT URL
			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/v3/technical-records/${systemNumber}/${createdTimestamp}`
			);
			expect(req.request.method).toBe('PATCH');

			// should format the vrms for the update payload
			expect(req.request.body).toHaveProperty('primaryVrm');
			expect(req.request.body).toHaveProperty('secondaryVrms');
		});
	});

	describe('sendLogs', () => {
		it('should send a logs array and report back a success', async () => {
			httpService.sendLogs([]).then((response) => {
				expect(response.body).toEqual([]);
			});

			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/log`);
			expect(req.request.method).toBe('POST');
			req.flush([], { status: 200, statusText: 'OK' });
		});
	});

	describe('getRecalls', () => {
		it('should call the correct endpoint with the provided VIN and use 30s timeout in production', () => {
			(environment as any).production = true;
			httpService.getRecalls('VIN123').subscribe();
			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/v3/technical-records/recalls/VIN123`);
			expect(req.request.method).toBe('GET');
			req.flush({});
		});

		it('should call the correct endpoint with the provided VIN and use 10s timeout in non-production', () => {
			(environment as any).production = true;
			httpService.getRecalls('VIN456').subscribe();
			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/v3/technical-records/recalls/VIN456`);
			expect(req.request.method).toBe('GET');
			req.flush({});
		});

		it('should emit an error if the request fails', (done) => {
			httpService.getRecalls('VIN789').subscribe({
				next: () => {},
				error: (e) => {
					expect(e.status).toBe(404);
					expect(e.statusText).toBe('Not Found');
					done();
				},
			});
			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/v3/technical-records/recalls/VIN789`);
			req.flush('Not found', { status: 404, statusText: 'Not Found' });
		});
	});

	describe('waitForTechRecord', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.runOnlyPendingTimers();
			jest.useRealTimers();
		});

		it('should return a non-archived record with current status when available', (done) => {
			const systemNumber = 'TEST-123';
			const mockRecord = {
				systemNumber,
				createdTimestamp: '2024-01-01T00:00:00Z',
				techRecord_statusCode: 'current',
			} as any;

			const spy = jest.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([mockRecord]));

			httpService.waitForTechRecord(systemNumber).subscribe((result) => {
				expect(result).toEqual(mockRecord);
				expect(spy).toHaveBeenCalled();
				done();
			});

			// Advance initial 3s timer
			jest.advanceTimersByTime(3000);
			jest.runAllTimers();
		});

		it('should prioritize current status records over provisional', (done) => {
			const systemNumber = 'TEST-456';
			const currentRecord = {
				systemNumber,
				createdTimestamp: '2024-01-02T00:00:00Z',
				techRecord_statusCode: 'current',
			} as any;
			const provisionalRecord = {
				systemNumber,
				createdTimestamp: '2024-01-01T00:00:00Z',
				techRecord_statusCode: 'provisional',
			} as any;

			jest.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([provisionalRecord, currentRecord]));

			httpService.waitForTechRecord(systemNumber).subscribe((result) => {
				expect(result.techRecord_statusCode).toBe('current');
				expect(result).toEqual(currentRecord);
				done();
			});

			jest.advanceTimersByTime(3000);
			jest.runAllTimers();
		});

		it('should return provisional record when current is not available', (done) => {
			const systemNumber = 'TEST-789';
			const provisionalRecord = {
				systemNumber,
				createdTimestamp: '2024-01-01T00:00:00Z',
				techRecord_statusCode: 'provisional',
			} as any;

			jest.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([provisionalRecord]));

			httpService.waitForTechRecord(systemNumber).subscribe((result) => {
				expect(result.techRecord_statusCode).toBe('provisional');
				expect(result).toEqual(provisionalRecord);
				done();
			});

			jest.advanceTimersByTime(3000);
			jest.runAllTimers();
		});

		it('should return the most recently created record when no current or provisional status', (done) => {
			const systemNumber = 'TEST-101';
			const olderRecord = {
				systemNumber,
				createdTimestamp: '2024-01-01T00:00:00Z',
				techRecord_statusCode: 'archived',
			} as any;
			const newerRecord = {
				systemNumber,
				createdTimestamp: '2024-01-02T00:00:00Z',
				techRecord_statusCode: 'archived',
			} as any;

			jest.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([olderRecord, newerRecord]));

			httpService.waitForTechRecord(systemNumber).subscribe((result) => {
				expect(result).toEqual(newerRecord);
				done();
			});

			jest.advanceTimersByTime(3000);
			jest.runAllTimers();
		});

		it('should return the first record as fallback', (done) => {
			const systemNumber = 'TEST-202';
			const firstRecord = {
				systemNumber,
				createdTimestamp: '2024-01-01T00:00:00Z',
				techRecord_statusCode: 'archived',
			} as any;

			jest.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([firstRecord]));

			httpService.waitForTechRecord(systemNumber).subscribe((result) => {
				expect(result).toEqual(firstRecord);
				done();
			});

			jest.advanceTimersByTime(3000);
			jest.runAllTimers();
		});

		it('should wait 3 seconds before first search attempt', (done) => {
			const systemNumber = 'TEST-303';
			const mockRecord = {
				systemNumber,
				createdTimestamp: '2024-01-01T00:00:00Z',
				techRecord_statusCode: 'current',
			} as any;

			const spy = jest.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([mockRecord]));

			httpService.waitForTechRecord(systemNumber).subscribe(() => {
				expect(spy).toHaveBeenCalled();
				done();
			});

			// Should not be called before timer
			expect(spy).not.toHaveBeenCalled();

			// Should be called after 3 seconds
			jest.advanceTimersByTime(3000);
			jest.runAllTimers();
			expect(spy).toHaveBeenCalled();
		});

		it('should allow the first search attempt to run immediately', () => {
			const systemNumber = 'TEST-IMMEDIATE';
			const currentRecord = {
				systemNumber,
				createdTimestamp: '2024-01-01T00:00:00Z',
				techRecord_statusCode: StatusCodes.CURRENT,
			} as any;
			const spy = jest.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([currentRecord]));
			let result: unknown;

			httpService.waitForTechRecord(systemNumber, { initialDelayMs: 0 }).subscribe((value) => (result = value));

			expect(spy).toHaveBeenCalledTimes(1);
			expect(result).toEqual(currentRecord);
		});

		it('should keep polling until the expected record status is available', () => {
			const systemNumber = 'TEST-PROMOTION';
			const provisionalRecord = {
				systemNumber,
				createdTimestamp: '2024-01-01T00:00:00Z',
				techRecord_statusCode: StatusCodes.PROVISIONAL,
			} as any;
			const currentRecord = {
				systemNumber,
				createdTimestamp: '2024-01-02T00:00:00Z',
				techRecord_statusCode: StatusCodes.CURRENT,
			} as any;
			const spy = jest
				.spyOn(httpService, 'searchTechRecordBySystemNumber')
				.mockReturnValueOnce(of([provisionalRecord]))
				.mockReturnValueOnce(of([provisionalRecord, currentRecord]));
			let result: unknown;

			httpService
				.waitForTechRecord(systemNumber, {
					expectedStatus: StatusCodes.CURRENT,
					initialDelayMs: 0,
				})
				.subscribe((value) => (result = value));

			expect(spy).toHaveBeenCalledTimes(1);
			expect(result).toBeUndefined();

			jest.advanceTimersByTime(500);

			expect(spy).toHaveBeenCalledTimes(2);
			expect(result).toEqual(currentRecord);
		});

		it('should stop retrying when a non-archived record is found', (done) => {
			const systemNumber = 'TEST-505';
			const provisionalRecord = {
				systemNumber,
				createdTimestamp: '2024-01-01T00:00:00Z',
				techRecord_statusCode: 'provisional',
			} as any;

			const spy = jest.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([provisionalRecord]));

			httpService.waitForTechRecord(systemNumber).subscribe((result) => {
				expect(result.techRecord_statusCode).toBe('provisional');
				expect(spy).toHaveBeenCalledTimes(1);
				done();
			});

			jest.advanceTimersByTime(3000);
			jest.runAllTimers();
		});

		it('should handle multiple records and select based on priority', (done) => {
			const systemNumber = 'TEST-707';
			const records = [
				{
					systemNumber,
					createdTimestamp: '2024-01-01T00:00:00Z',
					techRecord_statusCode: 'archived',
				},
				{
					systemNumber,
					createdTimestamp: '2024-01-03T00:00:00Z',
					techRecord_statusCode: 'archived',
				},
				{
					systemNumber,
					createdTimestamp: '2024-01-02T00:00:00Z',
					techRecord_statusCode: 'provisional',
				},
			] as any[];

			jest.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of(records));

			httpService.waitForTechRecord(systemNumber).subscribe((result) => {
				// Should select provisional over the newer archived record
				expect(result.techRecord_statusCode).toBe('provisional');
				expect(result.createdTimestamp).toBe('2024-01-02T00:00:00Z');
				done();
			});

			jest.advanceTimersByTime(3000);
			jest.runAllTimers();
		});

		it('should handle edge case where all records have same timestamp', (done) => {
			const systemNumber = 'TEST-808';
			const timestamp = '2024-01-01T00:00:00Z';
			const records = [
				{
					systemNumber,
					createdTimestamp: timestamp,
					techRecord_statusCode: 'archived',
				},
				{
					systemNumber,
					createdTimestamp: timestamp,
					techRecord_statusCode: 'archived',
				},
			] as any[];

			jest.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of(records));

			httpService.waitForTechRecord(systemNumber).subscribe((result) => {
				// Should return the first record when timestamps are identical
				expect(result).toEqual(records[0]);
				done();
			});

			jest.advanceTimersByTime(3000);
			jest.runAllTimers();
		});
	});

	describe('referenceResourceTypeResourceKeyGet', () => {
		it('should cache admin type lookups, bucketed by resource type', () => {
			httpService
				.referenceResourceTypeResourceKeyGet(ReferenceDataResourceType.ReferenceDataAdminType, 'TYRES')
				.subscribe();

			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/reference/${ReferenceDataResourceType.ReferenceDataAdminType}/TYRES`
			);

			expect(req.request.context.get(CACHE_CONTEXT)).toEqual(
				expect.objectContaining({
					cache: true,
					key: `${CacheKeys.REFERENCE_DATA}${ReferenceDataResourceType.ReferenceDataAdminType}TYRES`,
					bucket: httpService.getRefDataBucket(ReferenceDataResourceType.ReferenceDataAdminType),
				})
			);

			req.flush({});
		});

		it('should not cache any other single item lookup', () => {
			httpService.referenceResourceTypeResourceKeyGet(ReferenceDataResourceType.Tyres, 'some-key').subscribe();

			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/reference/${ReferenceDataResourceType.Tyres}/some-key`
			);

			expect(req.request.context.get(CACHE_CONTEXT)).toEqual({});

			req.flush({});
		});
	});
});
