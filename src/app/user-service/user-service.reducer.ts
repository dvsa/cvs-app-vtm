import { createReducer, on } from '@ngrx/store';
import { setUsername } from './user-service.actions';

export interface UserServiceState {
  username: string;
}
 
const initialState: UserServiceState = {
  username: "(Not logged in)",
};
 
const _userNameReducer = createReducer(
  initialState,
  on(setUsername, (state, { name }) => ({ username: name })),
);
 
export function usernameReducer(state: UserServiceState, action: any) {
  return _userNameReducer(state, action);
}
