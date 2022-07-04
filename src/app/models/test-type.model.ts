import { Defect } from './defect';
import * as Emissions from './emissions.enum';

export interface TestType {
  testTypeId: string;
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
  defects?: Defect[];

  additionalNotesRecorded: string;
}
