export interface ReferenceDataItem {
  resourceType: string;
  resourceKey: string;
}

export interface ReferenceDataList extends Array<ReferenceDataItem> {}
