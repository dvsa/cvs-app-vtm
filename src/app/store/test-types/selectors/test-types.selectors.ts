import { TestType } from '@api/test-types';
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
