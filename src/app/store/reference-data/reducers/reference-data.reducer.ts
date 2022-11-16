import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
  fetchReferenceData,
  fetchReferenceDataByKey,
  fetchReferenceDataByKeyFailed,
  fetchReferenceDataByKeySearch,
  fetchReferenceDataByKeySearchFailed,
  fetchReferenceDataByKeySearchSuccess,
  fetchReferenceDataByKeySuccess,
  fetchReferenceDataFailed,
  fetchReferenceDataSuccess,
  fetchTyreReferenceDataByKeySearch,
  fetchTyreReferenceDataByKeySearchFailed,
  fetchTyreReferenceDataByKeySearchSuccess,
  removeTyreSearch
} from '../actions/reference-data.actions';
export const STORE_FEATURE_REFERENCE_DATA_KEY = 'referenceData';

const selectResourceKey = (a: ReferenceDataModelBase): string | number => {
  return a.resourceKey;
};
interface ReferenceDataEntityState extends EntityState<ReferenceDataModelBase> {
  loading: boolean;
}

export interface ReferenceDataEntityStateTyres extends EntityState<ReferenceDataModelBase> {
  loading: boolean;
  searchReturn: any[];
}

export type ReferenceDataState = Record<ReferenceDataResourceType, ReferenceDataEntityState | ReferenceDataEntityStateTyres>;

function createAdapter() {
  return createEntityAdapter<ReferenceDataModelBase>({ selectId: selectResourceKey as any });
}

function getInitialState(resourceType: ReferenceDataResourceType) {
  return resourceTypeAdapters[resourceType].getInitialState({ loading: false });
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

//IMPORTANT: Ensure the keys in initialReferenceDataState call get the initial state from the matching resourceType

export const initialReferenceDataState: ReferenceDataState = {
  [ReferenceDataResourceType.BodyMake]: getInitialState(ReferenceDataResourceType.BodyMake),
  [ReferenceDataResourceType.BodyModel]: getInitialState(ReferenceDataResourceType.BodyModel),
  [ReferenceDataResourceType.Brake]: getInitialState(ReferenceDataResourceType.Brake),
  [ReferenceDataResourceType.CountryOfRegistration]: getInitialState(ReferenceDataResourceType.CountryOfRegistration),
  [ReferenceDataResourceType.PsvMake]: getInitialState(ReferenceDataResourceType.PsvMake),
  [ReferenceDataResourceType.ReasonsForAbandoningTrl]: getInitialState(ReferenceDataResourceType.ReasonsForAbandoningTrl),
  [ReferenceDataResourceType.ReasonsForAbandoningHgv]: getInitialState(ReferenceDataResourceType.ReasonsForAbandoningHgv),
  [ReferenceDataResourceType.ReasonsForAbandoningPsv]: getInitialState(ReferenceDataResourceType.ReasonsForAbandoningPsv),
  [ReferenceDataResourceType.SpecialistReasonsForAbandoning]: getInitialState(ReferenceDataResourceType.SpecialistReasonsForAbandoning),
  [ReferenceDataResourceType.TIRReasonsForAbandoning]: getInitialState(ReferenceDataResourceType.TIRReasonsForAbandoning),
  [ReferenceDataResourceType.Tyres]: getInitialState(ReferenceDataResourceType.Tyres),
  [ReferenceDataResourceType.User]: getInitialState(ReferenceDataResourceType.User)
};

export const referenceDataReducer = createReducer(
  initialReferenceDataState,
  on(fetchReferenceData, (state, action) => ({ ...state, [action.resourceType]: { ...state[action.resourceType], loading: true } })),
  on(fetchReferenceDataSuccess, (state, action) => {
    const { resourceType, payload, paginated } = action;
    return {
      ...state,
      [resourceType]: { ...resourceTypeAdapters[resourceType].upsertMany(payload, state[resourceType]), loading: paginated }
    };
  }),

  on(fetchReferenceDataFailed, (state, action) => ({ ...state, [action.resourceType]: { ...state[action.resourceType], loading: false } })),

  on(fetchReferenceDataByKey, (state, action) => ({ ...state, [action.resourceType]: { ...state[action.resourceType], loading: true } })),
  on(fetchReferenceDataByKeySuccess, (state, action) => {
    const { resourceType, payload } = action;
    return {
      ...state,
      [resourceType]: { ...resourceTypeAdapters[resourceType].upsertOne(payload, state[resourceType]), loading: false }
    };
  }),
  on(fetchReferenceDataByKeyFailed, (state, action) => ({ ...state, [action.resourceType]: { ...state[action.resourceType], loading: false } })),

  on(fetchReferenceDataByKeySearch, (state, action) => ({
    ...state,
    [action.resourceType]: { ...state[action.resourceType], searchReturn: null, loading: true }
  })),
  on(fetchReferenceDataByKeySearchSuccess, (state, action) => {
    const { resourceType, payload } = action;
    return {
      ...state,
      [resourceType]: { ...state[action.resourceType], searchReturn: payload, loading: false }
    };
  }),
  on(fetchReferenceDataByKeySearchFailed, (state, action) => ({
    ...state,
    [action.resourceType]: { ...state[action.resourceType], searchReturn: null, loading: false }
  })),

  on(fetchTyreReferenceDataByKeySearch, (state, action) => ({
    ...state,
    [ReferenceDataResourceType.Tyres]: { ...state[ReferenceDataResourceType.Tyres], searchReturn: null, loading: true }
  })),
  on(fetchTyreReferenceDataByKeySearchSuccess, (state, action) => {
    const { resourceType, payload } = action;
    return {
      ...state,
      [resourceType]: { ...state[resourceType], searchReturn: payload, loading: false }
    };
  }),
  on(fetchTyreReferenceDataByKeySearchFailed, (state, action) => ({
    ...state,
    [action.resourceType]: { ...state[action.resourceType], searchReturn: null, loading: false }
  })),
  on(removeTyreSearch, state => ({
    ...state,
    [ReferenceDataResourceType.Tyres]: { ...state[ReferenceDataResourceType.Tyres], searchReturn: null }
  }))
);

export const referenceDataFeatureState = createFeatureSelector<ReferenceDataState>(STORE_FEATURE_REFERENCE_DATA_KEY);
