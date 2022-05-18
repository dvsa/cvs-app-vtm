import { spinnerReducer, initialSpinnerState } from '@store/spinner/reducers/spinner.reducer';
import { getByVIN, getByVINFailure } from '@store/technical-records';
import * as TestResultsActions from '@store/test-records';

const stopLoading = [getByVINFailure, TestResultsActions.fetchTestResultsFailed, TestResultsActions.fetchTestResultsSuccess, TestResultsActions.fetchTestResultsBySystemIdFailed, TestResultsActions.fetchTestResultsBySystemIdSuccess];

const startLoading = [getByVIN, TestResultsActions.fetchTestResultsBySystemId, TestResultsActions.fetchTestResults];

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

  describe('Start Loading', () => {
    it.each(startLoading)('should start the loading state', (actionMethod) => {
      const expectedValue = { showSpinner: true };
      const action = actionMethod({} as any);

      const state = spinnerReducer({ showSpinner: false }, action);

      expect(state).toEqual(expectedValue);
      expect(state).not.toBe(expectedValue);
    });
  });

  describe('Stop Loading', () => {
    it.each(stopLoading)('should stop the loading state', (actionMethod) => {
      const expectedValue = { showSpinner: false };
      const action = actionMethod({} as any);

      const state = spinnerReducer({ showSpinner: true }, action);

      expect(state).toEqual(expectedValue);
      expect(state).not.toBe(expectedValue);
    });
  });
});
