export interface DeleteItem {
	success?: boolean;
}

export type EmptyObject = {};

export type ResourceKey = string | number;

export interface ReferenceDataItem {
	resourceType: string;
	resourceKey: ResourceKey;
	reason?: string;
}

export interface ReferenceDataApiResponseWithoutPagination {
	data: Array<ReferenceDataItem>;
}

export interface ReferenceDataApiResponseWithPagination extends ReferenceDataApiResponseWithoutPagination {
	paginationToken: string;
}

export type ReferenceDataApiResponse =
	| ReferenceDataApiResponseWithoutPagination
	| ReferenceDataApiResponseWithPagination;

export type ReferenceDataItemApiResponse = ReferenceDataItem | EmptyObject;
