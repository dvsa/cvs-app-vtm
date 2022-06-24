import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as UserServiceActions from './user-service.actions';

export const STORE_FEATURE_USER_KEY = 'user';

export interface UserServiceState {
  name: string;
  username: string;
  oid: string;
}

export const initialState: UserServiceState = {
  name: '(Not logged in)',
  username: '',
  oid: ''
};

const getUserState = createFeatureSelector<UserServiceState>(STORE_FEATURE_USER_KEY);

export const name = createSelector(getUserState, (state) => state.name);
export const username = createSelector(getUserState, (state) => state.username);
export const id = createSelector(getUserState, (state) => state.oid);

export const userServiceReducer = createReducer(
  initialState,
  on(UserServiceActions.Login, (state, { name, username, oid }) => ({ name, username, oid })),
  on(UserServiceActions.Logout, (state) => initialState)
);
