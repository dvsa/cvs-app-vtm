import { Brake, ReferenceDataResourceType } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { createSelector } from '@ngrx/store';
import { referenceDataFeatureState, resourceTypeAdapters } from '../reducers/reference-data.reducer';

const resourceTypeSelector = (resourceType: ReferenceDataResourceType) => createSelector(referenceDataFeatureState, state => state[resourceType]);

export const selectAllReferenceDataByResourceType = (resourceType: ReferenceDataResourceType) =>
  createSelector(resourceTypeSelector(resourceType), state =>
    isResourceType(resourceType) ? resourceTypeAdapters[resourceType].getSelectors().selectAll(state) : undefined
  );

export const selectReferenceDataByResourceKey = (resourceType: ReferenceDataResourceType, resourceKey: string | number) =>
  createSelector(referenceDataFeatureState, state => (isResourceType(resourceType) ? state[resourceType].entities[resourceKey] : undefined));

export const referenceDataLoadingState = createSelector(referenceDataFeatureState, state => Object.values(state).some(feature => feature.loading));

export const selectBrakeByCode = (code: string) =>
  createSelector(referenceDataFeatureState, state => state[ReferenceDataResourceType.Brake].entities[code] as Brake);

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

export const selectUserByResourceKey = (resourceKey: string) =>
  createSelector(referenceDataFeatureState, state => state[ReferenceDataResourceType.User].entities[resourceKey]);

export const isResourceType = (resourceType: string): resourceType is ReferenceDataResourceType => {
  return Object.values(ReferenceDataResourceType).includes(resourceType as ReferenceDataResourceType);
};
