import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as UserServiceActions from './user-service.actions';

export const STORE_FEATURE_USER_KEY = 'user';

export interface UserServiceState {
  name: string;
  username: string;
  oid: string;
  roles: string[] | null;
}

export const initialState: UserServiceState = {
  name: '(Not logged in)',
  username: '',
  oid: '',
  roles: null
};

const getUserState = createFeatureSelector<UserServiceState>(STORE_FEATURE_USER_KEY);

export const name = createSelector(getUserState, state => state.name);
export const username = createSelector(getUserState, state => state.username);
export const id = createSelector(getUserState, state => state.oid);
export const roles = createSelector(getUserState, state => state.roles);

export const userServiceReducer = createReducer(
  initialState,
  on(UserServiceActions.Login, (state, { name, username, oid, roles }) => ({ name, username, oid, roles })),
  on(UserServiceActions.Logout, state => initialState)
);
