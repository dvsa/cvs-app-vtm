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
    TechnicalRecordServiceActions.getByVIN,
    TestResultActions.fetchTestResults,
    TestResultActions.fetchTestResultsBySystemNumber,
    TestResultActions.fetchSelectedTestResult,
    (state) => ({ ...state, errors: [] })
  ),
  on(
    GlobalErrorActions.addError,
    TechnicalRecordServiceActions.getByVINFailure,
    TestResultActions.fetchTestResultsFailed,
    TestResultActions.fetchTestResultsBySystemNumberFailed,
    TestResultActions.fetchSelectedTestResultFailed,
    (state, { error, anchorLink }) => ({ ...state, errors: [...state.errors, { error: error, anchorLink: anchorLink }] })
  ),
  on(GlobalErrorActions.setErrors, TestResultActions.updateTestResultFailed, (state, { errors }) => ({ ...state, errors: [...errors] })),
  on(GlobalErrorActions.patchErrors, (state, { errors }) => ({ ...state, errors: [...state.errors, ...errors] }))
);
