import { Params } from '@angular/router';
import { Defect } from '@models/defect';
import { TestResultModel } from '@models/test-result.model';
import { TestType } from '@models/test-type.model';
import { createMock, createMockList } from 'ts-auto-mock';
import { mockTestResult } from '../../../../mocks/mock-test-result';
import { initialTestResultsState, TestResultsState } from '../reducers/test-records.reducer';
import {
  selectAmendedDefectData,
  selectDefectData,
  selectedAmendedTestResultState,
  selectedTestResultState,
  selectedTestSortedAmendmentHistory,
  selectTestFromSelectedTestResult,
  testResultLoadingState
} from './test-records.selectors';

describe('Test Results Selectors', () => {
  describe('selectedTestResultState', () => {
    it('should return the correct test result', () => {
      const state: TestResultsState = { ...initialTestResultsState, ids: ['testResult1'], entities: { testResult1: mockTestResult() } };
      const selectedState = selectedTestResultState.projector(state.entities, { testResultId: 'testResult1' } as Params);
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

    it('should return an ampty array if there are no defects', () => {
      const noDefectState = { ...state, testTypes: [{ ...state.testTypes[0], defects: undefined }] };
      const defectState = selectDefectData.projector(noDefectState);
      expect(defectState?.length).toBe(0);
    });
  });

  describe('selectSortedTestAmendmentHistory', () => {
    let mock: TestResultModel;
    let sorted: TestResultModel[];
    beforeEach(() => {
      mock = mockTestResult();
    });
    it('should sort the test history', () => {
      // Adding entries with null created at at the end if they exist
      const sortedTestHistory = selectedTestSortedAmendmentHistory.projector(mock);
      let previous = new Date(sortedTestHistory![0].createdAt!).getTime();
      let notfound: TestResultModel[] = [];
      sortedTestHistory?.forEach((test) => {
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
      testHistory: createMockList<TestResultModel>(1, (i) => createMock<TestResultModel>({ createdAt: `2020-01-01T00:0${i}:00.000Z` }))
    });

    it('should return amended record that matches "createdAt" route param value', () => {
      expect(selectedAmendedTestResultState.projector(testResult, { createdAt: '2020-01-01T00:01:00.000Z' })).toEqual(testResult.testHistory![1]);
    });

    it('should return return undefined when "createdAt" route param value doesn not match any amended records', () => {
      expect(selectedAmendedTestResultState.projector(testResult, { createdAt: '2020-01-01T00:02:00.000Z' })).toBeUndefined();
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
      testTypes: createMockList<TestType>(1, (i) =>
        createMock<TestType>({
          defects: createMockList<Defect>(1, (i) =>
            createMock<Defect>({
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

  describe('selectTestFromSelectedTestResult', () => {
    const testResult = createMock<TestResultModel>({
      testTypes: createMockList<TestType>(3, (i) => createMock<TestType>({ testTypeId: `${i}` }))
    });

    it('should return test from selected test result', () => {
      expect(selectTestFromSelectedTestResult.projector(testResult, { testTypeId: '1' })).toEqual(testResult.testTypes[1]);
    });

    it('should return undefined when testResult is undefined', () => {
      expect(selectTestFromSelectedTestResult.projector(undefined, { testTypeId: '1' })).toBeUndefined();
    });

    it('should return undefined when testTypeId not found', () => {
      expect(selectTestFromSelectedTestResult.projector(testResult, { testTypeId: '3' })).toBeUndefined();
    });

    it('should return undefined when testTypes is undefined', () => {
      expect(selectTestFromSelectedTestResult.projector({ testTypes: undefined }, { testTypeId: '3' })).toBeUndefined();
    });
  });
});
