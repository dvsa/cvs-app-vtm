import { mockCountriesOfRegistration } from '@mocks/reference-data/mock-countries-of-registration.reference-data';
import { ReferenceDataResourceType } from '@models/reference-data.model';

export const testCases = [
  {
    resourceType: ReferenceDataResourceType.CountryOfRegistration,
    resourceKey: mockCountriesOfRegistration[0].resourceKey,
    payload: mockCountriesOfRegistration
  }
];
