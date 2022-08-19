import { createSelector } from '@ngrx/store';
import { defectsAdapter, defectsFeatureState } from '../reducers/defects.reducer';

const { selectAll } = defectsAdapter.getSelectors();

export const defects = createSelector(defectsFeatureState, state => selectAll(state));

export const defect = (id: string) => createSelector(defectsFeatureState, state => state.entities[id]);

export const defectsLoadingState = createSelector(defectsFeatureState, state => state.loading);
