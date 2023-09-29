import { TestType } from '@api/test-types';
import { TestTypeCategory, TestTypeCategoryNextTestTypesOrCategoriesInner } from '@api/test-types/model/models';
import { TestResultModel } from '@models/test-results/test-result.model';
import { StatusCodes, VehicleSubclass } from '@models/vehicle-tech-record.model';
import { createSelector } from '@ngrx/store';
import { toEditOrNotToEdit } from '@store/test-records';
import { testTypesAdapter, testTypesFeatureState } from '../reducers/test-types.reducer';

const { selectIds, selectEntities, selectAll, selectTotal } = testTypesAdapter.getSelectors();

// select the array of ids
export const selectTestTypesIds = createSelector(testTypesFeatureState, state => selectIds(state));

// select the dictionary of test types entities
export const selectTestTypesEntities = createSelector(testTypesFeatureState, state => selectEntities(state));

// select the array of tests result
export const selectAllTestTypes = createSelector(testTypesFeatureState, state => selectAll(state));

// select the total test types count
export const selectTestTypesTotal = createSelector(testTypesFeatureState, state => selectTotal(state));

export const selectTestTypesLoadingState = createSelector(testTypesFeatureState, state => state.loading);

export const selectTestTypesByVehicleType = createSelector(selectAllTestTypes, toEditOrNotToEdit, (testTypes, testResult) => {
  if (testResult) {
    return filterTestTypes(testTypes, testResult);
  }
  return [];
});

export const sortedTestTypes = createSelector(selectTestTypesByVehicleType, testTypes => {
  const sortTestTypes = (testTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[]): TestTypeCategoryNextTestTypesOrCategoriesInner[] => {
    return testTypes
      .sort((a, b) => {
        if (!b.hasOwnProperty('sortId')) {
          return 1;
        }

        if (!a.hasOwnProperty('sortId')) {
          return -1;
        }

        return parseInt((a as TestTypeCategory).sortId || '0') - parseInt((b as TestTypeCategory).sortId || '0');
      })
      .map(testType => {
        const newTestType = { ...testType } as TestTypeCategory;

        if (newTestType.hasOwnProperty('nextTestTypesOrCategories')) {
          newTestType.nextTestTypesOrCategories = sortTestTypes(newTestType.nextTestTypesOrCategories!);
        }

        return newTestType;
      });
  };

  return sortTestTypes(testTypes);
});

export const selectTestType = (id: string | undefined) =>
  createSelector(selectTestTypesByVehicleType, (testTypes): TestType | undefined => {
    function findUsingId(id: string | undefined, testTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[] | undefined): TestType | undefined {
      if (!testTypes) {
        return undefined;
      }

      for (const testType of testTypes) {
        if (testType.id === id) {
          return testType;
        }

        const found = findUsingId(id, (testType as TestTypeCategory).nextTestTypesOrCategories);

        if (found) {
          return found;
        }
      }

      return undefined;
    }

    return findUsingId(id, testTypes);
  });

export const getTypeOfTest = (id: string | undefined) => createSelector(selectTestType(id), testTypes => testTypes?.typeOfTest);

function filterTestTypes(testTypes: TestTypeCategoryNextTestTypesOrCategoriesInner[], testResult: TestResultModel): TestTypeCategoryNextTestTypesOrCategoriesInner[] {
  const {
    vehicleType,
    statusCode,
    euVehicleCategory,
    vehicleSize,
    vehicleConfiguration,
    noOfAxles,
    vehicleClass,
    vehicleSubclass,
    numberOfWheelsDriven
  } = testResult;

  return (
    testTypes
      .filter(testTypes => !vehicleType || !testTypes.forVehicleType || testTypes.forVehicleType.includes(vehicleType as TestTypeCategory.ForVehicleTypeEnum))
      .filter(testTypes => !statusCode || statusCode !== StatusCodes.PROVISIONAL || testTypes.forProvisionalStatus)
      .filter(testTypes => !statusCode || !testTypes.forProvisionalStatusOnly || statusCode === StatusCodes.PROVISIONAL)
      .filter(testTypes => !euVehicleCategory || !testTypes.forEuVehicleCategory || testTypes.forEuVehicleCategory.includes(euVehicleCategory))
      .filter(testTypes => !vehicleSize || !testTypes.forVehicleSize || testTypes.forVehicleSize.includes(vehicleSize))
      .filter(
        testTypes => !vehicleConfiguration || !testTypes.forVehicleConfiguration || testTypes.forVehicleConfiguration.includes(vehicleConfiguration)
      )
      .filter(testTypes => !noOfAxles || !testTypes.forVehicleAxles || testTypes.forVehicleAxles.includes(noOfAxles))
      // if code AND description are null, or if either code OR description are in forVehicleClass, include in filter
      .filter(
        testTypes =>
          !vehicleClass ||
          !testTypes.forVehicleClass ||
          (!vehicleClass.code && !vehicleClass.description) ||
          (vehicleClass.code && testTypes.forVehicleClass.includes(vehicleClass.code)) ||
          (vehicleClass.description && testTypes.forVehicleClass.includes(vehicleClass.description))
      )
      .filter(
        testTypes =>
          !vehicleSubclass ||
          !testTypes.forVehicleSubclass ||
          testTypes.forVehicleSubclass.some(forVehicleSubclass => vehicleSubclass.includes(forVehicleSubclass as VehicleSubclass))
      )
      .filter(testTypes => !numberOfWheelsDriven || !testTypes.forVehicleWheels || testTypes.forVehicleWheels.includes(numberOfWheelsDriven))
      .map(testType => {
        const newTestType = { ...testType } as TestTypeCategory;

        if (newTestType.hasOwnProperty('nextTestTypesOrCategories')) {
          newTestType.nextTestTypesOrCategories = filterTestTypes(newTestType.nextTestTypesOrCategories!, testResult);
        }

        return newTestType;
      })
  );
}
