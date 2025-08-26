import { GlobalError } from '@core/components/global-error/global-error.interface';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { PsvMake } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Action, ActionCreator, ActionCreatorProps, createAction, props } from '@ngrx/store';
// eslint-disable-next-line import/no-unresolved

const prefix = '[Technical Record Service]';

export const getBySystemNumber = createAction(`${prefix} getBySystemNumber`, props<{ systemNumber: string }>());
export const getBySystemNumberSuccess = createAction(
	`${prefix} getBySystemNumber Success`,
	props<{ techRecordHistory: TechRecordSearchSchema[] }>()
);
export const getBySystemNumberFailure = createAction(`${prefix} getBySystemNumber Failure`, props<GlobalError>());

export const getTechRecordV3 = createAction(
	`${prefix} getTechRecordV3`,
	props<{ systemNumber: string; createdTimestamp: string }>()
);
export const getTechRecordV3Success = createOutcomeAction('getTechRecordV3', true);
export const getTechRecordV3Failure = createOutcomeAction('getTechRecordV3', false);

export const createVehicleRecord = createAction(
	`${prefix} createVehicleRecord`,
	props<{ vehicle: TechRecordType<'put'> }>()
);
export const createVehicleRecordSuccess = createOutcomeAction('createVehicleRecord', true);
export const createVehicleRecordFailure = createOutcomeAction('createVehicleRecord', false);

export const updateTechRecord = createAction(
	`${prefix} updateTechRecords`,
	props<{ systemNumber: string; createdTimestamp: string }>()
);
export const updateTechRecordSuccess = createOutcomeAction('updateTechRecords', true);
export const updateTechRecordFailure = createOutcomeAction('updateTechRecords', false);

export const amendVin = createAction(
	`${prefix} amendVin`,
	props<{ newVin: string; systemNumber: string; createdTimestamp: string }>()
);
export const amendVinSuccess = createOutcomeAction('amendVin', true);
export const amendVinFailure = createOutcomeAction('amendVin', false);

export const amendVrm = createAction(
	`${prefix} amendVrm`,
	props<{
		newVrm: string;
		cherishedTransfer: boolean;
		systemNumber: string;
		createdTimestamp: string;
		thirdMark?: string;
	}>()
);
export const amendVrmSuccess = createOutcomeAction('amendVrm', true);
export const amendVrmFailure = createOutcomeAction('amendVrm', false);

export const archiveTechRecord = createAction(
	`${prefix} archiveTechRecord`,
	props<{ systemNumber: string; createdTimestamp: string; reasonForArchiving: string }>()
);
export const archiveTechRecordSuccess = createOutcomeAction('archiveTechRecord', true);
export const archiveTechRecordFailure = createOutcomeAction('archiveTechRecord', false);

export const promoteTechRecord = createAction(
	`${prefix} promoteTechRecord`,
	props<{ systemNumber: string; createdTimestamp: string; reasonForPromoting: string }>()
);
export const promoteTechRecordSuccess = createOutcomeAction('promoteTechRecord', true);
export const promoteTechRecordFailure = createOutcomeAction('promoteTechRecord', false);

export const updateEditingTechRecord = createAction(
	`${prefix} updateEditingTechRecord`,
	props<{ vehicleTechRecord: TechRecordType<'put'> }>()
);
export const updateEditingTechRecordCancel = createAction(`${prefix} updateEditingTechRecordCancel`);

export const changeVehicleType = createAction(
	`${prefix} changeVehicleType`,
	props<{ techRecord_vehicleType: VehicleTypes }>()
);

export const createVehicle = createAction(`${prefix} createVehicle`, props<{ techRecord_vehicleType: VehicleTypes }>());

export const generatePlate = createAction(`${prefix} generatePlate`, props<{ reason: string }>());
export const generatePlateSuccess = createAction(`${prefix} generatePlate Success`);
export const generatePlateFailure = createOutcomeAction('generatePlate', false);
export const canGeneratePlate = createAction(`${prefix} canGeneratePlate`);
export const cannotGeneratePlate = createAction(`${prefix} cannotGeneratePlate`);

