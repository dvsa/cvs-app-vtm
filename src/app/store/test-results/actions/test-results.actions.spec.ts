import { fetchTestResultsBySystemId, fetchTestResultsBySystemIdFailed, fetchTestResultsBySystemIdSuccess, fetchTestResults, fetchTestResultsFailed, fetchTestResultsSuccess } from './test-results.actions';

describe('Test Result Actions', () => {
  it('should return correct types', () => {
    expect(fetchTestResults.type).toBe('[API/test-results] Fetch All');
    expect(fetchTestResultsSuccess.type).toBe('[API/test-results] Fetch All Success');
    expect(fetchTestResultsFailed.type).toBe('[API/test-results] Fetch All Failed');
    expect(fetchTestResultsBySystemId.type).toBe('[API/test-results] Fetch All By systemId');
    expect(fetchTestResultsBySystemIdSuccess.type).toBe('[API/test-results] Fetch All By systemId Success');
    expect(fetchTestResultsBySystemIdFailed.type).toBe('[API/test-results] Fetch All By systemId Failed');
  });
});
