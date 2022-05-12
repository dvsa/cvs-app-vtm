import * as Emissions from './emissions.enum';

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
  modType: {
    code: Emissions.ModTypeCode;
    description: Emissions.ModeTypeDescription;
  } | null;
  modificationTypeUsed: string;
  particulateTrapFitted: string;
  particulateTrapSerialNumber: string;
}
