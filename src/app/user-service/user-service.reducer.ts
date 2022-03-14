import { createReducer, on } from '@ngrx/store';
import { setUsername, resetUserService } from './user-service.actions';

export interface UserServiceState {
  username: string;
}
 
const initialState: UserServiceState = {
  username: "(Not logged in)",
};
 
const _userServiceReducer = createReducer(
  initialState,
  on(setUsername, (state, { name }) => ({ username: name })),
  //on(reset, (state) => (initialState)),
);
 
export function UserServiceReducer(state: UserServiceState, action: any) {
  return _userServiceReducer(state, action);
}
