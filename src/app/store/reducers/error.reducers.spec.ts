import { Action } from '@ngrx/store';

import { SetErrorMessage, ClearErrorMessage } from '../actions/Error.actions';
import { ErrorReducer, ErrorState, initialErrorState } from './error.reducers';

describe('ErrorReducer', () => {
  let state: ErrorState;
  let resultState: ErrorState;
  let action: any;

  describe('when initialised', () => {
    beforeEach(() => {
      action = {} as Action;
      const initState: ErrorState = initialErrorState;
      resultState = ErrorReducer(initState, action);
    });

    it('should set the default state', () => {
      expect(resultState).toMatchSnapshot();
    });
  });

  describe('SetErrorMessage', () => {
    it('should set the error(s) to the state', () => {
      action = new SetErrorMessage(['error1', 'error2']);
      state = {
        errors: []
      };

      resultState = ErrorReducer(state, action);

      expect(resultState).toMatchSnapshot();
    });
  });

  describe('ClearErrorMessage', () => {
    it('should clear error(s) from the state', () => {
      action = new ClearErrorMessage();
      state = {
        errors: ['current error value']
      };

      resultState = ErrorReducer(state, action);

      expect(resultState).toMatchSnapshot();
    });
  });
});
