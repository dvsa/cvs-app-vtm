import { TestResultDefects } from '@models/test-results/test-result-defects.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestType } from '@models/test-types/test-type.model';
import { createSelector } from '@ngrx/store';
import { selectRouteNestedParams } from '@store/router/router.selectors';
// eslint-disable-next-line import/no-cycle
import { testResultAdapter, testResultsFeatureState } from './test-records.reducer';

const { selectIds, selectEntities, selectAll, selectTotal } = testResultAdapter.getSelectors();

// select the array of ids
export const selectTestResultIds = createSelector(testResultsFeatureState, (state) => selectIds(state));

// select the dictionary of test results entities
export const selectTestResultsEntities = createSelector(testResultsFeatureState, (state) => selectEntities(state));

// select the array of tests result
export const selectAllTestResults = createSelector(testResultsFeatureState, (state) => selectAll(state));

// select the array of tests results in order of createdAt (most recent to oldest)
export const selectAllTestResultsInDateOrder = createSelector(selectAllTestResults, (testResults) =>
	testResults.sort(byDate)
);

// select the total test results count
export const selectTestResultsTotal = createSelector(testResultsFeatureState, (state) => selectTotal(state));

export const selectedTestResultState = createSelector(
	selectTestResultsEntities,
	selectRouteNestedParams,
	(entities, { testResultId, testNumber }) => {
		// eslint-disable-next-line security/detect-object-injection
		const testResult = entities[testResultId];
		if (!testResult) {
			return undefined;
		}

		const testTypeFound = testResult.testTypes.find((testType) => testType.testNumber === testNumber);

		if (!testTypeFound) {
			return undefined;
		}

		return { ...testResult, testTypes: [testTypeFound] } as TestResultModel;
	}
);

export const testResultInEdit = createSelector(testResultsFeatureState, (state) => state.editingTestResult);

export const toEditOrNotToEdit = createSelector(
	testResultInEdit,
	selectedTestResultState,
	(editingTestResult, selectedTestResult) => {
		return editingTestResult || selectedTestResult;
	}
);

export const testResultLoadingState = createSelector(testResultsFeatureState, (state) => state.loading);

export const selectDefectData = createSelector(selectedTestResultState, (testResult) =>
	getDefectFromTestResult(testResult)
);

export const isTestTypeOldIvaOrMsva = createSelector(toEditOrNotToEdit, (testResult) => {
	return (
		!!testResult?.testTypes[0]?.customDefects?.length &&
		!!testResult?.testTypes[0]?.customDefects?.every(
			(defect) => !!defect.referenceNumber && !!defect.referenceNumber.trim()
		)
	);
});

export const selectedTestSortedAmendmentHistory = createSelector(selectedTestResultState, (testResult) => {
	if (!testResult || !testResult.testHistory) {
		return [];
	}

	const testHistory = [...testResult.testHistory];
	return testHistory.sort(byDate);
});

export const selectedAmendedTestResultState = createSelector(
	selectedTestResultState,
	selectRouteNestedParams,
	(testRecord, { testNumber, createdAt }) => {
		const amendedTest = testRecord?.testHistory?.find((testResult) => testResult.createdAt === createdAt);

		if (!amendedTest) {
			return undefined;
		}

		const testTypeFound = amendedTest.testTypes.find((testType) => testType.testNumber === testNumber);

		if (!testTypeFound) {
			return undefined;
		}

		return { ...amendedTest, testTypes: [testTypeFound] };
	}
);

export const selectAmendedDefectData = createSelector(selectedAmendedTestResultState, (amendedTestResult) => {
	return getDefectFromTestResult(amendedTestResult);
});

export const sectionTemplates = createSelector(testResultsFeatureState, (state) => state.sectionTemplates);

export const resultOfTestSelector = createSelector(
	toEditOrNotToEdit,
	(testRecord) => testRecord?.testTypes[0].testResult
);

export const isTestTypeKeySame = (key: keyof TestType) =>
	createSelector(selectedAmendedTestResultState, selectedTestResultState, (testRecord, amendedTestRecord) => {
		return testRecord?.testTypes[0][`${key}`] === amendedTestRecord?.testTypes[0][`${key}`];
	});

// Common Functions
/**
 * Returns the selected test record defects for the first testType (if any).
 * TODO: When we have better routing set up, we need to revisit this so that the testType is also selected based on route paramerets/queries.
 */
function getDefectFromTestResult(testResult: TestResultModel | undefined): TestResultDefects {
	return (testResult?.testTypes && testResult.testTypes.length > 0 && testResult.testTypes[0].defects) || [];
}

function byDate(a: TestResultModel, b: TestResultModel): -1 | 0 | 1 {
	if (a === b) {
		// equal items sort equally
		return 0;
	}

	if (!a.createdAt) {
		// nulls sort after anything else
		return 1;
	}
	if (!b.createdAt) {
		return -1;
	}

	return new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? -1 : 1;
}
