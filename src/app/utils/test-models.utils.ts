import { TestResultModel } from '../models/test-result.model';
import { TestType } from '@app/models/test.type';

/**
 * *******************SOME GROUND RULES*************************************
 *
 *
 * We use this util file essentially for unit testing to enable a clean mock object provision
 * for our unit testing. Ideally more simplified object should/can be added.
 * Amendments of returned object should be done less often or not at ALL. We use
 * partial<T> object implementation hence the required object update(s) should be
 * passed in from the specific unit test of interest.
 *
 */

export const TEST_MODEL_UTILS = {
    mockTestResult
  };


function mockTestResult(args?: Partial<TestResultModel>): TestResultModel {
    const mock: TestResultModel = {
      testEndTimestamp: '2020-01-16T12:24:38.027Z',
      testStartTimestamp: '2020-01-16T10:24:38.027Z',
      testTypes: [mockTestType()]
    } as TestResultModel;
    return { ...mock, ...args };
  }

  function mockTestType(args?: Partial<TestType>): TestType {
    const mock: TestType = {
      testTypeName: 'first test',
      testNumber: '123123',
      testTypeEndTimestamp: '2020-01-16T12:24:38.027Z',
      testExpiryDate: '2021-01-16T12:24:38.027Z'
    } as TestType;
    return { ...mock, ...args };
  }
