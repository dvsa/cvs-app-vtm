import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CompressionHeaders } from '@dvsa/cvs-microservice-common/api/headers';
import { DefectCategoryReferenceDataSchema } from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
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
		it('should call tech-records/v4/updateVrm', () => {
			const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
			const subscription = httpService
				.amendTechRecordVrm('new vrm', false, technicalRecord.systemNumber, technicalRecord.createdTimestamp)
				.subscribe();

			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/tech-records/v4/updateVrm/HGV/${technicalRecord.createdTimestamp}`
			);
			expect(req.request.method).toBe('PATCH');
			expect(req.request.body).toHaveProperty('newVrm');
			expect(req.request.body).toHaveProperty('isCherishedTransfer');
			req.flush(technicalRecord);
			expect(subscription.closed).toBe(true);
		});
	});

	describe('archiveTechRecord', () => {
		it('should return a new tech record with status archived', () => {
			const subscription = httpService.archiveTechRecord('foo', 'bar', 'foobar').subscribe();

			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/tech-records/v4/archive/foo/bar`);
			expect(req.request.method).toBe('PATCH');
			expect(req.request.body).toHaveProperty('reasonForArchiving');
			req.flush({ systemNumber: 'foo', techRecord_statusCode: StatusCodes.ARCHIVED });
			expect(subscription.closed).toBe(true);
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

			const request = httpTestingController.expectOne(`${environment.VTM_API_URI}/tech-records/v4`);

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

			const request = httpTestingController.expectOne(`${environment.VTM_API_URI}/tech-records/v4`);
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

		it('should handle errors', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
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

		it('should handle errors', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
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

		it('should handle errors', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
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

		it('should handle errors', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
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

		it('should handle errors', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
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
	});

	describe('generateLetter', () => {
		it('should call tech-records/v4/letter', () => {
			const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
			const subscription = httpService.generateLetter(technicalRecord, 'test', 123, {}).subscribe();

			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/tech-records/v4/letter/HGV/${technicalRecord.createdTimestamp}`
			);
			expect(req.request.method).toBe('POST');
			expect(req.request.body).toHaveProperty('vtmUsername');
			expect(req.request.body).toHaveProperty('letterType');
			expect(req.request.body).toHaveProperty('paragraphId');
			expect(req.request.body).toHaveProperty('recipientEmailAddress');
			req.flush('Letter generated');
			expect(subscription.closed).toBe(true);
		});
	});

	describe('generatePlate', () => {
		it('should call tech-records/v4/plate', () => {
			const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
			const subscription = httpService.generatePlate(technicalRecord, 'reason', {}).subscribe();

			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/tech-records/v4/plate/HGV/${technicalRecord.createdTimestamp}`
			);
			expect(req.request.method).toBe('POST');
			expect(req.request.body).toHaveProperty('vtmUsername');
			expect(req.request.body).toHaveProperty('reasonForCreation');
			expect(req.request.body).toHaveProperty('recipientEmailAddress');
			req.flush({});
			expect(subscription.closed).toBe(true);
		});
	});

	describe('getTechRecordV3', () => {
		it('should call tech-records/v4/plate/HGV', () => {
			const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
			const subscription = httpService
				.getTechRecordBySysNumberAndTimestamp(technicalRecord.systemNumber, technicalRecord.createdTimestamp)
				.subscribe();

			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/tech-records/v4/HGV/${technicalRecord.createdTimestamp}`
			);
			expect(req.request.method).toBe('GET');
			req.flush(technicalRecord);
			expect(subscription.closed).toBe(true);
		});
	});

	describe('promoteTechRecord', () => {
		it('should call tech-records/v4/plate', () => {
			const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
			const subscription = httpService
				.promoteTechRecord(technicalRecord.systemNumber, technicalRecord.createdTimestamp, 'reason')
				.subscribe();

			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/tech-records/v4/promote/HGV/${technicalRecord.createdTimestamp}`
			);
			expect(req.request.method).toBe('PATCH');
			expect(req.request.body).toHaveProperty('reasonForPromoting');
			req.flush({ ...technicalRecord, techRecord_statusCode: StatusCodes.CURRENT });
			expect(subscription.closed).toBe(true);
		});
	});

	describe('searchTechRecordBySystemNumber', () => {
		it('should call service.searchTechRecords', () => {
			const technicalRecord = mockVehicleTechnicalRecord('hgv') as TechRecordType<'get'>;
			const spy = vi.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of());
			httpService.searchTechRecordBySystemNumber(technicalRecord.systemNumber).subscribe();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('searchTechRecords', () => {
		it('should call tech-records/v4/search', () => {
			const subscription = httpService.searchTechRecords(SEARCH_TYPES.ALL, 'term').subscribe();

			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/tech-records/v4/search/term?searchCriteria=${SEARCH_TYPES.ALL}&additionalInfo=true`
			);
			expect(req.request.method).toBe('GET');
			req.flush([]);
			expect(subscription.closed).toBe(true);
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
			const subscription = httpService
				.updateTechRecord(systemNumber, createdTimestamp, expectedVehicle as TechRecordType<'put'>)
				.subscribe();

			// Check for correct requests: should have made one request to the PUT URL
			const req = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/tech-records/v4/${systemNumber}/${createdTimestamp}`
			);
			expect(req.request.method).toBe('PATCH');

			// should format the vrms for the update payload
			expect(req.request.body).toHaveProperty('primaryVrm');
			expect(req.request.body).toHaveProperty('secondaryVrms');
			req.flush(expectedVehicle);
			expect(subscription.closed).toBe(true);
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
			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/tech-records/v4/recalls/VIN123`);
			expect(req.request.method).toBe('GET');
			req.flush({});
		});

		it('should call the correct endpoint with the provided VIN and use 10s timeout in non-production', () => {
			(environment as any).production = true;
			httpService.getRecalls('VIN456').subscribe();
			const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/tech-records/v4/recalls/VIN456`);
			expect(req.request.method).toBe('GET');
			req.flush({});
		});

		it('should emit an error if the request fails', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				httpService.getRecalls('VIN789').subscribe({
					next: () => {},
					error: (e) => {
						expect(e.status).toBe(404);
						expect(e.statusText).toBe('Not Found');
						done();
					},
				});
				const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/tech-records/v4/recalls/VIN789`);
				req.flush('Not found', { status: 404, statusText: 'Not Found' });
			});
		});
	});

	describe('waitForTechRecord', () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.runOnlyPendingTimers();
			vi.useRealTimers();
		});

		it('should return a non-archived record with current status when available', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const systemNumber = 'TEST-123';
				const mockRecord = {
					systemNumber,
					createdTimestamp: '2024-01-01T00:00:00Z',
					techRecord_statusCode: 'current',
				} as any;

				const spy = vi.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([mockRecord]));

				httpService.waitForTechRecord(systemNumber).subscribe((result) => {
					expect(result).toEqual(mockRecord);
					expect(spy).toHaveBeenCalled();
					done();
				});

				// Advance initial 3s timer
				vi.advanceTimersByTime(3000);
				vi.runAllTimers();
			});
		});

		it('should prioritize current status records over provisional', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
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

				vi.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([provisionalRecord, currentRecord]));

				httpService.waitForTechRecord(systemNumber).subscribe((result) => {
					expect(result.techRecord_statusCode).toBe('current');
					expect(result).toEqual(currentRecord);
					done();
				});

				vi.advanceTimersByTime(3000);
				vi.runAllTimers();
			});
		});

		it('should return provisional record when current is not available', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const systemNumber = 'TEST-789';
				const provisionalRecord = {
					systemNumber,
					createdTimestamp: '2024-01-01T00:00:00Z',
					techRecord_statusCode: 'provisional',
				} as any;

				vi.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([provisionalRecord]));

				httpService.waitForTechRecord(systemNumber).subscribe((result) => {
					expect(result.techRecord_statusCode).toBe('provisional');
					expect(result).toEqual(provisionalRecord);
					done();
				});

				vi.advanceTimersByTime(3000);
				vi.runAllTimers();
			});
		});

		it('should return the most recently created record when no current or provisional status', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
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

				vi.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([olderRecord, newerRecord]));

				httpService.waitForTechRecord(systemNumber).subscribe((result) => {
					expect(result).toEqual(newerRecord);
					done();
				});

				vi.advanceTimersByTime(3000);
				vi.runAllTimers();
			});
		});

		it('should return the first record as fallback', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const systemNumber = 'TEST-202';
				const firstRecord = {
					systemNumber,
					createdTimestamp: '2024-01-01T00:00:00Z',
					techRecord_statusCode: 'archived',
				} as any;

				vi.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([firstRecord]));

				httpService.waitForTechRecord(systemNumber).subscribe((result) => {
					expect(result).toEqual(firstRecord);
					done();
				});

				vi.advanceTimersByTime(3000);
				vi.runAllTimers();
			});
		});

		it('should wait 3 seconds before first search attempt', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const systemNumber = 'TEST-303';
				const mockRecord = {
					systemNumber,
					createdTimestamp: '2024-01-01T00:00:00Z',
					techRecord_statusCode: 'current',
				} as any;

				const spy = vi.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([mockRecord]));

				httpService.waitForTechRecord(systemNumber).subscribe(() => {
					expect(spy).toHaveBeenCalled();
					done();
				});

				// Should not be called before timer
				expect(spy).not.toHaveBeenCalled();

				// Should be called after 3 seconds
				vi.advanceTimersByTime(3000);
				vi.runAllTimers();
				expect(spy).toHaveBeenCalled();
			});
		});

		it('should allow the first search attempt to run immediately', () => {
			const systemNumber = 'TEST-IMMEDIATE';
			const currentRecord = {
				systemNumber,
				createdTimestamp: '2024-01-01T00:00:00Z',
				techRecord_statusCode: StatusCodes.CURRENT,
			} as any;
			const spy = vi.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([currentRecord]));
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
			const spy = vi
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

			vi.advanceTimersByTime(500);

			expect(spy).toHaveBeenCalledTimes(2);
			expect(result).toEqual(currentRecord);
		});

		it('should stop retrying when a non-archived record is found', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				const systemNumber = 'TEST-505';
				const provisionalRecord = {
					systemNumber,
					createdTimestamp: '2024-01-01T00:00:00Z',
					techRecord_statusCode: 'provisional',
				} as any;

				const spy = vi.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of([provisionalRecord]));

				httpService.waitForTechRecord(systemNumber).subscribe((result) => {
					expect(result.techRecord_statusCode).toBe('provisional');
					expect(spy).toHaveBeenCalledTimes(1);
					done();
				});

				vi.advanceTimersByTime(3000);
				vi.runAllTimers();
			});
		});

		it('should handle multiple records and select based on priority', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
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

				vi.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of(records));

				httpService.waitForTechRecord(systemNumber).subscribe((result) => {
					// Should select provisional over the newer archived record
					expect(result.techRecord_statusCode).toBe('provisional');
					expect(result.createdTimestamp).toBe('2024-01-02T00:00:00Z');
					done();
				});

				vi.advanceTimersByTime(3000);
				vi.runAllTimers();
			});
		});

		it('should handle edge case where all records have same timestamp', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
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

				vi.spyOn(httpService, 'searchTechRecordBySystemNumber').mockReturnValue(of(records));

				httpService.waitForTechRecord(systemNumber).subscribe((result) => {
					// Should return the first record when timestamps are identical
					expect(result).toEqual(records[0]);
					done();
				});

				vi.advanceTimersByTime(3000);
				vi.runAllTimers();
			});
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

	describe('additional request contracts', () => {
		it('amends a technical record VIN using the update endpoint and compressed request headers', () => {
			httpService.amendTechRecordVin('new-vin', 'SYS123', '2025-01-02').subscribe();

			const request = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/tech-records/v4/updateVin/SYS123/2025-01-02`
			);
			expect(request.request.method).toBe('PATCH');
			expect(request.request.body).toEqual({ newVin: 'new-vin' });
			expect(request.request.headers.get(CompressionHeaders.inbound.request)).toBe(CompressionHeaders.compressionValue);
			request.flush({});
		});

		it('passes document retrieval parameters and API key for documents and test media', () => {
			const documentParams = new Map([
				['documentId', 'doc 123'],
				['version', '2'],
			]);
			httpService.getDocument(documentParams).subscribe();
			const documentRequest = httpTestingController.expectOne(
				(request) => request.url === `${environment.VTM_API_URI}/v1/document-retrieval`
			);
			expect(documentRequest.request.params.get('documentId')).toBe('doc 123');
			expect(documentRequest.request.params.get('version')).toBe('2');
			expect(documentRequest.request.headers.get('Content-Type')).toBe('application/pdf; charset=utf-8');
			expect(documentRequest.request.headers.get('X-Api-Key')).toBe(environment.DOCUMENT_RETRIEVAL_API_KEY);
			documentRequest.flush('document');

			httpService.getTestResultMedia('result/123', new Map([['type', 'failReason']])).subscribe();
			const mediaRequest = httpTestingController.expectOne(
				(request) => request.url === `${environment.VTM_API_URI}/v1/document-retrieval/result/123`
			);
			expect(mediaRequest.request.params.get('type')).toBe('failReason');
			expect(mediaRequest.request.headers.get('Content-Type')).toBe('application/zip');
			expect(mediaRequest.request.headers.get('X-Api-Key')).toBe(environment.DOCUMENT_RETRIEVAL_API_KEY);
			mediaRequest.flush('archive');
		});

		it('includes optional type filters only when provided and caches test-type taxonomy requests', () => {
			httpService.getTestTypes('annual').subscribe();
			const filteredRequest = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/test-types?typeOfTest=annual`
			);
			expect(filteredRequest.request.params.get('typeOfTest')).toBe('annual');
			expect(filteredRequest.request.headers.get(CompressionHeaders.inbound.request)).toBe(
				CompressionHeaders.compressionValue
			);
			expect(filteredRequest.request.context.get(CACHE_CONTEXT)).toEqual(
				expect.objectContaining({ cache: true, key: CacheKeys.TEST_TYPES })
			);
			filteredRequest.flush({});

			httpService.getTestTypes().subscribe();
			const allTypesRequest = httpTestingController.expectOne(`${environment.VTM_API_URI}/test-types`);
			expect(allTypesRequest.request.params.has('typeOfTest')).toBe(false);
			allTypesRequest.flush({});
		});

		it('requires the mandatory test-type lookup parameters', () => {
			expect(() => httpService.getTestTypesid(null as unknown as string, [], 'hgv')).toThrow(
				'Required parameter id was null or undefined when calling getTestTypesid.'
			);
			expect(() => httpService.getTestTypesid('1', null as unknown as string[], 'hgv')).toThrow(
				'Required parameter fields was null or undefined when calling getTestTypesid.'
			);
			expect(() => httpService.getTestTypesid('1', [], null as unknown as string)).toThrow(
				'Required parameter vehicleType was null or undefined when calling getTestTypesid.'
			);
		});

		it('encodes test-type IDs and sends all optional vehicle filters', () => {
			httpService
				.getTestTypesid(
					'type/1',
					['bodyType', 'vehicleClass'],
					'hgv',
					'large',
					'articulated',
					3,
					'n3',
					'class 1',
					'A',
					8
				)
				.subscribe();

			const request = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/test-types/type%2F1?fields=bodyType,vehicleClass&vehicleType=hgv&vehicleSize=large&vehicleConfiguration=articulated&vehicleAxles=3&euVehicleCategory=n3&vehicleClass=class%201&vehicleSubclass=A&vehicleWheels=8`
			);
			expect(request.request.method).toBe('GET');
			request.flush({});
		});

		it('paginates reference data and reuses a cache bucket per resource type', () => {
			const bucket = httpService.getRefDataBucket(ReferenceDataResourceType.Tyres);
			httpService.referenceResourceTypeGet(ReferenceDataResourceType.Tyres, 'next-page').subscribe();
			const pagedRequest = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/reference/TYRES?paginationToken=next-page`
			);
			expect(pagedRequest.request.context.get(CACHE_CONTEXT)).toEqual(
				expect.objectContaining({
					cache: true,
					key: `${CacheKeys.REFERENCE_DATA}${ReferenceDataResourceType.Tyres}next-page`,
					bucket,
				})
			);
			pagedRequest.flush({ data: [] });

			httpService.referenceResourceTypeGet(ReferenceDataResourceType.Tyres).subscribe();
			const firstPageRequest = httpTestingController.expectOne(`${environment.VTM_API_URI}/reference/TYRES`);
			expect(httpService.getRefDataBucket(ReferenceDataResourceType.Tyres)).toBe(bucket);
			firstPageRequest.flush({ data: [] });
			expect(() => httpService.referenceResourceTypeGet(null as unknown as string)).toThrow(
				'Required parameter resourceType was null or undefined when calling referenceResourceTypeGet.'
			);
		});

		it('validates reference lookup inputs and supports CRUD requests', () => {
			expect(() => httpService.referenceResourceTypeResourceKeyGet(null as unknown as string, 'key')).toThrow(
				'Required parameter resourceType was null or undefined when calling referenceResourceTypeResourceKeyGet.'
			);
			expect(() => httpService.referenceResourceTypeResourceKeyGet('TYRES', null as unknown as string)).toThrow(
				'Required parameter resourceKey was null or undefined when calling referenceResourceTypeResourceKeyGet.'
			);
			expect(() => httpService.referenceLookupResourceTypeResourceKeyGet(null as unknown as string, 'key')).toThrow();
			expect(() => httpService.referenceLookupTyresSearchKeyParamGet('key', null as unknown as string)).toThrow();
			expect(() => httpService.referenceResourceTypeResourceKeyPost('TYRES', null as unknown as string, {})).toThrow();
			expect(() => httpService.referenceResourceTypeResourceKeyPut('TYRES', null as unknown as string, {})).toThrow();
			expect(() =>
				httpService.referenceResourceTypeResourceKeyDelete('TYRES', null as unknown as string, {})
			).toThrow();

			const body = { description: 'Updated tyre' };
			httpService.referenceResourceTypeResourceKeyPost('TYRES', 'key/1', body).subscribe();
			httpService.referenceResourceTypeResourceKeyPut('TYRES', 'key/1', body).subscribe();
			httpService.referenceResourceTypeResourceKeyDelete('TYRES', 'key/1', body).subscribe();

			const post = httpTestingController.expectOne(
				(request) => request.url === `${environment.VTM_API_URI}/reference/TYRES/key%2F1` && request.method === 'POST'
			);
			expect(post.request.method).toBe('POST');
			expect(post.request.body).toEqual(body);
			post.flush({});
			const put = httpTestingController.expectOne(
				(request) => request.url === `${environment.VTM_API_URI}/reference/TYRES/key%2F1` && request.method === 'PUT'
			);
			expect(put.request.method).toBe('PUT');
			expect(put.request.body).toEqual(body);
			put.flush({});
			const deleteRequest = httpTestingController.expectOne(
				(request) => request.url === `${environment.VTM_API_URI}/reference/TYRES/key%2F1` && request.method === 'DELETE'
			);
			expect(deleteRequest.request.method).toBe('DELETE');
			expect(deleteRequest.request.body).toEqual(body);
			deleteRequest.flush({});
		});

		it('posts and updates test results with outbound compression headers', () => {
			const body = { systemNumber: 'SYS123' } as TestResultSchema;
			httpService.testResultsPost(body).subscribe();
			const post = httpTestingController.expectOne(`${environment.VTM_API_URI}/test-results`);
			expect(post.request.method).toBe('POST');
			expect(post.request.body).toBe(body);
			expect(post.request.headers.get(CompressionHeaders.outbound.request)).toBe(CompressionHeaders.compressionValue);
			post.flush({ testResultId: 'id' });

			httpService.testResultsSystemNumberPut(body, 'SYS/123').subscribe();
			const put = httpTestingController.expectOne(`${environment.VTM_API_URI}/test-results/SYS%2F123`);
			expect(put.request.method).toBe('PUT');
			expect(put.request.body).toBe(body);
			put.flush(body);

			expect(() => httpService.testResultsPost(null as unknown as TestResultSchema)).toThrow();
			expect(() => httpService.testResultsSystemNumberPut(null as unknown as TestResultSchema, 'SYS')).toThrow();
			expect(() => httpService.testResultsSystemNumberPut(body, null as unknown as string)).toThrow();
		});

		it('generates ADR certificates and unarchives records with their action details', () => {
			httpService.generateADRCertificate('SYS123', 'timestamp', 'adr').subscribe();
			const certificate = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/tech-records/v4/adrCertificate/SYS123/timestamp`
			);
			expect(certificate.request.method).toBe('POST');
			expect(certificate.request.body).toEqual({ certificateType: 'adr' });
			certificate.flush({ message: 'Generated', id: 'id' });

			httpService.unarchiveTechRecord('SYS123', 'timestamp', 'corrected record', StatusCodes.CURRENT).subscribe();
			const unarchive = httpTestingController.expectOne(
				`${environment.VTM_API_URI}/tech-records/v4/unarchive/SYS123/timestamp`
			);
			expect(unarchive.request.method).toBe('POST');
			expect(unarchive.request.body).toEqual({ reasonForUnarchiving: 'corrected record', status: StatusCodes.CURRENT });
			expect(unarchive.request.headers.get(CompressionHeaders.outbound.request)).toBe(
				CompressionHeaders.compressionValue
			);
			unarchive.flush({});
		});

		it('fetches feature flags from the VTM endpoint', () => {
			httpService.getFeatureFlags().subscribe();

			const request = httpTestingController.expectOne(`${environment.VTM_API_URI}/feature-flags/VTM`);
			expect(request.request.method).toBe('GET');
			request.flush({});
		});
	});
});
