import { Action } from '@ngrx/store';

export const SET_USER = '[Global] Set User';
export const SET_USER_FAIL = '[Global] Set User Fail';
export const SET_USER_SUCCESS = '[Global] Set User Success';

// will be used to signify that we are intiating an async request effetcs
// ATM we only use Success to set the user in the service
// We will refactor that with effect once auth guard is in place
export class SetUser implements Action {
  readonly type = SET_USER;
}

export class SetUserFail implements Action {
  readonly type = SET_USER_FAIL;
}

export class SetUserSuccess implements Action {
  readonly type = SET_USER_SUCCESS;
  constructor(public payload: any) {}
}

export type UserAction = SetUser | SetUserFail | SetUserSuccess;
