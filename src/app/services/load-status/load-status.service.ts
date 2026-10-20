import { Injectable, inject } from '@angular/core';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { TestStatus } from '@dvsa/cvs-type-definitions/types/v1/enums/testStatus.enum.js';
import { TestResultSchema, TestResultTestTypeSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { TEST_TYPES_LOAD_STATUS_ANNUAL, TEST_TYPES_LOAD_STATUS_ANNUAL_RETEST } from '@models/testTypeId.enum';
import { Store } from '@ngrx/store';
import { selectAllTestResults } from '@store/test-records';
import dayjs, { Dayjs } from 'dayjs';

// Brake related IM numbers which mean the loading condition of the vehicle must be captured on the retest
export const LOAD_STATUS_DEFECT_IM_NUMBERS = [59, 71, 72, 73];

// A retest must be carried out within 21 days of the annual test it is retesting
export const LOAD_STATUS_RETEST_WINDOW_DAYS = 21;

@Injectable({ providedIn: 'root' })
export class LoadStatusService {
	private store = inject(Store);

	private vehicleTestHistory = this.store.selectSignal(selectAllTestResults);

	/**
	 * Load status is captured on HGV/TRL annual tests, and on annual test retests where the annual
	 * test being retested failed on one or more brake related defects.
	 */
	isLoadStatusApplicable(testResult: Partial<TestResultSchema> | undefined): boolean {
		const testType = testResult?.testTypes?.[0];
		if (!testType) return false;

		if (TEST_TYPES_LOAD_STATUS_ANNUAL.includes(testType.testTypeId)) return true;

		if (!TEST_TYPES_LOAD_STATUS_ANNUAL_RETEST.includes(testType.testTypeId)) return false;

		return !!this.getQualifyingAnnualTest(testResult);
	}

	/**
	 * Returns the annual test that a retest is retesting, if load status applies because of it.
	 *
	 * This is the most recent annual test the vehicle failed within the retest window; it only
	 * qualifies if it was failed on one or more brake related defects.
	 */
	getQualifyingAnnualTest(retest: Partial<TestResultSchema>): TestResultTestTypeSchema | undefined {
		// A contingency test being recorded now has no test date until the tester enters one
		const retestDate = this.getTestDate(retest, retest.testTypes?.[0]) ?? dayjs().startOf('day');

		const failedAnnualTests = this.vehicleTestHistory()
			.filter((test) => test.testStatus !== TestStatus.CANCELLED)
			// When amending, the retest itself is part of the vehicle's test history
			.filter((test) => !retest.testResultId || test.testResultId !== retest.testResultId)
			.flatMap((test) =>
				(test.testTypes ?? [])
					.filter(
						(testType) =>
							testType.testResult === TestResults.FAIL && TEST_TYPES_LOAD_STATUS_ANNUAL.includes(testType.testTypeId)
					)
					.map((testType) => ({ testType, testDate: this.getTestDate(test, testType) }))
			)
			.filter((annualTest): annualTest is { testType: TestResultTestTypeSchema; testDate: Dayjs } => {
				if (!annualTest.testDate) return false;

				const daysSinceAnnualTest = retestDate.diff(annualTest.testDate, 'day');
				return daysSinceAnnualTest >= 0 && daysSinceAnnualTest <= LOAD_STATUS_RETEST_WINDOW_DAYS;
			})
			.sort((a, b) => b.testDate.valueOf() - a.testDate.valueOf());

		// Only the most recent annual test failed within the retest window is considered
		const annualTest = failedAnnualTests.at(0)?.testType;
		if (!annualTest) return undefined;

		const hasBrakeRelatedDefect = !!annualTest.defects?.some((defect) =>
			LOAD_STATUS_DEFECT_IM_NUMBERS.includes(defect.imNumber)
		);

		return hasBrakeRelatedDefect ? annualTest : undefined;
	}

	/**
	 * A test result carries its date in more than one place, and the reactive form initialises the
	 * timestamps it has not captured yet to an empty string, so take the first usable date.
	 */
	private getTestDate(
		testResult: Partial<TestResultSchema>,
		testType: TestResultTestTypeSchema | undefined
	): Dayjs | undefined {
		const testDate = [testType?.testTypeStartTimestamp, testResult.testStartTimestamp, testResult.createdAt].find(
			(candidate) => !!candidate && dayjs(candidate).isValid()
		);

		return testDate ? dayjs(testDate).startOf('day') : undefined;
	}
}
