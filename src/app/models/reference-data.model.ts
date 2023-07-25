export enum ReferenceDataResourceType {
  Brakes = 'BRAKES',
  CountryOfRegistration = 'COUNTRY_OF_REGISTRATION',
  HgvMake = 'HGV_MAKE',
  PsvMake = 'PSV_MAKE',
  ReasonsForAbandoningHgv = 'REASONS_FOR_ABANDONING_HGV',
  ReasonsForAbandoningTrl = 'REASONS_FOR_ABANDONING_TRL',
  ReasonsForAbandoningPsv = 'REASONS_FOR_ABANDONING_PSV',
  ReferenceDataAdminType = 'REFERENCE_DATA_ADMIN_TYPE',
  SpecialistReasonsForAbandoning = 'SPECIALIST_REASONS_FOR_ABANDONING',
  TirReasonsForAbandoning = 'TIR_REASONS_FOR_ABANDONING',
  TrlMake = 'TRL_MAKE',
  Tyres = 'TYRES',
  User = 'USER',
  TyreLoadIndex = 'TYRE_LOAD_INDEX'
}

type AuditTypes = `${keyof Record<ReferenceDataResourceType, string>}#AUDIT`;
export type ReferenceDataResourceTypeAudit = `${keyof Record<ReferenceDataResourceType, string>}` | AuditTypes;

export interface ReferenceDataAdminColumn {
  name: string;
  heading: string;
  order: number;
}

export interface ReferenceDataModelBase {
  resourceType: ReferenceDataResourceType;
  resourceKey: string | number;
  description?: string;
  createdAt?: string;
  createdName?: string;
  createdId?: string;
  reason?: string;
}

export interface HgvMake extends ReferenceDataModelBase {}

export interface PsvMake extends ReferenceDataModelBase {
  dtpNumber: string;
  psvChassisMake: string;
  psvChassisModel: string;
  psvBodyMake: string;
  psvBodyType: string;
}

export interface Trlmake extends ReferenceDataModelBase {}

export interface BodyModel extends ReferenceDataModelBase {
  bodyMake: string;
}

export interface CountryOfRegistration extends ReferenceDataModelBase {}

export interface Brake extends ReferenceDataModelBase {
  service: string;
  secondary: string;
  parking: string;
}

export interface ReferenceDataTyre extends ReferenceDataModelBase {
  code: string;
  loadIndexSingleLoad?: string;
  tyreSize: string;
  dateTimeStamp: string;
  userId: string;
  loadIndexTwinLoad?: string;
  plyRating: string;
  axleLoadSingle?: string;
  axleLoadDouble?: string;
}

export interface ReferenceDataTyreLoadIndex extends ReferenceDataModelBase {
  loadIndex: string;
}

export interface User extends ReferenceDataModelBase {
  name: string;
  email: string;
}

export interface ReferenceDataAdminType extends ReferenceDataModelBase {
  code?: string;
  dtpNumber?: string;
  loadIndexSingleLoad?: string;
  loadIndexTwinLoad?: string;
  parking?: string;
  plyRating?: string;
  psvBodyMake?: string;
  psvBodyType?: string;
  psvChassisMake?: string;
  psvChassisModel?: string;
  secondary?: string;
  service?: string;
  tyreSize?: string;
}
