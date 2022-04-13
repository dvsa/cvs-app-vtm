import { TestResultModel } from '@models/test-result.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { fetchTestResultsBySystemIdFailed, fetchTestResultsBySystemIdSuccess, fetchTestResultsSuccess } from '../actions/test-records.actions';

export const STORE_FEATURE_TEST_RESULTS_KEY = 'testRecords';

export interface TestResultsState extends EntityState<TestResultModel> {
  error: string;
}

const selectTestResultId = (a: TestResultModel): string => {
  return a.testResultId;
};

export const testResultAdapter: EntityAdapter<TestResultModel> = createEntityAdapter<TestResultModel>({ selectId: selectTestResultId });

export const initialTestResultsState = testResultAdapter.getInitialState({ error: '' });

export const testResultsReducer = createReducer(
  initialTestResultsState,
  on(fetchTestResultsSuccess, (state, action) => testResultAdapter.setAll(action.payload, state)),
  on(fetchTestResultsBySystemIdSuccess, (state, action) => testResultAdapter.setAll(action.payload, state)),
  on(fetchTestResultsBySystemIdFailed, (state, { error }) => ({ ...state, error: error }))
);

export const testResultsFeatureState = createFeatureSelector<TestResultsState>(STORE_FEATURE_TEST_RESULTS_KEY);
