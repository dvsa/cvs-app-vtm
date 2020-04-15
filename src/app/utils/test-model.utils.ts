import { TestResultModel } from '@app/models/test-result.model';
import { TestType } from '@app/models/test.type';
import { TestTypeCategory } from '@app/models/test-type-category';

export const TEST_MODEL_UTILS = {
  mockTestRecord,
  mockTestType,
  mockTestTypeCategory
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

function mockTestTypeCategory(args?: Partial<TestTypeCategory>): TestTypeCategory {
  const mock: TestTypeCategory = {
    id: '1',
    name: 'Annual test',
    linkedIds: ['38', '39'],
    testTypeName: 'Annual test',
    forVehicleType: ['psv'],
    forVehicleSize: ['small', 'large'],
    forVehicleConfiguration: ['articulated', 'rigid'],
    forVehicleAxles: null,
    forEuVehicleCategory: null,
    forVehicleClass: null,
    forVehicleSubclass: null,
    forVehicleWheels: null,
    testTypeClassification: 'Annual With Certificate'
  } as TestTypeCategory;

  return { ...mock, ...args };
}
