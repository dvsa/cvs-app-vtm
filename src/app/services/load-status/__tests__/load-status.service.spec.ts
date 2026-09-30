import { initialAppState } from '@/src/app/store';
import { TestBed } from '@angular/core/testing';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestStatus } from '@dvsa/cvs-type-definitions/types/v1/enums/testStatus.enum.js';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectAllTestResults } from '@store/test-records';
import dayjs from 'dayjs';
import { LoadStatusService } from '../load-status.service';

const RETEST_DATE = '2026-09-28T10:00:00.000Z';

function annualTest(overrides: {
	testTypeId?: string;
	testResult?: TestResults;
	imNumbers?: number[];
	testTypeStartTimestamp?: string;
	testStatus?: TestStatus;
	testResultId?: string;
}): TestResultSchema {
	const {
		testTypeId = '94',
		testResult = TestResults.FAIL,
		imNumbers = [59],
		testTypeStartTimestamp = '2026-09-23T09:00:00.000Z',
		testStatus = TestStatus.SUBMITTED,
		testResultId = 'annual-test-id',
	} = overrides;

	return {
		testResultId,
		testStatus,
		testTypes: [
			{
				testTypeId,
				testResult,
				testTypeStartTimestamp,
				defects: imNumbers.map((imNumber) => ({ imNumber })),
			},
		],
	} as TestResultSchema;
}

function retest(overrides: Partial<TestResultSchema> & { testTypeId?: string } = {}): Partial<TestResultSchema> {
	const { testTypeId = '53', ...rest } = overrides;

	return {
		testResultId: 'retest-id',
		vehicleType: 'hgv',
		testTypes: [{ testTypeId, testTypeStartTimestamp: RETEST_DATE }],
		...rest,
	} as Partial<TestResultSchema>;
}

