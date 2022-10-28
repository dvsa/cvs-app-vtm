import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
  fetchReferenceData,
  fetchReferenceDataByKey,
  fetchReferenceDataByKeyFailed,
  fetchReferenceDataByKeySuccess,
  fetchReferenceDataFailed,
  fetchReferenceDataSuccess
} from '../actions/reference-data.actions';
export const STORE_FEATURE_REFERENCE_DATA_KEY = 'referenceData';

const selectResourceKey = (a: ReferenceDataModelBase): string => {
  return a.resourceKey;
};

export type ReferenceDataState = Record<ReferenceDataResourceType, EntityState<ReferenceDataModelBase>> & { error: string; loading: boolean };

function createAdapter() {
  return createEntityAdapter<ReferenceDataModelBase>({ selectId: selectResourceKey });
}

export const resourceTypeAdapters: Record<ReferenceDataResourceType, EntityAdapter<ReferenceDataModelBase>> = {
  [ReferenceDataResourceType.CountryOfRegistration]: createAdapter(),
  [ReferenceDataResourceType.User]: createAdapter(),
  [ReferenceDataResourceType.ReasonsForAbandoning]: createAdapter(),
  [ReferenceDataResourceType.TIRReasonsForAbandoning]: createAdapter(),
  [ReferenceDataResourceType.SpecialistReasonsForAbandoning]: createAdapter()
};

export const initialReferenceDataState: ReferenceDataState = {
  error: '',
  loading: false,
  [ReferenceDataResourceType.CountryOfRegistration]: resourceTypeAdapters[ReferenceDataResourceType.CountryOfRegistration].getInitialState(),
  [ReferenceDataResourceType.User]: resourceTypeAdapters[ReferenceDataResourceType.User].getInitialState(),
  [ReferenceDataResourceType.ReasonsForAbandoning]: resourceTypeAdapters[ReferenceDataResourceType.ReasonsForAbandoning].getInitialState(),
  [ReferenceDataResourceType.TIRReasonsForAbandoning]: resourceTypeAdapters[ReferenceDataResourceType.TIRReasonsForAbandoning].getInitialState(),
  [ReferenceDataResourceType.SpecialistReasonsForAbandoning]:
    resourceTypeAdapters[ReferenceDataResourceType.SpecialistReasonsForAbandoning].getInitialState()
};

export const referenceDataReducer = createReducer(
  initialReferenceDataState,
  on(fetchReferenceData, state => ({ ...state, loading: true })),
  on(fetchReferenceDataSuccess, (state, action) => {
    const { resourceType, payload } = action;
    return {
      ...state,
      [resourceType]: resourceTypeAdapters[resourceType].setAll(payload, state[resourceType]),
      loading: false
    };
  }),
  on(fetchReferenceDataFailed, state => ({ ...state, loading: false })),

  on(fetchReferenceDataByKey, state => ({ ...state, loading: true })),
  on(fetchReferenceDataByKeySuccess, (state, action) => {
    const { resourceType, payload } = action;
    return {
      ...state,
      [resourceType]: resourceTypeAdapters[resourceType].upsertOne(payload, state[resourceType]),
      loading: false
    };
  }),
  on(fetchReferenceDataByKeyFailed, state => ({ ...state, loading: false }))
);

export const referenceDataFeatureState = createFeatureSelector<ReferenceDataState>(STORE_FEATURE_REFERENCE_DATA_KEY);
