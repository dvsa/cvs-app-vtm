import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
	DefaultService as CreateTestResultsService,
	GetTestResultsService,
	UpdateTestResultsService,
} from '@api/test-results';
import { TestResultModel } from '@models/test-results/test-result.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/.';
import {
	createTestResult,
	fetchTestResults,
	fetchTestResultsBySystemNumber,
	toEditOrNotToEdit,
	updateTestResult,
} from '@store/test-records';
import { mockTestResult } from '../../../mocks/mock-test-result';
import { TestRecordsService } from './test-records.service';

describe('TestRecordsService', () => {
	let service: TestRecordsService;
	let httpTestingController: HttpTestingController;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				TestRecordsService,
				provideMockStore({ initialState: initialAppState }),
				GetTestResultsService,
				UpdateTestResultsService,
				CreateTestResultsService,
			],
		});

		httpTestingController = TestBed.inject(HttpTestingController);
		service = TestBed.inject(TestRecordsService);
		store = TestBed.inject(MockStore);
	});

	afterEach(() => {
		// After every test, assert that there are no more pending requests.
		httpTestingController.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('API', () => {
		describe('fetchTestResultbyServiceId', () => {
			it('should throw error when systemNumber is empty', (done) => {
				service.fetchTestResultbySystemNumber('').subscribe({
					error: (e) => {
						expect(e.message).toBe('systemNumber is required');
						done();
					},
				});
			});

			it('should add query params to url', () => {
				const now = new Date('2022-01-01T00:00:00.000Z');
				service
					.fetchTestResultbySystemNumber('SystemNumber', {
						status: 'submited',
						fromDateTime: now,
						toDateTime: now,
						testResultId: 'TEST_RESULT_ID',
						version: '1',
					})
					.subscribe({ next: () => {} });

				// Check for correct requests: should have made one request to POST search from expected URL
				const req = httpTestingController.expectOne(
					// eslint-disable-next-line max-len
					'https://url/api/v1/test-results/SystemNumber?status=submited&fromDateTime=2022-01-01T00:00:00.000Z&toDateTime=2022-01-01T00:00:00.000Z&testResultId=TEST_RESULT_ID&version=1'
				);
				expect(req.request.method).toBe('GET');

				// Provide each request with a mock response
				req.flush([]);
			});

			it('should get a single test result', () => {
				const systemNumber = 'SYS0001';
				const mockData = mockTestResult();
				service.fetchTestResultbySystemNumber(systemNumber).subscribe((response) => {
					expect(response).toEqual(mockData);
				});

				// Check for correct requests: should have made one request to POST search from expected URL
				const req = httpTestingController.expectOne('https://url/api/v1/test-results/SYS0001');
				expect(req.request.method).toBe('GET');

				// Provide each request with a mock response
				req.flush(mockData);
			});
		});
	});

	describe('TestRecordsService.prototype.loadTestResults.name', () => {
		it('should dispatch fetchTestResults action', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			service.loadTestResults();
			expect(dispatchSpy).toHaveBeenCalledWith(fetchTestResults());
		});
	});

	describe('TestRecordsService.prototype.loadTestResultBySystemNumber.name', () => {
		it('should dispatch fetchTestResultsBySystemNumber action', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			const systemNumber = 'SYS0001';
			service.loadTestResultBySystemNumber(systemNumber);
			expect(dispatchSpy).toHaveBeenCalledWith(fetchTestResultsBySystemNumber({ systemNumber }));
		});
	});

	describe('TestRecordsService.prototype.updateTestResult.name', () => {
		it('should dispatch updateTestResultState action', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			service.updateTestResult({} as TestResultModel);
			expect(dispatchSpy).toHaveBeenCalledWith(updateTestResult({ value: {} as TestResultModel }));
		});
	});

	describe('TestRecordsService.prototype.createTestResult.name', () => {
		it('should dispatch createTestResult action', () => {
			const dispatchSpy = jest.spyOn(store, 'dispatch');
			service.createTestResult({} as TestResultModel);
			expect(dispatchSpy).toHaveBeenCalledWith(createTestResult({ value: {} as TestResultModel }));
		});
	});

	describe('getTestTypeGroup', () => {
		it('should get the correct testTypeGroup', () => {
			expect(TestRecordsService.getTestTypeGroup('1')).toBe('testTypesGroup1');
		});

		it('should return undefined if the testTypeGroup is not supported', () => {
			expect(TestRecordsService.getTestTypeGroup('foo')).toBeUndefined();
		});
	});

	describe('isTestTypeGroupEditable$', () => {
		beforeEach(() => {
			store.resetSelectors();
		});

		it('should return true if the test type id is in a valid test type group and the test type group is in the master template', (done) => {
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: 'psv',
				testTypes: [{ testTypeId: '1' }],
			} as TestResultModel);
			service.isTestTypeGroupEditable$.subscribe((isValid) => {
				expect(isValid).toBe(true);
				done();
			});
		});

		it('should return false if the test type id is not in a test type gorup', (done) => {
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: 'psv',
				testTypes: [{ testTypeId: 'foo' }],
			} as TestResultModel);
			service.isTestTypeGroupEditable$.subscribe((isValid) => {
				expect(isValid).toBe(false);
				done();
			});
		});

		it('should return false if the test type group is not in the master template', (done) => {
			store.overrideSelector(toEditOrNotToEdit, {
				vehicleType: 'psv',
				testTypes: [{ testTypeId: 'foo' }],
			} as TestResultModel);
			service.isTestTypeGroupEditable$.subscribe((isValid) => {
				expect(isValid).toBe(false);
				done();
			});
		});

		it('should return false if the testResult is undefined', (done) => {
			store.overrideSelector(toEditOrNotToEdit, undefined);
			service.isTestTypeGroupEditable$.subscribe((isValid) => {
				expect(isValid).toBe(false);
				done();
			});
		});
	});

	describe('postTestResult', () => {
		it('should call the service', () => {
			service['createTestResultsService'].testResultsPost = jest.fn().mockReturnValue('foo');
			expect(service.postTestResult({} as TestResultModel)).toBe('foo');
		});
	});
});
