import { createAction, createFeatureSelector, createReducer, on, props } from '@ngrx/store';

export const STORE_SPINNER_KEY = 'Spinner';

export interface SpinnerState {
  showSpinner: boolean;
}

export const initialSpinnerState: SpinnerState = {
  showSpinner: false
};

export const getSpinnerState = createFeatureSelector<SpinnerState>(STORE_SPINNER_KEY);

export const setSpinnerState = createAction('[UI/spinner] set spinner state', props<{ showSpinner: boolean }>());

export const spinnerReducer = createReducer(
  initialSpinnerState,
  on(setSpinnerState, (state, { showSpinner }) => ({ ...state, showSpinner }))
);
