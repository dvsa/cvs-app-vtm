import { TestTypesTaxonomy } from '@api/test-types';
import { TestResultModel } from '@models/test-result.model';
import { selectTestTypesByVehicleType, sortedTestTypes } from './test-types.selectors';

const testTypes = [
  { forVehicleType: ['psv'] },
  { forVehicleType: ['car'] },
  { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
] as TestTypesTaxonomy;

describe('selectors', () => {
  describe('selectTestTypesByVehicleType', () => {
    it('should filter test types by vehicleType', () => {
      const expectedTestTypes: TestTypesTaxonomy = [
        { forVehicleType: ['psv'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }] }
      ] as TestTypesTaxonomy;
      const selector = selectTestTypesByVehicleType.projector(testTypes, { vehicleType: 'psv' } as TestResultModel);
      expect(selector).toHaveLength(2);
      expect(selector).toEqual(expectedTestTypes);
    });
  });

  describe('sortedTestTypes', () => {
    const unsortedData = [
      { id: '1', sortId: '4' },
      { id: '7', sortId: '1' },
      { id: '8' },
      {
        id: '5',
        sortId: '3',
        nextTestTypesOrCategories: [
          { id: '39', sortId: '2' },
          { id: '40', sortId: '1' }
        ]
      }
    ];

    it('should sort test types by sortId', () => {
      const expectedTestTypes: TestTypesTaxonomy = [
        { id: '8' },
        { id: '7', sortId: '1' },
        {
          id: '5',
          sortId: '3',
          nextTestTypesOrCategories: [
            { id: '40', sortId: '1' },
            { id: '39', sortId: '2' }
          ]
        },
        { id: '1', sortId: '4' }
      ] as TestTypesTaxonomy;
      const sorted = sortedTestTypes.projector(unsortedData);
      expect(sorted).toEqual(expectedTestTypes);
    });
  });
});
