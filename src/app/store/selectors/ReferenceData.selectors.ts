import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IReferenceDataState } from '@app/store/state/ReferenceDataState.state';

export const selectFeature = createFeatureSelector<IReferenceDataState>('referenceData');

export const getPreparers = createSelector(
  selectFeature,
  (state: IReferenceDataState) => state.preparers
);

export const getTestStations = createSelector(
  selectFeature,
  (state: IReferenceDataState) => state.testStations
);
