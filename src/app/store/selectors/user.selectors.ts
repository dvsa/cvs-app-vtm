import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState, getUserDetails } from '../reducers/User.reducers';

export const selectUserState = createFeatureSelector<UserState>('user');

export const getUserState = createSelector(selectUserState, getUserDetails);
