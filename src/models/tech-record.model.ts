export interface VehicleTechRecordModel {
  vrms: VrmModel[];
  vin: string;
  techRecord: TechRecordModel[];
}

export interface TechRecordModel {
  chassisMake: string;
  chassisModel: string;
  bodyMake: string;
  bodyModel: string;
  bodyType: BodyTypeModel;
  manufactureYear: number;
  regnDate: string;
  coifDate: string;
  ntaNumber: string;
  conversionRefNo: string;
  seatsLowerDeck: number;
  seatsUpperDeck: number;
  standingCapacity: number;
  speedRestriction: number;
  speedLimiterMrk: boolean;
  tachoExemptMrk: boolean;
  dispensations: string;
  remarks: string;
  reasonForCreation: string;
  statusCode: string;
  unladenWeight: number;
  grossKerbWeight: number;
  grossLadenWeight: number;
  grossGbWeight: number;
  grossDesignWeight: number;
  grossUnladenWeight: number;
  noOfAxles: number;
  brakeCode: string;
  vehicleClass: VehicleClassModel;
  vehicleType: string;
  vehicleSize: string;
  vehicleConfiguration: string;
  brakes: BrakeModel;
  axles: AxelsModel[];
}


export interface VrmModel {
  vrm: string;
  isPrimary: boolean;
}

export interface BrakeForceWheelModel {
  serviceBrakeForce: number;
  secondaryBrakeForce: number;
  parkingBrakeForce: number;
}

export interface BrakeModel {
  brakeCode: string;
  dataTrBrakeOne: string;
  dataTrBrakeTwo: string;
  dataTrBrakeThree: string;
  retarderBrakeOne: string;
  retarderBrakeTwo: string;
  brakeCodeOriginal: string;
  brakeForceWheelsNotLocked: BrakeForceWheelModel;
  brakeForceWheelsUpToHalfLocked: BrakeForceWheelModel;
}

export interface AxelsModel {
  parkingBrakeMrk: boolean;
  axleNumber: number
  weights: WeightsModel;
  tyres: TyresModel;
}

export interface WeightsModel {
  kerbWeight: number;
  ladenWeight: number;
  gbWeight: number;
  designWeight: number;
}

export interface TyresModel {
  tyreSize: string;
  plyRating: string;
  fitmentCode: string;
  dataTrPsvAxles: number;
  speedCategorySymbol: string;
  tyreCode: number;
}

export interface BodyTypeModel {
  code: string;
  description: string;
}

export interface VehicleClassModel {
  code: string;
  description: string;
}
