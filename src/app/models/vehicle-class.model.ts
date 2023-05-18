export interface VehicleClass {
  code?: VehicleClass.CodeEnum;
  description?: VehicleClass.DescriptionEnum;
}
export namespace VehicleClass {
  export type CodeEnum = '2' | 'n' | 's' | '1' | 't' | 'l' | '3' | 'v' | '4' | '7' | '5';
  export const CodeEnum = {
    _2: '2' as CodeEnum,
    N: 'n' as CodeEnum,
    S: 's' as CodeEnum,
    _1: '1' as CodeEnum,
    T: 't' as CodeEnum,
    L: 'l' as CodeEnum,
    _3: '3' as CodeEnum,
    V: 'v' as CodeEnum,
    _4: '4' as CodeEnum,
    _7: '7' as CodeEnum,
    _5: '5' as CodeEnum
  };
  export type DescriptionEnum =
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
    MotorbikesOver200ccOrWithASidecar: 'motorbikes over 200cc or with a sidecar' as DescriptionEnum,
    NotApplicable: 'not applicable' as DescriptionEnum,
    SmallPsvIeLessThanOrEqualTo22Seats: 'small psv (ie: less than or equal to 22 seats)' as DescriptionEnum,
    MotorbikesUpTo200cc: 'motorbikes up to 200cc' as DescriptionEnum,
    Trailer: 'trailer' as DescriptionEnum,
    LargePsvIeGreaterThan23Seats: 'large psv(ie: greater than 23 seats)' as DescriptionEnum,
    _3Wheelers: '3 wheelers' as DescriptionEnum,
    HeavyGoodsVehicle: 'heavy goods vehicle' as DescriptionEnum,
    MOTClass4: 'MOT class 4' as DescriptionEnum,
    MOTClass7: 'MOT class 7' as DescriptionEnum,
    MOTClass5: 'MOT class 5' as DescriptionEnum
  };
}
