import { TestTypeCategory, TestTypesTaxonomy } from '@api/test-types';
import { TestResultModel } from '@models/test-result.model';
import { initialTestTypeState, TestTypeState } from '../reducers/test-types.reducer';
import { selectTestTypesByVehicleType } from './test-types.selectors';

const testTypes: TestTypesTaxonomy = [
  { forVehicleType: ['psv'] },
  { forVehicleType: ['car'] },
  { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
];

describe('selectors', () => {
  it('selectTestTypesByVehicleType', () => {
    const expectedTestTypes: TestTypesTaxonomy = [
      { forVehicleType: ['psv'] },
      { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }] }
    ];
    const selector = selectTestTypesByVehicleType.projector(testTypes, { vehicleType: 'psv' } as TestResultModel)
    expect(selector).toHaveLength(2)
    // expect((selector[1] as TestTypeCategory).nextTestTypesOrCategories).toHaveLength(1)
    expect(selector).toEqual(expectedTestTypes);
  });
});


