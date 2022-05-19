import { initialSpinnerState, setSpinnerState, spinnerReducer } from '@store/spinner/reducers/spinner.reducer';

describe('Spinner Reducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = {
        type: 'Unknown'
      };

      const state = spinnerReducer(initialSpinnerState, action);
      expect(state).toBe(initialSpinnerState);
    });

    it('should not change the state', () => {
      const action = {
        type: 'Unknown'
      };

      const state = spinnerReducer({ showSpinner: true }, action);
      expect(state).toEqual({ showSpinner: true });
      expect(state).not.toBe({ showSpinner: true });
    });
  });

  describe('setSpinnerState', () => {
    it('should have the correct type', () => {
      expect(setSpinnerState.type).toBe('[UI/spinner] set spinner state');
    });

    it('should set correct state', () => {
      expect(setSpinnerState.type).toBe('[UI/spinner] set spinner state');
      const state = { ...initialSpinnerState };
      expect(state.showSpinner).toBeFalsy();
      const showingState = spinnerReducer(state, setSpinnerState({ showSpinner: true }));
      expect(showingState.showSpinner).toBeTruthy();
      const notShowingState = spinnerReducer(state, setSpinnerState({ showSpinner: false }));
      expect(notShowingState.showSpinner).toBeFalsy();
    });
  });
});
