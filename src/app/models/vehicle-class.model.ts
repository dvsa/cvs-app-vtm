export interface VehicleClass {
  code?: CodesEnum;
  description?: DescriptionsEnum;
}

export type CodesEnum = '2' | 'n' | 's' | '1' | 't' | 'l' | '3' | 'v' | '4' | '7' | '5';
export const CodeEnum = {
  _2: '2' as CodesEnum,
  N: 'n' as CodesEnum,
  S: 's' as CodesEnum,
  _1: '1' as CodesEnum,
  T: 't' as CodesEnum,
  L: 'l' as CodesEnum,
  _3: '3' as CodesEnum,
  V: 'v' as CodesEnum,
  _4: '4' as CodesEnum,
  _7: '7' as CodesEnum,
  _5: '5' as CodesEnum,
};
export type DescriptionsEnum =
  | 'motorbikes over 200cc or with a sidecar'
  | 'not applicable'
  | 'small psv (ie: less than or equal to 22 seats)'
  | 'motorbikes up to 200cc'
  | 'trailer'
  | 'large psv(ie: greater than 23 seats)'
  | '3 wheelers'
  | 'heavy goods vehicle'
  | 'MOT class 4'
  | 'MOT class 7'
  | 'MOT class 5';
export const DescriptionEnum = {
  MotorbikesOver200ccOrWithASidecar: 'motorbikes over 200cc or with a sidecar' as DescriptionsEnum,
  NotApplicable: 'not applicable' as DescriptionsEnum,
  SmallPsvIeLessThanOrEqualTo22Seats: 'small psv (ie: less than or equal to 22 seats)' as DescriptionsEnum,
  MotorbikesUpTo200cc: 'motorbikes up to 200cc' as DescriptionsEnum,
  Trailer: 'trailer' as DescriptionsEnum,
  LargePsvIeGreaterThan23Seats: 'large psv(ie: greater than 23 seats)' as DescriptionsEnum,
  _3Wheelers: '3 wheelers' as DescriptionsEnum,
  HeavyGoodsVehicle: 'heavy goods vehicle' as DescriptionsEnum,
  MOTClass4: 'MOT class 4' as DescriptionsEnum,
  MOTClass7: 'MOT class 7' as DescriptionsEnum,
  MOTClass5: 'MOT class 5' as DescriptionsEnum,
};
