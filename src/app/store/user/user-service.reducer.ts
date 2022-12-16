import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as UserServiceActions from './user-service.actions';
import { environment } from '../../../environments/environment';
import { Roles } from '@models/roles.enum';

export const STORE_FEATURE_USER_KEY = 'user';

export interface UserServiceState {
  name: string;
  userEmail: string;
  oid: string;
  roles: string[] | null;
}

export const initialState: UserServiceState = {
  name: '(Not logged in)',
  userEmail: '',
  oid: '',
  roles: null
};

const getUserState = createFeatureSelector<UserServiceState>(STORE_FEATURE_USER_KEY);

export const name = createSelector(getUserState, state => state.name);
export const userEmail = createSelector(getUserState, state => state.userEmail);
export const id = createSelector(getUserState, state => state.oid);
export const roles = createSelector(getUserState, state => state.roles);
export const user = createSelector(getUserState, state => state);

export const userServiceReducer = createReducer(
  initialState,
  on(UserServiceActions.Login, (state, { name, userEmail, oid, roles }) => ({ name, userEmail, oid, roles: getRoles(roles) })),
  on(UserServiceActions.Logout, state => initialState)
);

function getRoles(roles: string[]): string[] {
  return environment.RemoveAADFullAccessRole ? roles.filter(role => role !== Roles.Admin) : roles;
}
