import { TestTypeCategory } from '@models/test-types/testTypeCategory';
import { TestTypesTaxonomy } from '@models/test-types/testTypesTaxonomy';
import { fetchTestTypesSuccess } from '../test-types.actions';
import { TestTypeState, initialTestTypeState, testTypesReducer } from '../test-types.reducer';

describe('Test Types Reducer', () => {
	describe('unknown action', () => {
		it('should return the default state', () => {
			const action = {
				type: 'Unknown',
			};
			const state = testTypesReducer(initialTestTypeState, action);

			expect(state).toBe(initialTestTypeState);
		});

		it('should set the test types data on success and set loading to false on success action', () => {
			const testTypes = [
				{ id: '1', name: 'foo' },
				{ id: '12', name: 'bar' },
			] as TestTypesTaxonomy;
			const newState: TestTypeState = {
				...initialTestTypeState,
				entities: {
					1: { id: '1', name: 'foo' } as TestTypeCategory,
					12: { id: '12', name: 'bar' } as TestTypeCategory,
				},
				ids: ['1', '12'],
			};
			const action = fetchTestTypesSuccess({ payload: testTypes });
			const state = testTypesReducer({ ...initialTestTypeState }, action);

			expect(state).toEqual(newState);
		});
	});
});
