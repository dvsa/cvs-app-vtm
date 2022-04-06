import { createSelector } from '@ngrx/store';
import { selectRouteParams } from '@store/router/selectors/router.selectors';
import { testResultAdapter, testResultsFeatureState } from '../reducers/test-results.reducer';

const { selectIds, selectEntities, selectAll, selectTotal } = testResultAdapter.getSelectors();

// select the array of ids
export const selectTestResultIds = selectIds;

// select the dictionary of test results entities
export const selectTestResultsEntities = selectEntities;

// select the array of tests result
export const selectAllTestResults = selectAll;

// select the total test results count
export const selectTestResultsTotal = selectTotal;

export const testResultsEnitities = createSelector(testResultsFeatureState, selectTestResultsEntities);

export const selectedTestResultState = createSelector(testResultsEnitities, selectRouteParams, (entities, { systemId }) => entities[systemId]);
