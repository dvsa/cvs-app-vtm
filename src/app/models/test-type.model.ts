export interface TestType {
  testNumber: string;

  testCode: string;
  testTypeName: string;

  testTypeStartTimestamp: string | Date;
  testTypeEndTimestamp: string | Date;
  testExpiryDate: string | Date;

  certificateNumber: string;
  reasonForAbandoning: string[];
  additionalCommentsForAbandon?: string;
  testAnniversaryDate: string | Date;
  prohibitionIssued: boolean;

  testResult: string;
}
