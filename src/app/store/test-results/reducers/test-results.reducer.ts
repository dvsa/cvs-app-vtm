import { TestResultModel } from '@models/test-result.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { fetchTestResultBySystemIdSuccess, fetchTestResultsSuccess } from '../actions/test-results.actions';

export const STORE_FEATURE_TEST_RESULTS_KEY = 'testResults';

export interface TestResultsState extends EntityState<TestResultModel> {}

const selectTestResultId = (a: TestResultModel): string => {
  return a.systemNumber;
};

export const testResultAdapter: EntityAdapter<TestResultModel> = createEntityAdapter<TestResultModel>({ selectId: selectTestResultId });

export const initialTestResultsState = testResultAdapter.getInitialState();

export const testResultsReducer = createReducer(
  initialTestResultsState,
  on(fetchTestResultsSuccess, (state, action) => testResultAdapter.setAll(action.payload, state)),
  on(fetchTestResultBySystemIdSuccess, (state, action) => testResultAdapter.upsertOne(action.payload, state))
);

export const testResultsFeatureState = createFeatureSelector<TestResultsState>(STORE_FEATURE_TEST_RESULTS_KEY);
