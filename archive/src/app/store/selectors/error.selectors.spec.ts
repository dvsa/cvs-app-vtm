import { getErrors } from './error.selectors';
import { initialErrorState } from '../reducers/error.reducers';

describe('error selectors', () => {
  let errors: string[];

  beforeEach(() => {
    errors = ['error1', 'error2'];
  });

  describe('getErrors', () => {
    it('should return the default state on initialization', () => {
      expect(getErrors.projector(initialErrorState)).toEqual([]);
    });

    it('should return errors in state', () => {
      expect(getErrors.projector({ errors })).toEqual(errors);
    });
  });
});
