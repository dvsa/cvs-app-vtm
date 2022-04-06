import { mockTestResult, mockTestResultList } from '../../../../mocks/mock-test-result';
import { fetchTestResultBySystemIdSuccess, fetchTestResultsSuccess } from '../actions/test-results.actions';
import { initialTestResultsState, testResultsReducer, TestResultsState } from './test-results.reducer';

describe('Test Results Reducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = {
        type: 'Unknown'
      };
      const state = testResultsReducer(initialTestResultsState, action);

      expect(state).toBe(initialTestResultsState);
    });
  });

  describe('fetchTestResultsSuccess', () => {
    it('should set all test result records', () => {
      const testResults = mockTestResultList(3);
      const newState: TestResultsState = {
        ids: ['SYS0001', 'SYS0002', 'SYS0003'],
        entities: { SYS0001: testResults[0], SYS0002: testResults[1], SYS0003: testResults[2] }
      };
      const action = fetchTestResultsSuccess({ payload: [...testResults] });
      const state = testResultsReducer(initialTestResultsState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('fetchTestResultBySystemIdSuccess', () => {
    it('should upsert one test result record', () => {
      const testResult = mockTestResult();
      const newState: TestResultsState = { ids: ['SYS0001'], entities: { SYS0001: testResult } };
      const action = fetchTestResultBySystemIdSuccess({ payload: testResult });
      const state = testResultsReducer(initialTestResultsState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });
});
