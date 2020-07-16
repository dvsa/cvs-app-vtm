import * as fromUser from '../actions/User.action';
import { UserDetails } from "@app/models/user-details";

export interface UserState {
  details: UserDetails
}
// UserDetails
export const initialUserState: UserState = {
  // oid & unique_name
  details: null
}

export function UserReducer(
  state: UserState = initialUserState,
  action: fromUser.UserAction
):  UserState {

  // @ts-ignore does exist, throws error as action is imported as *
  const {type, payload} = action;
  switch(type) {
    // will dispatch AppIsLoading
    case fromUser.SET_USER: {
      return {
        ...state
      };
    }
    case fromUser.SET_USER_SUCCESS: {
      return {
        ...state,
        details: {
          ...payload
        }
      };
    }
    // will dispatch loading AppIsNotLoading
    case fromUser.SET_USER_FAIL: {
      return {
        ...state,
      };
    }
    default:
      return state;
  } 
}

export const getUserDetails = ({details}: UserState) => details;
