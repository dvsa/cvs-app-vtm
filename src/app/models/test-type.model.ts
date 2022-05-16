import * as Emissions from './emissions.enum';
import { TestStationType } from './test-station-type.enum';

export interface TestType {
  testNumber: string;

  testCode: string;
  testTypeName: string;

  testTypeStartTimestamp: string | Date;
  testTypeEndTimestamp: string | Date;
  testExpiryDate: string | Date;

  certificateNumber: string;
  reasonForAbandoning: string;
  additionalCommentsForAbandon?: string;
  testAnniversaryDate: string | Date;
  prohibitionIssued: boolean;

  testResult: string;

  seatbeltInstallationCheckDate: boolean;
  numberOfSeatbeltsFitted: number;
  lastSeatbeltInstallationCheckDate: Date | null;
  emissionStandard: Emissions.EmissionStandard;
  smokeTestKLimitApplied: string;
  fuelType: Emissions.FuelType;
  modType: Emissions.ModType;
  modificationTypeUsed: string;
  particulateTrapFitted: string;
  particulateTrapSerialNumber: string;

  testStationName: string;
  testStationPNumber: string;
  testStationType:TestStationType;
  testerName: string;
  testerEmailAddress: string;

  additionalNotesRecorded: string;


}
