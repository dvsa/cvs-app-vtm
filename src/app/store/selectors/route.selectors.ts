// Route selectors
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {RouterReducerState} from '@ngrx/router-store';
import { RouterStateUrl } from '@app/shared/utils';

export const selectReducerState = createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');
export const getRouterInfo = createSelector(
  selectReducerState,
  state => state.state
);
