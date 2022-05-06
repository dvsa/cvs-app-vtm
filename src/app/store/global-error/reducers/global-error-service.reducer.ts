import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as TechnicalRecordServiceActions from '../../technical-records/technical-record-service.actions';
import * as TestResultActions from '@store/test-records';
import * as GlobalErrorActions from '../actions/global-error.actions'
import { GlobalError } from 'src/app/features/global-error/global-error.service';

export const STORE_GLOBAL_ERROR_KEY = 'GlobalError';

export interface GlobalErrorState {
  globalError: Array<GlobalError>;
}

export const initialGlobalErrorState: GlobalErrorState = {
  globalError: []
};

export const getGlobalErrorState = createFeatureSelector<GlobalErrorState>(STORE_GLOBAL_ERROR_KEY);

export const globalErrorState = createSelector(getGlobalErrorState, (state) => state.globalError);

export const globalErrorReducer = createReducer(
  initialGlobalErrorState,
  on(GlobalErrorActions.clearError, TechnicalRecordServiceActions.getByVIN, TestResultActions.fetchTestResults, TestResultActions.fetchTestResultsBySystemId, (state) => ({ ...state, globalError: [] })),
  on(GlobalErrorActions.addError, TechnicalRecordServiceActions.getByVINFailure, TestResultActions.fetchTestResultsFailed, TestResultActions.fetchTestResultsBySystemIdFailed, (state, {error, anchorLink}) => ({...state, globalError: [...state.globalError, {error: error, anchorLink: anchorLink}]}))
);
