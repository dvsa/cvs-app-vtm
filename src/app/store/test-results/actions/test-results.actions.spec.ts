import { fetchTestResultBySystemId, fetchTestResultBySystemIdFailed, fetchTestResultBySystemIdSuccess, fetchTestResults, fetchTestResultsFailed, fetchTestResultsSuccess } from './test-results.actions';

describe('Test Result Actions', () => {
  it('should return correct types', () => {
    expect(fetchTestResults.type).toBe('[API/test-results] Fetch All');
    expect(fetchTestResultsSuccess.type).toBe('[API/test-results] Fetch All Success');
    expect(fetchTestResultsFailed.type).toBe('[API/test-results] Fetch All Failed');
    expect(fetchTestResultBySystemId.type).toBe('[API/test-results] Fetch One');
    expect(fetchTestResultBySystemIdSuccess.type).toBe('[API/test-results] Fetch One Success');
    expect(fetchTestResultBySystemIdFailed.type).toBe('[API/test-results] Fetch One Failed');
  });
});
