import { VehicleTypes } from './vehicle-tech-record.model';

export enum ReferenceDataResourceType {
  BodyMake = 'BODY_MAKE',
  BodyModel = 'BODY_MODEL',
  Tyres = 'TYRES',
  CountryOfRegistration = 'COUNTRY_OF_REGISTRATION',
  ReasonsForAbandoning = 'REASONS_FOR_ABANDONING',
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

export interface TyresModel extends ReferenceDataModelBase {
  code: string;
  loadIndexSingleLoad: string;
  tyreSize: string;
  dateTimeStamp: string;
  userId: string;
  loadIndexTwinLoad: string;
  plyRating: string;
}
export interface CountryOfRegistration extends ReferenceDataModelBase {}
export interface ReasonsForAbandoning extends ReferenceDataModelBase {
  vehicleType: VehicleTypes;
}
export interface User extends ReferenceDataModelBase {
  name: string;
  email: string;
}
