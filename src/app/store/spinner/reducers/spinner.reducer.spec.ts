import { spinnerReducer, initialSpinnerState } from '@store/spinner/reducers/spinner.reducer';
import { getByVIN, getByVINFailure, getByVINSuccess } from '@store/technical-records';
import  *  as TestResultsActions from '@store/test-records';

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

  describe('Start Loading', () => {
    it.each([TestResultsActions.fetchTestResultsBySystemId])('should start the loading state', (actionMethod) => {
      const expectedValue = { ...initialSpinnerState, showSpinner: true };
      const action = actionMethod({} as any);

      const state = spinnerReducer(initialSpinnerState, action);

      expect(state).toEqual(expectedValue);
      expect(state).not.toBe(expectedValue);
    });
  });

  describe('Stop Loading', () => {
    it.each([TestResultsActions.fetchTestResultsBySystemIdFailed, TestResultsActions.fetchTestResultsBySystemIdSuccess])('should stop the loading state', (actionMethod) => {
      const expectedValue = { ...initialSpinnerState, showSpinner: false };
      const action = actionMethod({} as any);

      const state = spinnerReducer(initialSpinnerState, action);

      expect(state).toEqual(expectedValue);
      expect(state).not.toBe(expectedValue);
    });
  });

  describe('Start Loading', () => {
    it.each([TestResultsActions.fetchTestResults])('should start the loading state', (actionMethod) => {
      const expectedValue = { ...initialSpinnerState, showSpinner: true };
      const action = actionMethod();

      const state = spinnerReducer(initialSpinnerState, action);

      expect(state).toEqual(expectedValue);
      expect(state).not.toBe(expectedValue);
    });
  });

  describe('Stop Loading', () => {
    it.each([TestResultsActions.fetchTestResultsFailed, TestResultsActions.fetchTestResultsSuccess])('should stop the loading state', (actionMethod) => {
      const expectedValue = { ...initialSpinnerState, showSpinner: false };
      const action = actionMethod({} as any);

      const state = spinnerReducer(initialSpinnerState, action);

      expect(state).toEqual(expectedValue);
      expect(state).not.toBe(expectedValue);
    });
  });


});
