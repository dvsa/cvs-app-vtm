import { ReferenceDataResourceType } from '@models/reference-data.model';

export type ReferenceDataItem = {
  resourceType: ReferenceDataResourceType;
  resourceKey: string | number;
};

export type ReferenceDataList = Array<ReferenceDataItem>;

export type ReferenceDataApiResponse = {
  data: ReferenceDataList;
};
