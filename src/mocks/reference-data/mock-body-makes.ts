import { BodyMake, ReferenceDataResourceType } from '@models/reference-data.model';

export const mockBodyMakes: BodyMake[] = [
  {
    resourceType: ReferenceDataResourceType.BodyMake,
    resourceKey: 'Audi',
    description: 'Audi'
  },
  {
    resourceType: ReferenceDataResourceType.BodyMake,
    resourceKey: 'BMW',
    description: 'BMW'
  },
  {
    resourceType: ReferenceDataResourceType.BodyMake,
    resourceKey: 'Toyota',
    description: 'Toyota'
  }
];
