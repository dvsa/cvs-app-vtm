import { FormNode } from '@forms/services/dynamic-form.types';
import { TestResultModel } from '@models/test-results/test-result.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import mergeWith from 'lodash.mergewith';
import {
  cancelEditingTestResult,
  fetchSelectedTestResult,
  fetchSelectedTestResultFailed,
  fetchSelectedTestResultSuccess,
  fetchTestResults,
  fetchTestResultsBySystemNumber,
  fetchTestResultsBySystemNumberFailed,
  fetchTestResultsBySystemNumberSuccess,
  fetchTestResultsSuccess,
  templateSectionsChanged,
  updateEditingTestResult,
  updateTestResult,
  updateTestResultFailed,
  updateTestResultSuccess
} from '../actions/test-records.actions';

export const STORE_FEATURE_TEST_RESULTS_KEY = 'testRecords';

interface Extras {
  error: string;
  loading: boolean;
  editingTestResult?: TestResultModel;
  sectionTemplates?: FormNode[];
}

export interface TestResultsState extends EntityState<TestResultModel>, Extras {}

const selectTestResultId = (a: TestResultModel): string => {
  return a.testResultId;
};

export const testResultAdapter: EntityAdapter<TestResultModel> = createEntityAdapter<TestResultModel>({ selectId: selectTestResultId });

export const initialTestResultsState = testResultAdapter.getInitialState<Extras>({
  error: '',
  loading: false
});

export const testResultsReducer = createReducer(
  initialTestResultsState,
  on(fetchTestResults, state => ({ ...state, loading: true })),
  on(fetchTestResultsSuccess, (state, action) => ({ ...testResultAdapter.setAll(action.payload, state), loading: false })),
  on(fetchTestResultsBySystemNumber, state => ({ ...state, loading: true })),
  on(fetchTestResultsBySystemNumberSuccess, (state, action) => ({ ...testResultAdapter.setAll(action.payload, state), loading: false })),
  on(fetchTestResultsBySystemNumberFailed, state => ({ ...testResultAdapter.setAll([], state), loading: false })),
  on(fetchSelectedTestResult, state => ({ ...state, loading: true })),
  on(fetchSelectedTestResultSuccess, (state, action) => ({ ...testResultAdapter.upsertOne(action.payload, state), loading: false })),
  on(fetchSelectedTestResultFailed, state => ({ ...state, loading: false })),
  on(updateTestResult, state => ({ ...state, loading: true })),
  on(updateTestResultSuccess, (state, action) => ({ ...testResultAdapter.updateOne(action.payload, state), loading: false })),
  on(updateTestResultFailed, state => ({ ...state, loading: false })),
  on(templateSectionsChanged, (state, action) => ({ ...state, sectionTemplates: action.sectionTemplates, editingTestResult: action.sectionsValue })),
  on(cancelEditingTestResult, state => ({ ...state, editingTestResult: undefined, sectionTemplates: undefined })),
  on(updateEditingTestResult, (state, action) => {
    const customizer = (objValue: any, srcValue: any) => {
      // if source value is an array with length of 0, then return the source value.
      // this is for cases where we remove items from a FormArray.
      if (Array.isArray(objValue) && srcValue.length === 0) {
        return srcValue;
      }
    };

    return {
      ...state,
      editingTestResult: mergeWith({}, state.editingTestResult, action.testResult, customizer)
    };
  })
);

export const testResultsFeatureState = createFeatureSelector<TestResultsState>(STORE_FEATURE_TEST_RESULTS_KEY);
