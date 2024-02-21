import { createSelector } from '@ngrx/store';
import { requiredStandardsFeatureState } from '../reducers/required-standards.reducer';

export const getRequiredStandardsState = createSelector(requiredStandardsFeatureState, (state) => state.requiredStandards);

export const requiredStandardsLoadingState = createSelector(requiredStandardsFeatureState, (state) => state.loading);
