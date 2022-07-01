import { TestResultModel } from '@models/test-result.model';
import { TestType } from '@models/test-type.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
  fetchSelectedTestResult,
  fetchSelectedTestResultFailed,
  fetchSelectedTestResultSuccess,
  fetchTestResults,
  fetchTestResultsBySystemNumber,
  fetchTestResultsBySystemNumberFailed,
  fetchTestResultsBySystemNumberSuccess,
  fetchTestResultsSuccess,
  updateTestResultState,
  updateTestResult,
  updateTestResultFailed,
  updateTestResultSuccess
} from '../actions/test-records.actions';

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
  on(fetchTestResultsBySystemNumber, (state) => ({ ...state, loading: true })),
  on(fetchTestResultsBySystemNumberSuccess, (state, action) => ({ ...testResultAdapter.setAll(action.payload, state), loading: false })),
  on(fetchTestResultsBySystemNumberFailed, (state) => ({ ...testResultAdapter.setAll([], state), loading: false })),
  on(fetchSelectedTestResult, (state) => ({ ...state, loading: true })),
  on(fetchSelectedTestResultSuccess, (state, action) => ({ ...testResultAdapter.upsertOne(action.payload, state), loading: false })),
  on(fetchSelectedTestResultFailed, (state) => ({ ...state, loading: false })),
  on(updateTestResultState, (state, { testResultId, testTypeId, section, value }) => {
    const testResult = state.entities[testResultId];
    if (!testResult) {
      return { ...state };
    }

    const updatedTestResult = updateTestResultBySection(section, testResult, testTypeId, value);

    return { ...testResultAdapter.upsertOne(updatedTestResult, state), loading: true };
  }),
  on(updateTestResult, (state) => ({ ...state, loading: true })),
  on(updateTestResultSuccess, updateTestResultFailed, (state) => ({ ...state, loading: false }))
);

export const testResultsFeatureState = createFeatureSelector<TestResultsState>(STORE_FEATURE_TEST_RESULTS_KEY);

function updateTestResultBySection(section: string, testResult: TestResultModel, testTypeId: string, value: any) {
  const testType = testResult?.testTypes.find((t) => t.testTypeId === testTypeId);
  const testTypeIndex = testResult?.testTypes.map((t) => t.testTypeId).indexOf(testTypeId);

  const newTestType = { ...testType };
  if (value && value.testTypes) {
    Object.assign(newTestType, value.testTypes[0]);
  }
  const testTypes = [...testResult?.testTypes];

  testTypes.splice(testTypeIndex, 1, newTestType as TestType);
  const newTestResult = { ...testResult, ...value, testTypes };

  return newTestResult;
}
