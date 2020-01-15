import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IAppState } from '../state/app.state';

export const selectFeature = createFeatureSelector<IAppState>(
  'error'
);

export const selectSearchPageError = createSelector(
  selectFeature,
  state => (state != null || state !== undefined) ? state.error : null // return error message
);
