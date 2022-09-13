import { ReferenceDataResourceType, User } from '@models/reference-data.model';

export const mockUsers: User[] = [
  {
    resourceType: ReferenceDataResourceType.User,
    resourceKey: '1',
    description: 'Steve - steve@dvsa.co.uk',
    name: 'Steve',
    email: 'steve@dvsa.co.uk'
  },
  {
    resourceType: ReferenceDataResourceType.User,
    resourceKey: '2',
    description: 'Mike - mike@dvsa.co.uk',
    name: 'Mike',
    email: 'mike@dvsa.co.uk'
  }
];
