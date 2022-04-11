import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as UserServiceActions from './user-service.actions';

export const STORE_FEATURE_USER_KEY = 'user';

export interface UserServiceState {
  username: string;
}

export const initialState: UserServiceState = {
  username: '(Not logged in)'
};

const getUserState = createFeatureSelector<UserServiceState>(STORE_FEATURE_USER_KEY);

export const username = createSelector(getUserState, (state) => state.username);

export const userServiceReducer = createReducer(
  initialState,
  on(UserServiceActions.Login, (state, { name }) => ({ username: name })),
  on(UserServiceActions.Logout, (state) => initialState)
);
