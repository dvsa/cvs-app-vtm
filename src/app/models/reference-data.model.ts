import { VehicleTypes } from './vehicle-tech-record.model';

export enum ReferenceDataResourceType {
  BodyMake = 'BODY_MAKE',
  BodyModel = 'BODY_MODEL',
  CountryOfRegistration = 'COUNTRY_OF_REGISTRATION',
  PsvMake = 'PSV_MAKE',
  ReasonsForAbandoning = 'REASONS_FOR_ABANDONING',
  User = 'USER'
}

export interface ReferenceDataModelBase {
  resourceType: ReferenceDataResourceType;
  resourceKey: string;
  description: string;
}

export interface PsvMake extends ReferenceDataModelBase {
  dtpNumber: string;
  psvChassisMake: string;
  psvChassisModel: string;
  psvBodyMake: string;
  psvBodyType: string;
}

export interface BodyMake extends ReferenceDataModelBase {}

export interface BodyModel extends ReferenceDataModelBase {
  bodyMake: string;
}

export interface CountryOfRegistration extends ReferenceDataModelBase {}

export interface ReasonsForAbandoning extends ReferenceDataModelBase {
  vehicleType: VehicleTypes;
}

export interface User extends ReferenceDataModelBase {
  name: string;
  email: string;
}
