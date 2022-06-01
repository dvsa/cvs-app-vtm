import { TestResultModel } from '@models/test-result.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { fetchSelectedTestResult, fetchSelectedTestResultFailed, fetchSelectedTestResultSuccess, fetchTestResults, fetchTestResultsBySystemId, fetchTestResultsBySystemIdFailed, fetchTestResultsBySystemIdSuccess, fetchTestResultsSuccess } from '../actions/test-records.actions';

export const STORE_FEATURE_TEST_RESULTS_KEY = 'testRecords';

export interface TestResultsState extends EntityState<TestResultModel> {
  error: string;
  loading: boolean;
}

const selectTestResultId = (a: TestResultModel): string => {
  return a.testResultId;
};

export const testResultAdapter: EntityAdapter<TestResultModel> = createEntityAdapter<TestResultModel>({ selectId: selectTestResultId });

export const initialTestResultsState = testResultAdapter.getInitialState({ error: '', loading: false });

export const testResultsReducer = createReducer(
  initialTestResultsState,
  on(fetchTestResults, (state) => ({ ...state, loading: true })),
  on(fetchTestResultsSuccess, (state, action) => ({ ...testResultAdapter.setAll(action.payload, state), loading: false })),
  on(fetchTestResultsBySystemId, (state) => ({ ...state, loading: true })),
  on(fetchTestResultsBySystemIdSuccess, (state, action) => ({ ...testResultAdapter.setAll(action.payload, state), loading: false })),
  on(fetchTestResultsBySystemIdFailed, (state) => ({ ...testResultAdapter.setAll([], state), loading: false })),
  on(fetchSelectedTestResult, (state) => ({ ...state, loading: true })),
  on(fetchSelectedTestResultSuccess, (state, action) => ({ ...testResultAdapter.upsertOne(action.payload, state), loading: false })),
  on(fetchSelectedTestResultFailed, (state) => ({ ...state, loading: false }))
);

export const testResultsFeatureState = createFeatureSelector<TestResultsState>(STORE_FEATURE_TEST_RESULTS_KEY);
