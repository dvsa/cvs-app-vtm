import { mockTestResultList } from '../../../../mocks/mock-test-result';
import { fetchTestResultsBySystemIdFailed, fetchTestResultsBySystemIdSuccess, fetchTestResultsSuccess } from '../actions/test-records.actions';
import { initialTestResultsState, testResultsReducer, TestResultsState } from './test-records.reducer';

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
        ...initialTestResultsState,
        ids: ['TestResultId0001', 'TestResultId0002', 'TestResultId0003'],
        entities: { TestResultId0001: testResults[0], TestResultId0002: testResults[1], TestResultId0003: testResults[2] }
      };
      const action = fetchTestResultsSuccess({ payload: [...testResults] });
      const state = testResultsReducer(initialTestResultsState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('fetchTestResultsBySystemId actions', () => {
    describe('fetchTestResultsBySystemIdSuccess', () => {
      it('should set all test result records', () => {
        const testResults = mockTestResultList();
        const newState: TestResultsState = { ...initialTestResultsState, ids: ['TestResultId0001'], entities: { ['TestResultId0001']: testResults[0] } };
        const action = fetchTestResultsBySystemIdSuccess({ payload: testResults });
        const state = testResultsReducer(initialTestResultsState, action);

        expect(state).toEqual(newState);
        expect(state).not.toBe(newState);
      });
    });

    describe('fetchTestResultsBySystemIdFailed', () => {
      it('should set error state', () => {
        const error = 'fetching test records failed';
        const newState = { ...initialTestResultsState, error };
        const action = fetchTestResultsBySystemIdFailed({ error });
        const state = testResultsReducer(initialTestResultsState, action);

        expect(state).toEqual(newState);
        expect(state).not.toBe(newState);
      });
    });
  });
});
