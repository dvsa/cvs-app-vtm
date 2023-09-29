import { TestTypeCategory, TestTypeCategoryNextTestTypesOrCategoriesInner } from '@api/test-types';
import { fetchTestTypes, fetchTestTypesFailed, fetchTestTypesSuccess } from '../actions/test-types.actions';
import { TestTypeState, initialTestTypeState, testTypesReducer } from './test-types.reducer';

describe('Test Types Reducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = {
        type: 'Unknown'
      };
      const state = testTypesReducer(initialTestTypeState, action);

      expect(state).toBe(initialTestTypeState);
    });

    it('should set loading to true', () => {
      const oldState: TestTypeState = { ...initialTestTypeState, loading: false };
      const action = fetchTestTypes();
      const state = testTypesReducer(oldState, action);

      expect(state.loading).toBe(true);
      expect(state).not.toBe(oldState);
    });

    it('should set the test types data on success and set loading to false on success action', () => {
      const testTypes = [
        { id: '1', name: 'foo' },
        { id: '12', name: 'bar' }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];
      const newState: TestTypeState = {
        ...initialTestTypeState,
        entities: {
          1: { id: '1', name: 'foo' } as TestTypeCategory,
          12: { id: '12', name: 'bar' } as TestTypeCategory
        },
        ids: ['1', '12'],
        loading: false
      };
      const action = fetchTestTypesSuccess({ payload: testTypes });
      const state = testTypesReducer({ ...initialTestTypeState, loading: true }, action);

      expect(state).toEqual(newState);
    });

    it('should set loading to false on failed action', () => {
      const oldState: TestTypeState = { ...initialTestTypeState, loading: true };
      const action = fetchTestTypesFailed({ error: 'error' });
      const state = testTypesReducer(oldState, action);

      expect(state.loading).toBe(false);
      expect(state).not.toBe(oldState);
    });
  });
});
