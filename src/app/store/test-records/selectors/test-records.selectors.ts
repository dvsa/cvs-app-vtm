import { TestResultModel } from '@models/test-result.model';
import { createSelector } from '@ngrx/store';
import { selectRouteParams } from '@store/router/selectors/router.selectors';
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

export const selectedTestResultState = createSelector(testResultsEnitities, selectRouteParams, (entities, { testResultId }) => entities[testResultId]);
export const testResultLoadingState = createSelector(testResultsFeatureState, (state) => state.loading);
