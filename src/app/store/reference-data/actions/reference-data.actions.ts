import { GlobalError } from '@core/components/global-error/global-error.interface';
import { CountryOfRegistration, ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { createAction, props } from '@ngrx/store';

export const fetchReferenceData = createAction('[API/reference-data] Fetch all of ResourceType', props<{ resourceType: ReferenceDataResourceType }>());
export const fetchReferenceDataSuccess = createAction('[API/reference-data] Fetch all of ResourceType Success', props<{ resourceType: ReferenceDataResourceType; payload: Array<ReferenceDataModelBase | CountryOfRegistration> }>());
export const fetchReferenceDataFailed = createAction('[API/reference-data] Fetch all of ResourceType Failed', props<GlobalError>());

export const fetchReferenceDataByKey = createAction('[API/reference-data] Fetch ResourceType by Key', props<{ resourceType: ReferenceDataResourceType; resourceKey: string }>());
export const fetchReferenceDataByKeySuccess = createAction('[API/reference-data] Fetch ResourceType by Key Success', props<{ resourceType: ReferenceDataResourceType; resourceKey: string; payload: ReferenceDataModelBase | CountryOfRegistration }>());
export const fetchReferenceDataByKeyFailed = createAction('[API/reference-data] Fetch ResourceType by Key Failed', props<GlobalError>());
