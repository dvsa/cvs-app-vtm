import { TestTypeCategory } from '@models/test-types/testTypeCategory';

export const createMockTestTypeCategory = (params: Partial<TestTypeCategory> = {}): TestTypeCategory => ({
	id: 'testTypeCategoryId',
	name: 'testNameCategoryName',
	forVehicleType: ['car'],
	...params,
});
