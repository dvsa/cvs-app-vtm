import { fetchTestTypes, fetchTestTypesFailed, fetchTestTypesSuccess } from './test-types.actions';

describe('Test Result Actions', () => {
	it('should return correct types', () => {
		expect(fetchTestTypes.type).toBe('[API/test-types-taxonomy] Fetch All');
		expect(fetchTestTypesSuccess.type).toBe('[API/test-types-taxonomy] Fetch All Success');
		expect(fetchTestTypesFailed.type).toBe('[API/test-types-taxonomy] Fetch All Failed');
	});
});
