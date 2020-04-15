
import { getAppFormState } from './app-form-state.selectors';
import { initialAppFormState } from '../reducers/app-form-state.reducers';

describe('AppFormState selectors', () => {

  describe('getBackState', () => {
    it('should return the default state on initialization', () => {
      expect(getAppFormState.projector(initialAppFormState)).toEqual(true);
    });
  });
});
