import { Params } from '@angular/router';
import { mockTestResult } from '../../../../mocks/mock-test-result';
import { initialTestResultsState, TestResultsState } from '../reducers/test-records.reducer';
import { selectedTestResultState, testResultLoadingState } from './test-records.selectors';

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
});
