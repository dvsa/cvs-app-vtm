import { getByVin, getByVinSuccess, getByVinFailure, getByPartialVinSuccess, getByPartialVinFailure, getByPartialVin, getByVrm, getByVrmSuccess, getByVrmFailure, getByTrailerId, getByTrailerIdSuccess, getByTrailerIdFailure } from './technical-record-service.actions';

const SUCCESS = ' Success';
const FAILURE = ' Failure';

describe('Technical record actions', () => {
  it('should have correct types', () => {
    expect(getByVin.type).toBe(getMessage('getByVin'));
    expect(getByVinSuccess.type).toBe(getMessage('getByVin', SUCCESS));
    expect(getByVinFailure.type).toBe(getMessage('getByVin', FAILURE));

    expect(getByPartialVin.type).toBe(getMessage('getByPartialVin'));
    expect(getByPartialVinSuccess.type).toBe(getMessage('getByPartialVin', SUCCESS));
    expect(getByPartialVinFailure.type).toBe(getMessage('getByPartialVin', FAILURE));

    expect(getByVrm.type).toBe(getMessage('getByVrm'));
    expect(getByVrmSuccess.type).toBe(getMessage('getByVrm', SUCCESS));
    expect(getByVrmFailure.type).toBe(getMessage('getByVrm', FAILURE));

    expect(getByTrailerId.type).toBe(getMessage('getByTrailerId'));
    expect(getByTrailerIdSuccess.type).toBe(getMessage('getByTrailerId', SUCCESS));
    expect(getByTrailerIdFailure.type).toBe(getMessage('getByTrailerId', FAILURE));
  });
});

function getMessage(title: string, suffix: string = '') {
  return `[Technical Record Service] ${title}${suffix}`;
}
