import { TestResultModel } from '@app/models/test-result.model';
import { TestType } from '@app/models/test.type';

export const TESTING_TEST_MODELS_UTILS = {
  mockTestRecord,
  mockTestType
};

function mockTestRecord(args?: Partial<TestResultModel>): TestResultModel {
  const mock: TestResultModel = {
    reasonForCreation: '',
    testResultId: '123',
    vehicleType: 'hgv',
    systemNumber: '123',
    testTypes: [this.mockTestType()]
  } as TestResultModel;

  return { ...mock, ...args };
}

function mockTestType(args?: Partial<TestType>): TestType {
  const mock: TestType = {
    testTypeId: '44',
    seatbeltInstallationCheckDate: true
  } as TestType;

  return { ...mock, ...args };
}

