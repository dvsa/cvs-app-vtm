import { GlobalErrorState, initialGlobalErrorState } from '@store/global-error/reducers/global-error-service.reducer';
import { getErrorMessage } from '@store/global-error/selectors/global-error.selectors';

describe('Global Error Selectors', () => {
  describe('getErrorMessage', () => {
    it('should return the correct error', () => {
      const state: GlobalErrorState = { ...initialGlobalErrorState, errors: [{ error: 'err' }] };
      const selectedState = getErrorMessage.projector(state);
      expect(selectedState).toEqual(state.errors);
    });
  });
});
