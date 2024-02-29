import { TestTypeCategory } from '@api/test-types';

export const createMockTestTypeCategory = (params: Partial<TestTypeCategory> = {}): TestTypeCategory => ({
  id: 'testTypeCategoryId',
  name: 'testNameCategoryName',
  forVehicleType: ['car'],
  ...params,
});
