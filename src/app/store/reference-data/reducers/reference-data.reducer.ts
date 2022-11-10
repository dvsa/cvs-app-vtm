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
  [ReferenceDataResourceType.BodyMake]: createAdapter(),
  [ReferenceDataResourceType.BodyModel]: createAdapter(),
  [ReferenceDataResourceType.Brake]: createAdapter(),
  [ReferenceDataResourceType.CountryOfRegistration]: createAdapter(),
  [ReferenceDataResourceType.PsvMake]: createAdapter(),
  [ReferenceDataResourceType.ReasonsForAbandoningHgv]: createAdapter(),
  [ReferenceDataResourceType.ReasonsForAbandoningPsv]: createAdapter(),
  [ReferenceDataResourceType.ReasonsForAbandoningTrl]: createAdapter(),
  [ReferenceDataResourceType.SpecialistReasonsForAbandoning]: createAdapter(),
  [ReferenceDataResourceType.TIRReasonsForAbandoning]: createAdapter(),
  [ReferenceDataResourceType.Tyres]: createAdapter(),
  [ReferenceDataResourceType.User]: createAdapter()
};

export const bodyModelsEntityAdapter: EntityAdapter<ReferenceDataModelBase> = createAdapter();
export const initialBodyModelsState = bodyModelsEntityAdapter.getInitialState();

//IMPORTANT: Ensure the keys in initialReferenceDataState call get the initial state from the matching adapter in resourceTypeAdapters

export const initialReferenceDataState: ReferenceDataState = {
  error: '',
  loading: false,
  [ReferenceDataResourceType.BodyMake]: resourceTypeAdapters[ReferenceDataResourceType.BodyMake].getInitialState(),
  [ReferenceDataResourceType.BodyModel]: resourceTypeAdapters[ReferenceDataResourceType.BodyModel].getInitialState(),
  [ReferenceDataResourceType.Brake]: resourceTypeAdapters[ReferenceDataResourceType.Brake].getInitialState(),
  [ReferenceDataResourceType.CountryOfRegistration]: resourceTypeAdapters[ReferenceDataResourceType.CountryOfRegistration].getInitialState(),
  [ReferenceDataResourceType.PsvMake]: resourceTypeAdapters[ReferenceDataResourceType.PsvMake].getInitialState(),
  [ReferenceDataResourceType.ReasonsForAbandoningTrl]: resourceTypeAdapters[ReferenceDataResourceType.ReasonsForAbandoningTrl].getInitialState(),
  [ReferenceDataResourceType.ReasonsForAbandoningHgv]: resourceTypeAdapters[ReferenceDataResourceType.ReasonsForAbandoningHgv].getInitialState(),
  [ReferenceDataResourceType.ReasonsForAbandoningPsv]: resourceTypeAdapters[ReferenceDataResourceType.ReasonsForAbandoningPsv].getInitialState(),
  [ReferenceDataResourceType.ReasonsForAbandoningTrl]: resourceTypeAdapters[ReferenceDataResourceType.ReasonsForAbandoningTrl].getInitialState(),
  [ReferenceDataResourceType.SpecialistReasonsForAbandoning]:
    resourceTypeAdapters[ReferenceDataResourceType.SpecialistReasonsForAbandoning].getInitialState(),
  [ReferenceDataResourceType.TIRReasonsForAbandoning]: resourceTypeAdapters[ReferenceDataResourceType.TIRReasonsForAbandoning].getInitialState(),
  [ReferenceDataResourceType.Tyres]: resourceTypeAdapters[ReferenceDataResourceType.Tyres].getInitialState(),
  [ReferenceDataResourceType.User]: resourceTypeAdapters[ReferenceDataResourceType.User].getInitialState(),
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
