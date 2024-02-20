import { createSelector } from '@ngrx/store';
import { requiredStandardsFeatureState } from '../reducers/required-standards.reducer';

export const requiredStandardsLoadingState = createSelector(requiredStandardsFeatureState, (state) => state.loading);
