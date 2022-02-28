import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ErrorState } from '../reducers/error.reducers';

export const selectFeature = createFeatureSelector<ErrorState>('error');

export const getErrors = createSelector(selectFeature, (state: ErrorState) => state.errors);
