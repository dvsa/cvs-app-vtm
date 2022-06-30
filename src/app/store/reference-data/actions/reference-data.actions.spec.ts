import { fetchReferenceData, fetchReferenceDataSuccess, fetchReferenceDataFailed, fetchReferenceDataByKey, fetchReferenceDataByKeyFailed, fetchReferenceDataByKeySuccess } from './reference-data.actions';
describe('Test Result Actions', () => {
  it('should return correct types', () => {
    expect(fetchReferenceData.type).toBe('[API/reference-data] Fetch all of ResourceType');
    expect(fetchReferenceDataSuccess.type).toBe('[API/reference-data] Fetch all of ResourceType Success');
    expect(fetchReferenceDataFailed.type).toBe('[API/reference-data] Fetch all of ResourceType Failed');

    expect(fetchReferenceDataByKey.type).toBe('[API/reference-data] Fetch ResourceType by Key');
    expect(fetchReferenceDataByKeySuccess.type).toBe('[API/reference-data] Fetch ResourceType by Key Success');
    expect(fetchReferenceDataByKeyFailed.type).toBe('[API/reference-data] Fetch ResourceType by Key Failed');
  });
});
