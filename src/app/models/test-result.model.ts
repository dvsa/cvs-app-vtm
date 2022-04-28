import { CountryOfRegistration } from './country-of-registration.enum';
import { EuVehicleCategory } from './eu-vehicle-category.enum';
import { TestType } from './test-type.model';
import { OdometerReadingUnits } from './odometer-unit.enum';

export interface TestResultModel {
  testResultId: string;

  systemNumber: string;
  vin: string;
  vrm?: string; // Mandatory for PSV and HGV, not applicable to TRL

  createdAt?: string;
  testStartTimestamp: string | Date;
  testResult: string;

  testTypes: TestType[];

  trailerId: string;
  countryOfRegistration: CountryOfRegistration;
  euVehicleCategory: EuVehicleCategory;
  odometerReading: number;
  odometerReadingUnits: OdometerReadingUnits;
  preparerName: string;
  preparerId: string;

  reasonForCreation?: string;
}
