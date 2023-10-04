import { GlobalError } from '@core/components/global-error/global-error.interface';
import { routerNavigatedAction } from '@ngrx/router-store';
import {
  createFeatureSelector, createReducer, createSelector, on,
} from '@ngrx/store';
import { fetchSearchResult, fetchSearchResultFailed } from '@store/tech-record-search/actions/tech-record-search.actions';
// eslint-disable-next-line import/no-cycle
import * as TestResultActions from '@store/test-records';
import * as ReferenceDataActions from '../../reference-data/actions/reference-data.actions';
import * as TechnicalRecordServiceActions from '../../technical-records/actions/technical-record-service.actions';
import { createVehicleRecordFailure } from '../../technical-records/actions/technical-record-service.actions';
import * as GlobalErrorActions from '../actions/global-error.actions';

export const STORE_FEATURE_GLOBAL_ERROR_KEY = 'globalError';

export interface GlobalErrorState {
  errors: Array<GlobalError>;
}

export const initialGlobalErrorState: GlobalErrorState = {
  errors: [],
};

export const getGlobalErrorState = createFeatureSelector<GlobalErrorState>(STORE_FEATURE_GLOBAL_ERROR_KEY);

export const globalErrorState = createSelector(getGlobalErrorState, (state) => state.errors);

export const globalErrorReducer = createReducer(
  initialGlobalErrorState,
  on(
    GlobalErrorActions.clearError,
    TechnicalRecordServiceActions.updateTechRecord,
    TestResultActions.fetchTestResults,
    TestResultActions.fetchTestResultsBySystemNumber,
    TestResultActions.fetchSelectedTestResult,
    ReferenceDataActions.fetchReferenceData,
    ReferenceDataActions.fetchReferenceDataByKey,
    fetchSearchResult,
    routerNavigatedAction,
    successMethod,
  ),

  on(
    GlobalErrorActions.addError,
    TechnicalRecordServiceActions.updateTechRecordFailure,
    TechnicalRecordServiceActions.generateLetterFailure,
    TechnicalRecordServiceActions.generatePlateFailure,
    TechnicalRecordServiceActions.archiveTechRecordFailure,
    TechnicalRecordServiceActions.unarchiveTechRecordFailure,
    TestResultActions.fetchTestResultsFailed,
    TestResultActions.fetchTestResultsBySystemNumberFailed,
    TestResultActions.fetchSelectedTestResultFailed,
    ReferenceDataActions.fetchReferenceDataFailed,
    ReferenceDataActions.fetchReferenceDataByKeyFailed,
    fetchSearchResultFailed,
    failureMethod,
  ),
  on(GlobalErrorActions.setErrors, TestResultActions.updateTestResultFailed, TestResultActions.createTestResultFailed, (state, { errors }) => ({
    ...state,
    errors: [...errors],
  })),
  on(GlobalErrorActions.patchErrors, (state, { errors }) => ({ ...state, errors: [...state.errors, ...errors] })),
  on(createVehicleRecordFailure, (state, action) => ({ errors: [...state.errors, { error: action.error }] })),
);

function successMethod(state: GlobalErrorState) {
  return { ...state, errors: [] };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function failureMethod(state: GlobalErrorState, errorMessage: { error: any; anchorLink?: any }) {
  return { ...state, errors: [...state.errors, { error: errorMessage.error, anchorLink: errorMessage.anchorLink }] };
}
