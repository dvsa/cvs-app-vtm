import { ReferenceDataResourceType } from '@models/reference-data.model';

export interface ReferenceDataItem {
  resourceType: ReferenceDataResourceType;
  resourceKey: string;
}

export interface ReferenceDataList extends Array<ReferenceDataItem> {}
