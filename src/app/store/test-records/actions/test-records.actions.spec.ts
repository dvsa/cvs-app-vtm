import {
  fetchTestResultsBySystemNumber,
  fetchTestResultsBySystemNumberFailed,
  fetchTestResultsBySystemNumberSuccess,
  fetchTestResults,
  fetchTestResultsFailed,
  fetchTestResultsSuccess,
  fetchSelectedTestResult,
  fetchSelectedTestResultSuccess,
  fetchSelectedTestResultFailed
} from './test-records.actions';

describe('Test Result Actions', () => {
  it('should return correct types', () => {
    expect(fetchTestResults.type).toBe('[API/test-results] Fetch All');
    expect(fetchTestResultsSuccess.type).toBe('[API/test-results] Fetch All Success');
    expect(fetchTestResultsFailed.type).toBe('[API/test-results] Fetch All Failed');
    expect(fetchTestResultsBySystemNumber.type).toBe('[API/test-results] Fetch All By systemNumber');
    expect(fetchTestResultsBySystemNumberSuccess.type).toBe('[API/test-results] Fetch All By systemNumber Success');
    expect(fetchTestResultsBySystemNumberFailed.type).toBe('[API/test-results] Fetch All By systemNumber Failed');
    expect(fetchSelectedTestResult.type).toBe('[API/test-results], Fetch by ID');
    expect(fetchSelectedTestResultSuccess.type).toBe('[API/test-results], Fetch by ID Success');
    expect(fetchSelectedTestResultFailed.type).toBe('[API/test-results], Fetch by ID Failed');
  });
});
