import {
  archiveTechRecord,
  archiveTechRecordFailure,
  archiveTechRecordSuccess,
  changeVehicleType,
  createProvisionalTechRecord,
  createProvisionalTechRecordFailure,
  createProvisionalTechRecordSuccess,
  createVehicle,
  createVehicleRecord,
  createVehicleRecordFailure,
  createVehicleRecordSuccess,
  getByAll,
  getByAllFailure,
  getByAllSuccess,
  getByPartialVin,
  getByPartialVinFailure,
  getByPartialVinSuccess,
  getByTrailerId,
  getByTrailerIdFailure,
  getByTrailerIdSuccess,
  getByVin,
  getByVinFailure,
  getByVinSuccess,
  getByVrm,
  getByVrmFailure,
  getByVrmSuccess,
  getBySystemNumber,
  getBySystemNumberFailure,
  getBySystemNumberSuccess,
  updateEditingTechRecord,
  updateEditingTechRecordCancel,
  updateTechRecords,
  updateTechRecordsFailure,
  updateTechRecordsSuccess
} from './technical-record-service.actions';

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

    expect(getBySystemNumber.type).toBe(getMessage('getBySystemNumber'));
    expect(getBySystemNumberSuccess.type).toBe(getMessage('getBySystemNumber', SUCCESS));
    expect(getBySystemNumberFailure.type).toBe(getMessage('getBySystemNumber', FAILURE));

    expect(getByAll.type).toBe(getMessage('getByAll'));
    expect(getByAllSuccess.type).toBe(getMessage('getByAll', SUCCESS));
    expect(getByAllFailure.type).toBe(getMessage('getByAll', FAILURE));

    expect(createVehicleRecord.type).toBe(getMessage('createVehicleRecord'));
    expect(createVehicleRecordSuccess.type).toBe(getMessage('createVehicleRecord', SUCCESS));
    expect(createVehicleRecordFailure.type).toBe(getMessage('createVehicleRecord', FAILURE));

    expect(createProvisionalTechRecord.type).toBe(getMessage('createProvisionalTechRecord'));
    expect(createProvisionalTechRecordSuccess.type).toBe(getMessage('createProvisionalTechRecord', SUCCESS));
    expect(createProvisionalTechRecordFailure.type).toBe(getMessage('createProvisionalTechRecord', FAILURE));

    expect(updateTechRecords.type).toBe(getMessage('updateTechRecords'));
    expect(updateTechRecordsSuccess.type).toBe(getMessage('updateTechRecords', SUCCESS));
    expect(updateTechRecordsFailure.type).toBe(getMessage('updateTechRecords', FAILURE));

    expect(archiveTechRecord.type).toBe(getMessage('archiveTechRecord'));
    expect(archiveTechRecordSuccess.type).toBe(getMessage('archiveTechRecord', SUCCESS));
    expect(archiveTechRecordFailure.type).toBe(getMessage('archiveTechRecord', FAILURE));

    expect(updateEditingTechRecord.type).toBe(getMessage('updateEditingTechRecord'));

    expect(updateEditingTechRecordCancel.type).toBe(getMessage('updateEditingTechRecordCancel'));

    expect(changeVehicleType.type).toBe(getMessage('changeVehicleType'));

    expect(createVehicle.type).toBe(getMessage('createVehicle'));
  });
});

function getMessage(title: string, suffix: string = '') {
  return `[Technical Record Service] ${title}${suffix}`;
}
