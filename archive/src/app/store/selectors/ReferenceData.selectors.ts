import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReferenceDataState } from '@app/store/state/ReferenceDataState.state';

export const selectFeature = createFeatureSelector<ReferenceDataState>('referenceData');

export const getPreparers = createSelector(
  selectFeature,
  (state: ReferenceDataState) => state.preparers
);

export const getTestStations = createSelector(
  selectFeature,
  (state: ReferenceDataState) => state.testStations
);

export const getTestTypeCategories = createSelector(
  selectFeature,
  (state: ReferenceDataState) => state.testTypeCategories
);
