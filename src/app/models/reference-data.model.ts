import { VehicleTypes } from './vehicle-tech-record.model';

export enum ReferenceDataResourceType {
  CountryOfRegistration = 'COUNTRY_OF_REGISTRATION',
  User = 'USER',
  ReasonsForAbandoning = 'REASONS_FOR_ABANDONING',
  TIRReasonsForAbandoning = 'TIR_REASONS_FOR_ABANDONING',
  SpecialistReasonsForAbandoning = 'SPECIALIST_REASONS_FOR_ABANDONING'
}

export interface ReferenceDataModelBase {
  resourceType: ReferenceDataResourceType;
  resourceKey: string;
  description: string;
}

export interface CountryOfRegistration extends ReferenceDataModelBase {}
export interface ReasonsForAbandoning extends ReferenceDataModelBase {
  vehicleType: VehicleTypes;
}

export interface User extends ReferenceDataModelBase {
  name: string;
  email: string;
}
