import { Params } from '@angular/router';
import { TestResultModel } from '@models/test-result.model';
import { mockTestResult, mockTestResultArchived } from '../../../../mocks/mock-test-result';
import { initialTestResultsState, TestResultsState } from '../reducers/test-records.reducer';
import { selectAmendedDefectData, selectDefectData, selectedAmendedTestResultState, selectedTestResultState, selectedTestSortedAmendementHistory, testResultLoadingState } from './test-records.selectors';

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

  describe('selectSortedTestAmendementHistory', () => {
    let mock: TestResultModel;
    let sorted: TestResultModel[];
    beforeEach(() => {
      mock = mockTestResult();
      sorted = [];
      sorted[0] = mock.testHistory![1];
      sorted[1] = mock.testHistory![3];
      sorted[2] = mock.testHistory![2];
      sorted[3] = mock.testHistory![0];
      sorted[4] = mock.testHistory![4];
    });
    it('should sort the ', () => {
      const sortedTestHistory = selectedTestSortedAmendementHistory.projector(mock);
      expect(sortedTestHistory).toEqual(sorted);
    });
  });

  describe(selectedAmendedTestResultState.name, () => {
    it('should return selected archived test record', () => {
      const archivedTestResultId = 'oldTestResult';
      const testResult: TestResultModel = { ...mockTestResult(), testHistory: [{ ...mockTestResultArchived(), testResultId: archivedTestResultId }] };
      const archivedTestResultState = selectedAmendedTestResultState.projector(testResult, { archivedTestResultId: archivedTestResultId });
      expect(archivedTestResultState?.testResultId).toBe(archivedTestResultId);
    });
  });

  describe(selectAmendedDefectData.name, () => {
    const state: TestResultModel = mockTestResultArchived();

    it('should return defect data for the first testType in selected test result', () => {
      const defectState = selectAmendedDefectData.projector(state);
      expect(defectState?.length).toBe(1);
      expect(defectState).toEqual(state.testTypes[0].defects);
    });

    it('should return an ampty array if there are no defects', () => {
      const noDefectState = { ...state, testTypes: [{ ...state.testTypes[0], defects: undefined }] };
      const defectState = selectAmendedDefectData.projector(noDefectState);
      expect(defectState?.length).toBe(0);
    });
  });
});
