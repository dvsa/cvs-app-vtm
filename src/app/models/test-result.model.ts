export interface TestResultModel {
  vin: string;
  testResultId: string;
  systemNumber: string;
  vrm?: string; // Mandatory for PSV and HGV, not applicable to TRL
  createdAt?: string;
  testTypes: any[]; //TODO
  reasonForCreation?: string;
  testStartTimestamp: string | Date;
  testStatus: string;
}
