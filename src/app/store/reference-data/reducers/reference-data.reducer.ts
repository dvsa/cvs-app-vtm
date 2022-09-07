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

export interface ReferenceDataState {
  error: string;
  loading: boolean;
  [ReferenceDataResourceType.CountryOfRegistration]: EntityState<ReferenceDataModelBase>;
  [ReferenceDataResourceType.User]: EntityState<ReferenceDataModelBase>;
}

function createAdapter() {
  return createEntityAdapter<ReferenceDataModelBase>({ selectId: selectResourceKey });
}

export const countriesOfRegistrationEntityAdapter: EntityAdapter<ReferenceDataModelBase> = createAdapter();
export const initialCountriesOfRegistrationState = countriesOfRegistrationEntityAdapter.getInitialState();

export const usersEntityAdapter: EntityAdapter<ReferenceDataModelBase> = createAdapter();
export const initialUsersState = usersEntityAdapter.getInitialState();

export const initialReferenceDataState: ReferenceDataState = {
  error: '',
  loading: false,
  [ReferenceDataResourceType.CountryOfRegistration]: initialCountriesOfRegistrationState,
  [ReferenceDataResourceType.User]: initialUsersState
};

export const referenceDataReducer = createReducer(
  initialReferenceDataState,
  on(fetchReferenceData, state => ({ ...state, loading: true })),
  on(fetchReferenceDataSuccess, (state, action) => {
    const { resourceType, payload } = action;
    return {
      ...state,
      [resourceType]: (resourceTypeAdapters[resourceType] as EntityAdapter<ReferenceDataModelBase>).setAll(payload, state[resourceType]),
      loading: false
    };
  }),
  on(fetchReferenceDataFailed, (state, action) => ({ ...state, loading: false })),

  on(fetchReferenceDataByKey, state => ({ ...state, loading: true })),
  on(fetchReferenceDataByKeySuccess, (state, action) => {
    const { resourceType, payload } = action;
    return {
      ...state,
      [resourceType]: (resourceTypeAdapters[resourceType] as EntityAdapter<ReferenceDataModelBase>).upsertOne(payload, state[resourceType]),
      loading: false
    };
  }),
  on(fetchReferenceDataByKeyFailed, (state, action) => ({ ...state, loading: false }))
);

export const referenceDataFeatureState = createFeatureSelector<ReferenceDataState>(STORE_FEATURE_REFERENCE_DATA_KEY);

export const resourceTypeAdapters = {
  [ReferenceDataResourceType.CountryOfRegistration]: countriesOfRegistrationEntityAdapter,
  [ReferenceDataResourceType.User]: usersEntityAdapter
};
