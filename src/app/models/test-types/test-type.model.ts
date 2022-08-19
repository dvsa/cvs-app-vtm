import { TestResultDefects } from '@models/test-results/test-result-defects.model';
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
  defects?: TestResultDefects;
  customDefects: customDefects[];

  additionalNotesRecorded: string;
}

export interface customDefects {
  referenceNumber: string;
  defectName: string;
  defectNotes: string;
}
