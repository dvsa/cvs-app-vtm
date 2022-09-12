import { TestResultDefects } from '@models/test-results/test-result-defects.model';
import * as Emissions from './emissions.enum';

export interface TestType {
  testTypeId: string;
  testNumber: string;
  name: string;
  testCode: string;
  testTypeName: string;

  testTypeStartTimestamp: string | Date;
  testTypeEndTimestamp: string | Date;
  testExpiryDate: string | Date;

  certificateNumber: string;
  reasonForAbandoning: string | null;
  additionalCommentsForAbandon?: string | null;
  testAnniversaryDate: string | Date;
  prohibitionIssued: boolean | null;

  testResult: resultOfTestEnum;

  seatbeltInstallationCheckDate: boolean;
  numberOfSeatbeltsFitted: number;
  lastSeatbeltInstallationCheckDate: string | Date | null;
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
  certificateLink?: string | null;
  deletionFlag?: boolean;
  secondaryCertificateNumber?: string | null;
}

export interface customDefects {
  referenceNumber: string;
  defectName: string;
  defectNotes: string;
}

export enum resultOfTestEnum {
  fail = 'fail',
  prs = 'prs',
  pass = 'pass',
  abandoned = 'abandoned'
}