describe('LoadStatusService', () => {
	let service: LoadStatusService;
	let store: MockStore;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [LoadStatusService, provideMockStore({ initialState: initialAppState })],
		});

		store = TestBed.inject(MockStore);
		service = TestBed.inject(LoadStatusService);
	});

	afterEach(() => {
		store.resetSelectors();
	});

	function setTestHistory(testResults: TestResultSchema[]) {
		store.overrideSelector(selectAllTestResults, testResults);
		store.refreshState();
	}

	describe('isLoadStatusApplicable', () => {
		beforeEach(() => setTestHistory([]));

		it('should be false when there is no test result', () => {
			expect(service.isLoadStatusApplicable(undefined)).toBe(false);
		});

		it('should be false when there is no test type', () => {
			expect(service.isLoadStatusApplicable({ testTypes: [] })).toBe(false);
		});

		it.each(['94', '40', '70', '107'])('should be true for annual test type %s', (testTypeId) => {
			expect(service.isLoadStatusApplicable(retest({ testTypeId }))).toBe(true);
		});

		it.each(['41', '95', '1', '18'])('should be false for test type %s', (testTypeId) => {
			expect(service.isLoadStatusApplicable(retest({ testTypeId }))).toBe(false);
		});

		describe('annual test retests', () => {
			it.each([59, 71, 72, 73])('should be true when the annual test being retested failed on IM %i', (imNumber) => {
				setTestHistory([annualTest({ imNumbers: [imNumber] })]);
				expect(service.isLoadStatusApplicable(retest())).toBe(true);
			});

			it('should be true for a TRL annual test retest', () => {
				setTestHistory([annualTest({ testTypeId: '40' })]);
				expect(service.isLoadStatusApplicable(retest({ testTypeId: '98', vehicleType: 'trl' }))).toBe(true);
			});

			it('should be true when the annual test was failed on both qualifying and other defects', () => {
				setTestHistory([annualTest({ imNumbers: [1, 71] })]);
				expect(service.isLoadStatusApplicable(retest())).toBe(true);
			});

			it('should be false when the vehicle has no test history', () => {
				expect(service.isLoadStatusApplicable(retest())).toBe(false);
			});

			it('should be false when the annual test was not failed on a qualifying defect', () => {
				setTestHistory([annualTest({ imNumbers: [1, 20] })]);
				expect(service.isLoadStatusApplicable(retest())).toBe(false);
			});

			it('should be false when the annual test has no defects', () => {
				setTestHistory([annualTest({ imNumbers: [] })]);
				expect(service.isLoadStatusApplicable(retest())).toBe(false);
			});

			it('should be false when the annual test was not failed', () => {
				setTestHistory([annualTest({ testResult: TestResults.PASS })]);
				expect(service.isLoadStatusApplicable(retest())).toBe(false);
			});

			it('should be false when the qualifying test was not an annual test', () => {
				setTestHistory([annualTest({ testTypeId: '76' })]);
				expect(service.isLoadStatusApplicable(retest())).toBe(false);
			});

			it('should be false when the annual test was cancelled', () => {
				setTestHistory([annualTest({ testStatus: TestStatus.CANCELLED })]);
				expect(service.isLoadStatusApplicable(retest())).toBe(false);
			});

			it('should be true on the last day of the 21 day retest window', () => {
				setTestHistory([annualTest({ testTypeStartTimestamp: '2026-09-07T09:00:00.000Z' })]);
				expect(service.isLoadStatusApplicable(retest())).toBe(true);
			});

			it('should be false when the annual test failed outside of the 21 day retest window', () => {
				setTestHistory([annualTest({ testTypeStartTimestamp: '2026-09-06T09:00:00.000Z' })]);
				expect(service.isLoadStatusApplicable(retest())).toBe(false);
			});

			it('should be false when the annual test is dated after the retest', () => {
				setTestHistory([annualTest({ testTypeStartTimestamp: '2026-09-29T09:00:00.000Z' })]);
				expect(service.isLoadStatusApplicable(retest())).toBe(false);
			});

			it('should only consider the most recent annual test failed within the retest window', () => {
				setTestHistory([
					annualTest({ testResultId: 'older', testTypeStartTimestamp: '2026-09-20T09:00:00.000Z', imNumbers: [59] }),
					annualTest({ testResultId: 'newer', testTypeStartTimestamp: '2026-09-25T09:00:00.000Z', imNumbers: [1] }),
				]);

				expect(service.isLoadStatusApplicable(retest())).toBe(false);
			});

			it('should ignore the retest itself when it is already part of the test history', () => {
				setTestHistory([{ ...(retest() as TestResultSchema), testStatus: TestStatus.SUBMITTED }, annualTest({})]);

				expect(service.isLoadStatusApplicable(retest())).toBe(true);
			});

			// The reactive form initialises timestamps it has not captured to an empty string, and the
			// vehicle type to 'car', until the tech record is patched over it
			it('should be true for a retest whose test date has not been captured yet', () => {
				setTestHistory([annualTest({ testTypeStartTimestamp: dayjs().subtract(3, 'day').toISOString() })]);

				expect(
					service.isLoadStatusApplicable({
						testResultId: 'retest-id',
						vehicleType: 'car',
						testStartTimestamp: '',
						createdAt: null,
						testTypes: [{ testTypeId: '53', testTypeStartTimestamp: null }],
					} as unknown as Partial<TestResultSchema>)
				).toBe(true);
			});

			it('should be false for a retest whose test date has not been captured yet and no recent failure', () => {
				setTestHistory([annualTest({ testTypeStartTimestamp: dayjs().subtract(30, 'day').toISOString() })]);

				expect(
					service.isLoadStatusApplicable({
						testResultId: 'retest-id',
						testStartTimestamp: '',
						createdAt: null,
						testTypes: [{ testTypeId: '53', testTypeStartTimestamp: null }],
					} as unknown as Partial<TestResultSchema>)
				).toBe(false);
			});

			it('should ignore an annual test whose date cannot be determined', () => {
				setTestHistory([
					{
						testResultId: 'annual-test-id',
						testStatus: TestStatus.SUBMITTED,
						testStartTimestamp: '',
						createdAt: null,
						testTypes: [
							{
								testTypeId: '94',
								testResult: TestResults.FAIL,
								testTypeStartTimestamp: null,
								defects: [{ imNumber: 59 }],
							},
						],
					} as unknown as TestResultSchema,
				]);

				expect(service.isLoadStatusApplicable(retest())).toBe(false);
			});

			it('should fall back to the test start timestamp and created date when timestamps are missing', () => {
				setTestHistory([
					{
						testResultId: 'annual-test-id',
						testStatus: TestStatus.SUBMITTED,
						testStartTimestamp: '2026-09-23T09:00:00.000Z',
						testTypes: [{ testTypeId: '94', testResult: TestResults.FAIL, defects: [{ imNumber: 72 }] }],
					} as TestResultSchema,
				]);

				expect(
					service.isLoadStatusApplicable({
						testResultId: 'retest-id',
						vehicleType: 'hgv',
						createdAt: RETEST_DATE,
						testTypes: [{ testTypeId: '53' }],
					} as Partial<TestResultSchema>)
				).toBe(true);
			});
		});
	});

	describe('getQualifyingAnnualTest', () => {
		it('should return the annual test that load status applies because of', () => {
			setTestHistory([annualTest({ imNumbers: [73] })]);

			expect(service.getQualifyingAnnualTest(retest())).toEqual(
				expect.objectContaining({ testTypeId: '94', testResult: TestResults.FAIL })
			);
		});

		it('should return undefined when no annual test qualifies', () => {
			setTestHistory([annualTest({ imNumbers: [1] })]);

			expect(service.getQualifyingAnnualTest(retest())).toBeUndefined();
		});
	});
});
