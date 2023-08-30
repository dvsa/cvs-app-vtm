import {
  fetchReferenceData,
  fetchReferenceDataSuccess,
  fetchReferenceDataFailed,
  fetchReferenceDataByKey,
  fetchReferenceDataByKeyFailed,
  fetchReferenceDataByKeySuccess,
  fetchReasonsForAbandoning,
  fetchReferenceDataByKeySearch,
  fetchReferenceDataByKeySearchFailed,
  fetchReferenceDataByKeySearchSuccess,
  fetchTyreReferenceDataByKeySearch,
  fetchTyreReferenceDataByKeySearchFailed,
  fetchTyreReferenceDataByKeySearchSuccess,
  addSearchInformation,
  fetchReferenceDataAudit,
  fetchReferenceDataAuditSuccess,
  fetchReferenceDataAuditFailed
} from './reference-data.actions';
describe('Test Result Actions', () => {
  it('should return correct types', () => {
    expect(fetchReferenceData.type).toBe('[API/reference-data] Fetch all of ResourceType');
    expect(fetchReferenceDataSuccess.type).toBe('[API/reference-data] Fetch all of ResourceType Success');
    expect(fetchReferenceDataFailed.type).toBe('[API/reference-data] Fetch all of ResourceType Failed');

    expect(fetchReferenceDataAudit.type).toBe('[API/reference-data] Fetch all of Audit ResourceType');
    expect(fetchReferenceDataAuditSuccess.type).toBe('[API/reference-data] Fetch all of Audit ResourceType Success');
    expect(fetchReferenceDataAuditFailed.type).toBe('[API/reference-data] Fetch all of Audit ResourceType Failed');

    expect(fetchReferenceDataByKey.type).toBe('[API/reference-data] Fetch ResourceType by Key');
    expect(fetchReferenceDataByKeySuccess.type).toBe('[API/reference-data] Fetch ResourceType by Key Success');
    expect(fetchReferenceDataByKeyFailed.type).toBe('[API/reference-data] Fetch ResourceType by Key Failed');
    expect(fetchReasonsForAbandoning.type).toBe('[API/reference-data] Fetch reasons for abandoning');

    expect(fetchReferenceDataByKeySearch.type).toBe('[API/reference-data] Fetch ResourceType by Key and Search');
    expect(fetchReferenceDataByKeySearchSuccess.type).toBe('[API/reference-data] Fetch ResourceType by Key and search Success');
    expect(fetchReferenceDataByKeySearchFailed.type).toBe('[API/reference-data] Fetch ResourceType by Key and search Failed');

    expect(fetchTyreReferenceDataByKeySearch.type).toBe('[API/reference-data] Fetch tyre by filter and term');
    expect(fetchTyreReferenceDataByKeySearchSuccess.type).toBe('[API/reference-data] Fetch tyre by filter and term Success');
    expect(fetchTyreReferenceDataByKeySearchFailed.type).toBe('[API/reference-data] Fetch tyre by filter and term Failed');

    expect(addSearchInformation.type).toBe('[API/reference-data] Add Search Information to state');
  });
});
