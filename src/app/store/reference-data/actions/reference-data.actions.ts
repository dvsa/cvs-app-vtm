import { GlobalError } from '@core/components/global-error/global-error.interface';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { createAction, props } from '@ngrx/store';

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

export const fetchReasonsForAbandoning = createAction('[API/reference-data] Fetch reasons for abandoning');
