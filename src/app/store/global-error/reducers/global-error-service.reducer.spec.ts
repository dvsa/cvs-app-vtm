import { globalErrorReducer, GlobalErrorState, initialGlobalErrorState } from '@store/global-error/reducers/global-error-service.reducer';
import { fetchTestResults, fetchTestResultsBySystemId, fetchTestResultsBySystemIdFailed, fetchTestResultsFailed, fetchTestResultsSuccess, initialTestResultsState, testResultsReducer } from '@store/test-records';
import { getByVIN, getByVINFailure } from '@store/technical-records';

describe('Global Error Reducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = {
        type: 'Unknown'
      };

      const state = globalErrorReducer(initialGlobalErrorState, action);
      expect(state).toBe(initialGlobalErrorState);
    });
  });

  describe('Fail action', () => {
    it.each([fetchTestResultsBySystemIdFailed, fetchTestResultsFailed, getByVINFailure])('should return the error state', (actionMethod) => {
      const error = 'fetching test records failed';
      const newState: GlobalErrorState = { ...initialGlobalErrorState, globalError: [{error: error, anchorLink: undefined}] };
      const action = actionMethod({ error });
      const state = globalErrorReducer(initialGlobalErrorState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('Success action', () => {
    it.each([fetchTestResultsBySystemId, getByVIN, fetchTestResults])('should reset the error state', (actionMethod) => {
      const newState = { ...initialGlobalErrorState, globalError: [] };
      //all props must be supplied here
      const action = actionMethod({ systemId: '', vin: '' });
      const state = globalErrorReducer(initialGlobalErrorState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });
});
