// The types and codes need to be lowercase for the API.

import { VehicleTypes } from './vehicle-tech-record.model';

export enum BodyTypeDescription {
  ARTIC = 'artic',
  ARTICULATED = 'articulated',
  BOX = 'box',
  CAR_TRANSPORTER = 'car transporter',
  CONCRETE_MIXER = 'concrete mixer',
  CURTAINSIDER = 'curtainsider',
  DOUBLE_DECKER = 'double decker',
  FLAT = 'flat',
  LIVESTOCK_CARRIER = 'livestock carrier',
  LOW_LOADER = 'low loader',
  MINI_BUS = 'mini bus',
  OTHER = 'other',
  PETROL_OR_OIL_TANKER = 'petrol/oil tanker',
  REFUSE = 'refuse',
  REFRIGERATED = 'refrigerated',
  SINGLE_DECKER = 'single decker',
  SKELETAL = 'skeletal',
  SKIP_LOADER = 'skip loader',
  TIPPER = 'tipper',
  TRACTOR = 'tractor'
}

export enum BodyTypeCode {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
  E = 'e',
  F = 'f',
  I = 'i',
  K = 'k',
  L = 'l',
  M = 'm',
  O = 'o',
  P = 'p',
  R = 'r',
  S = 's',
  T = 't',
  U = 'u',
  X = 'x',
  Y = 'y'
}

export const bodyTypeMap = new Map<BodyTypeDescription, BodyTypeCode>([
  [BodyTypeDescription.ARTIC, BodyTypeCode.U],
  [BodyTypeDescription.ARTICULATED, BodyTypeCode.A],
  [BodyTypeDescription.BOX, BodyTypeCode.K],
  [BodyTypeDescription.CAR_TRANSPORTER, BodyTypeCode.Y],
  [BodyTypeDescription.CONCRETE_MIXER, BodyTypeCode.M],
  [BodyTypeDescription.CURTAINSIDER, BodyTypeCode.E],
  [BodyTypeDescription.DOUBLE_DECKER, BodyTypeCode.D],
  [BodyTypeDescription.FLAT, BodyTypeCode.T],
  [BodyTypeDescription.LIVESTOCK_CARRIER, BodyTypeCode.I],
  [BodyTypeDescription.LOW_LOADER, BodyTypeCode.L],
  [BodyTypeDescription.MINI_BUS, BodyTypeCode.M],
  [BodyTypeDescription.OTHER, BodyTypeCode.O],
  [BodyTypeDescription.PETROL_OR_OIL_TANKER, BodyTypeCode.M],
  [BodyTypeDescription.REFUSE, BodyTypeCode.B],
  [BodyTypeDescription.REFRIGERATED, BodyTypeCode.R],
  [BodyTypeDescription.SINGLE_DECKER, BodyTypeCode.S],
  [BodyTypeDescription.SKELETAL, BodyTypeCode.X],
  [BodyTypeDescription.SKIP_LOADER, BodyTypeCode.F],
  [BodyTypeDescription.TIPPER, BodyTypeCode.P],
  [BodyTypeDescription.TRACTOR, BodyTypeCode.A]
]);

const commonBodyTypeCodeMap = new Map<BodyTypeCode, BodyTypeDescription>([
  [BodyTypeCode.K, BodyTypeDescription.BOX],
  [BodyTypeCode.D, BodyTypeDescription.DOUBLE_DECKER],
  [BodyTypeCode.T, BodyTypeDescription.FLAT],
  [BodyTypeCode.O, BodyTypeDescription.OTHER],
  [BodyTypeCode.B, BodyTypeDescription.REFUSE],
  [BodyTypeCode.R, BodyTypeDescription.REFRIGERATED],
  [BodyTypeCode.S, BodyTypeDescription.SINGLE_DECKER],
  [BodyTypeCode.X, BodyTypeDescription.SKELETAL],
  [BodyTypeCode.F, BodyTypeDescription.SKIP_LOADER],
  [BodyTypeCode.P, BodyTypeDescription.TIPPER]
]);

const psvBodyTypeCodeMap = new Map<BodyTypeCode, BodyTypeDescription>([
  ...commonBodyTypeCodeMap.entries(),
  [BodyTypeCode.A, BodyTypeDescription.ARTICULATED],
  [BodyTypeCode.M, BodyTypeDescription.MINI_BUS]
]);

const hgvBodyTypeCodeMap = new Map<BodyTypeCode, BodyTypeDescription>([
  ...commonBodyTypeCodeMap.entries(),
  [BodyTypeCode.U, BodyTypeDescription.ARTIC],
  [BodyTypeCode.Y, BodyTypeDescription.CAR_TRANSPORTER],
  [BodyTypeCode.M, BodyTypeDescription.CONCRETE_MIXER],
  [BodyTypeCode.E, BodyTypeDescription.CURTAINSIDER],
  [BodyTypeCode.I, BodyTypeDescription.LIVESTOCK_CARRIER],
  [BodyTypeCode.A, BodyTypeDescription.TRACTOR]
]);

const trlBodyTypeCodeMap = new Map<BodyTypeCode, BodyTypeDescription>([
  ...commonBodyTypeCodeMap.entries(),
  [BodyTypeCode.A, BodyTypeDescription.ARTICULATED],
  [BodyTypeCode.Y, BodyTypeDescription.CAR_TRANSPORTER],
  [BodyTypeCode.E, BodyTypeDescription.CURTAINSIDER],
  [BodyTypeCode.L, BodyTypeDescription.LIVESTOCK_CARRIER],
  [BodyTypeCode.L, BodyTypeDescription.LOW_LOADER],
  [BodyTypeCode.M, BodyTypeDescription.PETROL_OR_OIL_TANKER]
]);

export const vehicleBodyTypeCodeMap = new Map<VehicleTypes, Map<BodyTypeCode, BodyTypeDescription>>([
  [VehicleTypes.PSV, psvBodyTypeCodeMap],
  [VehicleTypes.HGV, hgvBodyTypeCodeMap],
  [VehicleTypes.TRL, trlBodyTypeCodeMap]
]);
