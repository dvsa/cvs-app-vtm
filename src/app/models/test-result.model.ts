import { TestType } from './test.type';
import { BodyType } from './body-type';

/*
export interface TestResultModel {
  reasonForCreation: string;
  testResultId: string;
  testerStaffId: string;
  testStartTimestamp: string;
  odometerReadingUnits: string;
  testEndTimestamp: string;
  testStatus: string;
  numberOfWheelsDriven: number;
  testTypes: TestType[];
  vehicleClass: BodyType;
  vin: string;
  vehicleSize: string;
  testStationName: string;
  vehicleId: string;
  vehicleType: string;
  countryOfRegistration: string;
  preparerId: string;
  preparerName: string;
  odometerReading: number;
  vehicleConfiguration: string;
  testStationType: string;
  reasonForCancellation: string;
  testerName: string;
  vrm: string;
  testStationPNumber: string;
  numberOfSeats: number;
  noOfAxles: number;
  testerEmailAddress: string;
  euVehicleCategory: string;
  trailerId: string;
  testResult: string;
  systemNumber: string;
  regnDate: string;
  firstUseDate: string;
  deletionFlag: boolean;
  testExpiryDate: string;
  testVersion: string;
  createdByName: string;
  createdAt: string;
  lastUpdatedByName: string;
  lastUpdatedAt: string;
  testHistory: TestResultModel[];
  vehicleSubclass: string[];
}
*/

export interface TestResultModel {
  testResultId: string;
  systemNumber: string;
  testerStaffId: string;
  testStartTimestamp: string | Date;
  odometerReadingUnits: string;
  testEndTimestamp: string | Date;
  testStatus: string;
  testTypes: any[]; //TODO
  vehicleClass: BodyType;
  vehicleSubclass?: string[];
  vin: string;
  vehicleSize?: string; // Mandatory for PSV only & not applicable to HGV and TRL
  testStationName: string;
  vehicleId?: string; // Not sent from FE, calculated in the BE. When the test result is submitted, in BE, the VRM of the vehicle will be copied into  vehicleId also.
  vehicleType: string;
  countryOfRegistration: string;
  preparerId: string;
  preparerName: string;
  odometerReading: number;
  vehicleConfiguration: string;
  testStationType: string;
  reasonForCancellation: string | null;
  testerName: string;
  vrm?: string; // Mandatory for PSV and HGV, not applicable to TRL
  testStationPNumber: string;
  numberOfSeats?: number; // mandatory for PSV only, not applicable for HGV and TRL
  noOfAxles: number;
  numberOfWheelsDriven?: number;
  testerEmailAddress: string;
  euVehicleCategory: string;
  deletionFlag?: boolean | null; // Not sent from FE, calculated in the BE.
  regnDate?: string | Date; // Used only for PSV and HGV
  trailerId?: string; // Mandatory for TRL, not applicable to PSV and HGV
  firstUseDate?: string | Date; // Used only for TRL
  testVersion?: string;
  reasonForCreation?: string;
  createdByName?: string;
  createdById?: string;
  createdAt?: string;
  lastUpdatedByName?: string;
  lastUpdatedById?: string;
  lastUpdatedAt?: string;
  shouldEmailCertificate?: string;
  testHistory?: TestResultModel[];
}
