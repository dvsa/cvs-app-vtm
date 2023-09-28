import { createSelector } from '@ngrx/store';
import { getGlobalWarningState } from '@store/global-warning/reducers/global-warning-service.reducers';

export const getErrorMessage = createSelector(getGlobalWarningState, state => {
  return state.warnings;
});
