import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as TechnicalRecordServiceActions from '../../technical-records/technical-record-service.actions';
import * as TestResultActions from '@store/test-records';

export const STORE_SPINNER_KEY = 'Spinner';

export interface SpinnerState {
  showSpinner: boolean;
}

export const initialSpinnerState: SpinnerState = {
  showSpinner: false
};

export const getSpinnerState = createFeatureSelector<SpinnerState>(STORE_SPINNER_KEY);

export const spinnerState = createSelector(getSpinnerState, (state) => state.showSpinner);

export const spinnerReducer = createReducer(
  initialSpinnerState,
  on(TechnicalRecordServiceActions.getByVIN, (state) => ({ ...state, showSpinner: true })),
  on(TechnicalRecordServiceActions.getByVINFailure, TechnicalRecordServiceActions.getByVINSuccess, (state) => ({ ...state, showSpinner: false }))
);
