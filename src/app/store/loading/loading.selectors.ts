import { createFeatureSelector, createSelector } from '@ngrx/store';
import { STORE_LOADING_KEY } from './loading.feature';
import { LoadingState } from './loading.reducer';

export const selectLoadingState = createFeatureSelector<LoadingState>(STORE_LOADING_KEY);

export const selectIsLoading = createSelector(selectLoadingState, (state) => state.pendingCount > 0);
