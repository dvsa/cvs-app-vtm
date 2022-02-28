import { TestResultModel } from '@app/models/test-result.model';

export interface TestResultTestTypeNumber {
  testResultUpdated: TestResultModel;
  testTypeNumber: string;
  testResultsUpdated: TestResultModel[];
}
