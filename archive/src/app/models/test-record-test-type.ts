import { TestType } from '@app/models/test.type';
import { TestResultModel } from '@app/models/test-result.model';

export interface TestRecordTestType {
  testType: TestType;
  testRecord: TestResultModel;
}
