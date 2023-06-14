import { ReferenceDataModelBase, ReferenceDataResourceType, ReferenceDataResourceTypeAudit, ReferenceDataTyre } from '@models/reference-data.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
  addSearchInformation,
  amendReferenceDataItemSuccess,
  createReferenceDataItemSuccess,
  deleteReferenceDataItemSuccess,
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
  removeReferenceDataByKey,
  removeTyreSearch
} from '../actions/reference-data.actions';
import cloneDeep from 'lodash.clonedeep';

export const STORE_FEATURE_REFERENCE_DATA_KEY = 'referenceData';

const selectResourceKey = (a: ReferenceDataModelBase): string | number => {
  return a.resourceKey;
};
interface ReferenceDataEntityState extends EntityState<ReferenceDataModelBase> {
  loading: boolean;
}

export interface ReferenceDataEntityStateSearch extends EntityState<ReferenceDataModelBase> {
  loading: boolean;
  searchReturn: ReferenceDataModelBase[] | null;
  term: string | null;
  filter: string | null;
}

export type ReferenceDataState = Record<ReferenceDataResourceType, ReferenceDataEntityState | ReferenceDataEntityStateSearch>;

function createAdapter() {
  return createEntityAdapter<ReferenceDataModelBase>({ selectId: selectResourceKey as any });
}

function getInitialState(resourceType: ReferenceDataResourceType) {
  return resourceTypeAdapters[resourceType].getInitialState({ loading: false });
}

export const resourceTypeAdapters: Record<ReferenceDataResourceType, EntityAdapter<ReferenceDataModelBase>> = {
  [ReferenceDataResourceType.Brakes]: createAdapter(),
  [ReferenceDataResourceType.CountryOfRegistration]: createAdapter(),
  [ReferenceDataResourceType.HgvMake]: createAdapter(),
  [ReferenceDataResourceType.PsvMake]: createAdapter(),
  [ReferenceDataResourceType.ReasonsForAbandoningHgv]: createAdapter(),
  [ReferenceDataResourceType.ReasonsForAbandoningPsv]: createAdapter(),
  [ReferenceDataResourceType.ReasonsForAbandoningTrl]: createAdapter(),
  [ReferenceDataResourceType.ReferenceDataAdminType]: createAdapter(),
  [ReferenceDataResourceType.SpecialistReasonsForAbandoning]: createAdapter(),
  [ReferenceDataResourceType.TirReasonsForAbandoning]: createAdapter(),
  [ReferenceDataResourceType.TrlMake]: createAdapter(),
  [ReferenceDataResourceType.Tyres]: createAdapter(),
  [ReferenceDataResourceType.User]: createAdapter()
};

//IMPORTANT: Ensure the keys in initialReferenceDataState call get the initial state from the matching resourceType

export const initialReferenceDataState: ReferenceDataState = {
  [ReferenceDataResourceType.Brakes]: getInitialState(ReferenceDataResourceType.Brakes),
  [ReferenceDataResourceType.CountryOfRegistration]: getInitialState(ReferenceDataResourceType.CountryOfRegistration),
  [ReferenceDataResourceType.HgvMake]: getInitialState(ReferenceDataResourceType.HgvMake),
  [ReferenceDataResourceType.PsvMake]: getInitialState(ReferenceDataResourceType.PsvMake),
  [ReferenceDataResourceType.ReasonsForAbandoningTrl]: getInitialState(ReferenceDataResourceType.ReasonsForAbandoningTrl),
  [ReferenceDataResourceType.ReasonsForAbandoningHgv]: getInitialState(ReferenceDataResourceType.ReasonsForAbandoningHgv),
  [ReferenceDataResourceType.ReasonsForAbandoningPsv]: getInitialState(ReferenceDataResourceType.ReasonsForAbandoningPsv),
  [ReferenceDataResourceType.ReferenceDataAdminType]: getInitialState(ReferenceDataResourceType.ReferenceDataAdminType),
  [ReferenceDataResourceType.SpecialistReasonsForAbandoning]: getInitialState(ReferenceDataResourceType.SpecialistReasonsForAbandoning),
  [ReferenceDataResourceType.TirReasonsForAbandoning]: getInitialState(ReferenceDataResourceType.TirReasonsForAbandoning),
  [ReferenceDataResourceType.TrlMake]: getInitialState(ReferenceDataResourceType.TrlMake),
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
    [action.resourceType]: { ...state[action.resourceType], searchReturn: null, loading: false, filter: null, term: null }
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
    [action.resourceType]: { ...state[action.resourceType], searchReturn: null, loading: false, filter: null, term: null }
  })),
  on(removeTyreSearch, state => ({
    ...state,
    [ReferenceDataResourceType.Tyres]: { ...state[ReferenceDataResourceType.Tyres], searchReturn: null, filter: null, term: null }
  })),
  on(deleteReferenceDataItemSuccess, (state, action) => {
    const { resourceType, resourceKey } = action;
    const currentState = cloneDeep(state);
    const newResourceTypeState = resourceTypeAdapters[resourceType].removeOne(resourceKey as string, currentState[resourceType]);

    currentState[resourceType] = newResourceTypeState;
    return currentState;
    // const { resourceType, resourceKey } = action;
    // const currentState: ReferenceDataState = cloneDeep(state);
    // const filteredEntities: (string | number)[] = [];
    // delete currentState[resourceType as ReferenceDataResourceType].entities[resourceKey];
    // currentState[resourceType as ReferenceDataResourceType].ids.forEach(id => {
    //   if (id != resourceKey) {
    //     filteredEntities.push(id);
    //   }
    // });
    // currentState[resourceType as ReferenceDataResourceType].ids = filteredEntities as string[];
    // return currentState;
  }),
  on(amendReferenceDataItemSuccess, (state, action) => {
    const { result } = action;
    const currentState: ReferenceDataState = cloneDeep(state);
    currentState[result.resourceType as ReferenceDataResourceType].entities[result.resourceKey] = result as ReferenceDataModelBase;
    return currentState;
  }),
  on(createReferenceDataItemSuccess, (state, action) => {
    const { result } = action;
    const currentState = cloneDeep(state);
    const newResourceTypeState = resourceTypeAdapters[result.resourceType].addOne(result, currentState[result.resourceType]);

    currentState[result.resourceType] = newResourceTypeState;
    return currentState;
    // const { result } = action;
    // const currentState: ReferenceDataState = cloneDeep(state);
    // const newIds: string[] = [];
    // newIds.push(result.resourceKey as string);
    // currentState[result.resourceType as ReferenceDataResourceType].ids.forEach(id => {
    //   newIds.push(id as string);

    // currentState[result.resourceType as ReferenceDataResourceType].entities[result.resourceKey] = result as ReferenceDataModelBase;
    // currentState[result.resourceType as ReferenceDataResourceType].ids = newIds;
    // return currentState;
  }),
  on(addSearchInformation, (state, action) => ({
    ...state,
    [ReferenceDataResourceType.Tyres]: { ...state[ReferenceDataResourceType.Tyres], filter: action.filter, term: action.term }
  }))
);

export const referenceDataFeatureState = createFeatureSelector<ReferenceDataState>(STORE_FEATURE_REFERENCE_DATA_KEY);
