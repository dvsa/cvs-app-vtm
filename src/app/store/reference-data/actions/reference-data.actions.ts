import { GlobalError } from '@core/components/global-error/global-error.interface';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { createAction, props } from '@ngrx/store';
import { ReferenceDataEntityStateSearch } from '../reducers/reference-data.reducer';

interface featureError extends GlobalError {
  resourceType: ReferenceDataResourceType;
}

export const fetchReferenceData = createAction(
  '[API/reference-data] Fetch all of ResourceType',
  props<{ resourceType: ReferenceDataResourceType; paginationToken?: string }>()
);
export const fetchReferenceDataSuccess = createAction(
  '[API/reference-data] Fetch all of ResourceType Success',
  props<{ resourceType: ReferenceDataResourceType; payload: Array<ReferenceDataModelBase>; paginated: boolean }>()
);
export const fetchReferenceDataFailed = createAction('[API/reference-data] Fetch all of ResourceType Failed', props<featureError>());

export const fetchReferenceDataByKey = createAction(
  '[API/reference-data] Fetch ResourceType by Key',
  props<{ resourceType: ReferenceDataResourceType; resourceKey: string | number }>()
);
export const fetchReferenceDataByKeySuccess = createAction(
  '[API/reference-data] Fetch ResourceType by Key Success',
  props<{
    resourceType: ReferenceDataResourceType;
    resourceKey: string | number;
    payload: ReferenceDataModelBase;
  }>()
);
export const fetchReferenceDataByKeyFailed = createAction('[API/reference-data] Fetch ResourceType by Key Failed', props<featureError>());

export const fetchReferenceDataByKeySearch = createAction(
  '[API/reference-data] Fetch ResourceType by Key and Search',
  props<{ resourceType: ReferenceDataResourceType; resourceKey: string | number }>()
);
export const fetchReferenceDataByKeySearchSuccess = createAction(
  '[API/reference-data] Fetch ResourceType by Key and search Success',
  props<{
    resourceType: ReferenceDataResourceType;
    resourceKey: string | number;
    payload: Array<ReferenceDataModelBase>;
  }>()
);
export const fetchReferenceDataByKeySearchFailed = createAction(
  '[API/reference-data] Fetch ResourceType by Key and search Failed',
  props<featureError>()
);

export const fetchTyreReferenceDataByKeySearch = createAction(
  '[API/reference-data] Fetch tyre by filter and term',
  props<{ searchFilter: string; searchTerm: string }>()
);
export const fetchTyreReferenceDataByKeySearchSuccess = createAction(
  '[API/reference-data] Fetch tyre by filter and term Success',
  props<{
    resourceType: ReferenceDataResourceType;
    payload: Array<ReferenceDataModelBase>;
  }>()
);
export const fetchTyreReferenceDataByKeySearchFailed = createAction(
  '[API/reference-data] Fetch tyre by filter and term Failed',
  props<featureError>()
);

export const addSearchInformation = createAction(
  '[API/reference-data] Add Search Information to state',
  props<{
    filter: string;
    term: string;
  }>()
);

export const removeTyreSearch = createAction('[API/reference-data] Remove search return from state');

export const removeReferenceDataByKey = createAction(
  '[API/reference-data] Remove item from state',
  props<{
    resourceType: ReferenceDataResourceType;
    resourceKey: string;
  }>()
);

export const fetchReasonsForAbandoning = createAction('[API/reference-data] Fetch reasons for abandoning');
