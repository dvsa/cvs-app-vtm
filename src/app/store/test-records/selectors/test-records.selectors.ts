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
export const selectAllTestResults = createSelector(testResultsFeatureState, (state) => {
  return Object.values(state.entities) as TestResultModel[];
});

// select the total test results count
export const selectTestResultsTotal = selectTotal;

export const testResultsEnitities = createSelector(testResultsFeatureState, selectTestResultsEntities);

export const selectedTestResultState = createSelector(testResultsEnitities, selectRouteNestedParams, (entities, { testResultId }) => entities[testResultId]);

export const selectDefectData = createSelector(selectedTestResultState, (testResult) => {
  return getDefectFromTestResult(testResult);
});

export const selectedArchivedTestResultState = createSelector(selectedTestResultState, selectRouteParams, (testRecord, { archivedTestResultId }) => testRecord?.testHistory?.find((i) => i.testResultId === archivedTestResultId));
export const selectArchivedDefectData = createSelector(selectedArchivedTestResultState, (archivedTestResult) => {
  return getDefectFromTestResult(archivedTestResult);
});

// Common Functions
/**
 * Returns the selected test record defects for the first testType (if any).
 * TODO: When we have better routing set up, we need to revisit this so that the testType is also selected based on route paramerets/queries.
 */
const getDefectFromTestResult = (testResult: TestResultModel | undefined) => {
  const defects = testResult?.testTypes && testResult?.testTypes.length > 0 ? testResult?.testTypes[0].defects : [];
  return defects || [];
};
