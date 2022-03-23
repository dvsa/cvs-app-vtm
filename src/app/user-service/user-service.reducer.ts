import { createReducer, on } from '@ngrx/store';
import * as UserServiceActions from './user-service.actions';

export interface UserServiceState {
  username: string;
}
 
const initialState: UserServiceState = {
  username: "(Not logged in)",
};
 
const _userServiceReducer = createReducer(
  initialState,
  on(UserServiceActions.Login, (state, { name }) => ({ username: name })),
  on(UserServiceActions.Logout, (state) => (initialState)),
);
 
export function UserServiceReducer(state: UserServiceState, action: any) {
  return _userServiceReducer(state, action);
}
