import { getByVIN, getByVINSuccess, getByVINFailure } from './technical-record-service.actions';

describe('Technical record actions', () => {
  it('should have correct types', () => {
    expect(getByVIN.type).toBe('[Technical Record Service] GetByVIN');
    expect(getByVINSuccess.type).toBe('[Technical Record Service] GetByVIN Success');
    expect(getByVINFailure.type).toBe('[Technical Record Service] GetByVIN Failure');
  });
});
