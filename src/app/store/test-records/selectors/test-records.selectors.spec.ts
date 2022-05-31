import { Params } from '@angular/router';
import { TestResultModel } from '@models/test-result.model';
import { mockTestResult, mockTestResultArchived } from '../../../../mocks/mock-test-result';
import { initialTestResultsState, TestResultsState } from '../reducers/test-records.reducer';
import { selectedTestResultState, testResultLoadingState, selectDefectData, selectedTestSortedAmendmentHistory } from './test-records.selectors';

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
});
