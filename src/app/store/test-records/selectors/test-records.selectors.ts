import { Defect } from '@models/defect';
import { TestResultModel } from '@models/test-result.model';
import { createSelector } from '@ngrx/store';
import { selectRouteNestedParams, selectRouteParams } from '@store/router/selectors/router.selectors';
import { testResultAdapter, testResultsFeatureState } from '../reducers/test-records.reducer';

const { selectIds, selectEntities, selectAll, selectTotal } = testResultAdapter.getSelectors();

// select the array of ids
export const selectTestResultIds = selectIds;

// select the dictionary of test results entities
export const selectTestResultsEntities = selectEntities;

// select the array of tests result
// export const selectAllTestResults = selectAll;
export const selectAllTestResults = createSelector(
  testResultsFeatureState,
  state => Object.values(state.entities) as TestResultModel[]
);

// select the total test results count
export const selectTestResultsTotal = selectTotal;

export const testResultsEnitities = createSelector(testResultsFeatureState, selectTestResultsEntities);

export const selectedTestResultState = createSelector(
  testResultsEnitities,
  selectRouteNestedParams,
  (entities, { testResultId }) => entities[testResultId]
);

export const testResultLoadingState = createSelector(testResultsFeatureState, state => state.loading);

export const selectDefectData = createSelector(
  selectedTestResultState,
  testResult => getDefectFromTestResult(testResult)
);

export const selectedTestSortedAmendmentHistory = createSelector(
  selectedTestResultState,
  testResult => testResult?.testHistory?.sort(byDate)
);

export const selectedAmendedTestResultState = createSelector(
  selectedTestResultState,
  selectRouteParams,
  (testRecord, { createdAt }) => testRecord?.testHistory?.find(i => i.createdAt === createdAt)
);

export const selectAmendedDefectData = createSelector(
  selectedAmendedTestResultState,
  amendedTestResult => getDefectFromTestResult(amendedTestResult)
);

// Common Functions
/**
 * Returns the selected test record defects for the first testType (if any).
 * TODO: When we have better routing set up, we need to revisit this so that the testType is also selected based on route paramerets/queries.
 */
function getDefectFromTestResult(testResult: TestResultModel | undefined): Defect[] {
  return testResult?.testTypes && testResult.testTypes.length > 0 && testResult.testTypes[0].defects || [];
};

function byDate(a: TestResultModel, b: TestResultModel): -1 | 0 | 1 {
  if (a === b) { // equal items sort equally
    return 0;
  }

  if (!a.createdAt) { // nulls sort after anything else
    return 1;
  }
  if (!b.createdAt) {
    return -1;
  }

  return new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? -1 : 1;
}
