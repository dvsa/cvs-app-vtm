import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { environment } from '@environments/environment';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { Defect } from '@models/defects/defect.model';
import { SEARCH_TYPES } from '@models/search-types-enum';
import { TestStation } from '@models/test-stations/test-station.model';
import { EuVehicleCategory } from '@models/test-types/eu-vehicle-category.enum';
import { first, of } from 'rxjs';
import { HttpService } from './http.service';

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
			const expectedResult = [{ imDescription: 'Some Description' } as Defect];
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
			const expectedResult = { imDescription: 'Some Description' } as Defect;
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
			const expectedResult = [{ imDescription: 'Some Description' } as Defect];
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
			const expectedResult = [{ testStationName: 'Some Name' } as TestStation];
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
			const expectedResult = { testStationName: 'Some Name' } as TestStation;
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
				`${environment.VTM_API_URI}/v3/technical-records/search/term?searchCriteria=${SEARCH_TYPES.ALL}`
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
});
