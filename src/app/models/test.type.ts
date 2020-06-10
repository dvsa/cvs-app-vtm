import { Defect } from '@app/models/defect';

export interface ModType {
  code: string;
  description: string;
}

export interface CustomDefect {
  referenceNumber: string;
  defectName: string;
  defectNotes: string;
}

export interface TestType {
  prohibitionIssued: boolean;
  testCode: string;
  testNumber: string;
  lastUpdatedAt: string;
  additionalCommentsForAbandon: string;
  numberOfSeatbeltsFitted: number;
  testTypeEndTimestamp: string;
  reasonForAbandoning: string;
  lastSeatbeltInstallationCheckDate: string;
  createdAt: string;
  testTypeId: string;
  testTypeStartTimestamp: string;
  certificateNumber: string;
  testTypeName: string;
  seatbeltInstallationCheckDate: boolean;
  additionalNotesRecorded: string;
  defects: Defect[];
  name: string;
  certificateLink: string;
  testResult: string;
  testExpiryDate: string;
  testAnniversaryDate: string;
  modType: ModType;
  emissionStandard: string;
  smokeTestKLimitApplied: string;
  fuelType: string;
  modificationTypeUsed: string;
  particulateTrapFitted: string;
  particulateTrapSerialNumber: string;
  secondaryCertificateNumber: string;
  customDefects: CustomDefect[];
}
