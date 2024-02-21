import { RequiredStandardState, initialRequiredStandardsState } from '../reducers/required-standards.reducer';
import { requiredStandardsLoadingState } from './required-standards.selector';

describe('RequiredStandardsLoadingState', () => {
  it('should return loading state', () => {
    const state: RequiredStandardState = { ...initialRequiredStandardsState, loading: true };
    const selectedState = requiredStandardsLoadingState.projector(state);
    expect(selectedState).toBeTruthy();
  });
});
