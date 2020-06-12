import { TestResultModel } from '@app/models/test-result.model';
import { TestType } from '@app/models/test.type';

export const TEST_MODEL_UTILS = {
  mockTestRecord,
  mockTestType
};

function mockTestRecord(args?: Partial<TestResultModel>): TestResultModel {
  const mock: TestResultModel = {
    reasonForCreation: '',
    testResultId: '123',
    vehicleType: 'hgv',
    systemNumber: '123',
    testTypes: [this.mockTestType()],
    testEndTimestamp: '2020-01-16T12:24:38.027Z',
    testStartTimestamp: '2020-01-16T10:24:38.027Z'
  } as TestResultModel;

  return { ...mock, ...args };
}

function mockTestType(args?: Partial<TestType>): TestType {
  const mock: TestType = {
    testTypeId: '1',
    seatbeltInstallationCheckDate: true,
    testTypeName: 'first test',
    testNumber: '123123',
    testTypeEndTimestamp: '2020-01-16T12:24:38.027Z',
    testExpiryDate: '2021-01-16T12:24:38.027Z',
    modType: {
      code: '1',
      description: 'test'
    }
  } as TestType;

  return { ...mock, ...args };
}
