import { spinnerReducer, initialSpinnerState } from '@store/spinner/reducers/spinner.reducer';
import { getByVIN, getByVINFailure, getByVINSuccess } from '@store/technical-records';

describe('Spinner Reducer', () => {

  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = {
        type: 'Unknown'
      };

      const state = spinnerReducer(initialSpinnerState, action);
      expect(state).toBe(initialSpinnerState);
    });
  });

  describe('Start Loading', () => {
    it.each([getByVIN])('should start the loading state', (actionMethod) => {
      const expectedValue = { ...initialSpinnerState, showSpinner: true };
      const action = actionMethod({} as any);

      const state = spinnerReducer(initialSpinnerState, action);

      expect(state).toEqual(expectedValue);
      expect(state).not.toBe(expectedValue);
    });
  });

  describe('Stop Loading', () => {
    it.each([getByVINSuccess, getByVINFailure])('should stop the loading state', (actionMethod) => {
      const expectedValue = { ...initialSpinnerState, showSpinner: false };
      const action = actionMethod({} as any);

      const state = spinnerReducer(initialSpinnerState, action);

      expect(state).toEqual(expectedValue);
      expect(state).not.toBe(expectedValue);
    });
  });
});
