import { initialSpinnerState, spinnerReducer } from '@store/spinner/reducers/spinner.reducer';
import { setSpinnerState } from '../actions/spinner.actions';

describe('Spinner Reducer', () => {
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
