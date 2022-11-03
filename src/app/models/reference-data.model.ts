export enum ReferenceDataResourceType {
  BodyMake = 'BODY_MAKE',
  BodyModel = 'BODY_MODEL',
  Tyres = 'TYRES',
  CountryOfRegistration = 'COUNTRY_OF_REGISTRATION',
  ReasonsForAbandoningHgv = 'REASONS_FOR_ABANDONING_HGV',
  ReasonsForAbandoningTrl = 'REASONS_FOR_ABANDONING_TRL',
  ReasonsForAbandoningPsv = 'REASONS_FOR_ABANDONING_PSV',
  TIRReasonsForAbandoning = 'TIR_REASONS_FOR_ABANDONING',
  SpecialistReasonsForAbandoning = 'SPECIALIST_REASONS_FOR_ABANDONING',
  User = 'USER'
}

export interface ReferenceDataModelBase {
  resourceType: ReferenceDataResourceType;
  resourceKey: string;
  description?: string;
}

export interface BodyMake extends ReferenceDataModelBase {}
export interface BodyModel extends ReferenceDataModelBase {
  bodyMake: string;
}

export interface ReferenceDataTyre extends ReferenceDataModelBase {
  code: string;
  loadIndexSingleLoad: string;
  tyreSize: string;
  dateTimeStamp: string;
  userId: string;
  loadIndexTwinLoad: string;
  plyRating: string;
}
export interface CountryOfRegistration extends ReferenceDataModelBase {}

export interface User extends ReferenceDataModelBase {
  name: string;
  email: string;
}
