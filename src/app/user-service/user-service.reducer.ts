import { createReducer, on } from '@ngrx/store';
import { setUsername } from './user-service.actions';
 
export const initialUsername = "";
 
const _userNameReducer = createReducer(
  initialUsername,
  on(setUsername, (state) => state),
);
 
export function usernameReducer(state, action) {
  return _userNameReducer(state, action);
}
