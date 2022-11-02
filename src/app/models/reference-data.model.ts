import { VehicleTypes } from './vehicle-tech-record.model';

export enum ReferenceDataResourceType {
  BodyMake = 'BODY_MAKE',
  BodyModel = 'BODY_MODEL',
  Brake = 'BRAKE',
  CountryOfRegistration = 'COUNTRY_OF_REGISTRATION',
  ReasonsForAbandoning = 'REASONS_FOR_ABANDONING',
  TIRReasonsForAbandoning = 'TIR_REASONS_FOR_ABANDONING',
  SpecialistReasonsForAbandoning = 'SPECIALIST_REASONS_FOR_ABANDONING',
  User = 'USER'
}

export interface ReferenceDataModelBase {
  resourceType: ReferenceDataResourceType;
  resourceKey: string;
  description: string;
}

export interface BodyMake extends ReferenceDataModelBase {}

export interface BodyModel extends ReferenceDataModelBase {
  bodyMake: string;
}

export interface Brake extends ReferenceDataModelBase {
  service: string;
  secondary: string;
  parking: string;
}

export interface CountryOfRegistration extends ReferenceDataModelBase {}

export interface ReasonsForAbandoning extends ReferenceDataModelBase {
  vehicleType: VehicleTypes;
}

export interface User extends ReferenceDataModelBase {
  name: string;
  email: string;
}