export const generateLetter = createAction(
	`${prefix} generateLetter`,
	props<{ letterType: string; paragraphId: number }>()
);
export const generateLetterSuccess = createAction(`${prefix} generateLetter Success`);
export const generateLetterFailure = createOutcomeAction('generateLetter', false);

export const updateBrakeForces = createAction(
	`${prefix} updateBrakesForces`,
	props<{ grossLadenWeight?: number; grossKerbWeight?: number }>()
);

export const updateBody = createAction(`${prefix} updatebody`, props<{ psvMake: PsvMake }>());

export const unarchiveTechRecord = createAction(
	`${prefix} unarchiveTechRecord`,
	props<{ systemNumber: string; createdTimestamp: string; reasonForUnarchiving: string; status: string }>()
);
export const unarchiveTechRecordSuccess = createOutcomeAction('unarchiveTechRecord', true);
export const unarchiveTechRecordFailure = createOutcomeAction('unarchiveTechRecord', false);

export const removeTC3TankInspection = createAction(`${prefix} removeTC3TankInspection`, props<{ index: number }>());
export const removeUNNumber = createAction(`${prefix} removeUNNumber`, props<{ index: number }>());

export const addSectionState = createAction(`${prefix} addSectionState`, props<{ section: string | number }>());
export const removeSectionState = createAction(`${prefix} removeSectionState`, props<{ section: string | number }>());
export const clearAllSectionStates = createAction(`${prefix} clearAllSectionState`);

export const updateScrollPosition = createAction(
	`${prefix} updateScrollPosition`,
	props<{ position: [number, number] }>()
);
export const clearScrollPosition = createAction(`${prefix} clearScrollPosition`);

export const clearADRDetailsBeforeUpdate = createAction(`${prefix} clearADRDetailsBeforeUpdate`);

export const updateADRAdditionalExaminerNotes = createAction(
	`${prefix} updateADRAdditionalExaminerNotes`,
	props<{ username: string }>()
);

export const updateExistingADRAdditionalExaminerNote = createAction(
	`${prefix} updateExistingADRAdditionalExaminerNote`,
	props<{ additionalExaminerNote: string; examinerNoteIndex: number }>()
);

export const generateADRCertificate = createAction(
	`${prefix} generateADRCertificate`,
	props<{
		systemNumber: string;
		createdTimestamp: string;
		certificateType: string;
	}>()
);
export const generateADRCertificateSuccess = createAction(
	`${prefix} generateADRCertificate Success`,
	props<{ id: string }>()
);
export const generateADRCertificateFailure = createOutcomeAction('generateADRCertificate', false);

export const generateContingencyADRCertificate = createAction(
	`${prefix} generateContingencyADRCertificate`,
	props<{
		systemNumber: string;
		createdTimestamp: string;
		certificateType: string;
	}>()
);

export const updateVehicleConfiguration = createAction(
	`${prefix} updateVehicleConfiguration`,
	props<{ vehicleConfiguration: string }>()
);

function createOutcomeAction<T extends boolean>(
	title: string,
	isSuccess: T
): ActionCreator<
	string,
	T extends false
		? (props: GlobalError) => GlobalError & Action<string>
		: (props: { vehicleTechRecord: TechRecordType<'get'> }) => {
				vehicleTechRecord: TechRecordType<'get'>;
			} & Action<string>
> {
	const suffix = isSuccess ? 'Success' : 'Failure';
	const type = `${prefix} ${title} ${suffix}`;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const actionCreator: ActionCreatorProps<any> = isSuccess
		? props<{ vehicleTechRecord: TechRecordType<'get'>[] }>()
		: props<GlobalError>();

	return createAction(type, actionCreator);
}
