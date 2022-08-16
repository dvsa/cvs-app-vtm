import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SpinnerState, STORE_FEATURE_SPINNER_KEY } from '../reducers/spinner.reducer';

export const getSpinnerState = createFeatureSelector<SpinnerState>(STORE_FEATURE_SPINNER_KEY);

export const getSpinner = createSelector(getSpinnerState, state => {
  return state.showSpinner;
});
