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
    expect(getBySystemNumber.type).toBe(getMessage('getBySystemNumber'));
    expect(getBySystemNumberSuccess.type).toBe(getMessage('getBySystemNumber', SUCCESS));
    expect(getBySystemNumberFailure.type).toBe(getMessage('getBySystemNumber', FAILURE));

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
