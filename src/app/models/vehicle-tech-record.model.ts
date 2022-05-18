export interface VehicleTechRecordModel {
  vrms: Vrm[];
  vin: string;
  trailerId?: string;
  systemNumber: string;
  techRecord: TechRecordModel[];
}

export interface Vrm {
  vrm: string;
  isPrimary: boolean;
}

export enum StatusCodes {
  ARCHIVED = 'archived',
  CURRENT = 'current',
  PROVISIONAL = 'provisional'
}

export enum VehicleTypes {
  PSV = 'psv',
  HGV = 'hgv',
  TRL = 'trl'
}

export enum FuelTypes {
  DIESELPETROL = 'DieselPetrol',
  HYBRID = 'Hybrid',
  ELECTRIC = 'Electric',
  CNG = 'CNG',
  FUELCELL = 'Fuel cell',
  LNG = 'LNG',
  OTHER = 'Other'
}

export enum VehicleClassDescriptions {
  MOTORBIKE_OVER_200CC = 'motorbikes over 200cc or with a sidecar',
  NOT_APPLICABLE = 'not applicable',
  SMALL_PSV = 'small psv (ie: less than or equal to 22 seats)',
  MOTORBIKE_UPTO_200CC = 'motorbikes up to 200cc',
  TRAILER = 'trailer',
  LARGE_PSV = 'large psv(ie: greater than 23 seats)',
  THREE_WHEELER = '3 wheelers',
  HGV = 'heavy goods vehicle',
  MOT_CLASS_4 = 'MOT class 4',
  MOT_CLASS_5 = 'MOT class 5',
  MOT_CLASS_7 = 'MOT class 7'
}

export enum VehicleConfigurations {
  RIGID = 'rigid',
  ARTICULATED = 'articulated',
  CENTRE_AXLE_DRAWBAR = 'centre axle drawbar',
  SEMI_CAR_TRANSPORTER = 'semi-car transporter',
  SEMI_TRAILER = 'semi-trailer',
  LOW_LOADER = 'low loader',
  OTHER = 'other',
  DRAWBAR = 'drawbar',
  FOUR_IN_LINE = 'four-in-line',
  DOLLY = 'dolly',
  FULL_DRAWBAR = 'full drawbar'
}

export enum FrameDescriptions {
  CHANNEL_SECTION = 'Channel section',
  SPACE_FRAME = 'Space frame',
  I_SECTION = 'I section',
  TUBULAR = 'Tubular',
  FRAME_SECTION = 'Frame section',
  OTHER = 'Other',
  INTEGRAL = 'integral',
  BOX_SECTION = 'Box section',
  U_SECTION = 'U section'
}

export enum EuVehicleCategories {
  M1 = 'm1',
  M2 = 'm2',
  M3 = 'm3',
  n1 = 'n1',
  n2 = 'n2',
  n3 = 'n3',
  o1 = 'o1',
  o2 = 'o2',
  o3 = 'o3',
  o4 = 'o4',
  l1e_a = 'l1e-a',
  l1e = 'l1e',
  l2e = 'l2e',
  l3e = 'l3e',
  l4e = 'l4e',
  l5e = 'l5e',
  l6e = 'l6e',
  l7e = 'l7e'
}

export enum VehicleSizes {
  SMALL = 'small',
  LARGE = 'large'
}

export enum approvalType {
  NTA = 'NTA',
  ECTA = 'ECTA',
  IVA = 'IVA',
  NSSTA = 'NSSTA',
  ECSSTA = 'ECSSTA'
}

export interface Axle {
  axleNumber?: number;
  parkingBrakeMrk?: boolean;
}

export interface TechRecordModel {
  statusCode: StatusCodes;
  vehicleType: VehicleTypes;
  regnDate: string;
  firstUseDate?: string;
  manufactureYear: number;
  noOfAxles: number;
  axles: Axle[];
  suspensionType?: string;
  speedLimiterMrk?: boolean;
  tachoExemptMrk?: boolean;
  euroStandard?: string;
  roadFriendly?: boolean;
  fuelPropulsionSystem?: FuelTypes;
  drawbarCouplingFitted?: boolean;
  vehicleClass: {
    description: string;
  };
  vehicleConfiguration: VehicleConfigurations;
  couplingType?: string;
  maxLoadOnCoupling?: number;
  frameDescription?: FrameDescriptions;
  offRoad?: boolean;
  numberOfWheelsDriven?: number;
  euVehicleCategory: EuVehicleCategories;
  emissionsLimit?: number;
  seatsLowerDeck?: number;
  seatsUpperDeck?: number;
  standingCapacity?: number;
  vehicleSize?: VehicleSizes;
  numberOfSeatbelts?: string;
  seatbeltInstallationApprovalDate?: string;
  departmentalVehicleMarker: boolean;
  dimensions?: Dimensions;
  frontAxleToRearAxle?: number;
  approvalType?: approvalType;
  approvalTypeNumber?: string;
  ntaNumber?: string;
  coifSerialNumber?: string;
  coifCertifierName?: string;
  coifDate?: string | Date;
  variantNumber?: string;
  variantVersionNumber?: string;
  brakes: Brakes;
}

export interface Dimensions {
  height: number;
  length: number;
  width: number;
}

export interface Brakes {
  dtpNumber?: string;
  loadSensingValve?: string; //TODO: Check from here if these types are correct
  antilockBrakingSystem?: string;
  axleNumber?: string;
  axleBrakeProperties?: AxleBrakeProperties; //Check to here and including object
  brakeCode?: string;
  dataTrBrakeOne?: string;
  dataTrBrakeTwo?: string;
  dataTrBrakeThree?: string;
  retarderBrakeOne?: RetarderBrake;
  retarderBrakeTwo?: RetarderBrake;
  brakeForceWheelsNotLocked?: BrakeForceWheelsNotLocked;
  brakeForceWheelsUpToHalfLocked?: BrakeForceWheelsUpToHalfLocked;
}

export interface BrakeForceWheelsNotLocked {
  parkingBrakeForceA: number;
  secondaryBrakeForceA: number;
  serviceBrakeForceA: number;
}

export interface BrakeForceWheelsUpToHalfLocked {
  parkingBrakeForceB: number;
  secondaryBrakeForceB: number;
  serviceBrakeForceB: number;
}
export enum RetarderBrake {
  ELECTRIC = 'electric',
  EXHAUST = 'exhaust',
  FRICTION = 'friction',
  HYDRAULIC = 'hydraulic',
  OTHER = 'other',
  NONE = 'none'
}

export interface AxleBrakeProperties {
  brakeActuator: string;
  leverLength: string;
  springBrakeParking: string;
}
