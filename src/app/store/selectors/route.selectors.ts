import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '../index';

export const selectReducerState = createFeatureSelector<RouterReducerState<RouterStateUrl>>(
  'router'
);
export const getRouterInfo = createSelector(selectReducerState, (state) => state.state);

export const getRouterParams = createSelector(selectReducerState, (state) => {
  if (!!state) {
    return { params: state.state.params, queryParams: state.state.queryParams };
  }
});
