import { GlobalError } from '@core/components/global-error/global-error.interface';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { createAction, props } from '@ngrx/store';

const prefix = '[API/reference-data]';

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
export const fetchReferenceDataFailed = createAction(
	'[API/reference-data] Fetch all of ResourceType Failed',
	props<featureError>()
);

export const fetchReferenceDataAudit = createAction(
	'[API/reference-data] Fetch all of Audit ResourceType',
	props<{ resourceType: ReferenceDataResourceType; paginationToken?: string }>()
);
export const fetchReferenceDataAuditSuccess = createAction(
	'[API/reference-data] Fetch all of Audit ResourceType Success',
	props<{ resourceType: ReferenceDataResourceType; payload: Array<ReferenceDataModelBase>; paginated: boolean }>()
);
export const fetchReferenceDataAuditFailed = createAction(
	'[API/reference-data] Fetch all of Audit ResourceType Failed',
	props<featureError>()
);

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
export const fetchReferenceDataByKeyFailed = createAction(
	'[API/reference-data] Fetch ResourceType by Key Failed',
	props<featureError>()
);

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

export const createReferenceDataItem = createAction(
	`${prefix} createReferenceDataItem`,
	props<{
		resourceType: ReferenceDataResourceType;
		resourceKey: string;
		payload: ReferenceDataModelBase;
	}>()
);
export const createReferenceDataItemSuccess = createAction(
	`${prefix} createReferenceDataItemSuccess`,
	props<{ result: ReferenceDataModelBase }>()
);
export const createReferenceDataItemFailure = createAction(
	`${prefix} createReferenceDataItemFailure`,
	props<GlobalError>()
);

export const amendReferenceDataItem = createAction(
	`${prefix} amendReferenceDataItem`,
	props<{
		resourceType: ReferenceDataResourceType;
		resourceKey: string;
		payload: ReferenceDataModelBase;
	}>()
);
export const amendReferenceDataItemSuccess = createAction(
	`${prefix} amendReferenceDataItemSuccess`,
	props<{ result: ReferenceDataModelBase }>()
);
export const amendReferenceDataItemFailure = createAction(
	`${prefix} amendReferenceDataItemFailure`,
	props<GlobalError>()
);

export const deleteReferenceDataItem = createAction(
	`${prefix} deleteReferenceDataItem`,
	props<{
		resourceType: ReferenceDataResourceType;
		resourceKey: string;
		reason: string;
	}>()
);
export const deleteReferenceDataItemSuccess = createAction(
	`${prefix} deleteReferenceDataItemSuccess`,
	props<{
		resourceType: ReferenceDataResourceType;
		resourceKey: string;
	}>()
);
export const deleteReferenceDataItemFailure = createAction(
	`${prefix} deleteReferenceDataItemFailure`,
	props<GlobalError>()
);
