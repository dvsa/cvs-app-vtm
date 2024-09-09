import {
	archiveTechRecord,
	archiveTechRecordFailure,
	archiveTechRecordSuccess,
	changeVehicleType,
	clearADRDetailsBeforeUpdate,
	createVehicle,
	createVehicleRecord,
	createVehicleRecordFailure,
	createVehicleRecordSuccess,
	getBySystemNumber,
	getBySystemNumberFailure,
	getBySystemNumberSuccess,
	unarchiveTechRecord,
	unarchiveTechRecordFailure,
	unarchiveTechRecordSuccess,
	updateEditingTechRecord,
	updateEditingTechRecordCancel,
	updateTechRecord,
	updateTechRecordFailure,
	updateTechRecordSuccess,
} from '../technical-record-service.actions';

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

		expect(updateTechRecord.type).toBe(getMessage('updateTechRecords'));
		expect(updateTechRecordSuccess.type).toBe(getMessage('updateTechRecords', SUCCESS));
		expect(updateTechRecordFailure.type).toBe(getMessage('updateTechRecords', FAILURE));

		expect(archiveTechRecord.type).toBe(getMessage('archiveTechRecord'));
		expect(archiveTechRecordSuccess.type).toBe(getMessage('archiveTechRecord', SUCCESS));
		expect(archiveTechRecordFailure.type).toBe(getMessage('archiveTechRecord', FAILURE));

		expect(updateEditingTechRecord.type).toBe(getMessage('updateEditingTechRecord'));

		expect(updateEditingTechRecordCancel.type).toBe(getMessage('updateEditingTechRecordCancel'));

		expect(changeVehicleType.type).toBe(getMessage('changeVehicleType'));

		expect(createVehicle.type).toBe(getMessage('createVehicle'));

		expect(unarchiveTechRecord.type).toBe(getMessage('unarchiveTechRecord'));
		expect(unarchiveTechRecordFailure.type).toBe(getMessage('unarchiveTechRecord', FAILURE));
		expect(unarchiveTechRecordSuccess.type).toBe(getMessage('unarchiveTechRecord', SUCCESS));

		expect(clearADRDetailsBeforeUpdate.type).toBe(getMessage('clearADRDetailsBeforeUpdate'));
	});
});

function getMessage(title: string, suffix = '') {
	return `[Technical Record Service] ${title}${suffix}`;
}
