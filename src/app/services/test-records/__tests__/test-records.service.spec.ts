import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestStatus } from '@dvsa/cvs-type-definitions/types/v1/enums/testStatus.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { environment } from '@environments/environment';
import { mockTestResult } from '@mocks/mock-test-result';
import { createMockTestType } from '@mocks/test-type.mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HttpService } from '@services/http/http.service';
import { State, initialAppState } from '@store/index';
import {
	cancelEditingTestResult,
	cleanTestResult,
	contingencyTestTypeSelected,
	createTestResult,
	editingTestResult,
	fetchTestResults,
	fetchTestResultsBySystemNumber,
	testResultInEdit,
	testTypeIdChanged,
	toEditOrNotToEdit,
	updateEditingTestResult,
	updateTestResult,
	updateTestResultFailed,
} from '@store/test-records';
import { firstValueFrom, of } from 'rxjs';
import { TestRecordsService } from '../test-records.service';

describe('TestRecordsService', () => {
	let httpService: HttpService;
	let service: TestRecordsService;
	let httpTestingController: HttpTestingController;
	let store: MockStore<State>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [TestRecordsService, provideMockStore({ initialState: initialAppState }), HttpService, HttpService],
		});

		httpTestingController = TestBed.inject(HttpTestingController);
		service = TestBed.inject(TestRecordsService);
		store = TestBed.inject(MockStore);
		httpService = TestBed.inject(HttpService);
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
			it('should throw error when systemNumber is empty', async () => {
				await new Promise<void>((resolve) => {
					const done = resolve;
					service.fetchTestResultbySystemNumber('').subscribe({
						error: (e) => {
							expect(e.message).toBe('systemNumber is required');
							done();
						},
					});
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
					`${environment.VTM_API_URI}/test-results/SystemNumber?status=submited&fromDateTime=2022-01-01T00:00:00.000Z&toDateTime=2022-01-01T00:00:00.000Z&testResultId=TEST_RESULT_ID&version=1`
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
				const req = httpTestingController.expectOne(`${environment.VTM_API_URI}/test-results/SYS0001`);
				expect(req.request.method).toBe('GET');

				// Provide each request with a mock response
				req.flush(mockData);
			});
		});
	});

	describe('TestRecordsService.prototype.loadTestResults.name', () => {
		it('should dispatch fetchTestResults action', () => {
			const dispatchSpy = vi.spyOn(store, 'dispatch');
			service.loadTestResults();
			expect(dispatchSpy).toHaveBeenCalledWith(fetchTestResults());
		});
	});

	describe('TestRecordsService.prototype.loadTestResultBySystemNumber.name', () => {
		it('should dispatch fetchTestResultsBySystemNumber action', () => {
			const dispatchSpy = vi.spyOn(store, 'dispatch');
			const systemNumber = 'SYS0001';
			service.loadTestResultBySystemNumber(systemNumber);
			expect(dispatchSpy).toHaveBeenCalledWith(fetchTestResultsBySystemNumber({ systemNumber }));
		});
	});

	describe('TestRecordsService.prototype.updateTestResult.name', () => {
		it('should dispatch updateTestResultState action', () => {
			const dispatchSpy = vi.spyOn(store, 'dispatch');
			service.updateTestResult({} as TestResultSchema);
			expect(dispatchSpy).toHaveBeenCalledWith(updateTestResult({ value: {} as TestResultSchema }));
		});
	});

	describe('TestRecordsService.prototype.createTestResult.name', () => {
		it('should dispatch createTestResult action', () => {
			const dispatchSpy = vi.spyOn(store, 'dispatch');
			service.createTestResult({} as TestResultSchema);
			expect(dispatchSpy).toHaveBeenCalledWith(createTestResult({ value: {} as TestResultSchema }));
		});
	});

	describe('saving and preparing test results', () => {
		it('removes test history from the cloned amendment payload and includes user details', async () => {
			const body = mockTestResult();
			const originalHistory = structuredClone(body.testHistory);
			vi.spyOn(httpService, 'testResultsSystemNumberPut').mockReturnValue(of(body));

			await firstValueFrom(
				service.saveTestResult('SYS0001', { name: 'Tester', id: 'oid', userEmail: 'tester@example.com' }, body)
			);

			expect(httpService.testResultsSystemNumberPut).toHaveBeenCalledWith(
				{
					msUserDetails: { msOid: 'oid', msUser: 'Tester', msEmailAddress: 'tester@example.com' },
					testResult: expect.not.objectContaining({ testHistory: expect.anything() }),
				},
				'SYS0001'
			);
			expect(body.testHistory).toEqual(originalHistory);
		});

		it('posts a new test result through the HTTP service', () => {
			const body = mockTestResult();
			const post = vi.spyOn(httpService, 'testResultsPost').mockReturnValue(of({ testResultId: 'new-id' }) as any);

			service.postTestResult(body);

			expect(post).toHaveBeenCalledExactlyOnceWith(body);
		});

		it('clears the certificate number for a failed TIR test when it is missing', () => {
			const result = mockTestResult();
			result.testTypes = [
				createMockTestType({ testTypeId: '49', testResult: TestResults.FAIL, certificateNumber: '' }),
			];

			expect(service.prepareTestResultForAmendment([], result)).toBe(result);
			expect(result.testTypes[0].certificateNumber).toBeNull();
		});

		it('uses the certificate number from the latest matching IVA/MSVA result when absent', () => {
			const latestPreviousTest = mockTestResult(1);
			latestPreviousTest.testTypes = [createMockTestType({ testTypeId: '125', certificateNumber: 'IVA-CERT' })];
			const earlierPreviousTest = mockTestResult(2);
			earlierPreviousTest.testTypes = [createMockTestType({ testTypeId: '153', certificateNumber: 'OLDER-CERT' })];
			const amended = mockTestResult();
			amended.testTypes = [createMockTestType({ testTypeId: '126', certificateNumber: null })];

			service.prepareTestResultForAmendment([latestPreviousTest, earlierPreviousTest], amended);

			expect(amended.testTypes[0].certificateNumber).toBe('IVA-CERT');
		});

		it('preserves an existing certificate number rather than replacing it', () => {
			const previous = mockTestResult();
			previous.testTypes = [createMockTestType({ testTypeId: '125', certificateNumber: 'OLD' })];
			const amended = mockTestResult();
			amended.testTypes = [createMockTestType({ testTypeId: '126', certificateNumber: 'CURRENT' })];

			service.prepareTestResultForAmendment([previous], amended);

			expect(amended.testTypes[0].certificateNumber).toBe('CURRENT');
		});
	});

	describe('dispatching edits and cancellation', () => {
		it('dispatches edit, cancel-edit, update-edit, test-type, contingency, and clean actions', () => {
			const dispatch = vi.spyOn(store, 'dispatch');
			const result = mockTestResult();

			service.editingTestResult(result);
			service.cancelEditingTestResult();
			service.updateEditingTestResult(result);
			service.testTypeChange('41');
			service.contingencyTestTypeSelected('annual');
			service.cleanTestResult();

			expect(dispatch.mock.calls.map(([action]) => action)).toEqual([
				editingTestResult({ testTypeId: result.testTypes[0].testTypeId }),
				cancelEditingTestResult(),
				updateEditingTestResult({ testResult: result }),
				testTypeIdChanged({ testTypeId: '41' }),
				contingencyTestTypeSelected({ testType: 'annual' }),
				cleanTestResult(),
			]);
		});

		it('cancels the selected test with the supplied reason', () => {
			const result = mockTestResult();
			store.overrideSelector(testResultInEdit, result);
			const dispatch = vi.spyOn(store, 'dispatch');

			service.cancelTest('Duplicate test');

			expect(dispatch).toHaveBeenCalledWith(
				updateTestResult({
					value: { ...result, testStatus: TestStatus.CANCELLED, reasonForCancellation: 'Duplicate test' },
				})
			);
		});

		it('reports a failed update when there is no selected test to cancel', () => {
			store.overrideSelector(testResultInEdit, undefined);
			const dispatch = vi.spyOn(store, 'dispatch');

			service.cancelTest('Duplicate test');

			expect(dispatch).toHaveBeenCalledWith(
				updateTestResultFailed({ errors: [{ error: 'No selected test result.' }] })
			);
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

		it('should return true if the test type id is in a valid test type group and the test type group is in the master template', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				store.overrideSelector(toEditOrNotToEdit, {
					vehicleType: 'psv',
					testTypes: [{ testTypeId: '1' }],
				} as TestResultSchema);
				service.isTestTypeGroupEditable$.subscribe((isValid) => {
					expect(isValid).toBe(true);
					done();
				});
			});
		});

		it('should return false if the test type id is not in a test type gorup', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				store.overrideSelector(toEditOrNotToEdit, {
					vehicleType: 'psv',
					testTypes: [{ testTypeId: 'foo' }],
				} as TestResultSchema);
				service.isTestTypeGroupEditable$.subscribe((isValid) => {
					expect(isValid).toBe(false);
					done();
				});
			});
		});

		it('should return false if the test type group is not in the master template', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				store.overrideSelector(toEditOrNotToEdit, {
					vehicleType: 'psv',
					testTypes: [{ testTypeId: 'foo' }],
				} as TestResultSchema);
				service.isTestTypeGroupEditable$.subscribe((isValid) => {
					expect(isValid).toBe(false);
					done();
				});
			});
		});

		it('should return false if the testResult is undefined', async () => {
			await new Promise<void>((resolve) => {
				const done = resolve;
				store.overrideSelector(toEditOrNotToEdit, undefined);
				service.isTestTypeGroupEditable$.subscribe((isValid) => {
					expect(isValid).toBe(false);
					done();
				});
			});
		});
	});
});
