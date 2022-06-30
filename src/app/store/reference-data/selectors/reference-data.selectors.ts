import { ReferenceDataResourceType } from '@models/reference-data.model';
import { createSelector } from '@ngrx/store';
import { referenceDataFeatureState, resourceTypeAdapters } from '../reducers/reference-data.reducer';

const resourceTypeSelector = (resourceType: ReferenceDataResourceType) =>
  createSelector(referenceDataFeatureState, (state) => {
    return state[resourceType];
  });

export const selectAllReferenceDataByResourceType = (resourceType: ReferenceDataResourceType) =>
  createSelector(resourceTypeSelector(resourceType), (state) => {
    return resourceTypeAdapters[resourceType].getSelectors().selectAll(state);
  });

export const selectReferenceDataByResourceKey = (resourceType: ReferenceDataResourceType, resourceKey: string) =>
  createSelector(referenceDataFeatureState, (state) => {
    return state[resourceType].entities[resourceKey];
  });

export const referenceDataLoadingState = createSelector(referenceDataFeatureState, (state) => state.loading);
