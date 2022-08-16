import { GlobalError } from '@core/components/global-error/global-error.interface';
import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as TestResultActions from '@store/test-records';
import * as TechnicalRecordServiceActions from '../../technical-records/actions/technical-record-service.actions';
import * as GlobalErrorActions from '../actions/global-error.actions';
import * as ReferenceDataActions from '../../reference-data/actions/reference-data.actions';

export const STORE_FEATURE_GLOBAL_ERROR_KEY = 'globalError';

export interface GlobalErrorState {
  errors: Array<GlobalError>;
}

export const initialGlobalErrorState: GlobalErrorState = {
  errors: []
};

export const getGlobalErrorState = createFeatureSelector<GlobalErrorState>(STORE_FEATURE_GLOBAL_ERROR_KEY);

export const globalErrorState = createSelector(getGlobalErrorState, state => state.errors);

export const globalErrorReducer = createReducer(
  initialGlobalErrorState,
  on(
    GlobalErrorActions.clearError,
    TechnicalRecordServiceActions.getByVin,
    TechnicalRecordServiceActions.getByPartialVin,
    TechnicalRecordServiceActions.getByVrm,
    TechnicalRecordServiceActions.getByTrailerId,
    TechnicalRecordServiceActions.getByAll,
    TestResultActions.fetchTestResults,
    TestResultActions.fetchTestResultsBySystemNumber,
    TestResultActions.fetchSelectedTestResult,
    ReferenceDataActions.fetchReferenceData,
    ReferenceDataActions.fetchReferenceDataByKey,
    successMethod
  ),

  on(
    GlobalErrorActions.addError,
    TechnicalRecordServiceActions.getByVinFailure,
    TechnicalRecordServiceActions.getByPartialVinFailure,
    TechnicalRecordServiceActions.getByVrmFailure,
    TechnicalRecordServiceActions.getByTrailerIdFailure,
    TechnicalRecordServiceActions.getByAllFailure,
    TestResultActions.fetchTestResultsFailed,
    TestResultActions.fetchTestResultsBySystemNumberFailed,
    TestResultActions.fetchSelectedTestResultFailed,
    ReferenceDataActions.fetchReferenceDataFailed,
    ReferenceDataActions.fetchReferenceDataByKeyFailed,
    failureMethod
  ),
  on(GlobalErrorActions.setErrors, TestResultActions.updateTestResultFailed, (state, { errors }) => ({ ...state, errors: [...errors] })),
  on(GlobalErrorActions.patchErrors, (state, { errors }) => ({ ...state, errors: [...state.errors, ...errors] }))
);

function successMethod(state: GlobalErrorState) {
  return { ...state, errors: [] };
}

function failureMethod(state: GlobalErrorState, errorMessage: { error: any; anchorLink: any }) {
  return { ...state, errors: [...state.errors, { error: errorMessage.error, anchorLink: errorMessage.anchorLink }] };
}
