import { CountryOfRegistration, ReferenceDataModelBase } from '@models/reference-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { fetchReferenceData, fetchReferenceDataFailed, fetchReferenceDataSuccess } from '../actions/reference-data.actions';
export const STORE_FEATURE_REFERENCE_DATA_KEY = 'referenceData';

const selectResourceKey = (a: ReferenceDataModelBase): string => {
  return a.resourceKey;
};

export interface ReferenceDataState {
  error: string;
  loading: boolean;
  COUNTRY_OF_REGISTRATION: EntityState<CountryOfRegistration>;
}

export const countriesOfRegistrationEntityAdapter: EntityAdapter<CountryOfRegistration> = createEntityAdapter<CountryOfRegistration>({ selectId: selectResourceKey });

export const initialCountriesOfRegistrationState = countriesOfRegistrationEntityAdapter.getInitialState();

const initialReferenceDataState: ReferenceDataState = {
  error: '',
  loading: false,
  COUNTRY_OF_REGISTRATION: initialCountriesOfRegistrationState
};

export const referenceDataReducer = createReducer(
  initialReferenceDataState,
  on(fetchReferenceData, (state) => ({ ...state, loading: true })),
  on(fetchReferenceDataSuccess, (state, action) => {
    const { resourceType, payload } = action;
    return { ...state, [resourceType]: (resourceTypeAdapters[resourceType] as EntityAdapter<ReferenceDataModelBase>).setAll(payload, state[resourceType]), loading: false };
  }),
  on(fetchReferenceDataFailed, (state, action) => ({ ...state, error: action.error, loading: false }))
);

export const referenceDataFeatureState = createFeatureSelector<ReferenceDataState>(STORE_FEATURE_REFERENCE_DATA_KEY);

export const resourceTypeAdapters = {
  COUNTRY_OF_REGISTRATION: countriesOfRegistrationEntityAdapter
};
