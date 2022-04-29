import { TestResultModel } from '@models/test-result.model';
import { TestType } from '@models/test-type.model';
import { createMock, createMockList } from 'ts-auto-mock';

const mockTestTypeList = (numberOfItems: number = 1) =>
  createMockList<TestType>(numberOfItems, (i: number) => {
    const now = new Date();
    const nextYear = new Date().setFullYear(now.getFullYear());

    return createMock<TestType>({
      testNumber: `TestNumber${String(i + 1).padStart(4, '0')}`,

      testCode: `Test${i}`,
      testTypeName: `Test Type Name ${i}`,

      testTypeStartTimestamp: now.toISOString(),
      testTypeEndTimestamp: now.setFullYear(now.getFullYear() + 1),
      testExpiryDate: nextYear,

      certificateNumber: `CertNumber${String(i + 1).padStart(4, '0')}`,
      reasonForAbandoning: ['The vehicle was not submitted for test at the appointed time', 'The relevant test fee has not been paid'],
      additionalCommentsForAbandon: 'The vehicle was not submitted for test at the appointed time',
      testAnniversaryDate: now.setFullYear(now.getFullYear() - 1),
      prohibitionIssued: false
    });
  });

export const mockTestResult = (i: number = 0) =>
  createMock<TestResultModel>({
    testResultId: `TestResultId${String(i + 1).padStart(4, '0')}`,

    systemNumber: 'SYS0001',
    vin: 'XMGDE02FS0H012345',
    vrm: 'KP02 ABC',

    createdAt: new Date().toISOString(),
    testStartTimestamp: new Date().toISOString(),
    testResult: 'Pass',

    testTypes: [...mockTestTypeList()],

    reasonForCreation: 'mock test result data'
  });

export const mockTestResultList = (items: number = 1) => createMockList<TestResultModel>(items, (i) => mockTestResult(i));
