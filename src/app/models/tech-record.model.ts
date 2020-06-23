import { AdrDetails } from '@app/models/adr-details';
import { BodyType } from './body-type';

export interface DDA {
  certificateIssued: boolean;
  wheelchairCapacity: number;
  wheelchairFittings: number;
  wheelchairLiftPresent: string;
  wheelchairLiftInformation: string;
  wheelchairRampPresent: boolean;
  wheelchairRampInformation: string;
  minEmergencyExits: string;
  outswing: string;
  ddaSchedules: string;
  seatbeltsFitted: string;
  ddaNotes: string;
}
export interface Applicant extends AddressInformation {
  name: string;
}

export interface Microfilm {
  microfilmDocumentType: string;
  microfilmRollNumber: string;
  microfilmSerialNumber: string;
}

export interface Plate {
  plateSerialNumber: string;
  plateIssueDate: string;
  plateReasonForIssue: string;
  plateIssuer: string;
  toEmailAddress: string;
}

export interface AuthIntoService {
  cocIssueDate: string;
  dateReceived: string;
  datePending: string;
  dateAuthorised: string;
  dateRejected: string;
}

export interface AxleSpacing {
  axles: string;
  value: number;
}

export interface Dimensions {
  length: number;
  height: number;
  width: number;
  axleSpacing: AxleSpacing[];
}

export interface Brakes {
  brakeCodeOriginal: string;
  brakeCode: string;
  dataTrBrakeOne: string;
  dataTrBrakeTwo: string;
  dataTrBrakeThree: string;
  retarderBrakeOne: string;
  retarderBrakeTwo: string;
  dtpNumber: string;
  brakeForceWheelsNotLocked: BrakeForceWheelsNotLocked;
  brakeForceWheelsUpToHalfLocked: BrakeForceWheelsUpToHalfLocked;
  loadSensingValve: boolean;
  antilockBrakingSystem: boolean;
}

export interface BrakeForceWheelsNotLocked {
  serviceBrakeForceA: number;
  secondaryBrakeForceA: number;
  parkingBrakeForceA: number;
}

export interface BrakeForceWheelsUpToHalfLocked {
  serviceBrakeForceB: number;
  secondaryBrakeForceB: number;
  parkingBrakeForceB: number;
}

export interface Weights {
  kerbWeight: number;
  ladenWeight: number;
  gbWeight: number;
  eecWeight: number;
  designWeight: number;
}

export interface Tyres {
  tyreSize: string;
  plyRating: string;
  fitmentCode: string;
  dataTrAxles: number;
  speedCategorySymbol: string;
  tyreCode: number;
}

export interface AxleBrakes {
  brakeActuator: number;
  leverLength: number;
  springBrakeParking: boolean;
}

export interface Axle {
  axleNumber: number;
  parkingBrakeMrk: boolean;
  weights: Weights;
  tyres: Tyres;
  brakes: AxleBrakes;
}

export interface AddressInformation {
  address1: string;
  address2: string;
  postTown: string;
  address3: string;
  postCode: string;
  emailAddress: string;
  telephoneNumber: string;
}

export interface PurchaserDetails extends AddressInformation {
  name: string;
  faxNumber: string;
  purchaserNotes: string;
}

export interface ManufacturerDetails extends AddressInformation {
  name: string;
  faxNumber: string;
  manufacturerNotes: string;
}

export interface LettersOfAuth {
  letterType: string;
  letterDateRequested: string;
  letterContents: string;
}

export interface TechRecord {
  createdAt: string;
  lastUpdatedAt: string;
  recordCompleteness: string;
  make: string;
  model: string;
  functionCode: string;
  fuelPropulsionSystem: string;
  offRoad: boolean;
  numberOfWheelsDriven: number;
  euVehicleCategory: string;
  emissionsLimit: number;
  departmentalVehicleMarker: boolean;
  alterationMarker: boolean;
  approvalType: string;
  approvalTypeNumber: string;
  variantNumber: string;
  variantVersionNumber: string;
  grossEecWeight: number;
  trainEecWeight: number;
  maxTrainEecWeight: number;
  applicantDetails: Applicant;
  microfilm: Microfilm;
  plates: Plate[];
  chassisMake: string;
  chassisModel: string;
  bodyMake: string;
  bodyModel: string;
  bodyType: BodyType;
  modelLiteral?: string;
  manufactureYear: number;
  regnDate: string;
  firstUseDate: string;
  coifDate: string;
  ntaNumber: string;
  coifSerialNumber: string;
  coifCertifierName: string;
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
  trainGbWeight: number;
  trainDesignWeight: number;
  maxTrainGbWeight: number;
  maxTrainDesignWeight: number;
  maxLoadOnCoupling: number;
  tyreUseCode: string;
  roadFriendly: boolean;
  drawbarCouplingFitted: boolean;
  euroStandard: string;
  suspensionType: string;
  couplingType: string;
  dimensions: Dimensions;
  frontAxleTo5thWheelMin: number;
  frontAxleTo5thWheelMax: number;
  frontAxleTo5thWheelCouplingMin: number;
  frontAxleTo5thWheelCouplingMax: number;
  frontAxleToRearAxle: number;
  rearAxleToRearTrl: number;
  couplingCenterToRearAxleMin: number;
  couplingCenterToRearAxleMax: number;
  couplingCenterToRearTrlMin: number;
  couplingCenterToRearTrlMax: number;
  centreOfRearmostAxleToRearOfTrl: number;
  notes: string;
  noOfAxles: number;
  brakeCode: string;
  adrDetails?: AdrDetails;
  createdByName: string;
  createdById: string;
  lastUpdatedByName: string;
  lastUpdatedById: string;
  updateType: string;
  vehicleClass: BodyType;
  vehicleSubclass: string[];
  vehicleType: string;
  vehicleSize: string;
  numberOfSeatbelts: string;
  seatbeltInstallationApprovalDate: string;
  vehicleConfiguration: string;
  brakes: Brakes;
  axles: Axle[];
  purchaserDetails: PurchaserDetails;
  manufacturerDetails: ManufacturerDetails;
  authIntoService: AuthIntoService;
  lettersOfAuth: LettersOfAuth;
  frameDescription: string;
  dda: DDA;
}
