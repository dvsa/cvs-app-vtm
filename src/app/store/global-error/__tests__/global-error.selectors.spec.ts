import { GlobalErrorState, initialGlobalErrorState } from '@store/global-error/global-error-service.reducer';
import { getErrorMessage } from '@store/global-error/global-error.selectors';

describe('Global Error Selectors', () => {
	describe('getErrorMessage', () => {
		it('should return the correct error', () => {
			const state: GlobalErrorState = { ...initialGlobalErrorState, errors: [{ error: 'err' }] };
			const selectedState = getErrorMessage.projector(state);
			expect(selectedState).toEqual(state.errors);
		});
	});
});
