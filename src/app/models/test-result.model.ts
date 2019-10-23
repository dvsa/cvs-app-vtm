import {VehicleClass} from '@app/models/vehicle.class';
import {TestType} from '@app/models/test.type';

export interface TestResultModel {
  testerStaffId: string;
  testStartTimestamp: Date;
  odometerReadingUnits: string;
  testEndTimestamp: Date;
  testStatus: string;
  testTypes: TestType[];
  vehicleClass: VehicleClass;
  vin: string;
  vehicleSize: string;
  testStationName: string;
  vehicleId: string;
  noOfAxles: number;
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
  testerEmailAddress: string;
  euVehicleCategory: string;
}


