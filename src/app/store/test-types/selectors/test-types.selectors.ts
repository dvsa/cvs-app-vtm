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

export const selectTestTypesByVehicleType = createSelector(selectAllTestTypes, selectedTestResultState, (testTypes, testResult) => {
  if (testResult) {
    const { vehicleType } = testResult;
    return testTypes.filter(testType => testType.forVehicleType?.includes(vehicleType));
  }
  return [];
});

export const formatData = createSelector(selectAllTestTypes, testTypes => {
  const reducer = (accumulator: any, currentValue: any) => {
    const newVal = { ...accumulator };

    const getIds = (testType: any) => {
      if (!testType['nextTestTypesOrCategories']) {
        return [{ name: testType.testTypeName, id: testType.id }];
      } else {
        const ids: any[] = [];
        testType['nextTestTypesOrCategories'].forEach((test: any) => {
          ids.push(...getIds(test));
        });

        return ids;
      }
    };

    for (const vt of currentValue.forVehicleType) {
      if (!newVal[vt]) {
        newVal[vt] = [...getIds(currentValue)];
      } else {
        newVal[vt] = [...newVal[vt], ...getIds(currentValue)];
      }
    }

    return newVal;
  };
  return testTypes.reduce(reducer, {});
});
