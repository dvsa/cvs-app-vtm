import { TestType } from './test-type.model';

export interface TestResultModel {
  testResultId: string;

  systemNumber: string;
  vin: string;
  vrm?: string; // Mandatory for PSV and HGV, not applicable to TRL

  createdAt?: string;
  testStartTimestamp: string | Date;
  testStatus: string;

  testTypes: TestType[];

  reasonForCreation?: string;
}
