import { createFeatureSelector, createSelector } from '@ngrx/store';
import { STORE_FEATURE_SPINNER_KEY, SpinnerState } from '../reducers/spinner.reducer';

export const getSpinnerState = createFeatureSelector<SpinnerState>(STORE_FEATURE_SPINNER_KEY);

export const getSpinner = createSelector(getSpinnerState, (state) => {
	return state.showSpinner;
});
