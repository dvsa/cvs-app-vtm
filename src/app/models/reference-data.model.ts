export enum ReferenceDataResourceType {
  CountryOfRegistration = 'COUNTRY_OF_REGISTRATION'
  // EuCategory = 'EU_CATEGORY'
}

export interface ReferenceDataModelBase {
  resourceType: ReferenceDataResourceType;
  resourceKey: string;
  description: string;
}

export interface CountryOfRegistration extends ReferenceDataModelBase {}
