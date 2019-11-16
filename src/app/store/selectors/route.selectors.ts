// Route selectors
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {RouterReducerState} from '@ngrx/router-store';
import {RouterStateUrl} from '@app/store/reducers';

export const selectReducerState = createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');
export const getRouterInfo = createSelector(
  selectReducerState,
  state => state.state
);
