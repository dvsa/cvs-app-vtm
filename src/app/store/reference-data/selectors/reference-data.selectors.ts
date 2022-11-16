import { Brake, ReferenceDataResourceType } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { createSelector } from '@ngrx/store';
import { ReferenceDataEntityStateTyres, referenceDataFeatureState, resourceTypeAdapters } from '../reducers/reference-data.reducer';

const resourceTypeSelector = (resourceType: ReferenceDataResourceType) => createSelector(referenceDataFeatureState, state => state[resourceType]);

export const selectAllReferenceDataByResourceType = (resourceType: ReferenceDataResourceType) =>
  createSelector(resourceTypeSelector(resourceType), state => resourceTypeAdapters[resourceType].getSelectors().selectAll(state));

export const selectReferenceDataByResourceKey = (resourceType: ReferenceDataResourceType, resourceKey: string | number) =>
  createSelector(referenceDataFeatureState, state => state[resourceType].entities[resourceKey]);

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

export const selectTyreSearchReturn = () =>
  createSelector(referenceDataFeatureState, state => (state[ReferenceDataResourceType.Tyres] as ReferenceDataEntityStateTyres).searchReturn);

export const selectUserByResourceKey = (resourceKey: string) =>
  createSelector(referenceDataFeatureState, state => state[ReferenceDataResourceType.User].entities[resourceKey]);
