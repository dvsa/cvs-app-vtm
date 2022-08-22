import { fetchDefect, fetchDefectFailed, fetchDefects, fetchDefectsFailed, fetchDefectsSuccess, fetchDefectSuccess } from './defects.actions';

describe('Defects Actions', () => {
  it('should return correct types', () => {
    expect(fetchDefects.type).toBe('[API/defects] Fetch Defects');
    expect(fetchDefectsSuccess.type).toBe('[API/defects] Fetch Defects Success');
    expect(fetchDefectsFailed.type).toBe('[API/defects] Fetch Defects Failed');
    expect(fetchDefect.type).toBe('[API/defects] Fetch Defect by ID');
    expect(fetchDefectSuccess.type).toBe('[API/defects] Fetch Defect by ID Success');
    expect(fetchDefectFailed.type).toBe('[API/defects] Fetch Defect by ID Failed');
  });
});
