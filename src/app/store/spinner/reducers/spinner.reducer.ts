import { createReducer, on } from '@ngrx/store';
import { setSpinnerState } from '../actions/spinner.actions';

export const STORE_FEATURE_SPINNER_KEY = 'Spinner';

export interface SpinnerState {
	showSpinner: boolean;
}

export const initialSpinnerState: SpinnerState = {
	showSpinner: false,
};

export const spinnerReducer = createReducer(
	initialSpinnerState,
	on(setSpinnerState, (state, { showSpinner }) => ({ ...state, showSpinner }))
);
