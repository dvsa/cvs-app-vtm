import { GlobalError } from '@core/components/global-error/global-error.interface';
import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as TestResultActions from '@store/test-records';
import * as TechnicalRecordServiceActions from '../../technical-records/actions/technical-record-service.actions';
import * as GlobalErrorActions from '../actions/global-error.actions';

export const STORE_GLOBAL_ERROR_KEY = 'GlobalError';

export interface GlobalErrorState {
  errors: Array<GlobalError>;
}

export const initialGlobalErrorState: GlobalErrorState = {
  errors: []
};

export const getGlobalErrorState = createFeatureSelector<GlobalErrorState>(STORE_GLOBAL_ERROR_KEY);

export const globalErrorState = createSelector(getGlobalErrorState, (state) => state.errors);

export const globalErrorReducer = createReducer(
  initialGlobalErrorState,
  on(
    GlobalErrorActions.clearError,
    TechnicalRecordServiceActions.getByVin,
    TechnicalRecordServiceActions.getByPartialVin,
    TechnicalRecordServiceActions.getByVrm,
    TechnicalRecordServiceActions.getByTrailerId,
    TestResultActions.fetchTestResults,
    TestResultActions.fetchTestResultsBySystemNumber,
    TestResultActions.fetchSelectedTestResult,
    succesMethod
  ),

  on(
    GlobalErrorActions.addError,
    TechnicalRecordServiceActions.getByVinFailure,
    TechnicalRecordServiceActions.getByPartialVinFailure,
    TechnicalRecordServiceActions.getByVrmFailure,
    TechnicalRecordServiceActions.getByTrailerIdFailure,
    TestResultActions.fetchTestResultsFailed,
    TestResultActions.fetchTestResultsBySystemNumberFailed,
    TestResultActions.fetchSelectedTestResultFailed,
    failureMethod
  ),
  on(GlobalErrorActions.setErrors, TestResultActions.updateTestResultFailed, (state, { errors }) => ({ ...state, errors: [...errors] }))
);

function succesMethod(state: GlobalErrorState) {
  return { ...state, errors: [] };
}

function failureMethod(state: GlobalErrorState, errorMessage: { error: any; anchorLink: any }) {
  return { ...state, errors: [...state.errors, { error: errorMessage.error, anchorLink: errorMessage.anchorLink }] };
}
