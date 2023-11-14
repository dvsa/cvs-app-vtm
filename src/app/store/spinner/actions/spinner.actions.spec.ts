import { initialSpinnerState, spinnerReducer } from '../reducers/spinner.reducer';
import { setSpinnerState } from './spinner.actions';

describe('unknown action', () => {
  it('should return the default state', () => {
    const action = {
      type: 'Unknown',
    };

    const state = spinnerReducer(initialSpinnerState, action);
    expect(state).toBe(initialSpinnerState);
  });

  it('should not change the state', () => {
    const action = {
      type: 'Unknown',
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
});
