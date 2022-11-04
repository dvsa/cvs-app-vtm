import { ReferenceDataResourceType, ReferenceDataTyre } from '@models/reference-data.model';

export const mockTyres: ReferenceDataTyre[] = [
  {
    resourceType: ReferenceDataResourceType.Tyres,
    resourceKey: '101',
    description: 'Tyre 101',
    code: '101',
    loadIndexSingleLoad: '128',
    tyreSize: '235/75-17.5',
    dateTimeStamp: '03-APR-14',
    userId: '1234',
    loadIndexTwinLoad: '124',
    plyRating: '12'
  },
  {
    resourceType: ReferenceDataResourceType.Tyres,
    resourceKey: '102',
    description: 'Tyre 102',
    code: '102',
    loadIndexSingleLoad: '130',
    tyreSize: '335/75-18',
    dateTimeStamp: '03-APR-14',
    userId: '1234',
    loadIndexTwinLoad: '132',
    plyRating: '32'
  },
  {
    resourceType: ReferenceDataResourceType.Tyres,
    resourceKey: '103',
    description: 'Tyre 103',
    code: '103',
    loadIndexSingleLoad: '82',
    tyreSize: '135/75-16',
    dateTimeStamp: '03-APR-14',
    userId: '1234',
    loadIndexTwinLoad: '88',
    plyRating: '56'
  }
];
