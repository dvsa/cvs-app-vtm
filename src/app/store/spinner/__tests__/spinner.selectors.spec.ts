import { SpinnerState, initialSpinnerState } from '@store/spinner/spinner.reducer';
import { getSpinner } from '@store/spinner/spinner.selectors';

describe('Spinner Selectors', () => {
	describe('getSpinner', () => {
		it('should return the spinner', () => {
			const state: SpinnerState = { ...initialSpinnerState, showSpinner: true };
			const selectedState = getSpinner.projector(state);
			expect(selectedState).toEqual(state.showSpinner);
		});
	});
});
