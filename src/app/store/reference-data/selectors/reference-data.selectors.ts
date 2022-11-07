import { inject } from '@angular/core';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { createSelector, DefaultProjectorFn, MemoizedSelector, Store } from '@ngrx/store';
import { State } from '@store/index';
import { testResultInEdit } from '@store/test-records';
import { referenceDataFeatureState, resourceTypeAdapters } from '../reducers/reference-data.reducer';

const resourceTypeSelector = (resourceType: ReferenceDataResourceType) =>
  createSelector(referenceDataFeatureState, state => {
    return state[resourceType];
  });

export const selectAllReferenceDataByResourceType = (resourceType: ReferenceDataResourceType) =>
  createSelector(resourceTypeSelector(resourceType), state => {
    return resourceTypeAdapters[resourceType].getSelectors().selectAll(state);
  });

export const selectReferenceDataByResourceKey = (resourceType: ReferenceDataResourceType, resourceKey: string | number) =>
  createSelector(referenceDataFeatureState, state => {
    return state[resourceType].entities[resourceKey];
  });

export const referenceDataLoadingState = createSelector(referenceDataFeatureState, state => state.loading);

export const selectUserByResourceKey = (resourceKey: string) =>
  createSelector(referenceDataFeatureState, state => {
    return state[ReferenceDataResourceType.User].entities[resourceKey];
  });

export const selectReasonsForAbandoning = (vehicleType: VehicleTypes) => {
  switch (vehicleType) {
    case VehicleTypes.PSV:
      return selectAllReferenceDataByResourceType(ReferenceDataResourceType.ReasonsForAbandoningPsv);
    case VehicleTypes.HGV:
      return selectAllReferenceDataByResourceType(ReferenceDataResourceType.ReasonsForAbandoningHgv);
    case VehicleTypes.TRL:
      return selectAllReferenceDataByResourceType(ReferenceDataResourceType.ReasonsForAbandoningTrl);
    default:
      throw new Error('Unknown Vehicle Type');
  }
};
