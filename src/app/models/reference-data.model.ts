export enum ReferenceDataResourceType {
  CountryOfRegistration = 'COUNTRY_OF_REGISTRATION',
  User = 'USER'
}

export interface ReferenceDataModelBase {
  resourceType: ReferenceDataResourceType;
  resourceKey: string;
  description: string;
}

export interface CountryOfRegistration extends ReferenceDataModelBase {}
export interface User extends ReferenceDataModelBase {
  name: string;
  email: string;
}
