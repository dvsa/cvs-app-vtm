import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as TechnicalRecordServiceActions from '../../technical-records/technical-record-service.actions';
import * as TestResultActions from '@store/test-records';

export const STORE_GLOBAL_ERROR_KEY = 'GlobalError';

export interface GlobalErrorState {
  globalError: string | null;
}

export const initialGlobalErrorState: GlobalErrorState = {
  globalError: null
};

export const getGlobalErrorState = createFeatureSelector<GlobalErrorState>(STORE_GLOBAL_ERROR_KEY);

export const globalErrorState = createSelector(getGlobalErrorState, (state) => state.globalError);

export const globalErrorReducer = createReducer(
  initialGlobalErrorState,
  on(TechnicalRecordServiceActions.getByVIN, TestResultActions.fetchTestResults, TestResultActions.fetchTestResultsBySystemId, (state) => ({ ...state, globalError: null })),
  on(TechnicalRecordServiceActions.getByVINFailure, TestResultActions.fetchTestResultsFailed, TestResultActions.fetchTestResultsBySystemIdFailed, (state, { error }) => ({ ...state, globalError: error }))
);
