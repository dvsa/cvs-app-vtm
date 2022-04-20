import { TestResultModel } from '@models/test-result.model';
import { TestType } from '@models/test.type';
import { createMock, createMockList } from 'ts-auto-mock';

const mockTestTypeList = (numberOfItems: number = 1) =>
  createMockList<TestType>(numberOfItems, (i: number) => {
    return createMock<TestType>({ testCode: `Test${i}`, testTypeName: 'Test type name' });
  });

export const mockTestResult = (i: number = 0) =>
  createMock<TestResultModel>({
    systemNumber: `SYS${String(i + 1).padStart(4, '0')}`,
    reasonForCreation: 'mock test result data',
    testResultId: `TestResultId${String(i + 1).padStart(4, '0')}`,
    vin: 'XMGDE02FS0H012345',
    vrm: 'KP01 ABC',
    testStartTimestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    testTypes: [...mockTestTypeList()],
    testStatus: 'Pass'
  });

export const mockTestResultList = (items: number = 1) => createMockList<TestResultModel>(items, (i) => mockTestResult(i));
