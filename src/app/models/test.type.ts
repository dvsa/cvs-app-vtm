import { Defect } from '@app/models/defect';

export interface TestType {
  prohibitionIssued: boolean;
  testCode: string;
  testNumber: string;
  lastUpdatedAt: Date;
  additionalCommentsForAbandon: string;
  numberOfSeatbeltsFitted: number;
  testTypeEndTimestamp: Date;
  reasonForAbandoning: string;
  lastSeatbeltInstallationCheckDate: string;
  createdAt: Date;
  testTypeId: string;
  testTypeStartTimestamp: Date;
  certificateNumber: string;
  testTypeName: string;
  seatbeltInstallationCheckDate: boolean;
  additionalNotesRecorded: string;
  defects: Defect[];
  name: string;
  certificateLink: string;
  testResult: string;
}
