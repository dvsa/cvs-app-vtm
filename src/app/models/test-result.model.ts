import { TestType } from '../models/test.type';
import { BodyType } from '@app/models/body-type';

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

