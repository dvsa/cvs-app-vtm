import { createSelector } from '@ngrx/store';
import { getGlobalErrorState } from '@store/global-error/global-error-service.reducer';

export const getErrorMessage = createSelector(getGlobalErrorState, (state) => {
	return state.errors;
});
