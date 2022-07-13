import { EuVehicleCategory } from './eu-vehicle-category.enum';
import { OdometerReadingUnits } from './odometer-unit.enum';
import { TestStationType } from './test-station-type.enum';
import { TestType } from './test-type.model';

export interface TestResultModel {
  testResultId: string;

  systemNumber: string;
  vin: string;
  vrm?: string; // Mandatory for PSV and HGV, not applicable to TRL

  createdAt?: string;
  testStartTimestamp: string | Date;

  testTypes: TestType[];

  trailerId: string;
  countryOfRegistration: string;
  euVehicleCategory: EuVehicleCategory;
  odometerReading: number;
  odometerReadingUnits: OdometerReadingUnits;
  preparerName: string;
  preparerId: string;

  testStationName: string;
  testStationPNumber: string;
  testStationType: TestStationType;
  testerName: string;
  testerEmailAddress: string;

  reasonForCreation?: string;
  vehicleType?: string;
  testHistory?: TestResultModel[];
  testStatus?: string;

  createdByName?: string;
  testVersion?: string | null;
  testCode?: string;
}
