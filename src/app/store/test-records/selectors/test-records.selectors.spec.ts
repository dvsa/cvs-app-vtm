import { Params } from '@angular/router';
import { TestResultDefect } from '@models/test-results/test-result-defect.model';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestType } from '@models/test-types/test-type.model';
import { createMock, createMockList } from 'ts-auto-mock';
import { mockTestResult } from '../../../../mocks/mock-test-result';
import { initialTestResultsState, TestResultsState } from '../reducers/test-records.reducer';
import {
  isTestTypeKeySame,
  selectAllTestResults,
  selectAmendedDefectData,
  selectDefectData,
  selectedAmendedTestResultState,
  selectedTestResultState,
  selectedTestSortedAmendmentHistory,
  selectTestResultIds,
  selectTestResultsEntities,
  selectTestResultsTotal,
  testResultLoadingState
} from './test-records.selectors';

describe('Test Results Selectors', () => {
  describe('adapter selectors', () => {
    it('should return correct state', () => {
      const state = { ...initialTestResultsState, ids: ['1'], entities: { ['1']: { preparerId: '2' } } };
      expect(selectTestResultIds.projector(state)).toEqual(['1']);
      expect(selectTestResultsEntities.projector(state)).toEqual({ ['1']: { preparerId: '2' } });
      expect(selectAllTestResults.projector(state)).toEqual([{ preparerId: '2' }]);
      expect(selectTestResultsTotal.projector(state)).toEqual(1);
    });
  });

  describe('selectedTestResultState', () => {
    it('should return the correct test result', () => {
      const state: TestResultsState = {
        ...initialTestResultsState,
        ids: ['testResult1'],
        entities: {
          testResult1: createMock<TestResultModel>({
            testResultId: 'testResult1',
            testTypes: [createMock<TestType>({ testNumber: '1' })]
          })
        }
      };

      const selectedState = selectedTestResultState.projector(state.entities, { testResultId: 'testResult1', testNumber: '1' } as Params);
      expect(selectedState).toEqual(state.entities['testResult1']);
    });
  });

  describe('testResultLoadingState', () => {
    it('should return loading state', () => {
      const state: TestResultsState = { ...initialTestResultsState, loading: true };
      const selectedState = testResultLoadingState.projector(state);
      expect(selectedState).toBeTruthy();
    });
  });

  describe('selectDefectData', () => {
    const state: TestResultModel = mockTestResult();

    it('should return defect data for the first testType in selected test result', () => {
      const defectState = selectDefectData.projector(state);
      expect(defectState?.length).toBe(1);
      expect(defectState).toEqual(state.testTypes[0].defects);
    });

    it('should return an empty array if there are no defects', () => {
      const noDefectState = { ...state, testTypes: [{ ...state.testTypes[0], defects: undefined }] };
      const defectState = selectDefectData.projector(noDefectState);
      expect(defectState?.length).toBe(0);
    });

    it('should return an empty array if there are no test types', () => {
      const noTestTypeState = { ...state, testTypes: undefined };
      const testTypeState = selectDefectData.projector(noTestTypeState);
      expect(testTypeState?.length).toBe(0);
    });

    it('should return an empty array if there are no test results', () => {
      const noTestResultState = undefined;
      const testResultState = selectDefectData.projector(noTestResultState);
      expect(testResultState?.length).toBe(0);
    });
  });

  describe('selectSortedTestAmendmentHistory', () => {
    let mock: TestResultModel;

    beforeEach(() => {
      const date = new Date('2022-01-02');
      mock = mockTestResult();
      mock.testHistory = mock.testHistory?.concat(...mock.testHistory);
      mock.testHistory![0].createdAt = undefined;
      mock.testHistory![1].createdAt = date.toISOString();
      mock.testHistory![2].createdAt = date.toISOString();
      mock.testHistory![3].createdAt = undefined;
      mock.testHistory![4].createdAt = new Date(date.setDate(date.getDate() - 1)).toISOString();
      mock.testHistory![5].createdAt = new Date(date.setDate(date.getDate() + 1)).toISOString();
      mock.testHistory![6].createdAt = new Date(date.setDate(date.getDate() - 1)).toISOString();
      mock.testHistory![7].createdAt = undefined;
      mock.testHistory![8].createdAt = date.toISOString();
      mock.testHistory![9].createdAt = date.toISOString();
    });

    it('should sort the test history', () => {
      // Adding entries with null created at at the end if they exist
      const sortedTestHistory = selectedTestSortedAmendmentHistory.projector(mock);
      let previous = new Date(sortedTestHistory![0].createdAt!).getTime();
      let notfound: TestResultModel[] = [];
      sortedTestHistory?.forEach(test => {
        if (test.createdAt) {
          expect(new Date(test.createdAt!).getTime()).toBeLessThanOrEqual(previous);
          previous = new Date(test.createdAt!).getTime();
        } else {
          notfound.push(test);
        }
      });
      if (notfound.length > 0) {
        expect(sortedTestHistory?.slice(-notfound.length)).toEqual(notfound);
      }
    });
  });

  describe('selectedAmendedTestResultState', () => {
    const testResult = createMock<TestResultModel>({
      testHistory: createMockList<TestResultModel>(2, i =>
        createMock<TestResultModel>({
          createdAt: `2020-01-01T00:0${i}:00.000Z`,
          testTypes: createMockList<TestType>(1, j => createMock<TestType>({ testTypeId: `${i}${j}`, testNumber: 'ABC00' }))
        })
      )
    });

    it('should return amended record that matches "createdAt" route param value', () => {
      const selectedState = selectedAmendedTestResultState.projector(testResult, { testNumber: 'ABC00', createdAt: '2020-01-01T00:00:00.000Z' });
      expect(selectedState).not.toBeUndefined();
      expect(testResult.testHistory![1].testTypes.length).toEqual(1);
    });

    it('should return return undefined when "createdAt" route param value does not match any amended records', () => {
      expect(selectedAmendedTestResultState.projector(testResult, { testTypeId: '00', createdAt: '2020-01-01T00:02:00.000Z' })).toBeUndefined();
    });

    it('should return return undefined when "testTypeId" route param value does not match any in amended test record', () => {
      expect(selectedAmendedTestResultState.projector(testResult, { testTypeId: '01', createdAt: '2020-01-01T00:02:00.000Z' })).toBeUndefined();
    });

    it('should return return undefined when there is no selected testResult', () => {
      expect(selectedAmendedTestResultState.projector(undefined, { createdAt: '2020-01-01T00:01:00.000Z' })).toBeUndefined();
    });

    it('should return return undefined when testHistory is empty', () => {
      expect(selectedAmendedTestResultState.projector({ ...testResult, testHistory: [] }, { createdAt: '2020-01-01T00:01:00.000Z' })).toBeUndefined();
    });
  });

  describe('selectAmendedDefectData', () => {
    const amendedTestResultState = createMock<TestResultModel>({
      testTypes: createMockList<TestType>(1, i =>
        createMock<TestType>({
          defects: createMockList<TestResultDefect>(1, i =>
            createMock<TestResultDefect>({
              imNumber: i
            })
          )
        })
      )
    });

    it('should return defect array from first testType in testResult', () => {
      const selectedState = selectAmendedDefectData.projector(amendedTestResultState);
      expect(selectedState?.length).toBe(1);
      expect(selectedState).toEqual(amendedTestResultState.testTypes[0].defects);
    });

    it('should return empty array if testResult is undefined', () => {
      expect(selectAmendedDefectData.projector(undefined)).toEqual([]);
    });

    it('should return empty array if testTypes is empty', () => {
      expect(selectAmendedDefectData.projector({ testTypes: [] })).toEqual([]);
    });
  });

  describe('isTestTypeKeySame', () => {
    it('should return false if the property is different', () => {
      const amendTestResult = {
        testTypes: [
          {
            testNumber: 'foo',
            testTypeId: '1'
          }
        ]
      } as TestResultModel;
      const oldTestResult = {
        testTypes: [
          {
            testNumber: 'foo',
            testTypeId: '2'
          }
        ]
      } as TestResultModel;
      const state = isTestTypeKeySame('testTypeId').projector(amendTestResult, oldTestResult);
      expect(state).toBe(false);
    });

    it('should return true if the property is the same', () => {
      const amendTestResult = {
        testTypes: [
          {
            testNumber: 'foo',
            testTypeId: '1'
          }
        ]
      } as TestResultModel;
      const oldTestResult = {
        testTypes: [
          {
            testNumber: 'foo',
            testTypeId: '1'
          }
        ]
      } as TestResultModel;
      const state = isTestTypeKeySame('testTypeId').projector(amendTestResult, oldTestResult);
      expect(state).toBe(true);
    });
  });
});
