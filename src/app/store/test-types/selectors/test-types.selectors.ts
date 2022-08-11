import { TestTypeCategory } from '@api/test-types/model/testTypeCategory';
import { TestTypesTaxonomy } from '@api/test-types/model/testTypesTaxonomy';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { createSelector } from '@ngrx/store';
import { selectedTestResultState } from '@store/test-records';
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

export const selectTestTypesByVehicleType = createSelector(selectAllTestTypes, selectedTestResultState, (testTypes, testResult) => {
  if (testResult) {
    const { vehicleType } = testResult;
    return filterTestTypes(testTypes, vehicleType);
  }
  return [];
});

export const sortedTestTypes = createSelector(selectTestTypesByVehicleType, testTypes => {
  const sortTestTypes = (testTypes: TestTypesTaxonomy): TestTypesTaxonomy => {
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

function filterTestTypes(testTypes: TestTypesTaxonomy, vehicleType: VehicleTypes): TestTypesTaxonomy {
  return testTypes
    .filter(testTypes => testTypes.forVehicleType?.includes(vehicleType))
    .map(testType => {
      const newTestType = { ...testType } as TestTypeCategory;

      if (newTestType.hasOwnProperty('nextTestTypesOrCategories')) {
        newTestType.nextTestTypesOrCategories = filterTestTypes(newTestType.nextTestTypesOrCategories!, vehicleType);
      }

      return newTestType;
    });
}

// function sortTestTypes(testTypes: TestTypesTaxonomy): TestTypesTaxonomy {
//   return testTypes
//     .sort((a, b) => {
//       if (!b.hasOwnProperty('sortId')) {
//         return 1;
//       }

//       if (!a.hasOwnProperty('sortId')) {
//         return -1;
//       }

//       return parseInt((a as TestTypeCategory).sortId || '0') - parseInt((b as TestTypeCategory).sortId || '0');
//     })
//     .map(testType => {
//       const newTestType = { ...testType } as TestTypeCategory;

//       if (newTestType.hasOwnProperty('nextTestTypesOrCategories')) {
//         newTestType.nextTestTypesOrCategories = sortTestTypes(newTestType.nextTestTypesOrCategories!);
//       }

//       return newTestType;
//     });
// }
