import { TestResultModel } from '@models/test-results/test-result.model';
import { mockTestResultList } from '../../../../mocks/mock-test-result';
import {
  fetchSelectedTestResult,
  fetchSelectedTestResultFailed,
  fetchSelectedTestResultSuccess,
  fetchTestResults,
  fetchTestResultsBySystemNumber,
  fetchTestResultsBySystemNumberFailed,
  fetchTestResultsBySystemNumberSuccess,
  fetchTestResultsSuccess,
  updateTestResult,
  updateTestResultFailed,
  updateTestResultSuccess
} from '../actions/test-records.actions';
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

  describe('fetchTestResults', () => {
    it('should set loading to true', () => {
      const oldState: TestResultsState = { ...initialTestResultsState, loading: false };
      const action = fetchTestResults();
      const state = testResultsReducer(oldState, action);

      expect(state.loading).toBe(true);
      expect(state).not.toBe(oldState);
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

  describe('fetchTestResultsBySystemNumber actions', () => {
    it('should set loading to true', () => {
      const newState: TestResultsState = { ...initialTestResultsState, loading: true };
      const action = fetchTestResultsBySystemNumber({ systemNumber: 'TestResultId0001' });
      const state = testResultsReducer(initialTestResultsState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });

    describe('fetchTestResultsBySystemNumberSuccess', () => {
      it('should set all test result records', () => {
        const testResults = mockTestResultList();
        const newState: TestResultsState = {
          ...initialTestResultsState,
          ids: ['TestResultId0001'],
          entities: { ['TestResultId0001']: testResults[0] }
        };
        const action = fetchTestResultsBySystemNumberSuccess({ payload: testResults });
        const state = testResultsReducer(initialTestResultsState, action);

        expect(state).toEqual(newState);
        expect(state).not.toBe(newState);
      });
    });

    describe('fetchTestResultsBySystemNumberFailed', () => {
      it('should set error state', () => {
        const newState = { ...initialTestResultsState, loading: false };
        const action = fetchTestResultsBySystemNumberFailed({ error: 'unit testing error message' });
        const state = testResultsReducer({ ...initialTestResultsState, loading: true }, action);

        expect(state).toEqual(newState);
        expect(state).not.toBe(newState);
      });
    });
  });

  describe('fetchSelectedTestResult actions', () => {
    it('should set loading to true', () => {
      const newState: TestResultsState = { ...initialTestResultsState, loading: true };
      const action = fetchSelectedTestResult();
      const state = testResultsReducer(initialTestResultsState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });

    describe('fetchSelectedTestResultSuccess', () => {
      it('should set all test result records', () => {
        const testResults = mockTestResultList();
        const updatedTestResult = { ...testResults[0], odometerReading: 99999 };

        const newState: TestResultsState = {
          ...initialTestResultsState,
          ids: [updatedTestResult.testResultId],
          entities: { [updatedTestResult.testResultId]: updatedTestResult }
        };
        const action = fetchSelectedTestResultSuccess({ payload: updatedTestResult });
        const state = testResultsReducer(initialTestResultsState, action);

        expect(state).toEqual(newState);
        expect(state).not.toBe(newState);
      });
    });

    describe('fetchSelectedTestResultFailed', () => {
      it('should set error state', () => {
        const newState = { ...initialTestResultsState, loading: false };
        const action = fetchSelectedTestResultFailed({ error: 'unit testing error message' });
        const state = testResultsReducer({ ...initialTestResultsState, loading: true }, action);

        expect(state).toEqual(newState);
        expect(state).not.toBe(newState);
      });
    });
  });

  describe('updateTestResult actions', () => {
    it('should set loading to true', () => {
      const state: TestResultsState = { ...initialTestResultsState, loading: true };
      const action = updateTestResult({ value: {} as TestResultModel });
      const newState = testResultsReducer(initialTestResultsState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });

    describe('updateTestResultSuccess', () => {
      it('should set loading to false', () => {
        const state: TestResultsState = { ...initialTestResultsState, loading: false };
        const action = updateTestResultSuccess({ payload: { id: '', changes: {} as TestResultModel } });
        const newState = testResultsReducer({ ...initialTestResultsState, loading: true }, action);

        expect(state).toEqual(newState);
        expect(state).not.toBe(newState);
      });
    });

    describe('updateTestResultFailed', () => {
      it('should set loading to false', () => {
        const state: TestResultsState = { ...initialTestResultsState, loading: false };
        const action = updateTestResultFailed({ errors: [] });
        const newState = testResultsReducer({ ...initialTestResultsState, loading: true }, action);

        expect(state).toEqual(newState);
        expect(state).not.toBe(newState);
      });
    });
  });
});
