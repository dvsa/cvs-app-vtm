// Auth selectors
import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromAuth from '../reducers/auth.reducers';

export const selectAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getUserName = createSelector(
  selectAuthState,
  fromAuth.getUserName
);
export const getFriendlyName = createSelector(
  selectAuthState,
  fromAuth.getFriendlyName
);
