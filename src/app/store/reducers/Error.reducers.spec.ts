import { EErrorActions, SetErrorMessage, ClearErrorMessage, ErrorActions } from '../actions/Error.actions';
import { initialAppState } from '../state/app.state';
import { ErrorReducer } from './Error.reducers';

describe('ErrorReducer', () => {
  describe('SetErrorMessage', () => {
    test('should set error message ', () => {
      const action = new SetErrorMessage('message');
      const result = ErrorReducer(initialAppState.error, action);

      expect(result).toEqual(action.payload);
    });
  });

  describe('ClearErrorMessage', () => {
    test('should clear error message ', () => {
      const action = new ClearErrorMessage();
      const result = ErrorReducer(initialAppState.error, action);

      expect(result).toEqual(null);
    });
  });

  test('default reducer', () => {
    const action = <ErrorActions>{ type: <EErrorActions>'EErrorActions' };
    const result = ErrorReducer(undefined, action);

    expect(result).toEqual(initialAppState['error']);
  });
});
