export enum AdrBodyType {
  ARTIC_TRACTOR = 'Artic tractor',

  RIGID_BOX_BODY = 'Rigid box body',

  RIGID_SHEETED_LOAD = 'Rigid sheeted load',

  RIGID_TANK = 'Rigid tank',

  RIGID_SKELETAL = 'Rigid skeletal',

  RIGID_BATTERY = 'Rigid battery',

  FULL_DRAWBAR_BOX_BODY = 'Full drawbar box body',

  FULL_DRAWBAR_SHEETED_LOAD = 'Full drawbar sheeted load',

  FULL_DRAWBAR_TANK = 'Full drawbar tank',

  FULL_DRAWBAR_SKELETAL = 'Full drawbar skeletal',

  FULL_DRAWBAR_BATTERY = 'Full drawbar battery',

  CENTRE_AXLE_BOX_BODY = 'Centre axle box body',

  CENTRE_AXLE_SHEETED_LOAD = 'Centre axle sheeted load',

  CENTRE_AXLE_TANK = 'Centre axle tank',

  CENTRE_AXLE_SKELETAL = 'Centre axle skeletal',

  CENTRE_AXLE_BATTERY = 'Centre axle battery',

  SEMI_TRAILER_BOX_BODY = 'Semi trailer box body',

  SEMI_TRAILER_SHEETED_LOAD = 'Semi trailer sheeted load',

  SEMI_TRAILER_TANK = 'Semi trailer tank',

  SEMI_TRAILER_SKELETAL = 'Semi trailer skeletal',

  SEMI_TRAILER_BATTERY = 'Semi trailer battery',
}

export enum AdrDangerousGood {
  FP = 'FP <61 (FL)',

  AT = 'AT',

  HYDROGEN_PEROXIDE = 'Class 5.1 Hydrogen Peroxide (OX)',

  MEMU = 'MEMU',

  CARBON_DISULPHIDE = 'Carbon Disulphide',

  HYDROGEN = 'Hydrogen',

  EXPLOSIVES_TYPE2 = 'Explosives (type 2)',

  EXPLOSIVES_TYPE3 = 'Explosives (type 3)',
}

export enum AdrAdditionalNotesNumber {
  One = '1',

  OneA = '1A',

  Two = '2',

  Three = '3',

  V1B = 'V1B',

  T1B = 'T1B',
}
