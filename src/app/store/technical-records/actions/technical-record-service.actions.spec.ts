import { getByVIN, getByVINSuccess, getByVINFailure, getByPartialVINSuccess, getByPartialVINFailure, getByPartialVIN } from './technical-record-service.actions';

describe('Technical record actions', () => {
  it('should have correct types', () => {
    expect(getByVIN.type).toBe('[Technical Record Service] GetByVIN');
    expect(getByVINSuccess.type).toBe('[Technical Record Service] GetByVIN Success');
    expect(getByVINFailure.type).toBe('[Technical Record Service] GetByVIN Failure');
    expect(getByPartialVIN.type).toBe('[Technical Record Service] GetByPartialVIN');
    expect(getByPartialVINSuccess.type).toBe('[Technical Record Service] GetByPartialVIN Success');
    expect(getByPartialVINFailure.type).toBe('[Technical Record Service] GetByPartialVIN Failure');
  });
});
