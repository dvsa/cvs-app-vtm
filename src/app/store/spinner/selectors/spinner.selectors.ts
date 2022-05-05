import { createSelector } from '@ngrx/store';
import { getSpinnerState } from '@store/spinner/reducers/spinner.reducer';

export const getSpinner = createSelector(getSpinnerState, (state) => {
  return state.showSpinner;
});
