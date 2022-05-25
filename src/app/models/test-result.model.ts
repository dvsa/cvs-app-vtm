import { CountryOfRegistration } from './country-of-registration.enum';
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
  countryOfRegistration: CountryOfRegistration;
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
  additionalNotesRecorded: string;

  reasonForCreation?: string;
  testHistory?: TestResultModel[];

  createdByName?: string;
  testVersion?: string | null;
}
