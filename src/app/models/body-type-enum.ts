// The types and codes need to be lowercase for the API.

import { MultiOptions } from '@forms/models/options.model';

export enum BodyTypeDescription {
  ARTICULATED = 'articulated',
  BOX = 'box',
  DOUBLE_DECKER = 'double decker',
  FLAT = 'flat',
  OTHER = 'other',
  PETROL_OR_OIL_TANKER = 'petrol/oil tanker',
  REFUSE = 'refuse',
  REFRIGERATED = 'refrigerated',
  SINGLE_DECKER = 'single decker',
  SKELETAL = 'skeletal',
  SKIP_LOADER = 'skip loader',
  TIPPER = 'tipper',
}

export function getBodyTypesAsOptions(): MultiOptions {
  return Object
    .entries(BodyTypeDescription)
    .map(([, value]) => ({ value, label: value }));
}

export enum BodyTypeCode {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
  F = 'f',
  K = 'k',
  M = 'm',
  O = 'o',
  P = 'p',
  R = 'r',
  S = 's',
  T = 't',
  X = 'x'
}

export function getCode(bodyType: BodyTypeDescription): BodyTypeCode {
  switch (bodyType) {
    case BodyTypeDescription.ARTICULATED:
      return BodyTypeCode.A;
    case BodyTypeDescription.BOX:
      return BodyTypeCode.K;
    case BodyTypeDescription.DOUBLE_DECKER:
      return BodyTypeCode.D;
    case BodyTypeDescription.FLAT:
      return BodyTypeCode.T;
    case BodyTypeDescription.OTHER:
      return BodyTypeCode.O;
    case BodyTypeDescription.PETROL_OR_OIL_TANKER:
      return BodyTypeCode.M;
    case BodyTypeDescription.REFUSE:
      return BodyTypeCode.B;
    case BodyTypeDescription.REFRIGERATED:
      return BodyTypeCode.R;
    case BodyTypeDescription.SINGLE_DECKER:
      return BodyTypeCode.S;
    case BodyTypeDescription.SKELETAL:
      return BodyTypeCode.X;
    case BodyTypeDescription.SKIP_LOADER:
      return BodyTypeCode.F;
    case BodyTypeDescription.TIPPER:
      return BodyTypeCode.P;
  }
}
