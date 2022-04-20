import { globalErrorReducer, initialGlobalErrorState } from '@store/global-error/reducers/global-error-service.reducer';

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
});
