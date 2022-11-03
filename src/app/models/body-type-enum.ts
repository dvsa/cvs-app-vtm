// The types and codes need to be lowercase for the API.

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

export const bodyTypeMap = new Map<BodyTypeDescription, BodyTypeCode>([
  [BodyTypeDescription.ARTICULATED,           BodyTypeCode.A],
  [BodyTypeDescription.BOX,                   BodyTypeCode.K],
  [BodyTypeDescription.DOUBLE_DECKER,         BodyTypeCode.D],
  [BodyTypeDescription.FLAT,                  BodyTypeCode.T],
  [BodyTypeDescription.OTHER,                 BodyTypeCode.O],
  [BodyTypeDescription.PETROL_OR_OIL_TANKER,  BodyTypeCode.M],
  [BodyTypeDescription.REFUSE,                BodyTypeCode.B],
  [BodyTypeDescription.REFRIGERATED,          BodyTypeCode.R],
  [BodyTypeDescription.SINGLE_DECKER,         BodyTypeCode.S],
  [BodyTypeDescription.SKELETAL,              BodyTypeCode.X],
  [BodyTypeDescription.SKIP_LOADER,           BodyTypeCode.F],
  [BodyTypeDescription.TIPPER,                BodyTypeCode.P],
]);
