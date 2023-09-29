import { TestTypeCategory, TestTypeCategoryNextTestTypesOrCategoriesInner } from '@api/test-types';
import { TestResultModel } from '@models/test-results/test-result.model';
import { VehicleSubclass } from '@models/vehicle-tech-record.model';
import { selectTestType, selectTestTypesByVehicleType, sortedTestTypes } from './test-types.selectors';

describe('selectors', () => {
  describe('selectTestTypesByVehicleType', () => {
    it('test with no data', () => {
      const selector = selectTestTypesByVehicleType.projector([], { vehicleType: 'psv' } as TestResultModel);
      expect(selector).toHaveLength(0);
    });

    it('test with vehicle type', () => {
      const testTypes = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const expectedTestTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];
      const selector = selectTestTypesByVehicleType.projector(testTypes, { vehicleType: 'psv' } as TestResultModel);
      expect(selector).toHaveLength(3);
      expect(selector).toEqual(expectedTestTypes);
    });

    it('test with eu vehicle category', () => {
      const testTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const expectedTestTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];
      const selector = selectTestTypesByVehicleType.projector(testTypes, { euVehicleCategory: 'm1' } as TestResultModel);
      expect(selector).toHaveLength(3);
      expect(selector).toEqual(expectedTestTypes);
    });

    it('test with vehicle size', () => {
      const testTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['large'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const expectedTestTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['small'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];
      const selector = selectTestTypesByVehicleType.projector(testTypes, { vehicleSize: 'small' } as TestResultModel);
      expect(selector).toHaveLength(4);
      expect(selector).toEqual(expectedTestTypes);
    });

    it('test with vehicle configuration', () => {
      const testTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'], forVehicleConfiguration: ['articulated'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['large'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const expectedTestTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['large'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const selector = selectTestTypesByVehicleType.projector(testTypes, { vehicleConfiguration: 'rigid' } as TestResultModel);
      expect(selector).toHaveLength(4);
      expect(selector).toEqual(expectedTestTypes);

      const selectorAdditional = selectTestTypesByVehicleType.projector(testTypes, { vehicleConfiguration: 'articulated' } as TestResultModel);
      expect(selectorAdditional).toHaveLength(5);
    });

    it('test with vehicle number of axles', () => {
      const testTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'], forVehicleAxles: [2] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['large'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const expectedTestTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['large'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const selector = selectTestTypesByVehicleType.projector(testTypes, { noOfAxles: 4 } as TestResultModel);
      expect(selector).toHaveLength(4);
      expect(selector).toEqual(expectedTestTypes);

      const selectorAdditional = selectTestTypesByVehicleType.projector(testTypes, { noOfAxles: 2 } as TestResultModel);
      expect(selectorAdditional).toHaveLength(5);
    });

    it('test with vehicle class using code', () => {
      const testTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'], forVehicleClass: ['n'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['large'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const expectedTestTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['large'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const selector = selectTestTypesByVehicleType.projector(testTypes, { vehicleClass: { code: 's' } } as TestResultModel);
      expect(selector).toHaveLength(4);
      expect(selector).toEqual(expectedTestTypes);

      const selectorAdditional = selectTestTypesByVehicleType.projector(testTypes, { vehicleClass: { code: 'n' } } as TestResultModel);
      expect(selectorAdditional).toHaveLength(5);
    });

    it('test with vehicle class using description', () => {
      const testTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'], forVehicleClass: ['3 wheelers'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['large'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const expectedTestTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['large'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const selector = selectTestTypesByVehicleType.projector(testTypes, {
        vehicleClass: { description: 'motorbikes up to 200cc' }
      } as TestResultModel);
      expect(selector).toHaveLength(4);
      expect(selector).toEqual(expectedTestTypes);

      const selectorAdditional = selectTestTypesByVehicleType.projector(testTypes, {
        vehicleClass: { description: '3 wheelers' }
      } as TestResultModel);
      expect(selectorAdditional).toHaveLength(5);
    });

    it('test with vehicle subclass', () => {
      const testTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'], forVehicleSubclass: ['test'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['large'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['lgv'], forVehicleSubclass: [VehicleSubclass.A] },
        { forVehicleType: ['motorcycle'], forVehicleSubclass: [VehicleSubclass.C] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const expectedTestTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['large'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const selector = selectTestTypesByVehicleType.projector(testTypes, { vehicleSubclass: [VehicleSubclass.L] } as TestResultModel);
      expect(selector).toHaveLength(4);
      expect(selector).toEqual(expectedTestTypes);

      const selectorAdditional = selectTestTypesByVehicleType.projector(testTypes, { vehicleSubclass: [VehicleSubclass.C] } as TestResultModel);
      expect(selectorAdditional).toHaveLength(5);
    });

    it('test with vehicle number of wheels', () => {
      const testTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'], forVehicleWheels: [4] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'], forVehicleWheels: [2] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['large'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const expectedTestTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'], forVehicleWheels: [4] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['large'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const selector = selectTestTypesByVehicleType.projector(testTypes, { numberOfWheelsDriven: 4 } as TestResultModel);
      expect(selector).toHaveLength(5);
      expect(selector).toEqual(expectedTestTypes);

      const selectorAdditional = selectTestTypesByVehicleType.projector(testTypes, { numberOfWheelsDriven: 2 } as TestResultModel);
      expect(selectorAdditional).toHaveLength(5);
    });

    it('test with vehicle type, eu code, vehicle size', () => {
      const testTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m2'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'], forVehicleSize: ['large'] },
        { forVehicleType: ['car'], forEuVehicleCategory: ['m1'], forVehicleSize: ['small'] },
        { forVehicleType: ['car'] },
        { forVehicleType: ['car', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }, { forVehicleType: ['hgv'] }] },
        {
          forVehicleType: ['psv', 'hgv'],
          nextTestTypesOrCategories: [
            { forVehicleType: ['psv', 'hgv'] },
            { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'], forVehicleSize: ['small'] }
          ]
        }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const expectedTestTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
        { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'], forVehicleSize: ['small'] },
        { forVehicleType: ['psv', 'hgv'], nextTestTypesOrCategories: [{ forVehicleType: ['psv', 'hgv'] }] },
        {
          forVehicleType: ['psv', 'hgv'],
          nextTestTypesOrCategories: [
            { forVehicleType: ['psv', 'hgv'] },
            { forVehicleType: ['psv'], forEuVehicleCategory: ['m1'], forVehicleSize: ['small'] }
          ]
        }
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];
      const selector = selectTestTypesByVehicleType.projector(testTypes, {
        vehicleType: 'psv',
        euVehicleCategory: 'm1',
        vehicleSize: 'small'
      } as TestResultModel);
      expect(selector).toHaveLength(3);
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
    ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

    it('should sort test types by sortId', () => {
      const expectedTestTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
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
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];
      const sorted = sortedTestTypes.projector(unsortedData);
      expect(sorted).toEqual(expectedTestTypes);
    });
  });

  describe('selectTestType', () => {
    it('return the right test type', () => {
      const exampleTestTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] = [
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
      ] as TestTypeCategoryNextTestTypesOrCategoriesInner[];

      const selector = selectTestType('39').projector(exampleTestTypes);
      expect(selector).toEqual((exampleTestTypes[2] as TestTypeCategory).nextTestTypesOrCategories?.pop());
    });
  });
});
