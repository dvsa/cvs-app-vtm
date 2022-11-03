import { ReasonsForAbandoning, ReferenceDataResourceType } from '@models/reference-data.model';
import { createSelector } from '@ngrx/store';
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

export const selectReferenceDataByResourceKey = (resourceType: ReferenceDataResourceType, resourceKey: string) =>
  createSelector(referenceDataFeatureState, state => {
    return state[resourceType].entities[resourceKey];
  });

export const referenceDataLoadingState = createSelector(referenceDataFeatureState, state => state.loading);

export const selectUserByResourceKey = (resourceKey: string) =>
  createSelector(referenceDataFeatureState, state => {
    return state[ReferenceDataResourceType.User].entities[resourceKey];
  });

export const selectReasonsForAbandoning = createSelector(
  selectAllReferenceDataByResourceType(ReferenceDataResourceType.ReasonsForAbandoning),
  testResultInEdit,
  (referenceData, testResult) => {
    return (referenceData as ReasonsForAbandoning[]).filter(reason => reason.vehicleType === testResult?.vehicleType);
  }
);
