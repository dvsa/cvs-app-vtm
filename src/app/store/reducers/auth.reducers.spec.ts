import {reducer, initialState, getUserName, getFriendlyName} from './auth.reducers';
import {SetAuths} from '@app/store/actions/auth.actions';

describe('Auth Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {type: 'NOOP'} as any;
      const result = reducer(undefined, action);

      expect(result).toBe(initialState);
    });
  });

  describe('[Auth] Set Auths', () => {
    it('should handle set auths', () => {
      const action = new SetAuths({userName: 'VTM', friendlyName: 'VTM Friendly'});
      const result = reducer(initialState, action);
      expect(result).toEqual({
        ...initialState,
        userName: action.payload.userName,
        friendlyName: action.payload.friendlyName
      });
    });
  });

  describe('getUserName', () => {
    it('should return userName', () => {
      const userName = getUserName({userName: 'VTM', friendlyName: 'VTM Friendly'});
      expect(userName).toEqual('VTM');
    });
  });

  describe('getFriendlyName', () => {
    it('should return friendlyName', () => {
      const userName = getFriendlyName({userName: 'VTM', friendlyName: 'VTM Friendly'});
      expect(userName).toEqual('VTM Friendly');
    });
  });

});

