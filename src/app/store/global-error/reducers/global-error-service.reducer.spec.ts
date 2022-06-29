import { globalErrorReducer, GlobalErrorState, initialGlobalErrorState } from '@store/global-error/reducers/global-error-service.reducer';
import { getByVIN, getByVINFailure } from '@store/technical-records';
import { fetchTestResults, fetchTestResultsBySystemNumber, fetchTestResultsBySystemNumberFailed, fetchTestResultsFailed } from '@store/test-records';
import { patchErrors, setErrors } from '../actions/global-error.actions';

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
    it.each([fetchTestResultsBySystemNumberFailed, fetchTestResultsFailed, getByVINFailure])('should return the error state', (actionMethod) => {
      const error = 'fetching test records failed';
      const newState: GlobalErrorState = { ...initialGlobalErrorState, errors: [{ error: error, anchorLink: undefined }] };
      const action = actionMethod({ error });
      const state = globalErrorReducer(initialGlobalErrorState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('Success action', () => {
    it.each([fetchTestResultsBySystemNumber, getByVIN, fetchTestResults])('should reset the error state', (actionMethod) => {
      const newState = { ...initialGlobalErrorState, errors: [] };
      //all props must be supplied here
      const action = actionMethod({ systemNumber: '', vin: '' });
      const state = globalErrorReducer(initialGlobalErrorState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('setErrors', () => {
    it('should replace existing errors with new ones', () => {
      const newState = { ...initialGlobalErrorState, errors: [{ error: 'some error', anchorLink: '' }] };
      const action = setErrors({ errors: [{ error: 'some error', anchorLink: '' }] });
      const state = globalErrorReducer({ ...initialGlobalErrorState, errors: [{ error: 'old error', anchorLink: '' }] }, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });

    it('should add new errors after existing ones', () => {
      const newState = {
        ...initialGlobalErrorState,
        errors: [
          { error: 'old error', anchorLink: '' },
          { error: 'new error', anchorLink: '' }
        ]
      };
      const action = patchErrors({
        errors: [{ error: 'new error', anchorLink: '' }]
      });
      const state = globalErrorReducer({ ...initialGlobalErrorState, errors: [{ error: 'old error', anchorLink: '' }] }, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });
});
