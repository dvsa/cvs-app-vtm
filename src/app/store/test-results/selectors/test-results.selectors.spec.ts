import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';
import { mockTestResult } from '../../../../mocks/mock-test-result';
import { TestResultsState } from '../reducers/test-results.reducer';
import { selectedTestResultState } from './test-results.selectors';

describe('Test Results Selectors', () => {
  describe('selectedTestResultState', () => {
    it('should return the correct test result', () => {
      const state: TestResultsState = { ids: ['testResult1'], entities: { testResult1: mockTestResult() } };
      const selectedState = selectedTestResultState.projector(state.entities, { systemId: 'testResult1' } as Params);
      expect(selectedState).toEqual(state.entities['testResult1']);
    });
  });
});
